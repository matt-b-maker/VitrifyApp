import { Component, Input, OnInit } from '@angular/core';
import { SideMenuHeaderComponent } from 'src/app/Components/side-menu-header/side-menu-header.component';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.page.html',
  styleUrls: ['./recipe.page.scss'],
})
export class RecipePage  {

  title: string = "Recipe Page, FUCK!!!";
  constructor() { }
}
