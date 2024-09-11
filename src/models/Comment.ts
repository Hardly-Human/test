import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './User';
import { Image } from './Image';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  text!: string; 

  @CreateDateColumn()
  createdAt!: Date;  // Automatically set the date of the comment

  @ManyToOne(() => User, user => user.comments, { eager: true })
  user!: User;  // The user who made the comment

  @ManyToOne(() => Image, image => image.comments, { onDelete: 'CASCADE' })
  image!: Image;  // The image the comment belongs to
}
