import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Image } from './Image';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  auth0Id!: string;  // Auth0 user ID (sub field)

  @Column()
  email!: string;  // Email from Auth0

  @Column({ nullable: true })
  name?: string;  // Optional: Full name from Auth0

  @Column({ nullable: true })
  profilePicture?: string;  // Optional: Profile picture URL from Auth0

  @OneToMany(() => Image, image => image.user)
  images: Image[];
}
