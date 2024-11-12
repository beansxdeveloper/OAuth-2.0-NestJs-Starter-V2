import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsObject } from 'class-validator';

export class CreateSystemDto {
  @IsString()
  @IsNotEmpty()
  systemId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  tokenExpirationTime?: number;

  @IsNumber()
  @IsOptional()
  rateLimit?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsObject()
  @IsOptional()
  configuration?: Record<string, any>;
}