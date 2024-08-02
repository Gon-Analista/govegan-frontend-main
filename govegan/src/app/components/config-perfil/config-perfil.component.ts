import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, AlertController, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserProfileService } from '../../services/user-profile.service';

@Component({
  selector: 'app-config-perfil',
  templateUrl: './config-perfil.component.html',
  styleUrls: ['./config-perfil.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ConfigPerfilComponent implements OnInit {
  @Input() perfil: any;

  constructor(
    private modalController: ModalController,
    private router: Router,
    private alertController: AlertController,
    private userProfileService: UserProfileService
  ) {}

  ngOnInit() {
    // If needed, you can initialize component-specific data here
  }

  cerrarModal(updated: boolean = false) {
    this.modalController.dismiss({
      updated: updated
    });
  }

  irAFavoritos() {
    this.cerrarModal();
    this.router.navigate(['/favoritos', { user: this.perfil.name }]);
  }

  irAdministrarAlimentos() {
    this.cerrarModal();
    this.router.navigate(['/administrar-alimentos', { user: this.perfil.name }]);
  }

  guardarCambios() {
    this.userProfileService.updateUserProfile(this.perfil).subscribe({
      next: (response) => {
        this.showAlert('Perfil actualizado', 'Perfil actualizado correctamente.');
        console.log('Perfil actualizado:', response);
        this.cerrarModal(true);
      },
      error: (error) => {
        console.error('Error al actualizar el perfil:', error);
        this.showAlert('Error', 'No se pudo actualizar el perfil. Por favor, intente de nuevo.');
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
}