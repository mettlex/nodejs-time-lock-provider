import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("keys")
export class Key {
  @PrimaryColumn({
    type: "uuid",
    unique: true,
    nullable: false,
  })
  uuid: string;

  @Column({
    type: "varchar",
    length: 5000,
    nullable: false,
  })
  encrypted_partial_data: string;

  @Column({
    type: "varchar",
    length: 256,
    nullable: false,
  })
  iv: string;

  @Column({
    type: "varchar",
    length: 1024,
    nullable: false,
  })
  admin_password_hash: string;

  @Column({
    type: "varchar",
    length: 1024,
    nullable: false,
  })
  recovery_password_hash: string;

  @Column({
    type: "bigint",
    nullable: false,
  })
  lock_duration_seconds: number;

  @Column({
    type: "timestamp with time zone",
    nullable: true,
    default: null,
  })
  unlock_at: Date;

  @Column({
    type: "timestamp with time zone",
    nullable: false,
  })
  delete_at: Date;
}
