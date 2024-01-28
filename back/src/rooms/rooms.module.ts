import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  controllers: [RoomsController],
  providers: [RoomsService],
  imports: [UtilsModule],
})
export class RoomsModule {}
