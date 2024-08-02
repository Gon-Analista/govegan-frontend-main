import { Component, OnInit, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ModalController, IonicModule, AlertController, PopoverController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppTabsComponent } from '../app-tabs/app-tabs.component';
import { Router } from '@angular/router';
import { RecipesService } from '../../services/recipes.service';
import { FoodsService } from '../../services/foods.service';
import { PlanificadorTipoFavoritoComponent } from '../planificador-tipo-favorito/planificador-tipo-favorito.component';
import { LoadingService } from '../../services/loading.service';
import { VistaCategoriasComponent } from '../vista-categorias/vista-categorias.component';
@Component({
  selector: 'app-detalle-planificador',
  templateUrl: './detalle-planificador.component.html',
  styleUrls: ['./detalle-planificador.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, AppTabsComponent, VistaCategoriasComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DetallePlanificador implements OnInit {

  @Input() mealType: any;
  @Input() user: string | undefined;

  showAlimentos: boolean = true;
  showRecetas: boolean = false;
  showFavoritos: boolean = false;
  flagErrorFavoritesFoods: boolean = false;
  flagErrorFavoritesRecipes: boolean = false;
  flagErrorRecipes: boolean = false;
  flagErrorFoods: boolean = false;

  favoriteRecipes: any[] = [];
  favoriteFoods: any[] = [];

  responseRecetas: any = {};
  alimento: any = {};
  response: any = {};
  responseBusquedaAlimentos: any = {};
  responseBusquedaRecetas: any = {};
  responseAlimentos: any = {};

  listaCompras: number = 0;
  contadorCalorias: number = 0;
  caloríasTemporales: number = 0;
  pageSize: number = 6;
  caloriasDesayuno: number = 0;
  caloriasAlmuerzo: number = 0;
  caloriasCena: number = 0;
  caloriasMeriendas: number = 0;
  caloriasDesayunoTemporales: number = 0;
  caloriasAlmuerzoTemporales: number = 0;
  caloriasCenaTemporales: number = 0;
  caloriasMeriendasTemporales: number = 0;
  selectedFoodAmount: number = 100;
  pageNumberBusquedaAlimentos: number = 0;
  pageNumberRecetas: number = 0;
  pageNumberAlimentosFavoritos: number = 0;
  pageNumberRecetasFavoritas: number = 0;
  pageNumberAlimentos: number = 0;
  pageNumberBusquedaRecetas: number = 0;
  favoritePagesFoods: number = 0;
  favoritePagesRecipes: number = 0;
  mostrarCalorias: number = 0;

  selectedOption: string = 'recetas';
  busquedaAlimentos: string = '';
  busquedaRecetas: string = '';

  gramosPorAlimento: { [key: string]: number } = {};
  acumuladorNutricional: any = {
    calciumMg: 0,
    caloriesKcal: 0,
    carbohydratesG: 0,
    cholesterolMg: 0,
    dietaryFiberG: 0,
    edibleFractionPercentage: 0,
    folateEquivFDMcg: 0,
    folicAcidMcg: 0,
    ironMg: 0,
    magnesiumMg: 0,
    monounsaturatedFatG: 0,
    niacinMg: 0,
    phosphorusMg: 0,
    polyunsaturatedFatG: 0,
    potassiumMg: 0,
    proteinG: 0,
    riboflavinMg: 0,
    saturatedFatG: 0,
    sodiumMg: 0,
    thiamineMg: 0,
    totalFatG: 0,
    vitaminAEquivRetinolMcg: 0,
    vitaminB12Mcg: 0,
    vitaminB6Mg: 0,
    vitaminCmg: 0,
    waterPercentage: 0,
    zincMg: 0
  };

  constructor(private modalController: ModalController,
    private router: Router,
    private alertController: AlertController,
    private popoverController: PopoverController,
    private foodsService: FoodsService,
    private recipesService: RecipesService,
    private loadingService: LoadingService,
  ) {
  }

  ngOnInit() {
    this.generatePersistentCalories();
  }

  generatePersistentCalories() {
    const storedCalories = localStorage.getItem('calorias') ?? '0';
    this.contadorCalorias = parseInt(storedCalories, 10);
    const storedDesayuno = localStorage.getItem('caloriasDesayuno') ?? '0';
    this.caloriasDesayuno = parseInt(storedDesayuno, 10);
    const storedAlmuerzo = localStorage.getItem('caloriasAlmuerzo') ?? '0';
    this.caloriasAlmuerzo = parseInt(storedAlmuerzo, 10);
    const storedCena = localStorage.getItem('caloriasCena') ?? '0';
    this.caloriasCena = parseInt(storedCena, 10);
    const storedMeriendas = localStorage.getItem('caloriasMeriendas') ?? '0';
    this.caloriasMeriendas = parseInt(storedMeriendas, 10);
  }

  ionViewWillEnter() {
    this.flagErrorFavoritesFoods = false;
    this.flagErrorFavoritesRecipes = false;
    this.updateFoodsAndRecipes();
  }

  async updateFoodsAndRecipes() {
    this.getFavoriteRecipes();
    this.getFavoriteFoods();
    await this.loadingService.showLoading();
    await Promise.all([
      this.getAllFoods(),
      this.getRecipes()
    ]);
    await this.loadingService.hideLoading();
  }


  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PlanificadorTipoFavoritoComponent,
      event: ev,
      translucent: true
    });
    popover.onDidDismiss().then(data => {
      this.selectedOption = data.data;
      if (this.selectedOption === undefined) {
        this.selectedOption = 'recetas';
      }
      else {
        this.showFavoritos = true;
      }
    });

    return await popover.present();
  }
  segmentChanged(event: any) {
    this.clearSearchResults();
    this.flagErrorFoods = false;
    this.flagErrorRecipes = false;
    const value = event.detail.value;
    this.showAlimentos = value === 'alimentos';
    this.showRecetas = value === 'recetas';
    this.showFavoritos = value === 'favoritos';
  }

  numeric(event: any) {
    let pattern = /^(\d)$/;
    let val = pattern.test(event.key);
    return val;
  }

  addToNutritionalList(food: any, gramos: number) {
    const factor = gramos / 100;
    const data = localStorage.getItem('acomuladorNutricionalTemporal');
    let acumuladorNutricional = data ? JSON.parse(data) : {
      calciumMg: 0,
      caloriesKcal: 0,
      carbohydratesG: 0,
      cholesterolMg: 0,
      dietaryFiberG: 0,
      edibleFractionPercentage: 0,
      folateEquivFDMcg: 0,
      folicAcidMcg: 0,
      ironMg: 0,
      magnesiumMg: 0,
      monounsaturatedFatG: 0,
      niacinMg: 0,
      phosphorusMg: 0,
      polyunsaturatedFatG: 0,
      potassiumMg: 0,
      proteinG: 0,
      riboflavinMg: 0,
      saturatedFatG: 0,
      sodiumMg: 0,
      thiamineMg: 0,
      totalFatG: 0,
      vitaminAEquivRetinolMcg: 0,
      vitaminB12Mcg: 0,
      vitaminB6Mg: 0,
      vitaminCmg: 0,
      waterPercentage: 0,
      zincMg: 0
    };

    acumuladorNutricional.calciumMg += Math.round(food.calciumMg * factor);
    acumuladorNutricional.caloriesKcal += Math.round(food.caloriesKcal * factor);
    acumuladorNutricional.carbohydratesG += Math.round(food.carbohydratesG * factor);
    acumuladorNutricional.cholesterolMg += Math.round(food.cholesterolMg * factor);
    acumuladorNutricional.dietaryFiberG += Math.round(food.dietaryFiberG * factor);
    acumuladorNutricional.edibleFractionPercentage += Math.round(food.edibleFractionPercentage * factor);
    acumuladorNutricional.folateEquivFDMcg += Math.round(food.folateEquivFDMcg * factor);
    acumuladorNutricional.folicAcidMcg += Math.round(food.folicAcidMcg * factor);
    acumuladorNutricional.ironMg += Math.round(food.ironMg * factor);
    acumuladorNutricional.magnesiumMg += Math.round(food.magnesiumMg * factor);
    acumuladorNutricional.monounsaturatedFatG += Math.round(food.monounsaturatedFatG * factor);
    acumuladorNutricional.niacinMg += Math.round(food.niacinMg * factor);
    acumuladorNutricional.phosphorusMg += Math.round(food.phosphorusMg * factor);
    acumuladorNutricional.polyunsaturatedFatG += Math.round(food.polyunsaturatedFatG * factor);
    acumuladorNutricional.potassiumMg += Math.round(food.potassiumMg * factor);
    acumuladorNutricional.proteinG += Math.round(food.proteinG * factor);
    acumuladorNutricional.riboflavinMg += Math.round(food.riboflavinMg * factor);
    acumuladorNutricional.saturatedFatG += Math.round(food.saturatedFatG * factor);
    acumuladorNutricional.sodiumMg += Math.round(food.sodiumMg * factor);
    acumuladorNutricional.thiamineMg += Math.round(food.thiamineMg * factor);
    acumuladorNutricional.totalFatG += Math.round(food.totalFatG * factor);
    acumuladorNutricional.vitaminAEquivRetinolMcg += Math.round(food.vitaminAEquivRetinolMcg * factor);
    acumuladorNutricional.vitaminB12Mcg += Math.round(food.vitaminB12Mcg * factor);
    acumuladorNutricional.vitaminB6Mg += Math.round(food.vitaminB6Mg * factor);
    acumuladorNutricional.vitaminCmg += Math.round(food.vitaminCmg * factor);
    acumuladorNutricional.waterPercentage += Math.round(food.waterPercentage * factor);
    acumuladorNutricional.zincMg += Math.round(food.zincMg * factor);

    localStorage.setItem('acomuladorNutricionalTemporal', JSON.stringify(acumuladorNutricional));

  }

  async addToMeal(caloriasPor100g: number, gramos: number) {
    await this.loadingService.showLoading('Añadiendo', true, 100);
    const calorias = (caloriasPor100g / 100) * gramos;
    this.mostrarCalorias = calorias;
    console.log('Agregar la caloria de: ' + calorias);
    this.listaCompras += 1;
    this.contadorCalorias += calorias;
    this.caloríasTemporales += calorias;
    localStorage.setItem('calorias', this.contadorCalorias.toString());

    switch (this.mealType) {
      case 'Desayuno':
        this.caloriasDesayuno += calorias;
        this.caloriasDesayunoTemporales += calorias;
        localStorage.setItem('caloriasDesayuno', this.caloriasDesayuno.toString());
        break;
      case 'Almuerzo':
        this.caloriasAlmuerzo += calorias;
        this.caloriasAlmuerzoTemporales += calorias;
        localStorage.setItem('caloriasAlmuerzo', this.caloriasAlmuerzo.toString());
        break;
      case 'Cena':
        this.caloriasCena += calorias;
        this.caloriasCenaTemporales += calorias;
        localStorage.setItem('caloriasCena', this.caloriasCena.toString());
        break;
      case 'Meriendas':
        this.caloriasMeriendas += calorias;
        this.caloriasMeriendasTemporales += calorias;
        localStorage.setItem('caloriasMeriendas', this.caloriasMeriendas.toString());
        break;
      default:
        break;
    }
  }

  calculateCalories(foodId: string, caloriesPer100g: number): number {
    const grams = this.gramosPorAlimento[foodId] || 100;
    return Math.round((caloriesPer100g / 100) * grams);
  }


  confirmMeal() {
    const acumuladorNutricionalTemporal = JSON.parse(localStorage.getItem('acomuladorNutricionalTemporal') ?? '{}');
    const acumuladorNutricionalActual = JSON.parse(localStorage.getItem('acomuladorNutricional') ?? '{}');

    for (const key in acumuladorNutricionalTemporal) {
      acumuladorNutricionalActual[key] += acumuladorNutricionalTemporal[key];
    }

    localStorage.setItem('acomuladorNutricional', JSON.stringify(acumuladorNutricionalActual));

    localStorage.setItem('acomuladorNutricionalTemporal', JSON.stringify(this.acumuladorNutricional));

    this.modalController.dismiss();
    this.router.navigate(['/planificador', {
      user: this.user,
      infoCalorias: this.contadorCalorias,
      desayuno: this.caloriasDesayuno,
      almuerzo: this.caloriasAlmuerzo,
      cena: this.caloriasCena,
      meriendas: this.caloriasMeriendas,
      mealType: this.mealType,
    }]);
  }

  async showAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  cerrarModal() {
    this.contadorCalorias = Number(this.contadorCalorias - this.caloríasTemporales);
    this.caloriasDesayuno = Number(this.caloriasDesayuno - this.caloriasDesayunoTemporales);
    this.caloriasAlmuerzo = Number(this.caloriasAlmuerzo - this.caloriasAlmuerzoTemporales);
    this.caloriasCena = Number(this.caloriasCena - this.caloriasCenaTemporales);
    this.caloriasMeriendas = Number(this.caloriasMeriendas - this.caloriasMeriendasTemporales);
    localStorage.setItem('caloriasDesayuno', this.caloriasDesayuno.toString());
    localStorage.setItem('caloriasAlmuerzo', this.caloriasAlmuerzo.toString());
    localStorage.setItem('caloriasCena', this.caloriasCena.toString());
    localStorage.setItem('caloriasMeriendas', this.caloriasMeriendas.toString());
    localStorage.setItem('calorias', this.contadorCalorias.toString());
    localStorage.setItem('acomuladorNutricionalTemporal', JSON.stringify(this.acumuladorNutricional));
    this.modalController.dismiss();
  }


  async getAllFoods() {
    return new Promise<void>((resolve, reject) => {
      this.foodsService.getAllFoods(this.pageNumberAlimentos, this.pageSize).subscribe({
        next: (response) => {
          this.responseAlimentos = response.page.content;
          this.response = response;
          resolve();
        },
        error: (error) => {
          console.error('Error getting foods:', error);
          reject(new Error('Error getting foods'));
        }
      });
    });
  }

  async getRecipes() {
    return new Promise<void>((resolve, reject) => {
      this.recipesService.getAllRecipes(this.pageNumberRecetas, this.pageSize).subscribe({
        next: (response) => {
          this.responseRecetas = response.page.content;
          resolve();
        },
        error: () => {
          reject(new Error('Error getting recipes'));
        }
      });
    });
  }

  getRecipebyId(id: string) {
    this.recipesService.getRecipeById(id).subscribe({
      next: (response: any) => {
        this.favoriteRecipes.push(response);
      },
      error: (error) => {
        console.error('Error getting recipe:', error);
      }
    });
  }

  getFavoriteRecipes() {
    this.recipesService.getFavoriteRecipes(this.pageNumberRecetasFavoritas, this.pageSize).subscribe({
      next: (response: any) => {
        const recipeIds = response.data.content;
        this.favoritePagesRecipes = response.data.totalPages;
        this.favoriteRecipes = [];
        recipeIds.forEach((id: string) => this.getRecipebyId(id));
        if (recipeIds.length === 0) {
          this.flagErrorFavoritesRecipes = true;
        }
      },
      error: (error) => {
        console.error('Error getting favorite recipes:', error);
      }
    });
  }

  getFavoriteFoods() {
    this.foodsService.getFavoriteFoods(this.pageNumberAlimentosFavoritos, this.pageSize).subscribe({
      next: (response: any) => {
        const foodIds = response.data.content;
        this.favoritePagesFoods = response.data.totalPages;
        this.favoriteFoods = [];
        foodIds.forEach((id: string) => this.getFoodbyId(id));
        if (foodIds.length === 0) {
          this.flagErrorFavoritesFoods = true;
        }
      },
      error: (error) => {
        console.error('Error getting favorite foods:', error);
      }
    });
  }

  addFavoriteFood(foodId: string) {
    this.foodsService.addFavoriteFood(foodId).subscribe({
      next: (response) => {
        console.log('Food added to favorites:', response);
        // Actualizar la lista de favoritos
        this.getFavoriteFoods();
      },
      error: (error) => {
        console.error('Error adding food to favorites:', error);
      }
    });
  }

  removeFavoriteFood(foodId: string) {
    this.foodsService.removeFavoriteFood(foodId).subscribe({
      next: (response) => {
        console.log('Food removed from favorites:', response);
        // Actualizar la lista de favoritos
        this.getFavoriteFoods();
      },
      error: (error) => {
        console.error('Error removing food from favorites:', error);
      }
    });
  }

  getFoodbyId(id: string) {
    this.foodsService.getFoodById(id).subscribe({
      next: (response: any) => {
        this.favoriteFoods.push(response);
      },
      error: (error) => {
        console.error('Error getting food:', error);
      }
    });
  }

  async confirmMealAlert() {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Está seguro de guardar para el plan de hoy',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('El reset del planificador ha sido cancelado');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.confirmMeal();
          }
        }
      ]
    });

    await alert.present();
  }

  buscarReceta(busquedaRecetas: string) {
    this.flagErrorRecipes = false;
    const trimmedbusquedaRecetas = busquedaRecetas.trim();

    if (trimmedbusquedaRecetas !== this.busquedaRecetas) {
      this.pageNumberBusquedaRecetas = 0;
    }

    this.busquedaRecetas = trimmedbusquedaRecetas;

    if (trimmedbusquedaRecetas) {
      this.recipesService.searchRecipes(trimmedbusquedaRecetas, this.pageNumberBusquedaRecetas, this.pageSize).subscribe({
        next: (responseBusqueda: any) => {
          console.log("response busqueda:", responseBusqueda);
          this.responseBusquedaRecetas = responseBusqueda;
          if (this.responseBusquedaRecetas.message === 'No data found') {
            this.flagErrorRecipes = true;
          }
        },
        error: (error) => {
          console.error('Error searching foods:', error);
        }
      });
    } else {
      this.clearSearchResults();
      this.getRecipes();
    }
  }

  buscarAlimento(busquedaAlimentos: string) {
    this.flagErrorFoods = false;
    const trimmedbusquedaAlimentos = busquedaAlimentos.trim();
    if (trimmedbusquedaAlimentos !== this.busquedaAlimentos) {
      this.pageNumberBusquedaAlimentos = 0;
    }

    this.busquedaAlimentos = trimmedbusquedaAlimentos;

    if (trimmedbusquedaAlimentos) {
      this.foodsService.searchFoods(trimmedbusquedaAlimentos, this.pageNumberBusquedaAlimentos, this.pageSize).subscribe({
        next: (responseBusqueda: any) => {
          console.log("response busqueda:", responseBusqueda);
          this.responseBusquedaAlimentos = responseBusqueda;
          if (this.responseBusquedaAlimentos.data.content.length === 0) {
            this.flagErrorFoods = true;
          }
        },
        error: (error) => {
          console.error('Error searching foods:', error);
          this.flagErrorFoods = true;
        }
      });
    } else {
      this.clearSearchResults();
      this.getAllFoods();
    }
  }

  clearSearchResults() {
    this.responseBusquedaAlimentos = {};
    this.responseBusquedaRecetas = {};
  }


  async cambiarPaginaAlimentos(incremento: number) {
    await this.loadingService.showLoading('Cargando', true, 100);
    this.pageNumberAlimentos += incremento;
    this.getAllFoods();
  }

  async cambiarPaginaRecetas(incremento: number) {
    await this.loadingService.showLoading('Cargando', true, 100);
    this.pageNumberRecetas += incremento;
    this.getRecipes();
  }
  async cambiarPaginaAlimentosFavoritos(incremento: number) {
    await this.loadingService.showLoading('Cargando', true, 500);
    this.pageNumberAlimentosFavoritos += incremento;
    this.getFavoriteFoods();
  }

  async cambiarPaginaRecetasFavoritas(incremento: number) {
    await this.loadingService.showLoading('Cargando', true, 500);
    this.pageNumberRecetasFavoritas += incremento;
    this.getFavoriteRecipes();
  }

  async cambiarPaginaBusquedaRecetas(incremento: number) {
    await this.loadingService.showLoading('Cargando', true, 100);
    this.pageNumberBusquedaRecetas += incremento;
    this.buscarReceta(this.busquedaRecetas);
  }

  async cambiarPaginaBusquedaAlimentos(incremento: number) {
    await this.loadingService.showLoading('Cargando', true, 100);
    this.pageNumberBusquedaAlimentos += incremento;
    this.buscarAlimento(this.busquedaAlimentos);
  }

}
