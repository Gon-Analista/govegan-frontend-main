import { Component,Input } from '@angular/core';
import { PopoverController,IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-search-options-popover',
  templateUrl: './search-options-popover.component.html',
  styleUrls: ['./search-options-popover.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class SearchOptionsPopoverComponent {

  @Input() username: string = '';

  constructor(private router: Router,
              private popoverController: PopoverController
            ) {
  }
  searchTerm: string = '';

  goToSearch(searchTerm: string) {
    // Remove any leading/trailing whitespace
    const trimmedSearchTerm = searchTerm.trim();
    
    // Navigate to the buscador page with query parameters instead of matrix parameters
    this.router.navigate(['/buscador'], { 
      queryParams: { 
        term: trimmedSearchTerm,
        user: this.username
      }
    });
    this.popoverController.dismiss();
  }
  goToBuscadorAlimentos( searchTerm: string) {
    this.router.navigate(['/buscador-alimentos', searchTerm, { user: this.username }]);
    this.popoverController.dismiss();
  }
}
