import { IsBoolean } from "class-validator";

export class ApproveReportDto {
    @IsBoolean()
    public approved: boolean;
}