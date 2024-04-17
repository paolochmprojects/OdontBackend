import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Users } from '@prisma/client';
import { GetUser } from 'src/auth/decorators';
import { JwtAuthGuard } from 'src/auth/guards';
import { CreatePatientDto, UpdatePatientDto } from './dto';
import { PatientsService } from './patients.service';
import { PaginationDto } from 'src/common';

@UseGuards(JwtAuthGuard)
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  create(@GetUser() user: Users, @Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.create(createPatientDto, user.id);
  }

  @Get()
  getAll(@GetUser() user: Users, @Query() paginationDto: PaginationDto) {
    return this.patientsService.getAll(user.id, paginationDto);
  }

  @Get(':id')
  getById(@GetUser() user: Users, @Param('id') id: string) {
    return this.patientsService.getById(id, user.id);
  }

  @Patch(':id')
  async updateById(
    @GetUser() user: Users,
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto,
  ) {
    await this.patientsService.updateById(id, updatePatientDto, user.id);
  }

  // implemente soft delete for patients
  // @Delete(':id')
  // delete(@Param('id') id: string, @GetUser() user: Users) {
  //   return this.patientsService.deleteById(id, user.id);
  // }
}
