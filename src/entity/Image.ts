import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  url!: string;  // S3 URL

  @Column()
  key!: string;  // S3 key (unique filename)

  @Column()
  createdAt: Date = new Date();

  @Column({ unique: true, nullable: true })
  shortUrl?: string;  // New field for storing short URL

  @ManyToOne(() => User, user => user.images)
  user!: User;
}
