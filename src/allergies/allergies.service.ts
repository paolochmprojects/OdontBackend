import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAllergyDto, UpdateAllergyDto } from './dto';
import { DatabaseService } from 'src/database/database.service';
import { Allergies } from '@prisma/client';

@Injectable()
export class AllergiesService {
  constructor(private databaseService: DatabaseService) {}

  async create(createAllergyDto: CreateAllergyDto, usersId: string) {
    const allergyFound = await this.getWithName(createAllergyDto.display_name);

    if (allergyFound) {
      return allergyFound;
    }

    // Generate the name for allergy
    const name = this.getName(createAllergyDto.display_name);

    const newAllergy = await this.databaseService.allergies.create({
      data: {
        ...createAllergyDto,
        name,
        usersId,
      },
    });

    return newAllergy;
  }

  private getName(display_name: string): string {
    return display_name
      .replaceAll(' ', '_')
      .replaceAll("'", '')
      .replaceAll('"', '')
      .replaceAll(', ', '')
      .replaceAll('.', '')
      .trim()
      .toLowerCase();
  }

  async getWithName(display_name: string): Promise<Allergies> {
    return await this.databaseService.allergies.findUnique({
      where: {
        name: this.getName(display_name),
      },
    });
  }

  async getAllAllergies(usersId: string): Promise<Allergies[]> {
    return await this.databaseService.allergies.findMany({
      where: {
        usersId,
      },
    });
  }

  async findById(id: string, usersId: string): Promise<Allergies> {
    const allergyFound = await this.databaseService.allergies.findUnique({
      where: {
        id,
        usersId,
      },
    });
    if (!allergyFound) {
      throw new BadRequestException(`Allergy with id ${id} not found`);
    }
    return allergyFound;
  }

  async update(
    id: string,
    updateAllergyDto: UpdateAllergyDto,
    usersId: string,
  ) {
    const allergyFound = await this.findById(id, usersId);

    let newName = allergyFound.name;

    if (updateAllergyDto.display_name) {
      newName = this.getName(updateAllergyDto.display_name);
    }

    const allergyFoundWithName = await this.getWithName(newName);

    if (allergyFoundWithName && allergyFoundWithName.id !== id) {
      throw new BadRequestException(
        `Allergy with name - ${updateAllergyDto.display_name} - already exist`,
      );
    }

    return await this.databaseService.allergies.update({
      where: { id },
      data: {
        ...updateAllergyDto,
        name: newName,
        usersId,
      },
      select: {
        id: true,
        name: true,
      },
    });
  }

  async delete(id: string, usersId: string) {
    // find allergy if exist
    await this.findById(id, usersId);

    return await this.databaseService.allergies.delete({
      where: {
        id,
        usersId,
      },
    });
  }
}
