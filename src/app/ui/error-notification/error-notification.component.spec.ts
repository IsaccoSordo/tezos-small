import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorNotificationComponent } from './error-notification.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

describe('ErrorNotificationsComponent', () => {
  let component: ErrorNotificationComponent;
  let fixture: ComponentFixture<ErrorNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgbModule],
      declarations: [ErrorNotificationComponent],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
});
