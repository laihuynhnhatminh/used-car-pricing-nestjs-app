import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  private id: number;

  @Column()
  private email: string;

  @Column()
  private password: string;
}
