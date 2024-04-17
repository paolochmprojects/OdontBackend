import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AllergiesService } from './allergies.service';
import { JwtAuthGuard } from 'src/auth/guards';
import { GetUser } from 'src/auth/decorators';
import { Users } from '@prisma/client';
import { CreateAllergyDto, UpdateAllergyDto } from './dto';

@Controller('allergies')
export class AllergiesController {
  constructor(private readonly allergiesService: AllergiesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @GetUser() user: Users,
    @Body() createAllergyDto: CreateAllergyDto,
  ) {
    return await this.allergiesService.create(createAllergyDto, user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@GetUser() user: Users) {
    return await this.allergiesService.getAllAllergies(user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@GetUser() user: Users, @Param('id') id: string) {
    return await this.allergiesService.delete(id, user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @GetUser() user: Users,
    @Param('id') id: string,
    @Body() updateAlergyDto: UpdateAllergyDto,
  ) {
    await this.allergiesService.update(id, updateAlergyDto, user.id);
  }
}
