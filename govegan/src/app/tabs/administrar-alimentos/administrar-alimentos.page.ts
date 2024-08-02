import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, ModalController } from '@ionic/angular';
import { AppTabsComponent } from '../../components/app-tabs/app-tabs.component';
import { FoodsService } from '../../services/foods.service';
import { DetalleAlimentoComponent } from '../../components/detalle-alimento/detalle-alimento.component';
import { LoadingService } from '../../services/loading.service';
import { VistaCategoriasComponent } from '../../components/vista-categorias/vista-categorias.component';

@Component({
  selector: 'app-administrar-alimentos',
  templateUrl: './administrar-alimentos.page.html',
  styleUrls: ['./administrar-alimentos.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, AppTabsComponent, VistaCategoriasComponent]
})
export class AdministrarAlimentosPage {

  constructor(
    private modalController: ModalController,
    private foodsService: FoodsService,
    private loadingService: LoadingService,
    private alertController: AlertController
  ) { }

  showAlergias = true;
  showEvitados = false;
  alergiesPages: number = 0;
  allergicFoods: any[] = [];
  unwantedFoods: any[] = [];
  pageNumberAll: number = 0;
  pageNumberBusqueda: number = 0;
  pageSize: number = 2;
  response: any = {};
  pageNumberAlergies: number = 0;
  pageSizeAlergies: number = 6;
  modalAlimento: any;

  ionViewWillEnter() {
    this.updateFoods();
  }

  async updateFoods() {
    await this.loadingService.showLoading('Cargando',true,500);
    await Promise.all([
      this.getAllergies(),
      this.getUnwantedFoods()
    ]);
    await this.loadingService.hideLoading();
  }

  getFoodbyId(id: string, targetArray: any[]) {
    this.foodsService.getFoodById(id).subscribe({
      next: (response: any) => {
        targetArray.push(response);
      },
      error: (error) => {
        console.error('Error getting food:', error);
      }
    });
  }

  async getUnwantedFoods() {
    return new Promise<void>((resolve, reject) => {
      this.foodsService.getUnwantedFoods().subscribe({
        next: (response: any) => {
          const foodUnwantedIds = response.data;
          this.unwantedFoods = [];
          foodUnwantedIds.forEach((id: string) => this.getFoodbyId(id, this.unwantedFoods));
          console.log('unwanted:', this.unwantedFoods);
          resolve();
        },
        error: (error) => {
          console.error('Error getting unwanted foods:', error);
          reject(new Error('Error getting unwanted foods'));
        }
      });
    });
  }
  
  async abrirModalAlimento(food: any) {
    this.modalAlimento = await this.modalController.create({
      component: DetalleAlimentoComponent,
      componentProps: { food }
    });

    await this.modalAlimento.present();
  }

  async getAllergies() {
    return new Promise<void>((resolve, reject) => {
      this.foodsService.getFoodAllergies(this.pageNumberAlergies, this.pageSizeAlergies).subscribe({
        next: (response: any) => {
          const foodAlergiesIds = response.data.content;
          this.allergicFoods = [];
          this.alergiesPages = response.data.totalPages;
          foodAlergiesIds.forEach((id: string) => this.getFoodbyId(id, this.allergicFoods));
          console.log('Allergies:', this.allergicFoods);
          resolve();
        },
        error: (error) => {
          console.error('Error getting allergies:', error);
          reject(new Error('Error getting allergies'));
        }
      });
    });
  }

  segmentChanged(event: any) {
    const value = event.detail.value;
    this.showAlergias = value === 'alergias';
    this.showEvitados = value === 'evitados';
  }

  isAllergicFood(foodId: string): boolean {
    return this.allergicFoods.some(food => food.id === foodId);
  }

  isUnwantedFood(foodId: string): boolean {
    return this.unwantedFoods.some(food => food.id === foodId);
  }

  toggleAllergyFood(foodId: string) {
    this.foodsService.removeFoodAllergy(foodId).subscribe({
      next: (response: any) => {
        console.log('Allergy removed:', response);
        this.allergicFoods = this.allergicFoods.filter(f => f.data.id !== foodId);
      },
      error: (error) => {
        console.error('Error removing allergy:', error);
      }
    });
  }

  toggleUnwantedFood(foodId: string) {
    this.foodsService.removeUnwantedFood(foodId).subscribe({
      next: (response: any) => {
        console.log('Dislike removed:', response);
        this.unwantedFoods = this.unwantedFoods.filter(f => f.data.id !== foodId);
      },
      error: (error) => {
        console.error('Error removing dislike:', error);
      }
    });
  }
  async cambiarPaginaAllergies(incremento: number) {
    await this.loadingService.showLoading('Cargando', true, 100);
    this.pageNumberAlergies += incremento;
    this.getAllergies();
  }

  async RemoveAllergyAlert(item: any, event: Event) {
    event.stopPropagation();
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Está seguro de eliminar de la lista de alergias?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('El eliminar de la lista de alergias ha sido cancelado');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            console.log('items en alerta alergia', item.data.id);
            this.toggleAllergyFood(item.data.id);         
          }
        }
      ]
    });
  
    await alert.present();
  }

  async RemoveUnwantedAlert(item: any, event: Event) {
    event.stopPropagation();
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Está seguro de eliminar de la lista de evitados?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('El eliminar de la lista de evitados ha sido cancelado');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            console.log('items en alerta unwanted', item.data.id);
            this.toggleUnwantedFood(item.data.id);
          }
        }
      ]
    });
  
    await alert.present();
  }
}
