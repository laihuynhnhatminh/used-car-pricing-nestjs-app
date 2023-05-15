import { Controller, Post, Body, UseGuards, Patch, Param } from '@nestjs/common';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { AuthGuard } from '../guards/auth.guard';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ReportDto } from './dtos/report.dto';
import { ApproveReportDto } from './dtos/approve-report.dtos';
import { Report } from './report.entity';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('reports')
export class ReportsController {
    constructor(private reportsService: ReportsService) {}

    @Post('/create')
    @Serialize(ReportDto)
    @UseGuards(AuthGuard)
    public async createReport(@Body() body: CreateReportDto, @CurrentUser() user: User): Promise<CreateReportDto> {
        return await this.reportsService.create(body, user);
    }

    @Patch('/:id')
    @UseGuards(AdminGuard)
    public async approveReport(@Param('id')id: string, @Body() body: ApproveReportDto): Promise<Report> {
        return await this.reportsService.updateApproval(id, body.approved);
    }
}
