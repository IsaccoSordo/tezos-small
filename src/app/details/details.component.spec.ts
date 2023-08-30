import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsComponent } from './details.component';
import { ActivatedRoute } from '@angular/router';
import { TableComponent } from '../ui/table/table.component';

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;
  const activatedRouteSpy = {
    snapshot: { paramMap: { get: (param: string) => '1' } },
  } as ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailsComponent, TableComponent],
      providers: [{ provide: ActivatedRoute, useValue: activatedRouteSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should run ngOnInit', () => {
    component.ngOnInit();
  });
});
