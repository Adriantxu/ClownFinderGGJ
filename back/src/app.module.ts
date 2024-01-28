import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaDbModule } from './prisma-db/prisma-db.module';
import { AuthModule } from './auth/auth.module';
import { RoomsModule } from './rooms/rooms.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      // envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    PrismaDbModule,
    UtilsModule,
    AuthModule,
    RoomsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
