import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loading: HTMLIonLoadingElement | null = null;

  constructor(private loadingController: LoadingController) {}

  async showLoading(message: string = 'Cargando', small: boolean = false, delay: number = 0) {
    if (small) {
      this.loading = await this.loadingController.create({
        message,
        spinner: 'bubbles',
        duration: delay,
      });
    } else {
      this.loading = await this.loadingController.create({
        message,
        spinner: 'bubbles',
        duration: 12000,
      });
    }
    await this.loading.present();
  }

  async hideLoading() {
    if (this.loading) {
      await this.loading.dismiss();
      this.loading = null;
    }
  }
}
