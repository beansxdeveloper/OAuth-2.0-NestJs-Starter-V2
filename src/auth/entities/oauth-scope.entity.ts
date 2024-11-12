import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { OAuthSystem } from './oauth-system.entity';

@Entity('oauth_scopes')
export class OAuthScope {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => OAuthSystem)
  @JoinTable()
  systems: OAuthSystem[];
}