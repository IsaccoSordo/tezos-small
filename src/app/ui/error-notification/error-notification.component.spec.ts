import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorNotificationComponent } from './error-notification.component';
import { MockSelector, provideMockStore } from '@ngrx/store/testing';
import { selectError } from 'src/app/store/tzkt.selectors';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

describe('ErrorNotificationsComponent', () => {
  let component: ErrorNotificationComponent;
  let fixture: ComponentFixture<ErrorNotificationComponent>;
  const selectors: MockSelector[] = [
    {
      selector: selectError,
      value: ['test'],
    },
  ];
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgbModule],
      declarations: [ErrorNotificationComponent],
      providers: [provideMockStore({ selectors })],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have as error "test"', (done) => {
    component.errors$.subscribe((errors) => {
      expect(errors).toHaveSize(1);
      expect(errors[0]).toBe('test');
      done();
    });
  });
});
