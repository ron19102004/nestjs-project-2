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
  @Get('/adminId=:id/monthCurrent=:monthCur&monthPrevious=:monthPre&year=:year')
  @UseGuards(MyselfGuard)
  @Roles(Role.admin, Role.master)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  async compareMonth(
    @Param('id') id: number,
    @Param('monthCur') monthCurrent: number,
    @Param('monthPre') monthPrevious: number,
    @Param('year') year: number,
  ) {
    // if (
    //   !ValidatorCustomModule.isNumber(monthCurrent) &&
    //   !ValidatorCustomModule.isNumber(year) &&
    //   !ValidatorCustomModule.isNumber(monthPrevious)
    // )
    //   return ResponseCustomModule.error(
    //     'Giá trị của tháng và năm không hợp lệ',
    //     400,
    //   );
    // if (!ValidatorCustomModule.isNumber(monthPrevious))
    //   return ResponseCustomModule.error(
    //     'Giá trị của tháng trước không hợp lệ',
    //     400,
    //   );
    // if (!ValidatorCustomModule.isNumber(monthCurrent))
    //   return ResponseCustomModule.error(
    //     'Giá trị của tháng hiện tại không hợp lệ',
    //     400,
    //   );
    // if (!ValidatorCustomModule.isNumber(year))
    //   return ResponseCustomModule.error('Giá trị của năm không hợp lệ', 400);
    // if (parseInt(monthPrevious) > 12 || parseInt(monthPrevious) < 1)
    //   return ResponseCustomModule.error(
    //     'Giá trị của tháng trước không hợp lệ',
    //     400,
    //   );
    // if (parseInt(monthCurrent) > 12 || parseInt(monthCurrent) < 1)
    //   return ResponseCustomModule.error(
    //     'Giá trị của tháng hiện tại không hợp lệ',
    //     400,
    //   );
    return await this.bookingAnalyticService.compareTwoMonth(
      id,
      monthPrevious + '',
      monthCurrent + '',
      year + '',
    );
  }
}
