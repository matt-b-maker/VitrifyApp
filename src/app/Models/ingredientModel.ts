export class Ingredient {
  state: 'in' | 'out' = 'in'; // Default state

  name: string;
  type: string;
  quantity: number;
  percentage: number;

  constructor(name: string, type: string, quantity: number, percentage: number) {
      this.name = name;
      this.type = type;
      this.quantity = quantity;
      this.percentage = percentage;
  }
}
