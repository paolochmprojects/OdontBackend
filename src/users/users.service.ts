import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { DatabaseService } from 'src/database/database.service';
import { Users } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private databaseService: DatabaseService) {}
  async create(createUserDto: CreateUserDto) {
    // verified if user already exists
    const userFound = await this.findUserByEmail(createUserDto.email);
    if (userFound) {
      throw new BadRequestException('User already exists');
    }

    // hash password
    const hashedPassword = await this.genHashPassword(createUserDto.password);

    // create user
    await this.databaseService.users.create({
      data: {
        fullName: createUserDto.fullName,
        email: createUserDto.email.trim().toLocaleLowerCase(),
        password: hashedPassword,
      },
    });
  }

  async findUserByEmail(email: string): Promise<Users | null> {
    // find user by email
    const user = await this.databaseService.users.findUnique({
      where: {
        email,
      },
    });
    return user;
  }

  async findUserById(
    id: string,
    withPass: boolean = false,
  ): Promise<Users | null> {
    const user = await this.databaseService.users.findUnique({
      where: {
        id,
      },
    });

    if (withPass) {
      return user;
    }
    delete user.password;
    return user;
  }

  async comparePassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }

  private async genHashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }
}
