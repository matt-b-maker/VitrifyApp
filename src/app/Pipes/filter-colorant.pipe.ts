import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterColorant',
  standalone: true
})
export class FilterColorantPipe implements PipeTransform {
  transform(value: any[], filter: string = 'Colorant'): any[] {
    return value.filter(ingredient => ingredient.type === filter);
  }
}
