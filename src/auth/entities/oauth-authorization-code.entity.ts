import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OAuthClient } from './oauth-client.entity';

@Entity('oauth_authorization_codes')
export class OAuthAuthorizationCode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column('simple-array', { nullable: true })
  scope: string[];

  @Column({ nullable: true })
  redirectUri: string;

  @Column({ type: 'json', nullable: true })
  codeChallenge?: {
    challenge: string;
    method: string;
  };

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => OAuthClient)
  client: OAuthClient;

  @CreateDateColumn()
  createdAt: Date;
}