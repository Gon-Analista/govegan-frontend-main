import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, ModalController } from '@ionic/angular';
import { AppTabsComponent } from '../../components/app-tabs/app-tabs.component';
import { ActivatedRoute, Router } from '@angular/router';
import { NgCircleProgressModule, CircleProgressOptions } from 'ng-circle-progress';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadingService } from '../../services/loading.service';
import { environment } from 'src/environments/environment';
import { UserProfileService } from '../../services/user-profile.service';
import { DetallePlanificador } from '../../components/detalle-planificador/detalle-planificador.component';
import { VistaValoresNutricionalesComponent } from '../../components/vista-valores-nutricionales/vista-valores-nutricionales.component';

@Component({
  selector: 'app-planificador',
  templateUrl: './planificador.page.html',
  styleUrls: ['./planificador.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, AppTabsComponent, NgCircleProgressModule],
  providers: [
    {
      provide: CircleProgressOptions,
      useValue: {
        radius: 100,
        outerStrokeWidth: 16,
        innerStrokeWidth: 8,
        outerStrokeColor: "#78C000",
        innerStrokeColor: "#C7E596",
        animationDuration: 300,
      }
    }
  ]
})
export class PlanificadorPage {
  response: any = {};
  waterIngested: number = 0;
  calorieGoal: number = 0;
  remainingCalories: number = 0;
  percentage: number = 0;
  waterWidth: string | undefined;
  waterPercentage: number = 0;
  food: any;
  pageNumberAll: number = 0;
  pageSize: number = 6;
  infoCalorias: number = 0;
  totalCalorias: number = 0;
  username: string = '';
  color: string = '#78C000';
  innerColor: string = '#C7E596';
  value: string = '';
  lastResetDate: string = '';
  selectedOption: string = '';
  showVideo: boolean = false;
  caloriasAcomuladas: number = 0;
  selectedWaterAmount: number = 0.25;
  waterAmounts: number[] = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
  desayuno: number = 0;
  almuerzo: number = 0;
  cena: number = 0;
  meriendas: number = 0;
  mealType: string = '';
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private alertController: AlertController,
    private modalController: ModalController,
    private loadingService: LoadingService,
    private userProfileService: UserProfileService


  ) {
    this.route.params.subscribe(params => {
      this.username = params['user'] || '';
      this.infoCalorias = params['infoCalorias'] || 0;
      this.desayuno = params['desayuno'] || 0;
      this.almuerzo = params['almuerzo'] || 0;
      this.cena = params['cena'] || 0;
      this.meriendas = params['meriendas'] || 0;
      this.mealType = params['mealType'] || '';
    });
  }

  ionViewWillEnter() {
    this.checkAndResetIfNeeded();
    this.updateMeals();
    this.loadUserProfile();
  }

  async abrirModalNutricionales() {
    const modal = await this.modalController.create({
      component: VistaValoresNutricionalesComponent,
    });

    await modal.present();
  }

  getCurrentDate(): string {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `${day}-${month}-${year}`;
  }

  checkAndResetIfNeeded() {
    const currentDate = this.getCurrentDate();
    const storedLastResetDate = localStorage.getItem('lastResetDate');

    if (!storedLastResetDate || storedLastResetDate !== currentDate) {
      this.confirmResetIfNeeded();
      localStorage.setItem('lastResetDate', currentDate);
    }
  }

  async confirmResetIfNeeded() {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: 'Se ha detectado un nuevo dia. ¿Desea resetear el planificador para el día actual?',
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
            this.resetPlanificador();
          }
        }
      ]
    });



    await alert.present();

  }

  async updateMeals() {
    const storedCalories = localStorage.getItem('calorias') ?? '0';
    this.infoCalorias = parseInt(storedCalories, 10);
    const storedDesayuno = localStorage.getItem('caloriasDesayuno') ?? '0';
    this.desayuno = parseInt(storedDesayuno, 10);
    const storedAlmuerzo = localStorage.getItem('caloriasAlmuerzo') ?? '0';
    this.almuerzo = parseInt(storedAlmuerzo, 10);
    const storedCena = localStorage.getItem('caloriasCena') ?? '0';
    this.cena = parseInt(storedCena, 10);
    const storedMeriendas = localStorage.getItem('caloriasMeriendas') ?? '0';
    this.meriendas = parseInt(storedMeriendas, 10);
    const storedWaterIngested = localStorage.getItem('waterIngested') ?? '0';
    this.waterIngested = parseFloat(storedWaterIngested);
  }

  async confirmResetPlanificador() {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Está seguro de resetear el plan de hoy? Su planificacion actual se perderá.',
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
            this.resetPlanificador();
          }
        }
      ]
    });



    await alert.present();
  }

  resetPlanificador() {
    this.desayuno = 0;
    this.almuerzo = 0;
    this.cena = 0;
    this.meriendas = 0;
    this.infoCalorias = 0;
    this.waterIngested = 0;
    this.waterPercentage = 0;
    this.waterWidth = `${this.waterPercentage}%`;
    this.percentage = 0;
    this.color = '#78C000';
    this.innerColor = '#C7E596';
    localStorage.setItem('caloriasDesayuno', this.desayuno.toString());
    localStorage.setItem('caloriasAlmuerzo', this.almuerzo.toString());
    localStorage.setItem('caloriasCena', this.cena.toString());
    localStorage.setItem('caloriasMeriendas', this.meriendas.toString());
    localStorage.setItem('calorias', this.infoCalorias.toString());
    localStorage.setItem('waterIngested', this.waterIngested.toString());
    localStorage.setItem('acomuladorNutricional', JSON.stringify(this.acumuladorNutricional));
    const currentDate = this.getCurrentDate();
    localStorage.setItem('lastResetDate', currentDate);
    this.lastResetDate = currentDate;
  }

  modal: any;
  async abrirModal(mealType: string) {
    this.modal = await this.modalController.create({
      component: DetallePlanificador,
      componentProps: {
        mealType,
        user: this.username,
      }
    });

    this.modal.onDidDismiss().then(() => {
      this.updateMeals();
    });

    await this.modal.present();
  }


  async setWaterProgress(waterIngested: number, waterGoal: number) {
    await this.loadingService.showLoading('Cargando', true, 500);
    const percentage = Math.round((waterIngested / waterGoal) * 100);
    this.waterPercentage = Math.min(percentage, 100);
    this.waterWidth = `${this.waterPercentage}%`;
    localStorage.setItem('waterIngested', waterIngested.toString());
    this.loadingService.hideLoading();
  }

  addWater() {
    const waterGoal = this.response.data.waterPerDay;
    if (this.waterIngested < waterGoal) {
      this.waterIngested += this.selectedWaterAmount;
      this.setWaterProgress(this.waterIngested, waterGoal);
      if (this.waterIngested >= waterGoal) {
        this.showAlert('¡Felicidades!', 'Has alcanzado tu meta de agua para el día.');
      }
    } else {
      this.showAlert('Límite alcanzado', 'Ya has alcanzado tu meta de agua para el día.');
    }
  }

  changeBarColor() {
    if (this.infoCalorias > this.calorieGoal + 50) {
      this.color = '#ff0000';
      this.innerColor = '#ff6464';
    }
  }

  async loadUserProfile() {
    this.userProfileService.getUserProfile().subscribe({
      next: (response: any) => {
        console.log('Perfil cargado:', response);
        this.response = response;
        this.calorieGoal = this.response.data.caloriesPerDay;
        this.remainingCalories = this.calorieGoal - this.infoCalorias;
        this.percentage = (this.infoCalorias / this.calorieGoal) * 100;
        this.setWaterProgress(this.waterIngested, this.response.data.waterPerDay);
        this.changeBarColor();
      },
      error: (error) => {
        console.log('Error al cargar el perfil:', error);
        this.showAlert('Error', 'No se pudo cargar el perfil del usuario');
      }
    });
  }

  async showAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  goToHome() {
    this.router.navigate(['/home', { user: this.username }]);
  }
}
