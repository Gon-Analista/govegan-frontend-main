import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule,AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule, IonicModule, ReactiveFormsModule]
})
export class RegistroPage{
  
  email: string = '';
  username: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private router: Router,
              private alertController: AlertController,
              private authService: AuthService
            ) { }

  register() {
    if (!this.email || !this.username || !this.password || !this.confirmPassword) {
      this.showAlert('Campos incompletos', 'Por favor, complete todos los campos.');
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.showAlert('Correo electrónico inválido', 'Por favor, ingrese un correo electrónico válido.');
      return;
    }

    if (this.password.length < 8) {
      this.showAlert('Contraseña demasiado corta', 'La contraseña debe tener al menos 8 caracteres.');
      return;
    }
  
    if (this.password !== this.confirmPassword) {
      this.showAlert('Contraseñas no coinciden', 'Las contraseñas ingresadas no coinciden. Por favor, inténtelo de nuevo.');
      return;
    }

    const userData = {
      username: this.username,
      password: this.password,
      email: this.email,
    };

    this.authService.register(userData).subscribe({
      next: (response) => {
        console.log('Registro exitoso:', response);
        this.router.navigate(['/login']);
        this.showAlert('Registro exitoso', '¡Felicitaciones! Te has registrado correctamente.');
      },
      error: (error) => {
        console.error('Error durante el registro:', error);
        if (error.status === 409) {
          this.showAlert('Registro fallido', 'El nombre de usuario ya está en uso. Por favor, elija otro.');
        } else {
          this.showAlert('Registro fallido', 'Hubo un problema durante el registro. Por favor, inténtelo de nuevo más tarde.');
        }
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

isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}


  gotoLog() {
    this.router.navigate(['/login']);
  }


}
