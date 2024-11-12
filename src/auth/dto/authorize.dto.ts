import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class AuthorizeDto {
  @IsString()
  @IsNotEmpty()
  client_id: string;

  @IsString()
  @IsNotEmpty()
  redirect_uri: string;

  @IsString()
  @IsNotEmpty()
  response_type: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsArray()
  @IsOptional()
  scope?: string[];
}