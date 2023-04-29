import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockSelector, provideMockStore } from '@ngrx/store/testing';
import { SpinnerComponent } from './spinner.component';
import { selectLoadingCounter } from 'src/app/store/tzkt.selectors';
import { By } from '@angular/platform-browser';

describe('SpinnerComponent', () => {
  let component: SpinnerComponent;
  let fixture: ComponentFixture<SpinnerComponent>;
  const selectors: MockSelector[] = [
    {
      selector: selectLoadingCounter,
      value: 123,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpinnerComponent],
      providers: [provideMockStore({ selectors })],
    }).compileComponents();

    fixture = TestBed.createComponent(SpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render spinner', () => {
    const spinner = fixture.debugElement.query(
      By.css('.spinner-border')
    ).nativeElement;
    expect(spinner).toBeTruthy();
  });
});
