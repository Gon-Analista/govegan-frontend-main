import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-verify-recovery-code',
  templateUrl: './verify-recovery-code.component.html',
  styleUrls: ['./verify-recovery-code.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class VerifyRecoveryCodeComponent {
  recoveryCode: string = '';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private authService: AuthService
  ) {}

  verifyCode() {
    if (!this.recoveryCode) {
      this.showAlert('Error', 'Por favor, ingrese el código de recuperación.');
      return;
    }
  
    this.authService.checkCode(this.recoveryCode).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        this.showAlert('Éxito', 'Código verificado correctamente. Proceda a cambiar su contraseña.');
        this.router.navigate(['/reset-password'], { state: { code: this.recoveryCode } });
      },
      error: (error: Error) => {
        console.error('Error:', error);
        let errorMessage = error.message || 'Código inválido. Por favor, intente nuevamente.';
        if (errorMessage === 'Recovery code expired') {
          errorMessage = 'El código de recuperación ha expirado. Por favor, solicite uno nuevo.';
        }
        this.showAlert('Error', errorMessage);
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

  gotoRest() {
    this.router.navigate(['/restablecer']);
  }
}