import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterFlux',
  standalone: true
})
export class FilterFluxPipe implements PipeTransform {
  transform(value: any[], filter: string = 'Flux'): any[] {
    return value.filter(ingredient => ingredient.type === filter);
  }
}
