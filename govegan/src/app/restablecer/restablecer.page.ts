import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { IonicModule,AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-restablecer',
  templateUrl: './restablecer.page.html',
  styleUrls: ['./restablecer.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule, IonicModule, ReactiveFormsModule]
})
export class RestablecerPage {

  constructor(private router: Router,
              private http: HttpClient,
              private alertController: AlertController,
              private authService: AuthService,
              private loadingService: LoadingService) { }

  email: string = '';
  response: any = {};
  async restablecer() {
    await this.loadingService.showLoading();
    if (!this.email) {
      await this.showAlert('Error', 'Por favor, ingrese un correo electrónico.');
      return;
    }
  
    const body = { email: this.email };
    console.log('Restablecer:', body);
  
    this.authService.restablecer(body).subscribe({
      next: (response) => {
        console.log('Restablecer:', response);
        this.response = response;
        this.showAlert('Restablecer contraseña', 'Se ha enviado un correo electrónico con las instrucciones para restablecer la contraseña.');
        this.loadingService.hideLoading();
        this.router.navigate(['/verificar-codigo']);
      },
      error: (error) => {
        console.error('Error:', error);
        let errorMessage = 'Ha ocurrido un error. Por favor, intente nuevamente.';
        this.loadingService.hideLoading();
        if (error.error && error.error.message) {
          switch (error.error.message) {
            case 'There is already an active recovery code for this user':
              errorMessage = 'Ya existe un código de recuperación activo para este usuario. Por favor, revise su correo electrónico o intente nuevamente más tarde.';
              this.loadingService.hideLoading();
              this.router.navigate(['/verificar-codigo']);
              break;
            case 'User not found':
              this.loadingService.hideLoading();
              errorMessage = 'No se encontró un usuario con este correo electrónico.';
              break;
          }
        }
  
        this.showAlert('Error', errorMessage);
      }
    });
  }

  gotoLog() {
    this.router.navigate(['/login']);
  }
  gotoReg() {

    this.router.navigate(['/registro']);
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
