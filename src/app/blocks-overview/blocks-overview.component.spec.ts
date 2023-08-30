import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlocksOverviewComponent } from './blocks-overview.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import { TableComponent } from '../ui/table/table.component';

describe('BlocksOverviewComponent', () => {
  let component: BlocksOverviewComponent;
  let fixture: ComponentFixture<BlocksOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgbModule, RouterTestingModule.withRoutes([])],
      declarations: [BlocksOverviewComponent, TableComponent],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(BlocksOverviewComponent);
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
