import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorNotificationComponent } from './error-notification.component';
import { Store } from '../../store/store.service';

describe('ErrorNotificationComponent', () => {
  let component: ErrorNotificationComponent;
  let fixture: ComponentFixture<ErrorNotificationComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorNotificationComponent],
      providers: [Store],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorNotificationComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  afterEach(() => {
    store.state.errors.set([]);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have references to store signals', () => {
    expect(component.errors).toBe(store.state.errors);
    expect(component.store).toBe(store);
  });

  it('should not display alerts when there are no errors', () => {
    store.state.errors.set([]);
    fixture.detectChanges();

    const alerts = fixture.nativeElement.querySelectorAll('ngb-alert');
    expect(alerts.length).toBe(0);
  });

  it('should display alerts when there are errors', async () => {
    store.state.errors.set([
      { text: 'Error 1' },
      { text: 'Error 2' }
    ]);
    fixture.detectChanges();
    await fixture.whenStable();

    const alerts = fixture.nativeElement.querySelectorAll('ngb-alert');
    expect(alerts.length).toBe(2);
  });

  it('should display error messages correctly', async () => {
    store.state.errors.set([
      { text: 'Network error occurred' },
      { text: 'Failed to load data' }
    ]);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Network error occurred');
    expect(compiled.textContent).toContain('Failed to load data');
  });

  it('should remove error when onClose is called', () => {
    store.state.errors.set([
      { text: 'Error 1' },
      { text: 'Error 2' },
      { text: 'Error 3' }
    ]);

    expect(component.errors().length).toBe(3);

    component.onClose(1);

    expect(component.errors().length).toBe(2);
    expect(component.errors()[0].text).toBe('Error 1');
    expect(component.errors()[1].text).toBe('Error 3');
  });

  it('should remove first error when index 0 is closed', () => {
    store.state.errors.set([
      { text: 'First' },
      { text: 'Second' }
    ]);

    component.onClose(0);

    expect(component.errors().length).toBe(1);
    expect(component.errors()[0].text).toBe('Second');
  });

  it('should remove last error when last index is closed', () => {
    store.state.errors.set([
      { text: 'First' },
      { text: 'Second' }
    ]);

    component.onClose(1);

    expect(component.errors().length).toBe(1);
    expect(component.errors()[0].text).toBe('First');
  });

  it('should update UI reactively when errors change', async () => {
    store.state.errors.set([{ text: 'Error 1' }]);
    fixture.detectChanges();
    await fixture.whenStable();
    let alerts = fixture.nativeElement.querySelectorAll('ngb-alert');
    expect(alerts.length).toBe(1);

    store.state.errors.update(prev => [...prev, { text: 'Error 2' }]);
    fixture.detectChanges();
    await fixture.whenStable();
    alerts = fixture.nativeElement.querySelectorAll('ngb-alert');
    expect(alerts.length).toBe(2);

    component.onClose(0);
    fixture.detectChanges();
    await fixture.whenStable();
    alerts = fixture.nativeElement.querySelectorAll('ngb-alert');
    expect(alerts.length).toBe(1);
  });
});
