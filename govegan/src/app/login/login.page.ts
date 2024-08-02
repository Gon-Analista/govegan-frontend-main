import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule,AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../services/auth.service';
import { LoadingService } from '../services/loading.service';

const jwtHelper = new JwtHelperService();


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule, IonicModule, ReactiveFormsModule]
})
export class LoginPage{


  constructor(private router: Router,
              private alertController: AlertController,
              private authService: AuthService,
              private loadingService: LoadingService) { }


  ionViewWillEnter() {
    this.logout();
  }

  async logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('RefreshToken');
  }


  username: string = '';
  password: string = '';
  user: any;
  tokenPayload: any = {};

  async login(): Promise<void> {
    await this.loadingService.showLoading('Ingresando');
  
    if (!this.username || !this.password) {
      await this.showAlert('Campos en blanco', 'Por favor, complete ambos campos.');
      this.loadingService.hideLoading();
      return;
    }
  
    this.authService.login(this.username, this.password).subscribe({
      next: (response: any) => {
  
        // Accedemos directamente a los datos dentro de 'data'
        const { token, refreshToken } = response.data;
  
        try {
          // Decodificamos el token
          const decodedToken = jwtHelper.decodeToken(token);
  
          if (!decodedToken) {
            throw new Error('Token decodificado es undefined');
          }
  
          // Guardamos los datos en sessionStorage
          sessionStorage.setItem('token', token);
          sessionStorage.setItem('refreshToken', refreshToken);
          sessionStorage.setItem('user', decodedToken.sub);
  
          // Navegamos a la página de inicio
          this.router.navigate(['/home', { user: decodedToken.sub }]);
        } catch (error) {
          console.error('Error al procesar el token:', error);
          this.showAlert('Error', 'Error al procesar el token. Por favor, inténtalo de nuevo.');
          this.loadingService.hideLoading();
        }
      },
      error: (error) => {
        console.error('Error durante el inicio de sesión:', error);
        this.showAlert('Inicio de sesión fallido', 'Nombre de usuario o contraseña incorrectos.');
        this.loadingService.hideLoading();
      },
      complete: () => {
        this.loadingService.hideLoading();
      }
    });
  }
  
  gotoRest() {
    this.router.navigate(['/restablecer']);
  }

  gotoReg() {
    this.router.navigate(['/registro']);
  }

  gotoBusc() {
    this.router.navigate(['/buscador']);
  }

  gotoHome() {
    this.router.navigate(['/home']);
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
