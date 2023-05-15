import { User } from 'src/users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ default: false })
  public approved: boolean;

  @Column()
  public price: number;

  @Column()
  public make: string;

  @Column()
  public model: string;

  @Column()
  public year: number;

  @Column()
  public lng: number;

  @Column()
  public lat: number;

  @Column()
  public mileage: number;

  @ManyToOne(() => User, (user) => user.reports)
  public user: User;
}
