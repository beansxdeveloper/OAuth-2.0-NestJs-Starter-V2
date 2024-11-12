import { OAuthSystem } from '../../auth/entities/oauth-system.entity';
import { OAuthClient } from '../../auth/entities/oauth-client.entity';
import { User } from '../../users/entities/user.entity';
import { OAuthScope } from '../../auth/entities/oauth-scope.entity';
import * as bcrypt from 'bcrypt';

export const createInitialData = async (connection) => {
  // Create scopes
  const scopes = await connection.getRepository(OAuthScope).save([
    {
      name: 'read',
      description: 'Read access to user data',
      isActive: true
    },
    {
      name: 'write',
      description: 'Write access to user data',
      isActive: true
    },
    {
      name: 'admin',
      description: 'Administrative access',
      isActive: true
    }
  ]);

  // Create systems
  const systems = await connection.getRepository(OAuthSystem).save([
    {
      systemId: 'system1',
      name: 'HR System',
      description: 'Human Resource Management System',
      isActive: true,
      tokenExpirationTime: 3600,
      rateLimit: 1000,
      configuration: {
        allowedIPs: ['*'],
        requirePKCE: true
      }
    },
    {
      systemId: 'system2',
      name: 'CRM System',
      description: 'Customer Relationship Management',
      isActive: true,
      tokenExpirationTime: 7200,
      rateLimit: 2000,
      configuration: {
        allowedIPs: ['*'],
        requirePKCE: false
      }
    }
  ]);

  // Create clients
  const hashedSecret1 = await bcrypt.hash('secret1', 10);
  const hashedSecret2 = await bcrypt.hash('secret2', 10);

  const clients = await connection.getRepository(OAuthClient).save([
    {
      clientId: 'client1',
      clientSecret: hashedSecret1,
      name: 'HR Web App',
      redirectUris: ['http://localhost:8080/callback'],
      permissions: ['read', 'write'],
      isActive: true,
      system: systems[0]
    },
    {
      clientId: 'client2',
      clientSecret: hashedSecret2,
      name: 'CRM Mobile App',
      redirectUris: ['http://localhost:8081/callback'],
      permissions: ['read'],
      isActive: true,
      system: systems[1]
    }
  ]);

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  await connection.getRepository(User).save([
    {
      email: 'hr.user@example.com',
      password: hashedPassword,
      firstName: 'HR',
      lastName: 'User',
      system: systems[0],
      systemUserId: 'HR001'
    },
    {
      email: 'crm.user@example.com',
      password: hashedPassword,
      firstName: 'CRM',
      lastName: 'User',
      system: systems[1],
      systemUserId: 'CRM001'
    },
    {
      email: 'admin@example.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User'
    }
  ]);
};