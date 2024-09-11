import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';  // Assuming you have a User entity

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;  // S3 URL

  @Column()
  key: string;  // S3 key (unique filename)

  @Column()
  createdAt: Date;

  @ManyToOne(() => User, user => user.images)
  user: User;
}
