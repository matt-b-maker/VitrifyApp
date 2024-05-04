import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterStabilizer',
  standalone: true
})
export class FilterStabilizerPipe implements PipeTransform {
  transform(value: any[], filter: string = 'Stabilizer'): any[] {
    return value.filter(ingredient => ingredient.type === filter);
  }
}
