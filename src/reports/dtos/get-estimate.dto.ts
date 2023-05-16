import { Transform } from 'class-transformer';
import {
  IsNumber,
  IsString,
  Max,
  Min,
  IsLongitude,
  IsLatitude,
} from 'class-validator';

export class GetEstimateDto {
  @IsString()
  public make: string;

  @IsString()
  public model: string;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1930)
  @Max(2050)
  public year: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  @Max(1000000)
  public mileage: number;

  @Transform(({ value }) => parseFloat(value))
  @IsLongitude()
  public lng: number;
  
  @Transform(({ value }) => parseFloat(value))
  @IsLatitude()
  public lat: number;
}
