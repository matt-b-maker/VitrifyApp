import { Component, Input, OnInit } from '@angular/core';
import { SideMenuHeaderComponent } from 'src/app/Components/side-menu-header/side-menu-header.component';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.page.html',
  styleUrls: ['./recipe.page.scss'],
})
export class RecipePage  {

  name: string = "";
  cone: number = 0;
  constructor() { }

  setName(event: any) {
    this.name = event.target.value;
  }

  setCone(event: any) {
    this.cone = event.target.value;
  }
}
