import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpinnerComponent } from './spinner.component';
import { Store } from '../../store/store.service';

describe('SpinnerComponent', () => {
  let component: SpinnerComponent;
  let fixture: ComponentFixture<SpinnerComponent>;
  let store: InstanceType<typeof Store>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpinnerComponent],
      providers: [Store],
    }).compileComponents();

    fixture = TestBed.createComponent(SpinnerComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  afterEach(() => {
    store.setLoadingCounter(0);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have reference to store loadingCounter signal', () => {
    expect(component.loadingCounter$).toBe(store.loadingCounter);
  });

  it('should not display spinner when loading counter is 0', () => {
    store.setLoadingCounter(0);
    fixture.detectChanges();

    const spinner = fixture.nativeElement.querySelector('.spinner-backdrop');
    expect(spinner).toBeNull();
  });

  it('should display spinner when loading counter is greater than 0', async () => {
    store.setLoadingCounter(1);
    fixture.detectChanges();
    await fixture.whenStable();

    const spinner = fixture.nativeElement.querySelector('.spinner-backdrop');
    expect(spinner).toBeTruthy();
  });

  it('should reactively update when loading counter changes', async () => {
    // Initially not loading
    store.setLoadingCounter(0);
    fixture.detectChanges();
    await fixture.whenStable();
    let spinner = fixture.nativeElement.querySelector('.spinner-backdrop');
    expect(spinner).toBeNull();

    // Start loading
    store.setLoadingCounter(2);
    fixture.detectChanges();
    await fixture.whenStable();
    spinner = fixture.nativeElement.querySelector('.spinner-backdrop');
    expect(spinner).toBeTruthy();

    // Stop loading
    store.setLoadingCounter(0);
    fixture.detectChanges();
    await fixture.whenStable();
    spinner = fixture.nativeElement.querySelector('.spinner-backdrop');
    expect(spinner).toBeNull();
  });

  it('should handle multiple concurrent operations (counter > 1)', async () => {
    store.setLoadingCounter(3);
    fixture.detectChanges();
    await fixture.whenStable();

    const spinner = fixture.nativeElement.querySelector('.spinner-backdrop');
    expect(spinner).toBeTruthy();
    expect(component.loadingCounter$()).toBe(3);
  });
});
