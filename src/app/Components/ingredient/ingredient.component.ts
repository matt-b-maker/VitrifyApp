import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';


@Component({
  selector: 'app-ingredient',
  standalone: true,
  templateUrl: './ingredient.component.html',
  styleUrls: ['./ingredient.component.scss'],
  imports : [IonicModule, CommonModule]
})
export class IngredientComponent {

  @Input() optionsList: string[] = [];
  name: string = '';
  quantity: number = 0;
  percentage: string = '';

  @Output() ingredientValueChange = new EventEmitter<string>();
  @Output() quantityValueChange = new EventEmitter<number>();
  @Output() percentageValueChange = new EventEmitter<string>();

  constructor() { }

  setQuantity(event: any) {
    this.quantity = event.target.value;
    this.quantityValueChange.emit(this.quantity);
  }

  setPercentage(event: any) {
    this.percentage = event.target.value;
    this.percentageValueChange.emit(this.percentage);
  }

  getQuantity(totalGrams: number) {
    return (parseInt(this.percentage) / 100) * totalGrams;
  }
}
