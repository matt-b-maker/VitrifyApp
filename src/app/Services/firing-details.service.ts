import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FiringDetailsService {
  constructor() {}

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

  firingCones: string[] = [
    '14',
    '13',
    '12',
    '11',
    '10',
    '9',
    '8',
    '7',
    '6',
    '5',
    '4',
    '3',
    '2',
    '1',
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '010',
    '011',
    '012',
    '013',
    '014',
    '015',
    '016',
    '017',
    '018',
    '019',
    '020',
    '021',
    '022',
  ];
}
