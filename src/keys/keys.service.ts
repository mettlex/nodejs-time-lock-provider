import { randomUUID } from "crypto";
import * as bcrypt from "bcrypt";
import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { CreateKeyDto } from "./dto/create-key.dto";
import { UpdateKeyDto } from "./dto/update-key.dto";
import { Key } from "./entities/key.entity";
import { addYears } from "date-fns";
import { TimeService } from "src/time/time.service";
import { DeleteKeyDto } from "./dto/delete-key.dto";

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

      await this.dataSource.manager.save<Key>(key);
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

  findOne() {
    return `This action returns a key`;
  }

  update(updateKeyDto: UpdateKeyDto) {
    return `This action updates a key`;
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
