import { Component, OnInit } from '@angular/core';
import { MaterialsService } from 'src/app/Services/materials.service';

@Component({
  selector: 'app-materials',
  templateUrl: './materials.page.html',
  styleUrls: ['./materials.page.scss'],
})
export class MaterialsPage implements OnInit {

  allMaterials: any[] = this.materialsService.getMaterialsProperties();
  modalOpen: boolean = false;
  chemicalComposition: string = '';
  name: string = '';
  healthAndSafety: string = '';
  usesInGlazes: string = '';

  constructor(private materialsService: MaterialsService) { }

  ngOnInit() {
    this.allMaterials = this.materialsService.getMaterialsProperties();
    console.log(this.allMaterials);
  }

  setOpen(material: any) {
    this.modalOpen = true;
    this.chemicalComposition = material.chemicalComposition;
    this.name = material.name;
    this.healthAndSafety = material.healthAndSafety;
    this.usesInGlazes = material.usesInGlazes;
  }

  cancel() {
    this.modalOpen = false;
  }

  searchMaterials(event: any) {
    let searchValue = event.target.value.toLowerCase();
    this.allMaterials = this.materialsService.getMaterialsProperties().filter(
      (material) =>
        material.name.toLowerCase().includes(searchValue) ||
        material.chemicalComposition.toLowerCase().includes(searchValue)
    );
  }
}
