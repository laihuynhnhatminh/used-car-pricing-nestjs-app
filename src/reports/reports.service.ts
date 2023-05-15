import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { Report } from './report.entity';

@Injectable()
export class ReportsService {

    constructor(
        @InjectRepository(Report) private repo: Repository<Report>
        ) {}

    public create(reportDto: CreateReportDto, user: User): Promise<Report> {
        const report = this.repo.create(reportDto);
        report.user = user;
        return this.repo.save(report);
    }

    public async updateApproval(id: string, approval: boolean): Promise<Report>{
        const report = await this.repo.findOne({ where: {id: parseInt(id)}});
        if (!report) {
            throw new NotFoundException();
        }
        report.approved = approval;
        return this.repo.save(report);
    }
}
