import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { IonInput, IonicModule } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-ingredient',
  standalone: true,
  templateUrl: './ingredient.component.html',
  styleUrls: ['./ingredient.component.scss', '../../../ionic-selectable.component.scss'],
  imports : [IonicModule, CommonModule, IonicModule, IonicSelectableComponent, FormsModule]
})
export class IngredientComponent implements OnInit {

  @ViewChild('ionInputEl', { static: true }) ionInputEl!: IonInput;

  @Output() quantityValueChange = new EventEmitter<number>();
  @Output() percentageValueChange = new EventEmitter<number>();
  @Output() removeIngredientEvent = new EventEmitter<string>();
  @Output() nameValueChange = new EventEmitter<string>();
  @Input() optionsList: string[] = [];
  @Input() placeholder: string = '';
  @Input() name: string = '';
  @Input() quantity: number = 0;
  @Input() percentage: number = 1;

  //1 through 100
  numbers: number[] = [];

  badgeShowing: boolean = false;
  borderClass: string = 'black-border';

  constructor() {

  }

  ngOnInit() {
    this.numbers = [];
    for (let i = 1; i <= 100; i++) {
      this.numbers.push(i);
    }
  }

  setQuantity(event: any) {
    this.quantity = event.target.value;
    this.quantityValueChange.emit(this.quantity);
  }

  setPercentage(event: any) {
    console.log(event.target.value);
    this.percentage = event.target.value;
    this.percentageValueChange.emit(this.percentage);
  }

  getQuantity(totalGrams: number) {
    return (this.percentage / 100) * totalGrams;
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

  checkLength(event: any, maxLength: number) {
    if (event.target!.value.length > maxLength) {
      this.ionInputEl.value = event.target.value.slice(0, maxLength);
    }
    this.setPercentage(event);
  }

  hideOrShowBadge(show: boolean) {
    this.badgeShowing = show;
  }
}
