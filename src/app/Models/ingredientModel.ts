class Composition {
  composition: string;
  colorClass: string;

  constructor(composition: string, color: string) {
      this.composition = composition;
      this.colorClass = color;
  }
}

export class Ingredient {
  name: string;
  composition: Composition;
  type: string;
  quantity: number;
  percentage: number;
  imageUrl: string;
  listName: string;

  constructor(name: string, composition: Composition, type: string, quantity: number, percentage: number) {
      this.name = name;
      this.composition = composition;
      this.type = type;
      this.quantity = quantity;
      this.percentage = percentage;
      this.listName = name + ' ' + composition.composition;
      this.imageUrl = '../../assets/images/silica-powder.jpg';
  }
}
