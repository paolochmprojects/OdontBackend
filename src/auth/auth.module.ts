import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import config from 'src/config/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: config.JWT.SECRET,
      signOptions: { expiresIn: config.JWT.EXPIRES_IN },
    }),
  ],
  exports: [UsersModule],
})
export class AuthModule {}
