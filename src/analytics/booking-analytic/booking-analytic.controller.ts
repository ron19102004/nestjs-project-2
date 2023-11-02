import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { BookingAnalyticService } from './booking-analytic.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ValidatorCustomModule } from 'src/helpers/validator.help';
import { ResponseCustomModule } from 'src/helpers/response.help';
import { MyselfGuard } from 'src/guards/myself.guard';
import { Role } from 'src/modules/user/interfaces/enum';
import { Roles } from 'src/auths/decorators/role.decorator';
import { RolesGuard } from 'src/guards/role.guard';
import { AuthsGuard } from 'src/auths/auths.guard';

@Controller('booking-analytic')
@ApiTags('booking-analytic')
export class BookingAnalyticController {
  constructor(private bookingAnalyticService: BookingAnalyticService) {}
  @Get('/adminId=:id/date=:date')
  @UseGuards(MyselfGuard)
  @Roles(Role.admin, Role.master)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  async getWithinDate(@Param('date') date: string, @Param('id') id: number) {
    if (!ValidatorCustomModule.isDate(date))
      return ResponseCustomModule.error('Giá trị ngày không hợp lệ', 400);
    return await this.bookingAnalyticService.quantityBookingWithinDate(
      id,
      date,
    );
  }
  @Get('/adminId=:id/month=:month&year=:year')
  @UseGuards(MyselfGuard)
  @Roles(Role.admin, Role.master)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  async getWithinMonth(
    @Param('month') month: string,
    @Param('year') year: string,
    @Param('id') id: number,
  ) {
    if (
      !ValidatorCustomModule.isNumber(month) &&
      !ValidatorCustomModule.isNumber(year)
    )
      return ResponseCustomModule.error(
        'Giá trị của tháng và năm không hợp lệ',
        400,
      );
    if (!ValidatorCustomModule.isNumber(month))
      return ResponseCustomModule.error('Giá trị của tháng không hợp lệ', 400);
    if (!ValidatorCustomModule.isNumber(year))
      return ResponseCustomModule.error('Giá trị của năm không hợp lệ', 400);
    if (parseInt(month) > 12 || parseInt(month) < 1)
      return ResponseCustomModule.error('Giá trị của tháng không hợp lệ', 400);
    return await this.bookingAnalyticService.quantityBookingWithinMonth(
      id,
      month,
      year,
    );
  }
  @Get('/adminId=:id/monthF=:monthf&monthS=:months&yearF=:yearf&yearS=:years')
  @UseGuards(MyselfGuard)
  @Roles(Role.admin, Role.master)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  async compareMonth(
    @Param('id') id: number,
    @Param('monthf') monthF: string,
    @Param('months') monthS: string,
    @Param('years') years: string,
    @Param('yearf') yearf: string,
  ) {
    if (
      !ValidatorCustomModule.isNumber(monthF) &&
      !ValidatorCustomModule.isNumber(years) &&
      !ValidatorCustomModule.isNumber(monthS) &&
      !ValidatorCustomModule.isNumber(yearf)
    )
      return ResponseCustomModule.error(
        'Giá trị của tháng và năm không hợp lệ',
        400,
      );
    if (!ValidatorCustomModule.isNumber(monthF))
      return ResponseCustomModule.error(
        'Giá trị của tháng thứ 1 không hợp lệ',
        400,
      );
    if (!ValidatorCustomModule.isNumber(monthS))
      return ResponseCustomModule.error(
        'Giá trị của tháng thứ 2 không hợp lệ',
        400,
      );
    if (!ValidatorCustomModule.isNumber(yearf))
      return ResponseCustomModule.error(
        'Giá trị của năm đầu không hợp lệ',
        400,
      );
    if (!ValidatorCustomModule.isNumber(years))
      return ResponseCustomModule.error(
        'Giá trị của năm đầu không hợp lệ',
        400,
      );
    if (parseInt(monthF) > 12 || parseInt(monthF) < 1)
      return ResponseCustomModule.error(
        'Giá trị của tháng đầu không hợp lệ',
        400,
      );
    if (parseInt(monthS) > 12 || parseInt(monthS) < 1)
      return ResponseCustomModule.error(
        'Giá trị của tháng sau không hợp lệ',
        400,
      );
    return await this.bookingAnalyticService.compareTwoMonth(
      id,
      monthF,
      monthS,
      yearf,
      years,
    );
  }
}
