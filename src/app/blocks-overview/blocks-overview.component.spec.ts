import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockSelector, provideMockStore } from '@ngrx/store/testing';
import { BlocksOverviewComponent } from './blocks-overview.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { selectBlocks, selectBlocksCount } from '../store/tzkt.selectors';
import { RouterTestingModule } from '@angular/router/testing';
import { TableComponent } from '../ui/table/table.component';

describe('BlocksOverviewComponent', () => {
  let component: BlocksOverviewComponent;
  let fixture: ComponentFixture<BlocksOverviewComponent>;
  const selectors: MockSelector[] = [
    {
      selector: selectBlocks,
      value: [{ level: 123 }],
    },
    {
      selector: selectBlocksCount,
      value: 123,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgbModule, RouterTestingModule.withRoutes([])],
      declarations: [BlocksOverviewComponent, TableComponent],
      providers: [provideMockStore({ selectors })],
    }).compileComponents();

    fixture = TestBed.createComponent(BlocksOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should run ngOnInit', (done) => {
    component.ngOnInit();
    component.blocks$.subscribe((data) => {
      expect(data).toHaveSize(1);
      expect(data[0].level).toEqual(123);
      done();
    });
    component.count$.subscribe((data) => {
      expect(data).toEqual(123);
    });
  });
});
