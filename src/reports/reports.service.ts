import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { Report } from './report.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  public create(reportDto: CreateReportDto, user: User): Promise<Report> {
    const report = this.repo.create(reportDto);
    report.user = user;
    return this.repo.save(report);
  }

  public createEstimate(
    estimateDto: GetEstimateDto,
  ): Promise<Report[]> {
    return this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make: estimateDto.make })
      .andWhere('model = :model', { model: estimateDto.model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng: estimateDto.lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat: estimateDto.lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year: estimateDto.year })
      .andWhere('approved IS TRUE')
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({ mileage: estimateDto.mileage })
      .limit(3)
      .getRawMany();
  }

  public async updateApproval(id: string, approval: boolean): Promise<Report> {
    const report = await this.repo.findOne({ where: { id: parseInt(id) } });
    if (!report) {
      throw new NotFoundException();
    }
    report.approved = approval;
    return this.repo.save(report);
  }
}
