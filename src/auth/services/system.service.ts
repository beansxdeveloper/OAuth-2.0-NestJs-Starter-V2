import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OAuthSystem } from '../entities/oauth-system.entity';
import { CreateSystemDto } from '../dto/create-system.dto';

@Injectable()
export class SystemService {
  constructor(
    @InjectRepository(OAuthSystem)
    private systemRepository: Repository<OAuthSystem>,
  ) {}

  async create(createSystemDto: CreateSystemDto): Promise<OAuthSystem> {
    const existingSystem = await this.systemRepository.findOne({
      where: { systemId: createSystemDto.systemId },
    });

    if (existingSystem) {
      throw new ConflictException('System with this ID already exists');
    }

    const system = this.systemRepository.create(createSystemDto);
    return this.systemRepository.save(system);
  }

  async findAll(): Promise<OAuthSystem[]> {
    return this.systemRepository.find({
      relations: ['clients'],
    });
  }

  async findById(id: string): Promise<OAuthSystem> {
    const system = await this.systemRepository.findOne({
      where: { id },
      relations: ['clients'],
    });

    if (!system) {
      throw new NotFoundException('System not found');
    }

    return system;
  }

  async update(id: string, updateData: Partial<OAuthSystem>): Promise<OAuthSystem> {
    const system = await this.findById(id);
    Object.assign(system, updateData);
    return this.systemRepository.save(system);
  }

  async delete(id: string): Promise<void> {
    const system = await this.findById(id);
    await this.systemRepository.remove(system);
  }
}