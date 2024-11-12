import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { OAuthSystem } from './oauth-system.entity';
import { OAuthToken } from './oauth-token.entity';

@Entity('oauth_clients')
export class OAuthClient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  clientId: string;

  @Column()
  clientSecret: string;

  @Column()
  name: string;

  @Column('simple-array')
  redirectUris: string[];

  @Column({ type: 'json', nullable: true })
  permissions: string[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  requestCount: number;

  @ManyToOne(() => OAuthSystem, system => system.clients)
  system: OAuthSystem;

  @OneToMany(() => OAuthToken, token => token.client)
  tokens: OAuthToken[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}