import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, AlertController, IonModal } from '@ionic/angular';
import { AppTabsComponent } from '../../components/app-tabs/app-tabs.component';
import { Router } from '@angular/router';
import { ConfigPerfilComponent } from '../../components/config-perfil/config-perfil.component';
import { UserProfileService } from '../../services/user-profile.service';
import { Observable } from 'rxjs';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, AppTabsComponent]
})
export class PerfilPage implements OnInit {
  confirm() {
    this.modalController.dismiss(null, 'confirm');
  }
  cancel() {
    this.modalController.dismiss(null, 'cancel');
  }
  
  fileName = '';
  fileSelected: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  imagePosition = { x: 0, y: 0 };
  isDragging = false;
  startPosition = { x: 0, y: 0 };

  userProfile: any = {};

  @ViewChild('fileInput') fileInput!: HTMLInputElement;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private modalController: ModalController,
    private userProfileService: UserProfileService,
  ) {}

  @ViewChild(IonModal)
  modal!: IonModal;

  ngOnInit() {
    this.loadUserProfile();
  }

  async abrirModal() {
    const modal = await this.modalController.create({
      component: ConfigPerfilComponent,
      componentProps: { perfil: this.userProfile }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data && data.updated) {
      this.loadUserProfile();
    }
  }

  openImageOptions() {
    console.log('Abrir opciones de imagen');
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

  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('RefreshToken');
    this.router.navigate(['/login']);
  }

  async showAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.ngOnInit();
    }

    if (this.fileSelected) {
      this.uploadFile()
        .subscribe({
          next: (response: any) => {
            this.uploadAndShowSuccessMessage();
          },
          error: (error) => {
            this.showAlert('Error', 'No se pudo subir la imagen');
          }
        })
        .add(() => {
          this.modal.dismiss(null, 'confirm');
        });
    } else {
      this.modal.dismiss(null, 'confirm');
    }
  }

  async uploadAndShowSuccessMessage() {
    // Upload data here
    // Show success message inside the modal
    const alert = await this.alertController.create({
      header: 'Confirmacion',
      message: 'Imagen actualizada correctamente!',
      buttons: ['OK']
    });

    await alert.present();
    this.ngOnInit();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileSelected = input.files[0];
      this.fileName = this.fileSelected.name;
  
      // Crear vista previa
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
        // Resetear la posición de la imagen
        this.imagePosition = { x: 0, y: 0 };
      };
      reader.readAsDataURL(this.fileSelected);
    }
  }

  showAlertUpload() {
    this.showAlert('Confirmacion', 'Imagen subida correctamente');
  }

  uploadFile(): Observable<any> {
    return new Observable<any>(observer => {
      if (this.fileSelected) {
        this.userProfileService.uploadProfilePicture(this.fileSelected).subscribe(
          response => {
            console.log('File uploaded successfully', response);
            observer.next(response);
          },
          error => {
            console.error('Error uploading file', error);
            observer.error(error);
          }
        );
      } else {
        observer.error('No file selected');
      }
    });
  }

  startDrag(event: MouseEvent | TouchEvent) {
    this.isDragging = true;
    if (event instanceof MouseEvent) {
      this.startPosition = { x: event.clientX - this.imagePosition.x, y: event.clientY - this.imagePosition.y };
    } else {
      this.startPosition = { x: event.touches[0].clientX - this.imagePosition.x, y: event.touches[0].clientY - this.imagePosition.y };
    }
    document.addEventListener('mousemove', this.drag);
    document.addEventListener('touchmove', this.drag);
    document.addEventListener('mouseup', this.endDrag);
    document.addEventListener('touchend', this.endDrag);
  }

  drag = (event: MouseEvent | TouchEvent) => {
    if (!this.isDragging) return;
    event.preventDefault();
    if (event instanceof MouseEvent) {
      this.imagePosition = {
        x: event.clientX - this.startPosition.x,
        y: event.clientY - this.startPosition.y
      };
    } else {
      this.imagePosition = {
        x: event.touches[0].clientX - this.startPosition.x,
        y: event.touches[0].clientY - this.startPosition.y
      };
    }
  }

  endDrag = () => {
    this.isDragging = false;
    document.removeEventListener('mousemove', this.drag);
    document.removeEventListener('touchmove', this.drag);
    document.removeEventListener('mouseup', this.endDrag);
    document.removeEventListener('touchend', this.endDrag);
  }

}


