import { ApiProperty } from '@nestjs/swagger';

export class GetEventsDto {
  @ApiProperty({ example: 0 })
  fromBlock: number;

  @ApiProperty({ example: 100000000 })
  toBlock: number;

  @ApiProperty({ required: false, example: 1 })
  page?: number;

  @ApiProperty({ required: false, example: 10 })
  limit?: number;
}
