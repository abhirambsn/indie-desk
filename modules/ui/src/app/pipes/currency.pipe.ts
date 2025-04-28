import { Pipe, PipeTransform } from '@angular/core';
import { Amount } from 'indiedesk-common-lib';

@Pipe({
  name: 'currency',
})
export class CurrencyPipe implements PipeTransform {
  transform(value: Amount): unknown {
    if (isNaN(value.amount) || value == null || value.currency == '') {
      return '';
    }

    let formattedAmount: string;
    if (value.currency === 'INR') {
      formattedAmount = new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value.amount);
    } else {
      formattedAmount = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value.amount);
    }
    return `${value.currency} ${formattedAmount}`;
  }
}
