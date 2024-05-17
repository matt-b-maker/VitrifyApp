import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { MaterialsService } from 'src/app/Services/materials.service';

@Component({
  selector: 'app-materials',
  templateUrl: './materials.page.html',
  styleUrls: ['./materials.page.scss'],
})
export class MaterialsPage implements OnInit {

  allMaterials: any[] = this.materialsService.getMaterialsProperties();
  digitalFireMaterials: any[] = [];
  modalOpen: boolean = false;
  oxidesWeight: string = '';
  name: string = '';
  hazardous: boolean = false;
  description: string = '';

  constructor(private materialsService: MaterialsService) { }

  async ngOnInit() {
    this.allMaterials = this.materialsService.getMaterialsProperties();
    this.digitalFireMaterials = await this.materialsService.getDigitalFireMaterials();
    console.log(this.allMaterials);
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
    // this.allMaterials = this.materialsService.getMaterialsProperties().filter(
    //   (material) =>
    //     material.name.toLowerCase().includes(searchValue) ||
    //     material.chemicalComposition.toLowerCase().includes(searchValue)
    // );
    let materials:any[] = [...this.digitalFireMaterials];
    this.digitalFireMaterials = materials.filter((material) =>
      material.Name.toLowerCase().includes(searchValue)
    );
  }

  onIonInfinite(event: any) {
    (event as InfiniteScrollCustomEvent).target.complete();
  }
}
