import { Injectable } from '@angular/core';

interface glaze {
  imageUrl: string;
  title: string;
  creator: string;
  year: number;
}

@Injectable({
  providedIn: 'root'
})
export class GlazeLogoGetterService {
  glazes: glaze[] = [];
  chosenNumber: number | undefined = 0;
  constructor() {
    this.glazes = [
      {
        imageUrl: 'https://ceramicartsnetwork.org/images/default-source/uploadedimages/wp-content/uploads/2015/03/glaze-recipes-and-expert-tips-for-great-pottery-glazing-results-new.jpg?sfvrsn=c5a6b3ef_0',
        title: 'Blue Glaze',
        creator: 'Jimmy Towel',
        year: 2019
      },
      {
        imageUrl: 'https://ceramicartsnetwork.org/images/default-source/uploadedimages/wp-content/uploads/2015/03/glaze-recipes-and-expert-tips-for-great-pottery-glazing-results-new.jpg?sfvrsn=c5a6b3ef_0',
        title: 'Blue Glaze',
        creator: 'Jimmy Towel',
        year: 2019
      },
      {
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJv-h7rEheHzuMWOuSxlCyki5IZWxX3ieBPbvQYYNN7gmC1arUzVGwAulW3LkTdxSYOmM&usqp=CAU',
        title: 'Salmon Blue Glaze',
        creator: 'Finny Waterson',
        year: 2050
      },
      {
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqY6V1xw9rxSbt2A2tgSolziy6-VRb_GjqsltmgzJ5jLyxdt3aAiGFduH14tsCpa2LpY8&usqp=CAU',
        title: 'The Twister',
        creator: 'Helen Hunt',
        year: 1655
      },
      {
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIiMn2zGWBl0B2fR6AN3yC2g4lMqduWayNvkTSuJ2DhA&s',
        title: 'Purp, lil\'',
        creator: 'Thursday Wantsgone',
        year: 1987
      },
      {
        imageUrl: 'https://ceramicartsnetwork.org/images/default-source/uploadedimages/wp-content/uploads/2009/02/ceramicspectrum_large.jpg?sfvrsn=80022d59_1',
        title: 'Green Mammoth',
        creator: 'Yep Durzz',
        year: 543
      },
    ];
  }

  getRandomGlaze(): glaze {
    //get random glaze from glazeGetter service that's not the same as the last one
    let randomNum = Math.floor(Math.random() * this.glazes.length);
    while (randomNum === this.chosenNumber) {
      randomNum = Math.floor(Math.random() * this.glazes.length);
    }
    this.chosenNumber = randomNum;
    return this.glazes[randomNum];
  }
}
