import { Expose, Transform } from "class-transformer";

export class ReportDto {
    @Expose()
    public id: number;
    @Expose()
    public make: string;
    @Expose()
    public model: string;
    @Expose()
    public year: number;
    @Expose()
    public lng: number;
    @Expose()
    public lat: number;
    @Expose()
    public price: number;

    @Transform(({obj}) => obj.user.id)
    @Expose()
    public userId: number;
}