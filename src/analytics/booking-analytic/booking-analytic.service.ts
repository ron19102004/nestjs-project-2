import { Injectable } from '@nestjs/common';
import { ResponseCustomModule } from 'src/helpers/response.help';
import { Booking } from 'src/modules';
import { BookingService } from 'src/modules/booking/booking.service';

@Injectable()
export class BookingAnalyticService {
  constructor(private bookingService: BookingService) {}
  async quantityBookingWithinDate(adminId: number, date: string) {
    const bookings: Booking[] = await this.bookingService
      .getRepository()
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.admin', 'admin')
      .where('booking.admin.id=:id', { id: adminId })
      .andWhere('booking.timeInit=:timeInit', { timeInit: date })
      .andWhere('booking.deleted=:deleted', { deleted: false })
      .getMany();
    let quantityAcceptedYet: number = 0;
    let quantityAccepted: number = 0;
    let quantityRejected: number = 0;
    let quantityFinished: number = 0;
    for (const booking of bookings) {
      if (booking.rejected === true) {
        quantityRejected++;
      } else if (
        booking.rejected === false &&
        booking.accepted === true &&
        booking.finished === false
      ) {
        quantityAccepted++;
      } else if (
        booking.rejected === false &&
        booking.accepted === true &&
        booking.finished === true
      ) {
        quantityFinished++;
      } else if (
        (booking.rejected === false,
        booking.finished === false,
        booking.accepted === false)
      ) {
        quantityAcceptedYet++;
      }
    }
    let percentAcceptedYet: number = parseFloat(
      ((quantityAcceptedYet * 100) / bookings.length).toFixed(0),
    );
    let percentAccepted: number = parseFloat(
      ((quantityAccepted * 100) / bookings.length).toFixed(0),
    );
    let percentRejected: number = parseFloat(
      ((quantityRejected * 100) / bookings.length).toFixed(0),
    );
    let percentFinished: number =
      100.0 - percentAcceptedYet - percentAccepted - percentRejected;
    if (
      Number.isNaN(percentAccepted) ||
      Number.isNaN(percentFinished) ||
      Number.isNaN(percentRejected) ||
      Number.isNaN(percentAcceptedYet)
    ) {
      percentAccepted =
        percentAcceptedYet =
        percentFinished =
        percentRejected =
          0;
    }
    if (percentFinished < 0) {
      percentFinished = 0;
    }
    const percent: number[] = [
      percentAcceptedYet,
      percentRejected,
      percentAccepted,
      percentFinished,
    ];
    const quantity: number[] = [
      quantityAcceptedYet,
      quantityRejected,
      quantityAccepted,
      quantityFinished,
    ];
    const data = {
      label: ['Chưa xử lý', 'Từ chối', 'Chấp nhận', 'Hoàn thành'],
      data: quantity,
      percent: percent,
    };
    return ResponseCustomModule.ok(data, 'Thống kê thành công');
  }
  async quantityBookingWithinMonth(
    adminId: number,
    month: string,
    year: string,
  ) {
    const bookings: Booking[] = await this.bookingService
      .getRepository()
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.admin', 'admin')
      .where('booking.admin.id=:id', { id: adminId })
      .andWhere('booking.deleted = :deleted', { deleted: false })
      .andWhere('booking."timeInit" ILIKE :month', {
        month: `%-${month}-${year}`,
      })
      .getMany();
    let quantityAcceptedYet: number = 0;
    let quantityAccepted: number = 0;
    let quantityRejected: number = 0;
    let quantityFinished: number = 0;
    for (const booking of bookings) {
      if (booking.rejected === true) {
        quantityRejected++;
      } else if (
        booking.rejected === false &&
        booking.accepted === true &&
        booking.finished === false
      ) {
        quantityAccepted++;
      } else if (
        booking.rejected === false &&
        booking.accepted === true &&
        booking.finished === true
      ) {
        quantityFinished++;
      } else if (
        (booking.rejected === false,
        booking.finished === false,
        booking.accepted === false)
      ) {
        quantityAcceptedYet++;
      }
    }
    let percentAcceptedYet: number = parseFloat(
      ((quantityAcceptedYet * 100) / bookings.length).toFixed(2),
    );
    let percentAccepted: number = parseFloat(
      ((quantityAccepted * 100) / bookings.length).toFixed(2),
    );
    let percentRejected: number = parseFloat(
      ((quantityRejected * 100) / bookings.length).toFixed(2),
    );
    let percentFinished: number =
      100.0 - percentAcceptedYet - percentAccepted - percentRejected;
    if (
      Number.isNaN(percentAccepted) ||
      Number.isNaN(percentFinished) ||
      Number.isNaN(percentRejected) ||
      Number.isNaN(percentAcceptedYet)
    ) {
      percentAccepted =
        percentAcceptedYet =
        percentFinished =
        percentRejected =
          0;
    }
    if (percentFinished < 0) {
      percentFinished = 0;
    }
    const percent: number[] = [
      percentAcceptedYet,
      percentRejected,
      percentAccepted,
      percentFinished,
    ];
    const quantity: number[] = [
      quantityAcceptedYet,
      quantityRejected,
      quantityAccepted,
      quantityFinished,
    ];
    const data = {
      label: ['Chưa xử lý', 'Từ chối', 'Chấp nhận', 'Hoàn thành'],
      data: quantity,
      percent: percent,
    };
    return ResponseCustomModule.ok(data, 'Thống kê thành công');
  }
  async compareTwoMonth(
    adminId: number,
    monthFirst: string,
    monthSecond: string,
    yearFirst: string,
    yearSecond: string,
  ) {
    const quantityBookingWithinMonth1 = await this.quantityBookingWithinMonth(
      adminId,
      monthFirst,
      yearFirst,
    );
    const quantityBookingWithinMonth2 = await this.quantityBookingWithinMonth(
      adminId,
      monthSecond,
      yearSecond,
    );
    const month1MinusMonth2: number[] =
      quantityBookingWithinMonth1.data.data.map(
        (value: number, index: number) =>
          value - quantityBookingWithinMonth2.data.data[index],
      );
    let total: number = 0;
    for (const value of month1MinusMonth2) {
      total += value < 0 ? -value : value;
    }
    const quantityAcceptedYet: number = month1MinusMonth2[0];
    const quantityAccepted: number = month1MinusMonth2[1];
    const quantityRejected: number = month1MinusMonth2[2];
    const quantityFinished: number = month1MinusMonth2[3];
    let percentAcceptedYet: number = parseFloat(
      ((quantityAcceptedYet * 100) / total).toFixed(2),
    );
    let percentAccepted: number = parseFloat(
      ((quantityAccepted * 100) / total).toFixed(2),
    );
    let percentRejected: number = parseFloat(
      ((quantityRejected * 100) / total).toFixed(2),
    );
    let percentFinished: number = parseFloat(
      ((quantityFinished * 100) / total).toFixed(2),
    );
    if (
      Number.isNaN(percentAccepted) ||
      Number.isNaN(percentFinished) ||
      Number.isNaN(percentRejected) ||
      Number.isNaN(percentAcceptedYet)
    ) {
      percentAccepted =
        percentAcceptedYet =
        percentFinished =
        percentRejected =
          0;
    }
    const percentCompare: number[] = [
      percentAcceptedYet,
      percentAccepted,
      percentRejected,
      percentFinished,
    ];
    const quantityCompare: number[] = [
      quantityAcceptedYet,
      quantityAccepted,
      quantityRejected,
      quantityFinished,
    ];
    const data = {
      label: quantityBookingWithinMonth1.data.label,
      quantityCompare: quantityCompare,
      dataMonthFirst: quantityBookingWithinMonth1.data,
      dataMonthSecond: quantityBookingWithinMonth2.data,
      percentCompare: percentCompare,
    };
    return ResponseCustomModule.ok(data, 'Thống kê thành công');
  }
}
