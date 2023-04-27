import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlocksOverviewComponent } from './blocks-overview.component';

describe('BlocksOverviewComponent', () => {
  let component: BlocksOverviewComponent;
  let fixture: ComponentFixture<BlocksOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlocksOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlocksOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
