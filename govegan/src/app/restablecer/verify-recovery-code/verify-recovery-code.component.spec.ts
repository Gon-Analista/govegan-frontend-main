import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VerifyRecoveryCodeComponent } from './verify-recovery-code.component';

describe('VerifyRecoveryCodeComponent', () => {
  let component: VerifyRecoveryCodeComponent;
  let fixture: ComponentFixture<VerifyRecoveryCodeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyRecoveryCodeComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VerifyRecoveryCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
