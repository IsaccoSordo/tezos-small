import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockSelector, provideMockStore } from '@ngrx/store/testing';
import { DetailsComponent } from './details.component';
import { ActivatedRoute } from '@angular/router';
import { selectTransactions } from '../store/tzkt.selectors';

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;
  const activatedRouteSpy = {
    snapshot: { paramMap: { get: (param: string) => '1' } },
  } as ActivatedRoute;
  const selectors: MockSelector[] = [
    {
      selector: selectTransactions,
      value: [{ sender: {}, target: {}, amount: 123 }],
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailsComponent],
      providers: [
        provideMockStore({ selectors }),
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should run ngOnInit', (done) => {
    component.ngOnInit();
    component.transactions$.subscribe((data) => {
      expect(data).toHaveSize(1);
      expect(data[0].amount).toEqual(123);
      done();
    });
  });
});
