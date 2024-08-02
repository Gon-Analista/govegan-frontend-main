import { Component, Input } from '@angular/core';
import { IonicModule, ModalController, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppTabsComponent } from '../app-tabs/app-tabs.component';
import { RecipesService } from '../../services/recipes.service';
import { UserProfileService } from '../../services/user-profile.service';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-detalle-receta',
  templateUrl: './detalle-receta.component.html',
  styleUrls: ['./detalle-receta.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, AppTabsComponent]
})
export class DetalleRecetaComponent {
  comments: any[] = [];
  showComments: boolean = false;
  flagNoComments: boolean = false;
  @Input() receta: any;
  @Input() comment: any;
  stars: number[] = [1, 2, 3, 4, 5];
  currentRating: number = 0;
  displayedComments: any[] = [];
  mostrarIngredientes: boolean = false;
  mostrarPreparacion: boolean = false;
  showRatingForm: boolean = false;
  pageNumberComments: number = 0;
  sizeComments: number = 3;
  totalComments: number = 0;
  pageNumberRatings: number = 0;
  sizeRatings: number = 9999;
  ratings: any[] = [];
  ratingsContent: any[] = [];
  userRating: number = 0;
  userProfile: any = {};

  constructor(
    private modalController: ModalController,
    private recipesService: RecipesService,
    private alertController: AlertController,
    private loadingService: LoadingService,
    private userProfileService: UserProfileService
  ) {}

  cerrarModal() {
    this.modalController.dismiss();
  }

  ionViewWillEnter() {
    this.loadUserProfile();
    this.updateFavoritesAndRatings();
  }


  async updateFavoritesAndRatings() {
    try {
      await this.loadingService.showLoading();
      await Promise.all([
        this.getRatingByRecipeIdNumber(this.receta.id)
      ]);
    } catch (error) {
      console.error('Error in updateFoodsAndRecipes:', error);
    }
    await this.loadingService.hideLoading();
  }

  toggleMostrarIngredientes() {
    this.mostrarIngredientes = !this.mostrarIngredientes;
  }

  toggleMostrarPreparacion() {
    this.mostrarPreparacion = !this.mostrarPreparacion;
  }

  resetComments() {
    this.pageNumberComments = 0;
    this.displayedComments = [];
    this.comments = [];
    this.totalComments = 0;
  }

  async getCommentsByRecipeId(recipeId: string) {
    await this.loadingService.showLoading();
    this.recipesService.commentFindById(recipeId, this.pageNumberComments, this.sizeComments).subscribe({
      next: (response: any) => {
        this.comments = response.content;
        this.totalComments = response.totalElements;
        if (this.totalComments === 0) {
          this.flagNoComments = true;
          console.log('flag no comments', this.flagNoComments, 'total comments', this.totalComments);
        } else {
          this.flagNoComments = false;
        }
        console.log('Comments:', this.comments);
        this.displayedComments = [...this.comments]; // Mostrar todos los comentarios cargados
        this.loadingService.hideLoading();
      },
      error: (error) => {
        console.error('Error getting comments:', error);
        this.loadingService.hideLoading();
      }
    });
  }

  refreshComments() {
    this.resetComments();
    this.getCommentsByRecipeId(this.receta.id);
  }
  

  loadMoreComments() {
    this.pageNumberComments++;
    this.recipesService.commentFindById(this.receta.id, this.pageNumberComments, this.sizeComments).subscribe({
      next: (response: any) => {
        const newComments = response.content;
        if (Array.isArray(newComments)) { 
          this.comments = [...this.comments, ...newComments];
          this.displayedComments = [...this.comments];
          console.log('Comments cargados:', this.comments);
        } else {
          console.error('Error: newComments is not an array');
        }
      },
      error: (error) => {
        console.error('Error getting comments:', error);
      }
    });
  }

  async toggleComments() {
    this.showComments = !this.showComments;
    if (this.showComments) {
      this.resetComments();
      this.getCommentsByRecipeId(this.receta.id);
    }
  }

  toggleRating() {
    this.showRatingForm = !this.showRatingForm;
  }

  getCurrentDate(): string {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `${day}-${month}-${year}`;
  }

  async addComment() {
    const alert = await this.alertController.create({
      header: 'Añadir Comentario',
      inputs: [
        {
          name: 'content',
          type: 'textarea',
          placeholder: 'Tu comentario'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Añadir',
          handler: data => {
            const newComment = {
              recipeId: this.receta.id,
              username: sessionStorage.getItem('user') ?? '',
              content: data.content,
              creationDate: this.getCurrentDate()
            };
            this.recipesService.postComment(newComment).subscribe({
              next: (response: any) => {
                console.log(response);
                console.log('Comentario añadido:', newComment);
                this.comments.unshift(newComment);
                this.displayedComments = [...this.comments];
                this.totalComments++;
                this.refreshComments();
              },
              error: (error) => {
                console.error('Error añadiendo el comentario:', error);
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  getRatingByRecipeId(recipeId: string) {
    this.recipesService.getRatingByRecipeId(recipeId, this.pageNumberRatings, this.sizeRatings).subscribe({
      next: (response: any) => {
        this.ratingsContent = response.content;
        console.log('Ratings:', this.ratings);
      },
      error: (error) => {
        console.error('Error getting ratings:', error);
      }
    });
  }

  async getRatingByRecipeIdNumber(recipeId: string) {
    return new Promise<void>((resolve, reject) => {
    this.recipesService.getRatingByRecipeIdNumber(recipeId, this.pageNumberRatings, this.sizeRatings).subscribe({
      next: (response: any) => {
        this.ratings = response;
        this.calculateAverageRating();
        console.log('Ratings solo el numero:', this.ratings);
        resolve();
      },
      error: () => {
        reject(new Error('Error getting ratings'));
      }
     });
    });
  }
  
  calculateAverageRating() {
    if (this.ratings.length === 0) {
      this.currentRating = 0;
    } else {
      const total = this.ratings.reduce((sum, rating) => sum + rating, 0);
      this.currentRating = total / this.ratings.length;
    }
  }
  
  get fullStars(): number[] {
    return Array(Math.floor(this.currentRating)).fill(0);
  }
  
  get hasHalfStar(): boolean {
    return this.currentRating % 1 >= 0.5;
  }
  
  get emptyStars(): number[] {
    const totalStars = Math.floor(this.currentRating) + (this.hasHalfStar ? 1 : 0);
    return Array(5 - totalStars).fill(0);
  }


  setRating(rating: number) {
    this.userRating = rating;
  }

  postRating() {
    const rating = {
      recipeId: this.receta.id,
      username: sessionStorage.getItem('user') ?? '',
      rating: this.userRating,
      createdAt: new Date().toISOString()
    };
  
    this.recipesService.addRating(rating).subscribe({
      next: (response: any) => {
        console.log('Rating agregado:', response);
        this.updateFavoritesAndRatings();
      },
      error: (error) => {
        if (error.status === 409) {
          this.showAlreadyRatedAlert();
        } else {
          console.error('Error agregando el rating:', error);
        }
      }
    });
  }

  loadUserProfile() {
    this.userProfileService.getUserProfile().subscribe({
      next: (response: any) => {
        console.log('Perfil cargado:', response);
        this.userProfile = response.data;
      },
      error: (error) => {
        console.log('Error al cargar el perfil:', error);
        this.showAlert('Error', 'No se pudo cargar el perfil del usuario');
      }
    });
  }
  
  async showAlreadyRatedAlert() {
    const alert = await this.alertController.create({
      header: 'Valoración ya existente',
      message: 'Ya has valorado esta receta anteriormente.',
      buttons: ['OK']
    });
  
    await alert.present();
  }


  async confirmRating() {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Está seguro de su valoración?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.postRating();
          }
        }
      ]
    });
  
    await alert.present();
  }

  isCurrentUserComment(username: string): boolean {
    return username === sessionStorage.getItem('user');
  }

  async deleteComment(comment: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que quieres eliminar este comentario?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.loadingService.showLoading('Eliminando',true,200);
            this.recipesService.deleteCommentByUsernameAndRecipeId(this.receta.id, comment.username).subscribe({
              error: () => {
                this.refreshComments();
                this.showAlert('Confirmacion','Comentario eliminado correctamente');
              }
            });
          }
        }
      ]
    });
  
    await alert.present();
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
