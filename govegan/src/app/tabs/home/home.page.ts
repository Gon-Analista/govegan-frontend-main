import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipesService } from '../../services/recipes.service';
import { AppTabsComponent } from '../../components/app-tabs/app-tabs.component';
import { FoodsService } from '../../services/foods.service';
import { LoadingService } from '../../services/loading.service';
import { CategoryConfigService } from '../../services/category-config.service';
import { UserProfileService } from '../../services/user-profile.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, AppTabsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage implements OnInit {
  username: string = '';
  categories: any[] = [];
  gender: string = '';
  pageNumberRecipes: number = 0;
  pageSize: number = 3;
  responseRecetas: any[] = [];
  responseImageRecetas: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipesService: RecipesService,
    private foodsService: FoodsService,
    private loadingService: LoadingService,
    private categoryConfigService: CategoryConfigService,
    private userProfileService: UserProfileService
  ) {
    this.route.params.subscribe(params => {
      this.username = params['user'] || '';
    });
  }

  ngOnInit() {
    this.updateFoodsAndRecipes();
  }

  ionViewWillEnter() {
    this.loadUserProfile();
  }

  async updateFoodsAndRecipes() {
    this.getRecipeImages();
    try {
      await this.loadingService.showLoading();
      await Promise.all([
        this.getFoodsCategories(),
      ]);
    } catch (error) {
      console.error('Error in updateFoodsAndRecipes:', error);
    }
    await this.loadingService.hideLoading();
  }

  getRecipeImages() {
    this.recipesService.getAllRecipesImages(this.pageNumberRecipes, this.pageSize).subscribe({
      next: (recipe: any) => {
        this.responseImageRecetas = recipe;
        console.log('Recetas:', this.responseImageRecetas);
      },
      error(err) {
        console.log('Error al obtener las recetas:', err);
      },
    });
  }

  getCategoryName(categoryId: string): string {
    const iconName = this.categoryConfigService.getCategoryIcon(categoryId);
    return iconName.replace('.svg', '');
  }

  async getFoodsCategories() {
    return new Promise<void>((resolve, reject) => {
      this.foodsService.getFoodsCategories().subscribe({
        next: (response: any) => {
          console.log('Categories:', response);
          this.categories = response.data.map((category: any) => {
            return {
              ...category,
              color: this.categoryConfigService.getCategoryColor(category.categoryCode),
              name: this.getCategoryName(category.categoryCode)
            };
          });
          resolve();
        },
        error: () => {
          reject(new Error('Error getting categories'));
        }
      });
    });
  }

  getCategoryColor(categoryId: string): string {
    return this.categoryConfigService.getCategoryColor(categoryId);
  }

  getCategoryIcon(categoryId: string): string {
    return 'assets/icon/' + this.categoryConfigService.getCategoryIcon(categoryId);
  }

  gotoBuscadorAlimentos(searchTerm: any) {
    this.router.navigate(['/buscador-alimentos', searchTerm]);
  }

  loadUserProfile() {
    this.userProfileService.getUserProfile().subscribe({
      next: (response: any) => {
        console.log('Perfil cargado:', response);
        this.gender = response.data.gender;
        this.username = response.data.name; // Update username from profile
      },
      error: (error) => {
        console.log('Error al cargar el perfil:', error);
      }
    });
  }

  goToPlanificador() {
    this.router.navigate(['/planificador']);
  }

  goToAdministradorAlimentos() {
    this.router.navigate(['/administrar-alimentos']);
  }

  goToGps() {
    this.router.navigate(['/gps']);
  }
}