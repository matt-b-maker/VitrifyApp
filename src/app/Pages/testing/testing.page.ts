import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  input,
} from '@angular/core';
import {
  AlertController,
  AnimationController,
  IonInput,
  LoadingController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { Timestamp } from 'firebase/firestore';
import { Subscription, fromEvent } from 'rxjs';
import { Recipe } from 'src/app/Models/recipeModel';
import { Status } from 'src/app/Models/status';
import { TestBatch } from 'src/app/Models/testBatchModel';
import { TestTile } from 'src/app/Models/testTileModel';
import { AnimationService } from 'src/app/Services/animation.service';
import { AuthService } from 'src/app/Services/auth.service';
import { FirestoreService } from 'src/app/Services/firestore.service';
import { RecipesService } from 'src/app/Services/recipes.service';
import { TestingService } from 'src/app/Services/testing.service';
import { parse } from 'uuid';

@Component({
  selector: 'app-testing',
  templateUrl: './testing.page.html',
  styleUrls: ['./testing.page.scss'],
})
export class TestingPage {

  userHasRecipes: boolean = false;

  initialTestBatches!: TestBatch[];
  testBatchUnderEdit!: TestBatch;
  editingModalOpen: boolean = false;
  detailsModalOpen: boolean = false;
  editOrAdd: string = 'Add';
  loaded: boolean = false;
  inputTitleMode: boolean = false;

  backbuttonSubscription!: Subscription;

  completeTestButtons = [
    {
      text: 'Update All Statuses',
      handler: () => {
        this.completeTest(true);
      },
    },
    {
      text: 'Only Update Batch Status',
      handler: () => {
        this.completeTest(false);
      },
    },
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
      },
    },
  ];

  constructor(
    public testingService: TestingService,
    public recipesService: RecipesService,
    private animationCtrl: AnimationController,
    private firestore: FirestoreService,
    private auth: AuthService,
    private alertController: AlertController,
    private modal: ModalController,
    private toastController: ToastController,
    private animationService: AnimationService,
    private loadingController: LoadingController
  ) {
    //this.testingService.getUserTestBatches();
    (async () => {
      this.recipesService.userRecipes = await this.firestore.getUserRecipes(
        this.auth.userMeta?.uid || ''
      );
      this.userHasRecipes = this.recipesService.userRecipes.length > 0;
      if (!this.userHasRecipes) {
        return;
      }
      this.loaded = false;
      await this.testingService.getUserTestBatches();
      this.testingService.testBatches.forEach((batch) => {
        batch.descriptionString = this.getTileSetupString(
          this.testingService.testBatches.indexOf(batch)
        );
      });
      this.initialTestBatches = this.testingService.testBatches;
      this.loaded = true;
    })();
  }

  getTileSetupString(index: number): string {
    if (this.testingService.testBatches[index].tiles.length === 0) {
      return 'No Tiles Yet';
    } else if (this.testingService.testBatches[index].tiles.length === 1) {
      return '1 Tile';
    } else {
      return `${this.testingService.testBatches[index].tiles.length} Tiles`;
    }
  }

  makeTitleEditable(index: number) {
    this.testBatchUnderEdit.tiles[index].inputTitleMode = true;
    setTimeout(() => {
      const inputElement = document.querySelector(
        `.title-input-${index}`
      ) as HTMLIonInputElement;
      if (inputElement) {
        inputElement.setFocus();
      }
    }, 0); // Adjust the timeout duration as needed
  }

  makeTitleReadOnly(index: number) {
    this.testBatchUnderEdit.tiles[index].inputTitleMode = false;
  }

  unfocusInput(index: number) {
    const inputElement = document.querySelector(
      `.title-input-${index}`
    ) as HTMLIonInputElement;
    if (inputElement) {
      inputElement.blur();
    }
    this.makeTitleReadOnly(index);
  }

  setTileCount(event: any) {
    // Get the value from the input element
    let inputValue = (event.target as HTMLInputElement).value;
    try {
      if (
        event.target.value.trim() === '' ||
        parseInt(event.target.value.trim()) <= 0
      ) {
        inputValue = '1';
      }
    } catch (error) {
      return;
    }
    event.target.value = inputValue.trim().replace(/^0+/, '').slice(0, 3);

    // Convert the value to a number if necessary, trimming zeros from the beginning
    let tileCount = parseInt(inputValue.trim().replace(/^0+/, ''));

    console.log(tileCount);

    if (tileCount < 0) {
      tileCount = 1;
    }
    if (tileCount > 100) {
      tileCount = 100;
    }
    if (tileCount === this.testBatchUnderEdit.tiles.length) {
      return;
    }
    if (tileCount > this.testBatchUnderEdit.tiles.length) {
      while (this.testBatchUnderEdit.tiles.length < tileCount) {
        this.addTileToBatch();
      }
    }
    if (tileCount < this.testBatchUnderEdit.tiles.length) {
      while (this.testBatchUnderEdit.tiles.length > tileCount) {
        this.testBatchUnderEdit.tiles.pop();
      }
    }
    let titleInput = document.querySelector(
      '#startingTilesInput'
    ) as HTMLIonInputElement;
    if (titleInput) {
      titleInput.blur();
    }
  }

  async deleteTile(index: number) {
    await this.alertController
      .create({
        header: 'Just Checking',
        message: 'Are you sure you want to delete this tile?',
        buttons: [
          {
            text: 'Yes, do it',
            handler: async () => {
              let tiles = document.querySelectorAll('.tile');
              let removedTile = tiles[index] as HTMLElement;
              await this.animationService.slideOutItem(removedTile).then(() => {
                this.testBatchUnderEdit.tiles.splice(index, 1);
                this.animationService.slideUpRemainingItems(
                  Array.from(tiles) as HTMLElement[],
                  index
                );
              });
            },
          },
          {
            text: 'Nope',
            handler: () => {
              return;
            },
          },
        ],
      })
      .then((alert) => {
        alert.present();
      });
  }

  editTestBatch(testBatch: TestBatch) {
    this.testBatchUnderEdit = JSON.parse(JSON.stringify(testBatch));
    this.editOrAdd = `Editing ${testBatch.name}`;
    console.log(this.testBatchUnderEdit.tiles[0]);
    this.editingModalOpen = true;
  }

  showTestBatchDetails(testBatch: TestBatch) {
    this.testBatchUnderEdit = testBatch;
    this.detailsModalOpen = true;
  }

  setLayerName(event: any, tileIndex: number, recipeIndex: number) {
    console.log(event);
    const selectedRecipe = this.recipesService.userRecipes.find(
      (recipe) => recipe.name === event.detail.value
    );
    console.log(selectedRecipe);
    if (selectedRecipe) {
      this.testBatchUnderEdit.tiles[tileIndex].recipes[recipeIndex].name =
        selectedRecipe.name;
      this.testBatchUnderEdit.tiles[tileIndex].recipes[recipeIndex].id =
        selectedRecipe.id;
      this.testBatchUnderEdit.tiles[tileIndex].recipes[
        recipeIndex
      ].description = selectedRecipe.description;
      this.testBatchUnderEdit.tiles[tileIndex].recipes[recipeIndex].creator =
        selectedRecipe.creator;
      this.testBatchUnderEdit.tiles[tileIndex].recipes[recipeIndex].cone =
        selectedRecipe.cone;
      this.testBatchUnderEdit.tiles[tileIndex].recipes[recipeIndex].revisions =
        selectedRecipe.revisions;
      this.testBatchUnderEdit.tiles[tileIndex].selectedRevisions[
        recipeIndex
      ] = 1;
    }
  }

  setLayerRevision(event: any, tileIndex: number, recipeIndex: number) {
    this.testBatchUnderEdit.tiles[tileIndex].selectedRevisions[recipeIndex] =
      event.detail.value;
  }

  addTestBatch() {
    console.log('click');
    this.editOrAdd = 'New Test Batch';
    this.testBatchUnderEdit = new TestBatch(
      '',
      this.auth.userMeta?.uid || '',
      `Test Batch ${this.testingService.testBatches.length + 1}`,
      [new TestTile(1, [new Recipe('', '', '', '', '', [])], '')]
    );
    this.editingModalOpen = true;
    this.backbuttonSubscription
  }

  async deleteTestBatch(testBatch: TestBatch) {
    await this.alertController
      .create({
        header: 'Just Checking',
        message: 'Are you sure you want to delete this test batch?',
        buttons: [
          {
            text: 'Yes, do it',
            handler: async () => {
              await this.firestore.deleteTestBatch(testBatch.id);
              this.testingService.testBatches =
                this.testingService.testBatches.filter(
                  (batch) => batch.id !== testBatch.id
                );
              this.toastController
                .create({
                  message: 'Test batch deleted',
                  duration: 2000,
                  position: 'bottom',
                  color: 'success',
                })
                .then((toast) => {
                  toast.present();
                });
            },
          },
          {
            text: 'Nope',
            handler: () => {
              return;
            },
          },
        ],
      })
      .then((alert) => {
        alert.present();
      });
  }

  closeDetailsModal() {
    this.detailsModalOpen = false;
  }

  async closeModalAndSave() {
    //just close if nothing has changed
    if (
      JSON.stringify(this.testBatchUnderEdit) ==
      JSON.stringify(
        this.testingService.testBatches.find(
          (batch) => batch.id === this.testBatchUnderEdit.id
        )
      )
    ) {
      this.editingModalOpen = false;
      return;
    }

    if (this.testBatchUnderEdit?.name === '') {
      //let the user close the modal and clear the test batch if they want to
      await this.alertController
        .create({
          header: 'Error',
          message: 'Please enter a name for the test batch before saving.',
          buttons: [
            {
              text: 'Oh, yeah, ok',
              handler: () => {
                return;
              },
            },
            {
              text: 'Forget it, leave it',
              handler: () => {
                this.testBatchUnderEdit = new TestBatch(
                  '',
                  this.auth.userMeta?.uid || '',
                  `Test Batch ${this.testingService.testBatches.length + 1}`,
                  [new TestTile(1, [], '')]
                );
                this.editingModalOpen = false;
              },
            },
          ],
        })
        .then((alert) => {
          alert.present();
        });
    } else if (
      this.testingService.testBatches.some(
        (batch) => batch.name === this.testBatchUnderEdit.name
      ) &&
      !this.editingModalOpen
    ) {
      //let the user close the modal and clear the test batch if they want to
      await this.alertController
        .create({
          header: 'Error',
          message:
            'You already have a test batch with that name. Please enter a unique name.',
          buttons: [
            {
              text: 'Oh, yeah, ok',
              handler: () => {
                return;
              },
            },
            {
              text: 'Forget it, leave it',
              handler: () => {
                this.testBatchUnderEdit = new TestBatch(
                  '',
                  this.auth.userMeta?.uid || '',
                  `Test Batch ${this.testingService.testBatches.length + 1}`,
                  [new TestTile(1, [], '')]
                );
                this.editingModalOpen = false;
              },
            },
          ],
        })
        .then((alert) => {
          alert.present();
        });
    } else {
      //if there's no content, just close the modal
      this.testBatchUnderEdit.tiles = this.testBatchUnderEdit.tiles.filter(
        (tile) => tile.recipes.length > 0 && tile.recipes[0].name !== ''
      );
      //remove any recipes from the tiles that don't have a name
      this.testBatchUnderEdit.tiles.forEach((tile) => {
        tile.recipes = tile.recipes.filter((recipe) => recipe.name !== '');
      });

      if (this.testBatchUnderEdit.tiles.length === 0) {
        this.editingModalOpen = false;
        return;
      }

      //ask if they want to save or close without saving
      await this.alertController
        .create({
          header: 'Heyo',
          message: 'Do you want to save your changes?',
          buttons: [
            {
              text: 'Yes, save it',
              handler: async () => {
                this.testBatchUnderEdit.dateCreatedFormatted =
                  this.getDateCreated(this.testBatchUnderEdit);
                //remove tiles without any recipes
                await this.firestore.upsertTestBatch(this.testBatchUnderEdit);
                //if the test batch is already in the array, update it, else add it
                if (
                  this.testingService.testBatches.find(
                    (batch) => batch.id === this.testBatchUnderEdit.id
                  )
                ) {
                  this.testingService.testBatches[
                    this.testingService.testBatches.findIndex(
                      (batch) => batch.id === this.testBatchUnderEdit.id
                    )
                  ] = this.testBatchUnderEdit;

                  //mod the description string
                  this.testingService.testBatches[
                    this.testingService.testBatches.indexOf(
                      this.testBatchUnderEdit
                    )
                  ].descriptionString = this.getTileSetupString(
                    this.testingService.testBatches.indexOf(
                      this.testBatchUnderEdit
                    )
                  );
                } else {
                  this.testingService.testBatches.push(this.testBatchUnderEdit);

                  //mod the description string
                  this.testingService.testBatches[
                    this.testingService.testBatches.length - 1
                  ].descriptionString = this.getTileSetupString(
                    this.testingService.testBatches.length - 1
                  );
                }
                this.testBatchUnderEdit = new TestBatch(
                  '',
                  this.auth.userMeta?.uid || '',
                  `Test Batch ${this.testingService.testBatches.length + 1}`,
                  [new TestTile(1, [], '')]
                );
                this.editingModalOpen = false;
              },
            },
            {
              text: 'Nope',
              handler: () => {
                this.editingModalOpen = false;
              },
            },
          ],
        })
        .then((alert) => {
          alert.present();
        });
    }
  }

  addLayerToTile(index: number) {
    this.testBatchUnderEdit?.tiles[index].recipes.push(
      new Recipe('', '', '', '', '', [])
    );
    this.testBatchUnderEdit?.tiles[index].selectedRevisions.push(1);
  }

  async removeRecipeFromTile(tileIndex: number, recipeIndex: number) {
    await this.alertController
      .create({
        header: 'Just Checking',
        message: 'Are you sure you want to delete this recipe?',
        buttons: [
          {
            text: 'Yes, do it',
            handler: () => {
              this.testBatchUnderEdit?.tiles[tileIndex].recipes.splice(
                recipeIndex,
                1
              );
              this.testBatchUnderEdit?.tiles[
                tileIndex
              ].selectedRevisions.splice(recipeIndex, 1);
            },
          },
          {
            text: 'Nope',
            handler: () => {
              return;
            },
          },
        ],
      })
      .then((alert) => {
        alert.present();
      });
  }

  async addTileToBatch() {
    this.testBatchUnderEdit?.tiles.push({
      number: this.testBatchUnderEdit.tiles.length + 1,
      recipes: [new Recipe('', '', '', '', '', [])],
      selectedRevisions: [],
      notes: '',
      inputTitleMode: false,
    });
    //do the animation
    await this.animationService.slideInNewItem();
  }

  getDateCreated(testBatch: TestBatch): string {
    try {
      const month = (testBatch.dateCreated.getMonth() + 1)
        .toString()
        .padStart(2, '0');
      const day = testBatch.dateCreated.getDate().toString().padStart(2, '0');
      const year = testBatch.dateCreated.getFullYear().toString();

      return `${month}/${day}/${year}`;
    } catch {
      const timeStamp = testBatch.dateCreated as unknown as Timestamp;
      const date = new Date(
        timeStamp.nanoseconds / 1000000 + timeStamp.seconds * 1000
      );
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const year = date.getFullYear().toString();

      return `${month}/${day}/${year}`;
    }
  }

  getChipColor(testBatch: TestBatch) {
    if (testBatch.status === Status.InProgress) {
      return 'primary';
    } else if (testBatch.status === Status.Tested) {
      return 'success';
    } else {
      return 'warning';
    }
  }

  async completeTest(updateRecipeStatuses: boolean) {
    const loading = await this.loadingController.create({
      message: 'Completing this Test...',
    });

    if (updateRecipeStatuses) {
      await loading.present();

      //to prevent updating the status of the same recipe multiple times
      let moddedRecipes: string[] = [];

      //update the status of the recipes in the test batch
      this.testBatchUnderEdit.tiles.forEach((tile) => {
        tile.recipes.forEach(async (recipe, index) => {
          console.log(tile.selectedRevisions[index]);
          if (moddedRecipes.includes(recipe.id)) {
            return;
          }
          let recipeToUpdate = this.recipesService.userRecipes.find(
            (userRecipe) => userRecipe.id === recipe.id
          );
          if (recipeToUpdate) {
            recipeToUpdate.revisions[tile.selectedRevisions[index] - 1].status =
              Status.Tested;
            moddedRecipes.push(recipeToUpdate.id);
            await this.firestore.updateRecipe(recipeToUpdate);
          }
        });
      });

      loading.dismiss();
    }

    await loading.present();

    //update the status of the test batch
    this.testBatchUnderEdit.status = Status.Tested;

    await this.firestore.upsertTestBatch(this.testBatchUnderEdit);

    loading.dismiss();

    this.detailsModalOpen = false;

    this.toastController
      .create({
        message: 'Test Batch Completed',
        duration: 2000,
        position: 'bottom',
        color: 'success',
      })
      .then((toast) => {
        toast.present();
      });
  }
}
