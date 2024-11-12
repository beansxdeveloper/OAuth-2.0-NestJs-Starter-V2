import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Index } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OAuthClient } from './oauth-client.entity';

@Entity('oauth_tokens')
export class OAuthToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  accessToken: string;

  @Column()
  @Index()
  refreshToken: string;

  @Column()
  expiresIn: number;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ type: 'json', nullable: true })
  scope: string[];

  @Column({ type: 'inet', nullable: true })
  ipAddress: string;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => OAuthClient, client => client.tokens)
  client: OAuthClient;

  @CreateDateColumn()
  createdAt: Date;
}