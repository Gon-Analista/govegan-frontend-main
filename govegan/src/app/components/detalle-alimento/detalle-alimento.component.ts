import { Component, Input } from '@angular/core';
import { ModalController,IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VistaCategoriasComponent } from '../vista-categorias/vista-categorias.component';

@Component({
  selector: 'app-detalle-alimento',
  templateUrl: './detalle-alimento.component.html',
  styleUrls: ['./detalle-alimento.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,VistaCategoriasComponent],
})
export class DetalleAlimentoComponent{

  @Input() food: any;

  constructor(
             private modalController: ModalController) { }


  cerrarModal() {
    
    this.modalController.dismiss();
    
  }

}
