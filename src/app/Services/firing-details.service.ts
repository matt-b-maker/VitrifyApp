import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FiringDetailsService {

  constructor() { }

  firingTypes: string[] = [
    'Oxidation',
    'Reduction',
    'Salt',
    'Wood',
    'Soda',
    'Raku',
    'Pit',
    'Other',
  ];

  cones: string[] = [
    '06',
    '5',
    '5/6',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
  ];
}
