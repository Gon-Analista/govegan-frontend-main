import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FoodsService } from '../../services/foods.service';
import { LoadingService } from '../../services/loading.service';
import { VistaCategoriasComponent } from '../vista-categorias/vista-categorias.component';

@Component({
  selector: 'app-vista-alimentos',
  templateUrl: './vista-alimentos.component.html',
  styleUrls: ['./vista-alimentos.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, VistaCategoriasComponent],
})
export class VistaAlimentosComponent {
  @Input() food: any;
  @Input() favoriteFoods: string[] = [];
  @Input() allergicFoods: string[] = [];
  @Input() dislikedFoods: string[] = [];
  @Output() foodStatusChanged = new EventEmitter<{ type: string, foodId: string }>();
  
  private readonly MAX_ITEMS: number = 7;

  constructor(
    private foodsService: FoodsService,
    private loadingService: LoadingService,
    private alertController: AlertController
  ) {}

  isFavoriteFood(foodId: string): boolean {
    return this.favoriteFoods.includes(foodId);
  }

  isAllergicFood(foodId: string): boolean {
    return this.allergicFoods.includes(foodId);
  }

  isDislikedFood(foodId: string): boolean {
    return this.dislikedFoods.includes(foodId);
  }

  async toggleFavoriteFood(food: any, event: Event) {
    await this.loadingService.showLoading('Cargando', true, 1000);
    event.stopPropagation();
    const foodId = food.id;
    if (this.isFavoriteFood(foodId)) {
      this.foodsService.removeFavoriteFood(foodId).subscribe({
        next: () => {
          this.favoriteFoods = this.favoriteFoods.filter(id => id !== foodId);
          this.foodStatusChanged.emit({ type: 'favorite', foodId });
          this.loadingService.hideLoading();
        },
        error: (error) => {
          console.error('Error removing favorite food:', error);
          this.loadingService.hideLoading();
        }
      });
    } else {
      if (this.isAllergicFood(foodId) || this.isDislikedFood(foodId)) {
        this.loadingService.hideLoading();
        this.showAlert('Cuidado', 'No puedes añadir una comida a favoritos si ya está en alergias o evitados.');
        return;
      }
      this.foodsService.addFavoriteFood(foodId).subscribe({
        next: () => {
          this.favoriteFoods.push(foodId);
          this.foodStatusChanged.emit({ type: 'favorite', foodId });
          this.loadingService.hideLoading();
        },
        error: (error) => {
          console.error('Error adding favorite food:', error);
          this.loadingService.hideLoading();
        }
      });
    }
  }

  async toggleAllergyFood(food: any, event: Event) {
    await this.loadingService.showLoading('Cargando', true, 1000);
    event.stopPropagation();
    const foodId = food.id;
    if (this.isAllergicFood(foodId)) {
      this.foodsService.removeFoodAllergy(foodId).subscribe({
        next: () => {
          this.allergicFoods = this.allergicFoods.filter(id => id !== foodId);
          this.foodStatusChanged.emit({ type: 'allergy', foodId });
          this.loadingService.hideLoading();
        },
        error: (error) => {
          console.error('Error removing allergy:', error);
          this.loadingService.hideLoading();
        }
      });
    } else {
      if (this.isFavoriteFood(foodId) || this.isDislikedFood(foodId)) {
        this.loadingService.hideLoading();
        this.showAlert('Cuidado', 'No puedes añadir una comida a alergias si ya está en favoritos o evitados.');
        return;
      }
      this.foodsService.addFoodAllergy(foodId).subscribe({
        next: () => {
          this.allergicFoods.push(foodId);
          this.foodStatusChanged.emit({ type: 'allergy', foodId });
          this.loadingService.hideLoading();
        },
        error: (error) => {
          console.error('Error adding allergy:', error);
          this.loadingService.hideLoading();
        }
      });
    }
  }

  async toggleDislikeFood(food: any, event: Event) {
    await this.loadingService.showLoading('Cargando', true, 1000);
    event.stopPropagation();
    const foodId = food.id;
    if (this.isDislikedFood(foodId)) {
      this.foodsService.removeUnwantedFood(foodId).subscribe({
        next: () => {
          this.dislikedFoods = this.dislikedFoods.filter(id => id !== foodId);
          this.foodStatusChanged.emit({ type: 'dislike', foodId });
          this.loadingService.hideLoading();
        },
        error: (error) => {
          console.error('Error removing dislike:', error);
          this.loadingService.hideLoading();
        }
      });
    } else {
      if (this.isFavoriteFood(foodId) || this.isAllergicFood(foodId)) {
        this.loadingService.hideLoading();
        this.showAlert('Cuidado', 'No puedes añadir una comida a evitados si ya está en favoritos o alergias.');
        return;
      }
      if (this.dislikedFoods.length >= this.MAX_ITEMS) {
        this.loadingService.hideLoading();
        this.showAlert('Límite alcanzado', 'No puedes añadir más de 8 evitados.');
        return;
      }
      this.foodsService.addUnwantedFood(foodId).subscribe({
        next: () => {
          this.dislikedFoods.push(foodId);
          this.foodStatusChanged.emit({ type: 'dislike', foodId });
          this.loadingService.hideLoading();
        },
        error: (error) => {
          console.error('Error adding dislike:', error);
          this.loadingService.hideLoading();
        }
      });
    }
  }
  async showAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

}
