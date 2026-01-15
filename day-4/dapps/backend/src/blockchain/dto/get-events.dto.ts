import { ApiProperty } from '@nestjs/swagger';

export class GetEventsDto {
  @ApiProperty({
    example: 10000000,
    description: 'The starting block number to fetch events from',
  })
  fromBlock: number;

  @ApiProperty({
    example: 10000000,
    description: 'The ending block number to fetch events to',
  })
  toBlock: number;
}
