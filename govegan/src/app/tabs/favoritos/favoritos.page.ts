import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, ModalController } from '@ionic/angular';
import { AppTabsComponent } from '../../components/app-tabs/app-tabs.component';
import { RecipesService } from '../../services/recipes.service';
import { FoodsService } from '../../services/foods.service';
import { DetalleRecetaComponent } from '../../components/detalle-receta/detalle-receta.component';
import { DetalleAlimentoComponent } from '../../components/detalle-alimento/detalle-alimento.component';
import { LoadingService } from '../../services/loading.service';
import { VistaCategoriasComponent } from '../../components/vista-categorias/vista-categorias.component';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, AppTabsComponent, VistaCategoriasComponent]
})
export class FavoritosPage {

  showAlimentos = true;
  showRecetas = false;
  favoriteRecipes: any[] = [];
  favoriteFoods: any[] = [];
  pageNumberFavoriteRecipes: number = 0;
  pageSize: number = 2;
  pageNumberFavoriteFoods: number = 0;
  pageSizeFavoritesFoods: number = 6;
  modalReceta: any;
  modalAlimento: any;
  favoritePagesRecipes: number = 0;
  favoritePagesFoods: number = 0;
  flagErrorRecipes: boolean = false;
  flagErrorFoods: boolean = false;

  constructor(
    private recipesService: RecipesService,
    private foodsService: FoodsService,
    private modalController: ModalController,
    private loadingService: LoadingService,
    private alertController: AlertController
  ) { }

  ionViewWillEnter() {
    this.flagErrorRecipes = false;
    this.flagErrorFoods = false;
    this.updateFavorites();
  }

  async updateFavorites() {
    await this.loadingService.showLoading('Cargando',true,2000);
    await Promise.all([
      this.getFavoriteRecipes(),
      this.getFavoriteFoods()
    ]);

    await this.loadingService.hideLoading();
  }

  async abrirModalReceta(receta: any) {
    this.modalReceta = await this.modalController.create({
      component: DetalleRecetaComponent,
      componentProps: { receta } 
    });
  
    await this.modalReceta.present();
  }

  async abrirModalAlimento(food: any) {
    this.modalAlimento = await this.modalController.create({
      component: DetalleAlimentoComponent,
      componentProps: { food } 
    });
  
    await this.modalAlimento.present();
  }

  segmentChanged(event: any) {
    const value = event.detail.value;
    this.showAlimentos = value === 'alimentos';
    this.showRecetas = value === 'recetas';
  }

  toggleFavoriteRecipe(item: any) {
    const recipeId = item.data?.id;
    this.recipesService.removeFavoriteRecipe(recipeId).subscribe({
      next: (response: any) => {
        console.log('Favorite recipe removed:', response);
        this.favoriteRecipes = this.favoriteRecipes.filter(i => i.data.id !== recipeId);
      },
      error: (error) => {
        console.error('Error removing favorite recipe:', error);
      }
    });
  }

  toggleFavoriteFood(item: any) {
    const foodId = item.data?.id;
    this.foodsService.removeFavoriteFood(foodId).subscribe({
      next: (response: any) => {
        console.log('Favorite food removed:', response);
        this.favoriteFoods = this.favoriteFoods.filter(i => i.data.id !== foodId);
      },
      error: (error) => {
        console.error('Error removing favorite food:', error);
      }
    });
  }

  isFavoriteRecipe(item: any): boolean {
    return this.favoriteRecipes.some(i => i.data.id === item.data.id);
  }

  isFavoriteFood(item: any): boolean {
    return this.favoriteFoods.some(i => i.data.id === item.data.id);
  }

  async getFavoriteRecipes() {
    return new Promise<void>((resolve, reject) => {
      this.recipesService.getFavoriteRecipes(this.pageNumberFavoriteRecipes, this.pageSize).subscribe({
        next: (response: any) => {
          const recipeIds = response.data.content;
          this.favoritePagesRecipes = response.data.totalPages;
          this.favoriteRecipes = [];
          recipeIds.forEach((id: string) => this.getRecipebyId(id));
          if (recipeIds.length === 0) {
            this.flagErrorRecipes = true;
          }
          resolve();
        },
        error: (error) => {
          console.error('Error getting favorite recipes:', error);
          reject(new Error('Error getting favorite recipes'));
        }
      });
    });
  }

  async getFavoriteFoods() {
    return new Promise<void>((resolve, reject) => {
      this.foodsService.getFavoriteFoods(this.pageNumberFavoriteFoods, this.pageSizeFavoritesFoods).subscribe({
        next: (response: any) => {
          const foodIds = response.data.content;
          this.favoritePagesFoods = response.data.totalPages;
          this.favoriteFoods = [];
          foodIds.forEach((id: string) => this.getFoodbyId(id));
          if (foodIds.length === 0) {
            this.flagErrorFoods = true;
          }
          resolve();
        },
        error: (error) => {
          console.error('Error getting favorite foods:', error);
          reject(new Error('Error getting favorite foods'));
        }
      });
    });
  }

  async getRecipebyId(id: string) {
    this.recipesService.getRecipeById(id).subscribe({
      next: (response: any) => {
        this.favoriteRecipes.push(response);
      },
      error: (error) => {
        console.error('Error getting recipe:', error);
      }
    });
  }

  async getFoodbyId(id: string) {
    this.foodsService.getFoodById(id).subscribe({
      next: (response: any) => {
        this.favoriteFoods.push(response);
      },
      error: (error) => {
        console.error('Error getting food:', error);
      }
    });
  }

  async cambiarPaginaFavoriteRecipes(incremento: number) {
    await this.loadingService.showLoading('Cargando',true,500);
    this.pageNumberFavoriteRecipes += incremento;
    this.getFavoriteRecipes();
  }

  async cambiarPaginaFavoriteFoods(incremento: number) {
    await this.loadingService.showLoading('Cargando',true,500);
    this.pageNumberFavoriteFoods += incremento;
    this.getFavoriteFoods();
  }

  async RemoveFavoriteAlert(item: any, event: Event) {
    event.stopPropagation();
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Está seguro de eliminar de la lista de favoritos?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('El eliminar de la lista de favoritos ha sido cancelado');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            if (this.isFavoriteFood(item)) {
              this.toggleFavoriteFood(item);
            } else {
              this.toggleFavoriteRecipe(item);
            }
          }
        }
      ]
    });

    await alert.present();
  }

}
