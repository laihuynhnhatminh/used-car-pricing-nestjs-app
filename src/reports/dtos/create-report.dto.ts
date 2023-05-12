import { IsNumber, IsString, Max, Min, IsLongitude, IsLatitude } from "class-validator";

export class CreateReportDto {
    @IsString()
    public make: string;

    @IsString()
    public model: string;

    @IsNumber()
    @Min(1930)
    @Max(2050)
    public year: number;

    @IsNumber()
    @Min(0)
    @Max(1000000)
    public mileage: number;

    @IsNumber()
    @IsLongitude()
    public lng: number;
  
    @IsNumber()
    @IsLatitude()
    public lat: number;
    
    @IsNumber()
    @Min(0)
    @Max(1000000)
    public price: number;
}