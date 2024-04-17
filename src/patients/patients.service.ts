import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePatientDto, UpdatePatientDto } from './dto';
import { DatabaseService } from 'src/database/database.service';
import { PaginationDto } from 'src/common';

@Injectable()
export class PatientsService {
  constructor(private databaseService: DatabaseService) {}

  async create(createPatientDto: CreatePatientDto, usersId: string) {
    // handler users with same numId
    if (createPatientDto.numId) {
      const patientWithNumId = await this.getUserWithNumId(
        createPatientDto.numId,
        usersId,
      );
      if (patientWithNumId.length) {
        throw new BadRequestException('Some patient with same NumId');
      }
    }
    const { allergies: allergiesArray = [] } = createPatientDto;

    const allergiesToConnect = allergiesArray.map((allergy) => {
      return { id: allergy };
    });

    return await this.databaseService.patients.create({
      data: {
        ...createPatientDto,
        usersId,
        allergies: { connect: allergiesToConnect },
      },
      include: { allergies: true },
    });
  }

  async getUserWithNumId(numId: string, usersId: string) {
    return await this.databaseService.patients.findMany({
      where: { numId, usersId },
    });
  }
  // implement paginations for more control
  async getAll(usersId: string, paginationDto: PaginationDto) {
    const { take, page, search } = paginationDto;
    if (!search) {
      const totalPatients = await this.databaseService.patients.count({
        where: { usersId },
      });
      const totalPages = Math.ceil(totalPatients / take);
      const patients = await this.databaseService.patients.findMany({
        where: { usersId },
        include: { allergies: true },
        skip: (page - 1) * take,
        take,
      });

      return {
        totalPatients,
        totalPages,
        patients,
      };
    } else {
      const totalPatients = await this.databaseService.patients.count({
        where: {
          usersId,
          OR: [
            { fullName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { numId: { contains: search, mode: 'insensitive' } },
          ],
        },
      });
      const totalPages = Math.ceil(totalPatients / take);
      const patients = await this.databaseService.patients.findMany({
        where: {
          usersId,
          OR: [
            { fullName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { numId: { contains: search, mode: 'insensitive' } },
          ],
        },
        include: { allergies: true },
        skip: (page - 1) * take,
        take,
      });

      return {
        totalPatients,
        totalPages,
        patients,
      };
    }
  }

  async getById(id: string, usersId: string) {
    const patient = await this.databaseService.patients.findUnique({
      where: { id, usersId },
      include: { allergies: true },
    });

    if (!patient) {
      throw new BadRequestException(`Patient with id ${id} not found`);
    }
    return patient;
  }

  async deleteById(id: string, usersId: string) {
    await this.getById(id, usersId);
    return await this.databaseService.patients.delete({ where: { id } });
  }

  async updateById(
    id: string,
    updatePatientDto: UpdatePatientDto,
    usersId: string,
  ) {
    const patientFound = await this.getById(id, usersId);

    if (updatePatientDto.numId) {
      const patientWithNumId = await this.getUserWithNumId(
        updatePatientDto.numId,
        usersId,
      );
      if (patientWithNumId.length) {
        throw new BadRequestException('Some patient with same NumId');
      }
    }

    const { allergies: allergiesArray } = updatePatientDto;

    let allergiesFoundWithId = await this.databaseService.allergies.findMany({
      where: { id: { in: allergiesArray } },
      select: { id: true },
    });

    if (!updatePatientDto.allergies) {
      allergiesFoundWithId = patientFound.allergies;
    }

    return await this.databaseService.patients.update({
      where: { id },
      data: { ...updatePatientDto, allergies: { set: allergiesFoundWithId } },
    });
  }
}
