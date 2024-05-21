import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, AnimationController, IonModal } from '@ionic/angular';
import { InventoryService } from 'src/app/Services/inventory.service';
import { Material } from 'src/app/Interfaces/material';
import { UserInventory } from 'src/app/Models/userInventoryModel';
import { FirestoreService } from 'src/app/Services/firestore.service';
import { AuthService } from 'src/app/Services/auth.service';
import { MaterialsService } from 'src/app/Services/materials.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage {
  initialInventory!: Material[];
  unitSelection: string[] = ['g', 'kg', 'lb', 'oz'];
  unit: string = 'g';
  loaded: boolean = false;
  //materials that are not already in the inventory
  allMaterials!: Material[];
  infoModalOpen: boolean = false;

  //info properties
  name: string = '';
  hazardous: boolean = false;
  description: string = '';
  oxidesWeight: string = '';

  constructor(
    public inventoryService: InventoryService,
    private animationCtrl: AnimationController,
    private firestore: FirestoreService,
    private auth: AuthService,
    private alertController: AlertController,
    private materialsService: MaterialsService,
    private modalController: ModalController
  ) {
    (async () => {
      this.loaded = false;
      this.inventoryService.userInventory = await this.firestore.getUserInventory(
        this.auth.userMeta?.uid || ''
      );
      this.initialInventory = this.initialInventory = JSON.parse(JSON.stringify(this.inventoryService.userInventory.inventory));
      this.loaded = true;
      this.allMaterials = this.materialsService.materials.filter(
        (material) =>
          !this.inventoryService.userInventory.inventory.some(
            (inventoryItem) => inventoryItem.Name.trim().toLowerCase() === material.Name.trim().toLowerCase()
          )
      ).slice(0, 50);
    })();
  }

  setOpen(material: any) {
    this.infoModalOpen = true;
    this.oxidesWeight = material.OxidesWeight;
    this.name = material.Name;
    this.hazardous = material.Hazardous;
    this.description = material.Description;
  }

  closeModalGeneral() {
    this.infoModalOpen = false;
    this.modalController.dismiss();
  }

  closeModalAndSave() {
    this.inventoryService.userInventory.inventory = this.inventoryService.userInventory.inventory.filter((item) => {
      return item.Name !== '' || item.Quantity !== 0;
    });
    console.log(this.inventoryService.userInventory.inventory, this.initialInventory);
    if (JSON.stringify(this.inventoryService.userInventory.inventory) !== JSON.stringify(this.initialInventory)){
      this.initialInventory = JSON.parse(JSON.stringify(this.inventoryService.userInventory.inventory));
      this.firestore.setUserInventory(this.auth.userMeta?.uid || '', this.inventoryService.userInventory);
    }
    this.modalController.dismiss();
  }

  setInventoryItem(event: any, index: number) {
    this.inventoryService.userInventory.inventory[index].Name = event.Name;
    let material = this.materialsService.materials.find(
      (material) => material.Name === event.Name
    ) as Material;
    this.inventoryService.userInventory.inventory[index].Oxides = material.Oxides;
    this.inventoryService.userInventory.inventory[index].OxidesWeight = material.OxidesWeight;
    this.inventoryService.userInventory.inventory[index].Description = material.Description;
    this.inventoryService.userInventory.inventory[index].Hazardous = material.Hazardous;
    this.allMaterials = this.allMaterials.filter(
      (material) =>
        !this.inventoryService.userInventory.inventory.some(
          (inventoryItem) => inventoryItem.Name === material.Name
        )
    );
  }

  setQuantity(event: any, index: number) {
    this.inventoryService.userInventory.inventory[index].Quantity = event.detail.value;
  }

  setItemUnit(event: any, index: number) {
    this.inventoryService.userInventory.inventory[index].Unit = event.detail.value;
  }

  async addInventoryItem() {
    //check if any of the ingredients are empty
    if (this.inventoryService.userInventory.inventory.some((item) => item.Name === '')) {
      await this.alertController.create({
        header: 'Error',
        message: 'Please fill out the previous ingredient before adding another.',
        buttons: ['OK'],
      }).then((alert) => {
        alert.present();
      });
      return;
    }

    this.inventoryService.userInventory.inventory.push({
      Name: '',
      Oxides: [],
      OxidesWeight: 0,
      Description: '',
      Percentage: 0,
      Quantity: 0,
      Hazardous: false,
      Unit: 'g',
    });

    //do the animation
    await this.slideInNewIngredient().then(() => {
      // Get the last ingredient's HTML element and slide it in
      let materialElements = document.querySelectorAll('.inventory-item');
      let lastIngredientElement = materialElements[
        materialElements.length - 1
      ] as HTMLElement;
      lastIngredientElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    });
  }

  async removeInventoryItem(index: number) {
    // Get the ingredient's HTML element and slide it out
    let ingredientElements = document.querySelectorAll('.inventory-item');
    let removedIngredientElement = ingredientElements[index] as HTMLElement;

    await this.slideOutIngredient(removedIngredientElement).then(() => {
      // Remove the ingredient from the array
      this.inventoryService.userInventory.inventory.splice(index, 1);

      // Slide up all remaining ingredients to fill the gap
      this.slideUpRemainingIngredients(
        Array.from(ingredientElements) as HTMLElement[],
        index
      );
    });
  }

  //animation methods
  async slideInNewIngredient(): Promise<void> {
    const slideInAnimation = this.animationCtrl
      .create()
      .duration(100)
      .fromTo('transform', 'translateX(100%)', 'translateX(0)')
      .fromTo('opacity', '0', '1'); // Fade in effect
    await slideInAnimation.play();
  }

  async slideUpRemainingIngredients(
    ingredientElements: HTMLElement[],
    removedIndex: number
  ) {
    if (
      ingredientElements.length === 0 ||
      removedIndex < 0 ||
      removedIndex >= ingredientElements.length
    )
      return;

    const slideUpAnimation = this.animationCtrl.create().duration(300); // Adjust duration as needed

    //slide up all elements after the one removed to fill the gap
    ingredientElements.forEach((element, index) => {
      if (index >= removedIndex) {
        slideUpAnimation
          .addElement(element)
          .fromTo(
            'transform',
            `translateY(${element.clientHeight}px)`,
            'translateY(0)'
          );
      }
    });

    await slideUpAnimation.play();
  }

  async slideOutIngredient(ingredientElement: HTMLElement) {
    const slideOutAnimation = this.animationCtrl
      .create()
      .addElement(ingredientElement)
      .duration(300)
      .fromTo('transform', 'translateX(0)', 'translateX(100%)')
      .fromTo('opacity', '1', '0'); // Fade out effect

    await slideOutAnimation.play();
  }
}
