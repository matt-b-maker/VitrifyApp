export class Ingredient {
    name: string;
    amount: number;
    unit: string;
    percentage: number;

    constructor(name: string, amount: number, unit: string, percentage: number) {
        this.name = name;
        this.amount = amount;
        this.unit = unit;
        this.percentage = percentage;
    }
}
