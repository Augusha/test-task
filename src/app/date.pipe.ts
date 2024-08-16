import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  standalone: true,
  name: 'date',
})
export class CustomDatePipe implements PipeTransform {
  private datePipe = new DatePipe('en-US');

  transform(value: string): string | null {
    return this.datePipe.transform(value, 'MMMM d, y');
  }
}
