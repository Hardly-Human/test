import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Image } from './Image';
import { Comment } from './Comment';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  email!: string;

  @Column()
  auth0Id!: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  profilePicture?: string;

  @OneToMany(() => Image, image => image.user)
  images!: Image[];

  @OneToMany(() => Comment, comment => comment.user)
  comments!: Comment[]; 
}
