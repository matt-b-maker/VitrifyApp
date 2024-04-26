import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, NgZone, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';


@Component({
  selector: 'app-ingredient',
  standalone: true,
  templateUrl: './ingredient.component.html',
  styleUrls: ['./ingredient.component.scss', '../../../ionic-selectable.component.scss'],
  imports : [IonicModule, CommonModule, IonicModule, IonicSelectableComponent]
})
export class IngredientComponent {

  @Output() quantityValueChange = new EventEmitter<number>();
  @Output() percentageValueChange = new EventEmitter<string>();
  @Output() removeIngredientEvent = new EventEmitter<string>();
  @Output() nameValueChange = new EventEmitter<string>();
  @Input() optionsList: string[] = [];
  @Input() placeholder: string = '';
  @Input() name: string = 'good job';
  @Input() quantity: number = 0;
  @Input() percentage: string = '';

  badgeShowing: boolean = false;
  borderClass: string = 'black-border';

  constructor(private zone: NgZone) { }

  setQuantity(event: any) {
    this.quantity = event.target.value;
    this.quantityValueChange.emit(this.quantity);
  }

  setPercentage(event: any) {
    this.percentage = event.target.value;
    if (this.percentage.length > 3) this.borderClass = 'red-border';
    else {
      this.borderClass = 'black-border';
    }
    this.percentageValueChange.emit(this.percentage);
  }

  getQuantity(totalGrams: number) {
    return (parseInt(this.percentage) / 100) * totalGrams;
  }

  removeIngredient() {
    this.removeIngredientEvent.emit(this.name);
  }

  setName(selectedName: any) {
    this.name = selectedName.value;
    console.log(this.name);
    this.nameValueChange.emit(this.name);
  }

  emitNameChange() {
    this.nameValueChange.emit(this.name);
  }

  hideOrShowBadge(show: boolean) {
    this.badgeShowing = show;
  }
}
