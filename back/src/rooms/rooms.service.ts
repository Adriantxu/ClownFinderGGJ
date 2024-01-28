import { Injectable } from '@nestjs/common';
import { PrismaDbService } from 'src/prisma-db/prisma-db.service';

@Injectable()
export class RoomsService {
  constructor(private prismaService: PrismaDbService) {}

  async getAllRooms() {
    return this.prismaService.room.findMany();
  }

  async getRoomById(roomId: number) {
    return this.prismaService.room.findUnique({
      where: {
        id: roomId,
      },
      include: {
        users: true,
      },
    });
  }

  async addUserToRoom(userId: number, roomId: number, maxNumberPeople: number) {
    const isFull = await this.prismaService.user.count({
      where: {
        room_id: roomId,
      },
    });

    if (isFull >= maxNumberPeople) {
      throw new Error('Room is full');
    }

    return this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        room: {
          connect: {
            id: roomId,
          },
        },
      },
    });
  }

  async createRoom(name: string, password: string, max_size: number) {
    return this.prismaService.room.create({
      data: {
        name,
        password,
        max_size,
      },
    });
  }

  async updateJoke(userId: number, joke: string) {
    return this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        user_joke: joke,
      },
    });
  }

  async startRoom(roomId: number) {
    const users = await this.prismaService.user.findMany({
      where: {
        room_id: roomId,
      },
    });

    const randomUser = users[Math.floor(Math.random() * users.length)];

    return this.prismaService.user.update({
      where: {
        id: randomUser.id,
      },
      data: {
        being_clown: true,
      },
    });
  }

  async continueRoom(roomId: number, winnerId: number) {
    const users = await this.prismaService.user.findMany({
      where: {
        room_id: roomId,
        being_clown: false,
      },
    });

    const winner = await this.prismaService.user.findUnique({
      where: {
        id: winnerId,
      },
    });

    await this.prismaService.user.update({
      where: {
        id: winnerId,
      },
      data: {
        points: winner.points + 1,
      },
    });

    const randomUser = users[Math.floor(Math.random() * users.length)];

    return this.prismaService.user.update({
      where: {
        id: randomUser.id,
      },
      data: {
        being_clown: true,
        user_joke: null,
      },
    });
  }

  async stopRoom(roomId: number) {
    const users = await this.prismaService.user.findMany({
      where: {
        room_id: roomId,
      },
    });

    for (const user of users) {
      await this.prismaService.user.update({
        where: {
          id: user.id,
        },
        data: {
          being_clown: false,
          user_joke: null,
          room_id: null,
        },
      });
    }

    return this.prismaService.room.delete({
      where: {
        id: roomId,
      },
    });
  }
}
