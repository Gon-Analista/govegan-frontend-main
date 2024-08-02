import { CanActivateFn,Router } from '@angular/router';
import { inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AlertController } from '@ionic/angular';

const jwtHelper = new JwtHelperService();

function isValidJwt(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.log('El token no tiene 3 partes');
      return false;
    }
    
    // Intenta decodificar el token
    const decoded = jwtHelper.decodeToken(token);
    return !!decoded;
  } catch (error) {
    console.error('Error al validar el token:', error);
    return false;
  }
}

function showAlert(alertController: AlertController, header: string, message: string, router: Router) {
  alertController.create({
    header: header,
    message: message,
    buttons: [{
      text: 'OK',
      handler: () => {
        router.navigate(['/login']);
      }
    }]
  }).then(alert => alert.present());
}

export const authGuard: CanActivateFn = (route, state) => {
  const token = sessionStorage.getItem('token');
  const router = inject(Router);
  const alertController = inject(AlertController);

  if (!token) {
    showAlert(alertController, 'Sesión necesaria', 'Por favor inicia sesión para acceder a esta página', router);
    return false;
  }

  if (!isValidJwt(token)) {
    console.log('El token no es válido según isValidJwt');
    showAlert(alertController, 'Token inválido', 'El token de sesión es inválido. Por favor, inicia sesión nuevamente.', router);
    return false;
  }

  try {
    const isExpired = jwtHelper.isTokenExpired(token);
    if (isExpired) {
      showAlert(alertController, 'Sesión expirada', 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.', router);
      return false;
    }
    const tokenPayload = jwtHelper.decodeToken(token);
    const username = tokenPayload.sub;
    const storedUsername = sessionStorage.getItem('user');
    if (username === storedUsername) {
      return true;
    } else {
      showAlert(alertController, 'Sesión inválida', 'No tienes autorización para acceder a esta página', router);
      return false;
    }
  } catch (error) {
    console.error('Error en authGuard:', error);
    showAlert(alertController, 'Error de sesión', 'Ocurrió un error al verificar tu sesión. Por favor inicia sesión nuevamente.', router);
    return false;
  }
};