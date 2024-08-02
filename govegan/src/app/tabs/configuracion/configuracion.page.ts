import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AppTabsComponent } from '../../components/app-tabs/app-tabs.component';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, AppTabsComponent]
})
export class ConfiguracionPage implements OnInit {

  isDarkMode = false;

  constructor(private renderer: Renderer2) {}


  ngOnInit() {
    this.isDarkMode = localStorage.getItem('theme') === 'dark';
    this.renderer.setAttribute(document.body, 'color-theme', this.isDarkMode ? 'dark' : 'light');
  }

  toggleTheme(event: any) {
    this.isDarkMode = event.detail.checked;
    const theme = this.isDarkMode ? 'dark' : 'light';
    this.renderer.setAttribute(document.body, 'color-theme', theme);
    localStorage.setItem('theme', theme);
  }


  toggleMode(event: any) {
    console.log(event.detail.checked);

  }
}
