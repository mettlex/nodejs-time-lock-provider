import { randomUUID } from "crypto";
import * as bcrypt from "bcrypt";
import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  NotImplementedException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { CreateKeyDto } from "./dto/create-key.dto";
import { UpdateKeyDto } from "./dto/update-key.dto";
import { Key } from "./entities/key.entity";
import { addSeconds, addYears, differenceInSeconds } from "date-fns";
import { TimeService } from "src/time/time.service";
import { DeleteKeyDto } from "./dto/delete-key.dto";
import { ReadKeyDto } from "./dto/read-key.dto";
import { StatusKeyDto } from "./dto/status-key.dto";
import { UnlocKeyDto } from "./dto/unlock-key.dto";

@Injectable()
export class KeysService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Key)
    private keysRepository: Repository<Key>,
    private readonly timeService: TimeService,
  ) {}

  async create({
    admin_password,
    encrypted_partial_data,
    iv,
    lock_duration_seconds,
    recovery_password,
  }: CreateKeyDto) {
    const key = new Key();

    try {
      key.uuid = randomUUID();
      key.admin_password_hash = await bcrypt.hash(admin_password, 10);
      key.recovery_password_hash = await bcrypt.hash(recovery_password, 10);
      key.unlock_at = null;
      key.delete_at = addYears(this.timeService.timestamp * 1000, 1);
      key.iv = iv;
      key.lock_duration_seconds = lock_duration_seconds;
      key.encrypted_partial_data = encrypted_partial_data;

      await this.keysRepository.save(key);
    } catch (error) {
      console.error(error);

      throw new InternalServerErrorException(
        {
          success: false,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
        },
        {
          cause: error,
        },
      );
    }

    return {
      success: true,
      message: "Key saved successfully",
      key: {
        uuid: key.uuid,
        unlock_at: key.unlock_at,
        delete_at: key.delete_at,
      },
    };
  }

  findAll() {
    return `This action returns all keys`;
  }

  async findOne({ uuid, admin_password }: ReadKeyDto) {
    const key = await getKey({ keysRepository: this.keysRepository, uuid });

    const match = await bcrypt.compare(admin_password, key.admin_password_hash);

    if (!match) {
      throw new UnauthorizedException({
        success: false,
        statusCode: HttpStatus.UNAUTHORIZED,
        message: "admin_password didn't match",
      });
    }

    key.delete_at = addYears(this.timeService.timestamp * 1000, 1);

    await this.keysRepository.update(
      {
        uuid,
      },
      key,
    );

    return {
      success: true,
      message: "Key retrived successfully",
      key: {
        uuid: key.uuid,
        iv: key.iv,
        encrypted_partial_data: key.encrypted_partial_data,
        lock_duration_seconds: +key.lock_duration_seconds,
        unlock_at: key.unlock_at,
        delete_at: key.delete_at,
      },
    };
  }

  update(updateKeyDto: UpdateKeyDto) {
    throw new NotImplementedException({
      success: false,
      statusCode: HttpStatus.NOT_IMPLEMENTED,
      message: "This action will be implemented later",
    });
  }

  async remove({ uuid, admin_password }: DeleteKeyDto) {
    const key = await getKey({ keysRepository: this.keysRepository, uuid });

    const match = await bcrypt.compare(admin_password, key.admin_password_hash);

    if (!match) {
      throw new UnauthorizedException({
        success: false,
        statusCode: HttpStatus.UNAUTHORIZED,
        message: "admin_password didn't match",
      });
    }

    await this.keysRepository.delete({
      uuid,
    });

    return {
      success: true,
      message: "Key deleted successfully",
    };
  }

  async status({ uuid }: StatusKeyDto) {
    const key = await getKey({ keysRepository: this.keysRepository, uuid });

    key.delete_at = addYears(this.timeService.timestamp * 1000, 1);

    await this.keysRepository.update(
      {
        uuid,
      },
      key,
    );

    return {
      success: true,
      message: "Key status retrieved successfully",
      key: {
        unlock_at: key.unlock_at,
        delete_at: key.delete_at,
      },
    };
  }

  async unlock({ uuid, recovery_password }: UnlocKeyDto) {
    const key = await getKey({ keysRepository: this.keysRepository, uuid });

    const match = await bcrypt.compare(
      recovery_password,
      key.recovery_password_hash,
    );

    if (!match) {
      throw new UnauthorizedException({
        success: false,
        statusCode: HttpStatus.UNAUTHORIZED,
        message: "recovery_password didn't match",
      });
    }

    let status: string;

    const currentDateTime = new Date(this.timeService.timestamp * 1000);

    if (!key.unlock_at) {
      key.unlock_at = addSeconds(currentDateTime, key.lock_duration_seconds);
      status = "STARTED";
    } else if (differenceInSeconds(currentDateTime, key.unlock_at) > 1) {
      status = "UNLOCKED";
    } else {
      status = "PENDING";
    }

    const unlockedKey: Partial<Key> = {
      ...key,
      admin_password_hash: undefined,
      recovery_password_hash: undefined,
    };

    key.delete_at = addYears(this.timeService.timestamp * 1000, 1);

    await this.keysRepository.update(
      {
        uuid,
      },
      key,
    );

    return {
      status,
      key:
        status === "UNLOCKED"
          ? unlockedKey
          : {
              unlock_at: key.unlock_at,
              delete_at: key.delete_at,
            },
    };
  }
}

async function getKey({
  keysRepository,
  uuid,
}: {
  keysRepository: Repository<Key>;
  uuid: string;
}) {
  let key: Key | null = null;

  try {
    key = await keysRepository.findOne({
      where: {
        uuid,
      },
    });
  } catch (error) {
    console.log(error);

    throw new InternalServerErrorException(
      {
        success: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      },
      {
        cause: error,
      },
    );
  }

  if (!key) {
    throw new NotFoundException({
      success: false,
      statusCode: HttpStatus.NOT_FOUND,
      message: "Key Not Found for the given UUID",
    });
  }

  return key;
}
