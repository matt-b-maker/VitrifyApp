import { Component, OnDestroy, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, ModalController } from '@ionic/angular';
import { Subscription, fromEvent } from 'rxjs';
import { Material } from 'src/app/Interfaces/material';
import { InventoryService } from 'src/app/Services/inventory.service';
import { MaterialsService } from 'src/app/Services/materials.service';

@Component({
  selector: 'app-public-materials',
  templateUrl: './public-materials.page.html',
  styleUrls: ['./public-materials.page.scss'],
})
export class PublicMaterialsPage implements OnInit, OnDestroy {

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
  inInventory: boolean = false;

  backbuttonSubscription!: Subscription;

  constructor(private materialsService: MaterialsService, private modal: ModalController, private inventoryService: InventoryService) {
    this.allMaterials = this.materialsService.materials;
    this.listMaterials = this.allMaterials.filter((material) => {
      return material.Name.charAt(0) === this.chosenLetter;
    });
  }

  async ngOnInit() {
    this.allMaterials = this.materialsService.materials;
    this.listMaterials = this.allMaterials.filter((material) => {
      return material.Name.charAt(0) === this.chosenLetter;
    });
    const event = fromEvent(document, 'backbutton');
    this.backbuttonSubscription = event.subscribe(async () => {
        const modal = await this.modal.getTop();
        if (modal) {
            modal.dismiss();
        }
    });
  }

  ngOnDestroy() {
    this.modal.dismiss();
    this.backbuttonSubscription.unsubscribe();
  }

  setOpen(material: any) {
    if (this.inventoryService.userInventory.inventory.some((inventoryItem) => inventoryItem.Name.trim().toLowerCase() === material.Name.trim().toLowerCase())) {
      this.inInventory = true;
    }
    this.oxidesWeight = material.OxidesWeight;
    this.name = material.Name;
    this.hazardous = material.Hazardous;
    this.description = material.Description;
    this.modalOpen = true;
  }

  cancel() {
    this.modalOpen = false;
    this.inInventory = false;
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
