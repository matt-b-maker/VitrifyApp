import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { Material } from 'src/app/Interfaces/material';
import { MaterialsService } from 'src/app/Services/materials.service';

@Component({
  selector: 'app-custom-materials',
  templateUrl: './custom-materials.page.html',
  styleUrls: ['./custom-materials.page.scss'],
})
export class CustomMaterialsPage implements OnInit {

  allMaterials: Material[] = this.materialsService.materials;
  listMaterials: Material[] = [];
  letters: string[] = 'A B C D E F Frits G H I J K L M N O P Q R S T U V W X Y Z'.split(' ');
  dropdownShowing: boolean = true;
  loading: boolean = false;
  chosenLetter: string = 'A';
  modalOpen: boolean = false;
  oxidesWeight: string = '';
  name: string = '';
  hazardous: boolean = false;
  description: string = '';

  constructor(private materialsService: MaterialsService) {
    this.allMaterials = this.materialsService.materials;
    console.log(this.allMaterials.length);
    this.listMaterials = this.allMaterials.filter((material) => {
      return material.Name.charAt(0) === this.chosenLetter;
    });
  }

  async ngOnInit() {
    this.allMaterials = this.materialsService.materials;
    console.log(this.allMaterials.length);
    this.listMaterials = this.allMaterials.filter((material) => {
      return material.Name.charAt(0) === this.chosenLetter;
    });
  }

  setOpen(material: any) {
    this.modalOpen = true;
    this.oxidesWeight = material.OxidesWeight;
    this.name = material.Name;
    this.hazardous = material.Hazardous;
    this.description = material.Description;
  }

  cancel() {
    this.modalOpen = false;
  }

  searchMaterials(event: any) {
    let searchValue = event.target.value.toLowerCase();
    this.loading = true;

    setTimeout(() => {
      if (searchValue === '') {
        this.listMaterials = this.allMaterials.filter((material) => {
          return material.Name.charAt(0) === this.chosenLetter;
        });
        this.dropdownShowing = true;
      } else {
        this.dropdownShowing = false;
        this.listMaterials = this.allMaterials.filter((material) => {
          return material.Name.toLowerCase().includes(searchValue);
        });
      }
      this.loading = false;
    }, 0);
  }

  onIonInfinite(event: any) {
    (event as InfiniteScrollCustomEvent).target.complete();
  }

  setListMaterials(event: any) {
    this.chosenLetter = event.detail.value;
    if (this.chosenLetter.toLowerCase() === 'frits') {
      this.listMaterials = this.allMaterials.filter((material) => {
        return material.Name.toLowerCase().includes('frit');
      });
      return;
    }
    this.listMaterials = this.allMaterials.filter((material) => {
      return material.Name.charAt(0) === this.chosenLetter && !material.Name.toLowerCase().includes("frit");
    });
  }

}
