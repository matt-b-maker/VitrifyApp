import { Injectable } from '@angular/core';
import { ConeTemp } from '../Interfaces/coneTempInterface';

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

  conesAndTemps: { [key: string]: ConeTemp } = {
    //ceramic cones from 10 to 022 in the format {
    //   farhenheit: 2345,
    //   celsius: 1285,
    //   clayReaction: '',
    //   fireColor: '',
    //   glazeType: '',
    // }
    '022': {
      farhenheit: 1087,
      celsius: 586,
      clayReaction: 'Vitrification begins',
      fireColor: 'Dull Red',
      glazeType: 'Low fire glazes',
    },
    '021': {
      farhenheit: 1112,
      celsius: 600,
      clayReaction: 'Vitrification begins',
      fireColor: 'Dull Red',
      glazeType: 'Low fire glazes',
    },
    '020': {
      farhenheit: 1159,
      celsius: 626,
      clayReaction: 'Vitrification begins',
      fireColor: 'Dull Red',
      glazeType: 'Low fire glazes',
    },
    '019': {
      farhenheit: 1252,
      celsius: 678,
      clayReaction: 'Vitrification begins',
      fireColor: 'Dull Red',
      glazeType: 'Low fire glazes',
    },
    '018': {
      farhenheit: 1319,
      celsius: 715,
      clayReaction: 'Vitrification begins',
      fireColor: 'Dull Red',
      glazeType: 'Low fire glazes',
    },
    '017': {
      farhenheit: 1360,
      celsius: 738,
      clayReaction: 'Vitrification begins',
      fireColor: 'Cherry Red',
      glazeType: 'Low fire glazes',
    },
    '016': {
      farhenheit: 1422,
      celsius: 722,
      clayReaction: 'Vitrification begins',
      fireColor: 'Cherry Red',
      glazeType: 'Low fire glazes',
    },
    '015': {
      farhenheit: 1456,
      celsius: 791,
      clayReaction: 'Vitrification begins',
      fireColor: 'Cherry Red',
      glazeType: 'Low fire glazes',
    },
    '014': {
      farhenheit: 1485,
      celsius: 807,
      clayReaction: 'Organic matter burns out',
      fireColor: 'Cherry Red',
      glazeType: 'Low fire glazes',
    },
    '013': {
      farhenheit: 1539,
      celsius: 837,
      clayReaction: 'Vitrification begins',
      fireColor: 'Cherry Red',
      glazeType: 'Low fire glazes',
    },
    '012': {
      farhenheit: 1582,
      celsius: 861,
      clayReaction: 'Vitrification begins',
      fireColor: 'Cherry Red',
      glazeType: 'Low fire glazes',
    },
    '011': {
      farhenheit: 1607,
      celsius: 875,
      clayReaction: 'Vitrification begins',
      fireColor: 'Cherry Red',
      glazeType: 'Low fire glazes',
    },
    '010': {
      farhenheit: 1657,
      celsius: 903,
      clayReaction: 'Vitrification begins',
      fireColor: 'Cherry Red',
      glazeType: 'Low fire glazes',
    },
    '09': {
      farhenheit: 1789,
      celsius: 976,
      clayReaction: 'Vitrification begins',
      fireColor: 'Cherry Red',
      glazeType: 'Low fire glazes',
    },
    '08': {
      farhenheit: 1728,
      celsius: 942,
      clayReaction: 'Vitrification begins',
      fireColor: 'Yellow',
      glazeType: 'Low fire glazes',
    },
    '07': {
      farhenheit: 1789,
      celsius: 976,
      clayReaction: 'Vitrification begins',
      fireColor: 'Yellow',
      glazeType: 'Low fire glazes',
    },
    '06': {
      farhenheit: 1828,
      celsius: 998,
      clayReaction: 'Vitrification begins',
      fireColor: 'Yellow',
      glazeType: 'Low fire glazes',
    },
    '05': {
      farhenheit: 1888,
      celsius: 1031,
      clayReaction: 'Vitrification begins',
      fireColor: 'Yellow',
      glazeType: 'Low fire glazes',
    },
    '04': {
      farhenheit: 1945,
      celsius: 1063,
      clayReaction: 'Vitrification begins',
      fireColor: 'Yellow',
      glazeType: 'Low fire glazes',
    },
    '03': {
      farhenheit: 1987,
      celsius: 1086,
      clayReaction: 'Vitrification begins',
      fireColor: 'Yellow',
      glazeType: 'Low fire glazes',
    },
    '02': {
      farhenheit: 2016,
      celsius: 1102,
      clayReaction: 'Vitrification begins',
      fireColor: 'Yellow',
      glazeType: 'Low fire glazes',
    },
    '01': {
      farhenheit: 2046,
      celsius: 1119,
      clayReaction: 'Vitrification begins',
      fireColor: 'Yellow',
      glazeType: 'Low fire glazes',
    },
    '1': {
      farhenheit: 2079,
      celsius: 1137,
      clayReaction: 'Vitrification begins',
      fireColor: 'Yellow',
      glazeType: 'Low fire glazes',
    },
    '2': {
      farhenheit: 2088,
      celsius: 1142,
      clayReaction: 'Vitrification begins',
      fireColor: 'White',
      glazeType: 'Low fire glazes',
    },
    '3': {
      farhenheit: 2105,
      celsius: 1152,
      clayReaction: 'Vitrification begins',
      fireColor: 'White',
      glazeType: 'Low fire glazes',
    },
    '4': {
      farhenheit: 2124,
      celsius: 1162,
      clayReaction: 'Vitrification begins',
      fireColor: 'White',
      glazeType: 'Low fire glazes',
    },
    '5': {
      farhenheit: 2167,
      celsius: 1186,
      clayReaction: 'Vitrification begins',
      fireColor: 'White',
      glazeType: 'Low fire glazes',
    },
    '6': {
      farhenheit: 2232,
      celsius: 1222,
      clayReaction: 'Vitrification begins',
      fireColor: 'White',
      glazeType: 'Low fire glazes',
    },
    '7': {
      farhenheit: 2262,
      celsius: 1239,
      clayReaction: 'Vitrification begins',
      fireColor: 'White',
      glazeType: 'Mid-range glazes',
    },
    '8': {
      farhenheit: 2280,
      celsius: 1249,
      clayReaction: 'Vitrification begins',
      fireColor: 'White',
      glazeType: 'High Fire and Salt glazes',
    },
    '9': {
      farhenheit: 2300,
      celsius: 1260,
      clayReaction: 'Vitrification begins',
      fireColor: 'White',
      glazeType: 'High Fire and Salt glazes',
    },
    '10': {
      farhenheit: 2345,
      celsius: 1285,
      clayReaction: 'Stoneware and porcelain',
      fireColor: 'White',
      glazeType: 'High Fire and Salt glazes',
    },
  };
}
