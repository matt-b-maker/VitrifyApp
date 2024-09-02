import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonicSelectableComponent, IonicSelectableItemTemplateDirective } from 'ionic-selectable';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Material } from 'src/app/Interfaces/material';
import { MaterialsService } from 'src/app/Services/materials.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-materials-select',
  templateUrl: './materials-select.component.html',
  styleUrls: ['./materials-select.component.scss'],
  standalone: true,
  imports: [IonicSelectableComponent, FormsModule, IonicSelectableItemTemplateDirective, CommonModule]
})
export class MaterialsSelectComponent {

  @Input() materialName: string = '';
  @Input() material: Material = { Name: '', Oxides: [], OxidesWeight: 0, Description: '', Percentage: 0, Quantity: 0, Hazardous: false, Unit: 'g'};
  @Input() allMaterials: Material[] = this.materialsService.materials.slice(0, 50);
  @Output() ingredientChangedEmitter: EventEmitter<Material> = new EventEmitter<Material>();
  searching: boolean = false;

  constructor(private materialsService: MaterialsService) {
    this.allMaterials = this.allMaterials.sort((a, b) =>
      a.Name.localeCompare(b.Name)
    );
   }

  onMaterialSelect(event: any) {
    this.materialName = event.Name;
    this.material = event;
    this.ingredientChangedEmitter.emit(event);
  }

  searchIngredients(event: {
    component: IonicSelectableComponent;
    text: string;
  }) {
    let search = event.text.trim().toLowerCase();
    event.component.startSearch();

    if (!search) {
      event.component.items = this.allMaterials;
      event.component.endSearch();
      this.searching = false;
      return;
    }

    let searchResults: Material[] = [];

    if (search.length < 2) {
      searchResults = this.materialsService.materials.filter((material) =>
        material.Name.toLowerCase().startsWith(search)
      );
    }
    else {
      searchResults = this.materialsService.materials.filter((material) =>
        material.Name.toLowerCase().includes(search)
      );
    }

    event.component.items = searchResults.slice(0, 50);
    if (search.toLowerCase() === 'silica') {
      //put silica at the top of the list
      let silicaIndex = searchResults.findIndex((material) => material.Name.toLowerCase() === 'silica');
      if (silicaIndex !== -1) {
        searchResults.splice(silicaIndex, 1);
        let silicaMaterial = this.materialsService.materials.find((material) => material.Name.toLowerCase() === 'silica');
        if (silicaMaterial) {
          searchResults.unshift(silicaMaterial);
          event.component.items = searchResults.slice(0, 50);
        }
      }
    }
    this.searching = true;
    event.component.endSearch();
  }

  getMoreIngredients(event: {
    component: IonicSelectableComponent;
    text: string;
  }) {
    if (this.searching) {
      let items = this.materialsService.materials.filter((material) =>
        material.Name.toLowerCase().includes(
          event.component.searchText.toLowerCase()
        )
      );
      event.component.items = items.slice(0, event.component.items.length + 50);
      event.component.endInfiniteScroll();
      return;
    }
    this.allMaterials = [
      ...this.materialsService.materials.slice(
        0,
        this.allMaterials.length + 50
      ),
    ];
    event.component.endInfiniteScroll();
  }

  setIngredientValue(event: any) {
    this.materialName = event.value.Name;
    this.material = event.value as Material;
    this.ingredientChangedEmitter.emit(event.value as Material);
  }

  resetMaterials(event: any) {
  }

  getOxideInfo(material: Material) {
    let oxides = material.Oxides;
    let oxideInfo = '';
    for (let i = 0; i < oxides.length; i++) {
      if (i !== 0) {
        oxideInfo += ' ~ ';
      }
      oxideInfo += oxides[i].OxideName + ': ' + oxides[i].Analysis + '%';
    }
    return oxideInfo;
  }
}
