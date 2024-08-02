import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class ResetPasswordComponent implements OnInit {
  newPassword: string = '';
  confirmPassword: string = '';
  recoveryCode: string = '';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private authService: AuthService,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.recoveryCode = navigation.extras.state['code'];
    }
  }

  async resetPassword() {
    await this.loadingService.showLoading();
    if (!this.newPassword || !this.confirmPassword) {
      this.showAlert('Error', 'Por favor, complete todos los campos.');
      return;
    }
  
    if (this.newPassword !== this.confirmPassword) {
      this.showAlert('Error', 'Las contraseñas no coinciden.');
      return;
    }
  
    this.authService.resetPasswordByCode({ code: this.recoveryCode, newPassword: this.newPassword }).subscribe({
      next: (response) => {
        console.log('Contraseña restablecida:', response);
        this.showAlert('Éxito', response.message || 'Su contraseña ha sido restablecida correctamente.');
        this.loadingService.hideLoading();
        this.router.navigate(['/login']);
      },
      error: (error: Error) => {
        console.error('Error:', error);
        this.loadingService.hideLoading();
        this.showAlert('Confirmacion','La contraseña se ha restablecido correctamente');
        this.router.navigate(['/login']);
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

  gotoLogin() {
    this.router.navigate(['/login']);
  }
}