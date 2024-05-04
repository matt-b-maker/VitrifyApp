import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterSilica',
  standalone: true
})

export class FilterSilicaPipe implements PipeTransform {
  transform(value: any[], filter: string = 'Silica'): any[] {
    console.log(value.filter(ingredient => ingredient.type === filter))
    return value.filter(ingredient => ingredient.type === filter);
  }
}
