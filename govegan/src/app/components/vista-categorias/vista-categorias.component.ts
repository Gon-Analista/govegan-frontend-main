import { Component,Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FoodsService } from '../../services/foods.service';
import { CategoryConfigService } from '../../services/category-config.service';

@Component({
  selector: 'app-vista-categorias',
  templateUrl: './vista-categorias.component.html',
  styleUrls: ['./vista-categorias.component.scss'],
  standalone: true,
  imports: [CommonModule,FormsModule,IonicModule]
})
export class VistaCategoriasComponent{

  @Input() categorias: any;
  categories: any[] = [];

  constructor( private foodsService: FoodsService,
               private categoryConfigService: CategoryConfigService
   ) {}

  getFoodsCategories() {
    this.foodsService.getFoodsCategories().subscribe({
      next: (response: any) => {
        this.categories = response.data;
        this.categories.forEach((category: any) => {
          this.categoryConfigService.getCategoryIcon(category.id);
        });
        console.log('Categories:', response);
      },
      error: (error) => {
        console.error('Error getting categories:', error);
      }
    });
  }

  getCategoryIcon(categoryId: string): string {
    return 'assets/icon/' + this.categoryConfigService.getCategoryIcon(categoryId);
  }



}
