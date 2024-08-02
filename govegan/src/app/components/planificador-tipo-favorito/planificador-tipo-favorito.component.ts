import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule,PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-planificador-tipo-favorito',
  templateUrl: './planificador-tipo-favorito.component.html',
  styleUrls: ['./planificador-tipo-favorito.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class PlanificadorTipoFavoritoComponent{


  constructor(
              private popoverController: PopoverController
            ) {
  }


  recetasFavoritas() {
    this.popoverController.dismiss('recetas');
  }

  alimentosFavoritos() {
    this.popoverController.dismiss('alimentos');
  }
  

}
