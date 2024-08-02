import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalController, IonicModule } from '@ionic/angular';
import { FoodsService } from '../../services/foods.service';
import { AppTabsComponent } from '../../components/app-tabs/app-tabs.component';
import { DetalleAlimentoComponent } from '../../components/detalle-alimento/detalle-alimento.component';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from '../../services/loading.service';
import { VistaAlimentosComponent } from 'src/app/components/vista-alimentos/vista-alimentos.component';
import { CategoryConfigService } from 'src/app/services/category-config.service';

@Component({
  selector: 'app-buscador-alimentos',
  templateUrl: './buscador-alimentos.page.html',
  styleUrls: ['./buscador-alimentos.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, AppTabsComponent, VistaAlimentosComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BuscadorAlimentosPage implements OnInit {
  
  flagError: boolean = false;
  flagSearchid: boolean = false;

  response: any = {};
  responseCategoriaPorId: any = {};
  responseBusqueda: any = {};

  pageNumberAll: number = 0;
  pageNumberBusqueda: number = 0;
  pageSize: number = 2;
  pageSizeBusqueda: number = 2;
  pageSizeCategory: number = 2;
  pageNumberCategory: number = 0;
  pageNumberAllFavorites: number = 0;
  pageSizeFavorites: number = 999;
  pageNumberAlergies: number = 0;
  pageSizeAlergies: number = 999;

  searchTerm: string = '';

  favoriteFoods: string[] = [];
  allergicFoods: string[] = [];
  dislikedFoods: string[] = [];
  responseCategories: any[] = [];

  modalAlimento: any;
  selectedCategory: any;

  constructor(
    private modalController: ModalController,
    private foodsService: FoodsService,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private categoryConfigService: CategoryConfigService,
  ) { }

  ngOnInit() {
    this.getFoodsCategories()
    this.route.params.subscribe(params => {
      this.selectedCategory = params['searchTerm'];
      if (this.selectedCategory !== ' ') {
        this.getFoodsByCategory(this.selectedCategory);
      }
    });
  }

  ionViewWillEnter(){
    this.updateFoods();
  }

  getFoodsByCategory(searchid: string){
    return this.foodsService.getFoodsByCategory(searchid, this.pageNumberCategory, this.pageSizeCategory).subscribe({
      next: (response: any) => {
        console.log('busqueda por categoria:', response);
        this.flagSearchid = true;
        this.responseCategoriaPorId = response;
      },
      error: (error) => {
        console.error('Error getting foods by category:', error);
      }
    });
    
  }

  async updateFoods() {
    this.getUnwantedFoods();
    this.getAllergies();
    this.getFavoriteFoods();
    try {
      await this.loadingService.showLoading();
      await Promise.all([
        this.getAllFoods()
      ]);
    } catch (error) {
      console.error('Error in updateFoods:', error);
    } finally {
      await this.loadingService.hideLoading();
    }
  }

  async abrirModalAlimento(food: any) {
    this.modalAlimento = await this.modalController.create({
      component: DetalleAlimentoComponent,
      componentProps: { food } 
    });
  
    await this.modalAlimento.present();
  }

  async getAllFoods() {
    return new Promise<void>((resolve, reject) => {
      this.foodsService.getAllFoods(this.pageNumberAll, this.pageSize).subscribe({
        next: (response: any) => {
          this.response = response;
          console.log('foods:', response);
          resolve();
        },
        error: () => {
          reject(new Error('Error getting foods'));
        }
      });
    });
  }

  async buscarAlimento(searchTerm: string) {
    this.flagError = false;
    const trimmedSearchTerm = searchTerm.trim();
    if (searchTerm === '') {
      this.flagSearchid = false;
      await this.getAllFoods();
    }
    this.searchTerm = trimmedSearchTerm;
    if (trimmedSearchTerm) {
      this.foodsService.searchFoods(trimmedSearchTerm, this.pageNumberBusqueda, this.pageSizeBusqueda).subscribe({
        next: (responseBusqueda: any) => {
          console.log("response busqueda:", responseBusqueda);
          this.responseBusqueda = responseBusqueda;
          if (this.responseBusqueda.message === 'No data found') {
            this.flagError = true;
          }
        },
        error: (error) => {
          console.error('Error searching foods:', error);
        }
      });
    } else {
      this.clearSearchResults();
    }
  }
  
  clearSearchResults() {
    this.searchTerm = '';
    this.responseBusqueda = {};
  }

  async cambiarPaginaAll(incremento: number) {
    await this.loadingService.showLoading('Cargando',true,100);
    this.pageNumberAll += incremento;
    await this.getAllFoods();
  }

  async cambiarPaginaBusqueda(incremento: number) {
    await this.loadingService.showLoading('Cargando',true,100);
    this.pageNumberBusqueda += incremento;
    await this.buscarAlimento(this.searchTerm);
  }

  async cambiarPaginaCategory(incremento: number) {
    await this.loadingService.showLoading('Cargando',true,100);
    this.pageNumberCategory += incremento;
    this.getFoodsByCategory(this.selectedCategory);
  }

  getUnwantedFoods() {
    this.foodsService.getUnwantedFoods().subscribe({
      next: (response: any) => {
        console.log('Unwanted foods:', response);
        this.dislikedFoods = response.data;
      },
      error: (error) => {
        console.error('Error getting unwanted foods:', error);
      }
    });
  }
  
  getAllergies() {
    this.foodsService.getFoodAllergies(this.pageNumberAlergies, this.pageSizeAlergies).subscribe({
      next: (response: any) => {
        console.log('Allergies:', response);
        this.allergicFoods = response.data.content;
      },
      error: (error) => {
        console.error('Error getting allergies:', error);
      }
    });
  }
  

  getFavoriteFoods() {
    this.foodsService.getFavoriteFoods(this.pageNumberAllFavorites, this.pageSizeFavorites).subscribe({
      next: (response: any) => {
        console.log('Favorite foods:', response);
        this.favoriteFoods = response.data.content;
      },
      error: (error) => {
        console.error('Error getting favorite foods:', error);
      }
    });
  }

  getFoodsCategories() {
    this.foodsService.getFoodsCategories().subscribe({
      next: (response: any) => {
        this.responseCategories = response.data.map((category: any) => {
          return {
            ...category,
            name: this.getCategoryName(category.categoryCode),
            selected: false
          };
        });
        console.log('Foods categories:', this.responseCategories);
      },
      error: (error) => {
        console.error('Error getting foods categories:', error);
      }
    });
  }

  getCategoryName(categoryId: string): string {
    const iconName = this.categoryConfigService.getCategoryIcon(categoryId);
    return iconName.replace('.svg', '');
    
  }

  async selectCategory(id: string) {
    this.selectedCategory = id;
    this.responseCategories.forEach(cat => {
      cat.selected = (cat.id === id);
      this.pageNumberCategory = 0;
    });
    await this.loadingService.showLoading('Cargando',true,200);
    this.getFoodsByCategory(this.selectedCategory);
  }
}
