import { Component} from '@angular/core';
import { IonicModule,ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vista-valores-nutricionales',
  templateUrl: './vista-valores-nutricionales.component.html',
  styleUrls: ['./vista-valores-nutricionales.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class VistaValoresNutricionalesComponent{

  food: any = {};


  constructor(
    private modalController: ModalController) { }

  
  loadNutritionalValues(){
    const nutritionalValues = JSON.parse(localStorage.getItem('acomuladorNutricional') ?? '{}');
    this.food = nutritionalValues;
  }

  ionViewWillEnter() {
    this.loadNutritionalValues();
    console.log("nutritional values:", this.food);
  }


  cerrarModal() {
    this.modalController.dismiss();
  }

}
