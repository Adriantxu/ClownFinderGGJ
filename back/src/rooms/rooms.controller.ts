import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Utils } from 'src/utils/middlewareHelper';
import { Request } from 'express';
import { RoomsService } from './rooms.service';
import { AddJokeDto, LogToRoom, RoomCreateDto } from './dto';

@Controller('rooms')
export class RoomsController {
  constructor(
    private readonly utils: Utils,
    private roomService: RoomsService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getAllRooms(@Req() req: Request) {
    this.utils.getUserId(req);

    return this.roomService.getAllRooms();
  }

  @Post('access/:id')
  @UseGuards(AuthGuard('jwt'))
  async accessRoomId(
    @Req() req: Request,
    @Param('id') roomId: string,
    @Body() body: LogToRoom,
  ) {
    const userId = this.utils.getUserId(req);

    const room = await this.roomService.getRoomById(+roomId).then((e) => {
      if (!e) {
        throw new BadRequestException('Room not found');
      }
      return e;
    });

    const isPasswordCorrect = this.checkPassword(body.password, room.password);

    if (!isPasswordCorrect) {
      throw new BadRequestException('Room Password incorrect');
    }

    await this.roomService.addUserToRoom(userId, room.id, room.max_size);

    return await this.roomService.getRoomById(+roomId);
  }

  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  async createRoom(@Req() req: Request, @Body() body: RoomCreateDto) {
    const userId = this.utils.getUserId(req);

    const room = await this.roomService.createRoom(
      body.name,
      body.password,
      body.max_size,
    );

    await this.roomService.addUserToRoom(userId, room.id, room.max_size);

    return await this.roomService.getRoomById(room.id);
  }

  @Patch(':id/joke')
  @UseGuards(AuthGuard('jwt'))
  async updateRoom(
    @Req() req: Request,
    @Param('id') roomId: string,
    @Body() body: AddJokeDto,
  ) {
    const userId = this.utils.getUserId(req);

    await this.roomService.getRoomById(+roomId).then((e) => {
      if (!e) {
        throw new BadRequestException('Room not found');
      }
      return e;
    });

    await this.roomService.updateJoke(userId, body.joke);

    return await this.roomService.getRoomById(+roomId);
  }

  @Post(':id/start')
  @UseGuards(AuthGuard('jwt'))
  async startRoom(@Req() req: Request, @Param('id') roomId: string) {
    this.utils.getUserId(req);

    await this.roomService.getRoomById(+roomId).then((e) => {
      if (!e) {
        throw new BadRequestException('Room not found');
      }
      return e;
    });

    await this.roomService.startRoom(+roomId);

    return await this.roomService.getRoomById(+roomId);
  }

  @Post(':id/next')
  @UseGuards(AuthGuard('jwt'))
  async nextRoom(
    @Req() req: Request,
    @Param('id') roomId: string,
    @Body() body: object,
  ) {
    this.utils.getUserId(req);

    await this.roomService.getRoomById(+roomId).then((e) => {
      if (!e) {
        throw new BadRequestException('Room not found');
      }
      return e;
    });

    await this.roomService.continueRoom(+roomId, body['winnerId']);

    return await this.roomService.getRoomById(+roomId);
  }

  @Delete(':id/stop')
  @UseGuards(AuthGuard('jwt'))
  async stopRoom(@Req() req: Request, @Param('id') roomId: string) {
    this.utils.getUserId(req);

    await this.roomService.getRoomById(+roomId).then((e) => {
      if (!e) {
        throw new BadRequestException('Room not found');
      }
      return e;
    });

    return await this.roomService.stopRoom(+roomId);
  }

  private checkPassword(passwordSend: string, roomPassword: string | null) {
    if (!roomPassword) {
      return true;
    }
    return passwordSend === roomPassword;
  }
}
