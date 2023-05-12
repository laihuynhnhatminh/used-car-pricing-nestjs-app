import { Exclude } from 'class-transformer';
import { Report } from 'src/reports/report.entity';
import { Entity, Column, PrimaryGeneratedColumn, AfterInsert, AfterUpdate, AfterRemove, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public email: string;

  @Column()
  @Exclude()
  public password: string;

  @OneToMany(() => Report, (report) => report.user)
  public reports: Report[];

  @AfterInsert()
  private logInsert(): void {
    console.log(`Inserted User with id: ${this.id}`);
  }

  @AfterUpdate()
  private logUpdate(): void {
    console.log(`Updated User with id: ${this.id}`);
  }

  @AfterRemove()
  private logRemove(): void {
    console.log(`Removed User with id: ${this.id}`);
  }
}
