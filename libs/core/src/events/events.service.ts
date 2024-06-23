import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { ReserveSpotDto } from './dto/reserve-spot.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Prisma, SpotStatus, TicketStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventsService {

  constructor(private prismaService: PrismaService) { }

  create(createEventDto: CreateEventDto) {
    return this.prismaService.event.create({
      data: {
        ...createEventDto,
        date: new Date(createEventDto.date)
      }
    })
  }

  findAll() {
    return this.prismaService.event.findMany()
  }

  findOne(id: string) {
    return this.prismaService.event.findUnique({
      where: { id },
    })
  }

  update(id: string, updateEventDto: UpdateEventDto) {
    return this.prismaService.event.update({
      where: { id },
      data: {
        ...updateEventDto,
        date: new Date(updateEventDto.date)
      }
    })
  }

  remove(id: string) {
    return this.prismaService.event.delete({
      where: { id },
    })
  }

  async reserveSpot(dto: ReserveSpotDto & { eventId: string }) {
    const spots = await this.prismaService.spot.findMany({
      where: {
        name: {
          in: dto.spots
        }
      }
    });
    if (spots.length !== dto.spots.length) {
      const foundSpotsName = spots.map(spot => spot.name);
      console.log(foundSpotsName);
      const notFoundSpots = dto.spots.filter(spotName => !foundSpotsName.includes(spotName));
      console.log(notFoundSpots);
      throw new Error(`Spots not found: ${notFoundSpots.join(', ')}`);
    }

    try {
      const tickets = this.prismaService.$transaction(async (prisma) => {
        await prisma.reservationHistory.createMany({
          data: spots.map(spot => ({
            spotId: spot.id,
            ticketKind: dto.ticket_kind,
            email: dto.email,
            status: TicketStatus.RESERVED,
          }))
        });

        await prisma.spot.updateMany({
          where: {
            id: {
              in: spots.map(spot => spot.id)
            }
          },
          data: {
            status: SpotStatus.RESERVED
          }
        });

        const tickets = await Promise.all(spots.map(spot => prisma.ticket.create({
          data: {
            spotId: spot.id,
            ticketKind: dto.ticket_kind,
            email: dto.email,
          }
        })));
        return tickets;
      }, {isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted});
      return tickets;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        switch (e.code) {
          case 'P2002':
            throw new Error('Ticket already reserved');
          case 'P2034':
            throw new Error('Spot already reserved'); 
          default:
            throw e;
        }
      }
    }
  }
}
