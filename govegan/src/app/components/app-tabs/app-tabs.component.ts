import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule,PopoverController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { Router,ActivatedRoute } from '@angular/router';
import { trashOutline,trash,starHalf,nutrition,lockClosedOutline, lockClosedSharp, lockOpen, lockOpenOutline, refresh, calendarOutline, calendarNumberOutline, calendarNumber, restaurantOutline, storefront, storefrontOutline, pizzaOutline, water, camera, starSharp, starOutline, heartDislikeSharp, thumbsDownSharp, alert, heart, add, chevronForwardOutline, radio, settingsSharp, personOutline, searchOutline, homeSharp, heartOutline, person, star, documentText, logOut, waterOutline, restaurant, lockClosed, nutritionOutline, informationCircleOutline, peopleOutline, basketOutline, bookOutline, bulbOutline } from 'ionicons/icons';
import { SearchOptionsPopoverComponent } from '../search-options-popover/search-options-popover.component';

@Component({
  selector: 'app-app-tabs',
  templateUrl: './app-tabs.component.html',
  styleUrls: ['./app-tabs.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class AppTabsComponent{

  IonIcons = {
    add,
    chevronForwardOutline,
    logOut,
    documentText,
    star,
    radio,
    person,
    settingsSharp,
    personOutline,
    searchOutline,
    homeSharp,
    heartOutline,
    heart,
    alert,
    thumbsDownSharp,
    heartDislikeSharp,
    starOutline,
    starSharp,
    camera,
    refresh,
    water,
    waterOutline,
    restaurant,
    restaurantOutline,
    pizzaOutline,
    storefrontOutline,
    storefront,
    calendarNumberOutline,
    calendarOutline,
    calendarNumber,
    lockClosed,
    lockClosedOutline,
    lockClosedSharp,
    lockOpen,
    lockOpenOutline,
    nutritionOutline,
    informationCircleOutline,
    peopleOutline,
    basketOutline,
    bookOutline,
    bulbOutline,
    nutrition,
    starHalf,
    trashOutline,
    trash
  };

  username: string = '';

  constructor(private router: Router, 
              private route: ActivatedRoute, 
              private popoverController: PopoverController) {
    addIcons(this.IonIcons);
    this.route.params.subscribe(params => {
      this.username = params['user'] || '';
    });
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      mode: 'ios',
      cssClass: 'popover',
      component: SearchOptionsPopoverComponent,
      componentProps: { username: this.username },
      event: ev,
      translucent: true
    });
    await popover.present();
  }

  goToHome() {
    this.router.navigate(['/home', { user: this.username }]);
  }

  goToPerfil() {
    this.router.navigate(['/perfil', { user: this.username }]);
  }

  goToFavoritos() {
    this.router.navigate(['/favoritos', { user: this.username }]);
  }

  goToConfig() {
    this.router.navigate(['/configuracion', { user: this.username }]);
  }
}
