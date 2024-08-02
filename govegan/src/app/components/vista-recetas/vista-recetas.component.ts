import { Component,Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecipesService } from 'src/app/services/recipes.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-vista-recetas',
  templateUrl: './vista-recetas.component.html',
  styleUrls: ['./vista-recetas.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class VistaRecetasComponent{

  @Input() recipe: any;
  @Input() favoriteRecipes: string[] = [];
  pageFavoriteRecipes: number = 0;
  sizeFavoriteRecipes: number = 999;

  constructor( private recipesService: RecipesService, 
               private loadingService: LoadingService,) { }


  async toggleFavoriteRecipe(item: any, event: Event) {
    await this.loadingService.showLoading('Cargando',true,1000);
    event.stopPropagation();
    const recipeId = item.id || item.data?.id;
    const isFavorite = this.isFavoriteRecipe(recipeId);
    if (isFavorite) {
      this.favoriteRecipes = this.favoriteRecipes.filter(id => id !== recipeId);
      const accessToken = sessionStorage.getItem('token') ?? '';
      this.recipesService.removeFavoriteRecipe(recipeId).subscribe({
        next: (response: any) => {
          console.log('Favorite recipe removed:', response);
        },
        error: (error) => {
          console.error('Error removing favorite recipe:', error);
        }
      });
    } else {
      this.favoriteRecipes.push(recipeId);
      const accessToken = sessionStorage.getItem('token') ?? '';
      this.recipesService.addFavoriteRecipe(recipeId).subscribe({
        next: (response: any) => {
          console.log('Favorite recipe added:', response);
        },
        error: (error) => {
          console.error('Error adding favorite recipe:', error);
        }
      });
    }
    this.loadingService.hideLoading();
  }

  isFavoriteRecipe(recipeId: string): boolean {
    return this.favoriteRecipes.includes(recipeId);
  }

}
