import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { OAuthClient } from './oauth-client.entity';

@Entity('oauth_systems')
export class OAuthSystem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  systemId: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'json', nullable: true })
  configuration: Record<string, any>;

  @Column({ type: 'int', default: 3600 })
  tokenExpirationTime: number;

  @Column({ type: 'int', default: 0 })
  rateLimit: number;

  @OneToMany(() => OAuthClient, client => client.system)
  clients: OAuthClient[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}