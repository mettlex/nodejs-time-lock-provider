import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("servers")
export class Server {
  @PrimaryColumn({
    type: "integer",
    unique: true,
    generated: true,
    nullable: false,
  })
  id: string;

  @Column({
    type: "varchar",
    length: 2048,
    nullable: false,
  })
  base_url: string;

  @Column({
    type: "json",
    nullable: true,
  })
  authentication: string;

  @Column({
    type: "json",
    nullable: false,
  })
  routes: string;
}
