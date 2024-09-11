import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { User } from './User';
import { Comment } from './Comment';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  url!: string;

  @Column()
  key!: string;

  @Column()
  createdAt: Date = new Date();

  @Column({ unique: true, nullable: true })
  shortUrl?: string;

  @ManyToOne(() => User, user => user.images)
  user!: User;

  @OneToMany(() => Comment, comment => comment.image)
  comments!: Comment[];  // One image can have multiple comments
}
