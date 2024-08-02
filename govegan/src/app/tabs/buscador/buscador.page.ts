import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { RecipesService } from '../../services/recipes.service';
import { DetalleRecetaComponent } from '../../components/detalle-receta/detalle-receta.component';
import { AppTabsComponent } from '../../components/app-tabs/app-tabs.component';
import { LoadingService } from '../../services/loading.service';
import { VistaRecetasComponent } from '../../components/vista-recetas/vista-recetas.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.page.html',
  styleUrls: ['./buscador.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, AppTabsComponent, VistaRecetasComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BuscadorPage implements OnInit {
  searchTerm: string = '';
  username: string = '';

  modalReceta: any;
  showAlimentos = false;
  showRecetas = true;
  flagSearchNeeds: boolean = false;
  response: any = {};
  params: any = {};
  responseBusqueda: any = {};
  responseSpecialNeeds: any = {};
  pageNumberAll: number = 0;
  pageNumberBusqueda: number = 0;
  pageSize: number = 2;
  favoriteRecipes: string[] = [];
  busqueda: string = '';
  pageFavoriteRecipes: number = 0;
  sizeFavoriteRecipes: number = 999;
  pageNumberSpecialNeeds: number = 0;
  sizeSpecialNeeds: number = 2;
  flagError: boolean = false;
  selectedSpecialNeed: string = '';
  selected: boolean = false;
  specialNeeds: any = [
    { nombres: 'Vegetariano', variables: 'vegetariano' },
    { nombres: 'Sin lactosa', variables: 'sin lactosa' },
    { nombres: 'Vegano', variables: 'vegano' },
    { nombres: 'Rico en fibra', variables: 'fuente de fibra' },
    { nombres: 'Sin gluten', variables: 'sin gluten' }
  ];

  constructor(
    private modalController: ModalController,
    private recipesService: RecipesService,
    private loadingService: LoadingService,
    private route: ActivatedRoute
  ) { }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['term'] || '';
      this.username = params['user'] || '';
      console.log('Search Term:', this.searchTerm);
      console.log('Username:', this.username);
    });
  }

  ionViewWillEnter() {
    console.log('specialNeeds:', this.specialNeeds);
    this.updateRecipes();
  }

  async updateRecipes() {
    try {
      await this.loadingService.showLoading();
      await Promise.all([
        this.getRecipes(),
        this.getFavoriteRecipes(),
        this.getSpecialNeeds()
      ]);
    } catch (error) {
      console.error('Error in updateRecipes:', error);
    } finally {
      await this.loadingService.hideLoading();
    }
  }

  segmentChanged(event: any) {
    const value = event.detail.value;
    this.showAlimentos = value === 'alimentos';
    this.showRecetas = value === 'recetas';
  }

  async abrirModal(receta: any) {
    this.modalReceta = await this.modalController.create({
      component: DetalleRecetaComponent,
      componentProps: { receta }
    });

    await this.modalReceta.present();
  }

  async getRecipes() {
    return new Promise<void>((resolve, reject) => {
      this.recipesService.getAllRecipes(this.pageNumberAll, this.pageSize).subscribe({
        next: (response: any) => {
          console.log('All recipes:', response);
          this.response = response;
          resolve();
        },
        error: () => {
          reject(new Error('Error getting recipes'));
        }
      });
    });
  }

  async getFavoriteRecipes() {
    return new Promise<void>((resolve, reject) => {
      this.recipesService.getFavoriteRecipes(this.pageFavoriteRecipes, this.sizeFavoriteRecipes).subscribe({
        next: (response: any) => {
          console.log('Favorite recipes:', response);
          this.favoriteRecipes = response.data.content;
          resolve();
        },
        error: (error) => {
          console.error('Error getting favorite recipes:', error);
          reject(new Error('Error getting favorite recipes'));
        }
      });
    });
  }

  buscarReceta(busqueda: string) {
    this.flagError = false;
    const trimmedBusqueda = busqueda.trim();
    if (busqueda === '') {
      this.flagSearchNeeds = false;
      this.getRecipes();
    }
    this.busqueda = trimmedBusqueda;
    if (trimmedBusqueda) {
      this.recipesService.searchRecipes(trimmedBusqueda, this.pageNumberBusqueda, this.pageSize).subscribe({
        next: (responseBusqueda: any) => {
          console.log("Search results:", responseBusqueda);
          this.responseBusqueda = responseBusqueda;
          if (this.responseBusqueda.message === 'No data found') {
            this.flagError = true;
          }
        },
        error: (error) => {
          console.error('Error searching recipes:', error);
        }
      });
    } else {
      this.clearSearchResults();
      this.getRecipes();
    }
  }

  clearSearchResults() {
    this.responseBusqueda = {};
  }

  async cambiarPaginaAll(incremento: number) {
    await this.loadingService.showLoading('Cargando',true,100);
    this.pageNumberAll += incremento;
    this.getRecipes();
  }

  async cambiarPaginaBusqueda(incremento: number) {
    await this.loadingService.showLoading('Cargando',true,100);
    this.pageNumberBusqueda += incremento;
    this.buscarReceta(this.busqueda);
  }

  async cambiarPaginaSpecialNeeds(incremento: number) {
    await this.loadingService.showLoading('Cargando',true,100);
    this.pageNumberSpecialNeeds += incremento;
    this.getSpecialNeeds();
  }

  specialNeedSelected(specialNeed: string) {
    this.pageNumberSpecialNeeds = 0;
    this.selectedSpecialNeed = specialNeed;
    this.getSpecialNeeds();
  }
  

  async getSpecialNeeds() {
    return new Promise<void>((resolve, reject) => {
    this.recipesService.postSpecialNeeds(this.pageNumberSpecialNeeds, this.sizeSpecialNeeds, { specialNeed: this.selectedSpecialNeed }).subscribe({
      next: (response: any) => {
        console.log('Special needs:', response);
        this.flagSearchNeeds = true;
        this.responseSpecialNeeds = response;
        resolve();
      },
      error: () => {
        reject(new Error('Error getting special needs'));
      }
    });
  });
  }

  
}
