import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoryConfigService {
  private categoryIcons: { [key: string]: string } = {
    '1': 'Legumbres.svg',
    '2': 'Nueces.svg',
    '3': 'Verduras.svg',
    '4': 'Frutas.svg',
    '5': 'Cereales.svg',
    '6': 'Panes.svg',
    '7': 'Azucares.svg',
    '8': 'Aceites.svg',
    '9': 'Bebidas.svg',
    '10': 'Postres.svg',
    '11': 'Infantiles.svg',
    '12': 'Salsas.svg',
    '13': 'Preparados.svg',
    '14': 'Especias.svg'
  };

  private categoryColors: { [key: string]: string } = {
    '1': '#c2c2f0',  // Legumbres
    '2': '#FFE4B5',  // Nueces
    '3': '#98fb98',  // Verduras
    '4': '#ffe4e1',  // Frutas
    '5': '#f5f5dc',  // Cereales
    '6': '#ecd9c6',  // Panes
    '7': '#f0e0e6',  // Azucares
    '8': '#f0f0e6',  // Aceites
    '9': '#e0ffff',  // Bebidas
    '10': '#e6e6fa',  // Postres
    '11': '#add8e6',  // Infantiles
    '12': '#abebc6',  // Salsas
    '13': '#f9e79f',  // Preparados
    '14': '#ffcccb'   // Especias
  };

  getCategoryIcon(categoryId: string): string {
    return this.categoryIcons[categoryId] || 'default.svg';
  }

  getCategoryColor(categoryId: string): string {
    return this.categoryColors[categoryId] || '#FFFFFF';
  }
}
