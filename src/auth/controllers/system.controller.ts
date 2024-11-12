import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { SystemService } from '../services/system.service';
import { CreateSystemDto } from '../dto/create-system.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AdminGuard } from '../guards/admin.guard';

@Controller('auth/systems')
@UseGuards(JwtAuthGuard, AdminGuard)
export class SystemController {
  constructor(private systemService: SystemService) {}

  @Post()
  create(@Body() createSystemDto: CreateSystemDto) {
    return this.systemService.create(createSystemDto);
  }

  @Get()
  findAll() {
    return this.systemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.systemService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateData: Partial<CreateSystemDto>) {
    return this.systemService.update(id, updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.systemService.delete(id);
  }
}