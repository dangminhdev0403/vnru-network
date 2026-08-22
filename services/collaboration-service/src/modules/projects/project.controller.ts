import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { AuthGuard } from './auth.guard';
import {
  parseBootstrapDto,
  parseAddMemberDto,
  parseCreateMilestoneDto,
  parseUpdateMilestoneDto,
  parseSubmitDto,
  parseReviewDto,
  parseCreateReportDto,
  parseUpdateReportDto,
  parseOutcomeDto,
  parseCompleteDto,
  parseTerminateDto,
} from './project-types';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function checkUuid(id: string, name: string) {
  if (!id || !UUID_RE.test(id)) {
    throw new NotFoundException({ error: { code: 'NOT_FOUND', message: `${name} not found` } });
  }
}

@Controller('api/v1/projects')
@UseGuards(AuthGuard)
export class ProjectController {
  constructor(private readonly service: ProjectService) {}

  @Post('bootstrap')
  async bootstrap(@Body() body: any, @Req() req: any) {
    const dto = parseBootstrapDto(body);
    return this.service.bootstrap(dto, req.user);
  }

  @Get()
  async list(@Query() query: any, @Req() req: any) {
    return this.service.list(query, req.user);
  }

  @Get(':id')
  async detail(@Param('id') id: string, @Req() req: any) {
    checkUuid(id, 'Project');
    return this.service.findOne(id, req.user);
  }

  @Get(':id/members')
  async getMembers(@Param('id') id: string, @Req() req: any) {
    checkUuid(id, 'Project');
    return this.service.getMembers(id, req.user);
  }

  @Post(':id/members')
  async addMember(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    checkUuid(id, 'Project');
    const dto = parseAddMemberDto(body);
    return this.service.addMember(id, dto.userId, dto.role, req.user);
  }

  @Post(':id/milestones')
  async createMilestone(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    checkUuid(id, 'Project');
    const dto = parseCreateMilestoneDto(body);
    return this.service.createMilestone(id, dto, req.user);
  }

  @Patch(':id/milestones/:milestoneId')
  async updateMilestone(
    @Param('id') id: string,
    @Param('milestoneId') milestoneId: string,
    @Body() body: any,
    @Req() req: any
  ) {
    checkUuid(id, 'Project');
    checkUuid(milestoneId, 'Milestone');
    const dto = parseUpdateMilestoneDto(body);
    return this.service.updateMilestone(id, milestoneId, dto, req.user);
  }

  @Post(':id/milestones/:milestoneId/submit')
  async submitMilestone(
    @Param('id') id: string,
    @Param('milestoneId') milestoneId: string,
    @Body() body: any,
    @Req() req: any
  ) {
    checkUuid(id, 'Project');
    checkUuid(milestoneId, 'Milestone');
    const dto = parseSubmitDto(body);
    return this.service.submitMilestone(id, milestoneId, dto.expectedVersion, req.user);
  }

  @Post(':id/milestones/:milestoneId/review')
  async reviewMilestone(
    @Param('id') id: string,
    @Param('milestoneId') milestoneId: string,
    @Body() body: any,
    @Req() req: any
  ) {
    checkUuid(id, 'Project');
    checkUuid(milestoneId, 'Milestone');
    const dto = parseReviewDto(body);
    return this.service.reviewMilestone(id, milestoneId, dto, req.user);
  }

  @Post(':id/reports')
  async createReport(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    checkUuid(id, 'Project');
    const dto = parseCreateReportDto(body);
    return this.service.createReport(id, dto, req.user);
  }

  @Patch(':id/reports/:reportId')
  async updateReport(
    @Param('id') id: string,
    @Param('reportId') reportId: string,
    @Body() body: any,
    @Req() req: any
  ) {
    checkUuid(id, 'Project');
    checkUuid(reportId, 'Report');
    const dto = parseUpdateReportDto(body);
    return this.service.updateReport(id, reportId, dto, req.user);
  }

  @Post(':id/reports/:reportId/submit')
  async submitReport(
    @Param('id') id: string,
    @Param('reportId') reportId: string,
    @Body() body: any,
    @Req() req: any
  ) {
    checkUuid(id, 'Project');
    checkUuid(reportId, 'Report');
    const dto = parseSubmitDto(body);
    return this.service.submitReport(id, reportId, dto.expectedVersion, req.user);
  }

  @Post(':id/reports/:reportId/review')
  async reviewReport(
    @Param('id') id: string,
    @Param('reportId') reportId: string,
    @Body() body: any,
    @Req() req: any
  ) {
    checkUuid(id, 'Project');
    checkUuid(reportId, 'Report');
    const dto = parseReviewDto(body);
    return this.service.reviewReport(id, reportId, dto, req.user);
  }

  @Post(':id/outcomes')
  async addOutcome(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    checkUuid(id, 'Project');
    const dto = parseOutcomeDto(body);
    return this.service.addOutcome(id, dto, req.user);
  }

  @Post(':id/complete')
  async complete(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    checkUuid(id, 'Project');
    const dto = parseCompleteDto(body);
    return this.service.complete(id, dto.expectedVersion, req.user);
  }

  @Post(':id/terminate')
  async terminate(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    checkUuid(id, 'Project');
    const dto = parseTerminateDto(body);
    return this.service.terminate(id, dto, req.user);
  }
}
