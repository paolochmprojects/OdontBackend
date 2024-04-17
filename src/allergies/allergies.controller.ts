import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Users } from '@prisma/client';
import { GetUser } from 'src/auth/decorators';
import { JwtAuthGuard } from 'src/auth/guards';
import { AllergiesService } from './allergies.service';
import { CreateAllergyDto, UpdateAllergyDto } from './dto';

@UseGuards(JwtAuthGuard)
@Controller('allergies')
export class AllergiesController {
  constructor(private readonly allergiesService: AllergiesService) {}

  @Post()
  async create(
    @GetUser() user: Users,
    @Body() createAllergyDto: CreateAllergyDto,
  ) {
    return await this.allergiesService.create(createAllergyDto, user.id);
  }

  @Get()
  async findAll(@GetUser() user: Users) {
    return await this.allergiesService.getAllAllergies(user.id);
  }

  // TODO: implement search functions

  @Delete(':id')
  async delete(@GetUser() user: Users, @Param('id', ParseUUIDPipe) id: string) {
    return await this.allergiesService.delete(id, user.id);
  }

  @Patch(':id')
  async update(
    @GetUser() user: Users,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAlergyDto: UpdateAllergyDto,
  ) {
    await this.allergiesService.update(id, updateAlergyDto, user.id);
  }
}
