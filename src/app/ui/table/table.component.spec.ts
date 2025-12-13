import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableComponent } from './table.component';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    // Reset component state
    component.page.set(1);
  });

  describe('initialization', () => {
    it('should create', () => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

    it('should have default values for all inputs', () => {
      expect(component.headers()).toEqual([]);
      expect(component.show()).toBe(false);
      expect(component.count()).toBe(100);
      expect(component.pageSize()).toBe(10);
      expect(component.maxSize()).toBe(10);
      expect(component.paginator()).toBe(false);
      expect(component.page()).toBe(1);
    });

    it('should initialize BehaviorSubject refresh output', () => {
      expect(component.refresh).toBeDefined();
      expect(component.refresh.subscribe).toBeDefined();
    });
  });

  describe('input signals', () => {
    it('should accept and update input values', () => {
      const headers = ['Name', 'Age', 'Email'];

      fixture.componentRef.setInput('headers', headers);
      fixture.componentRef.setInput('show', true);
      fixture.componentRef.setInput('count', 500);
      fixture.componentRef.setInput('pageSize', 25);
      fixture.componentRef.setInput('paginator', true);
      fixture.detectChanges();

      expect(component.headers()).toEqual(headers);
      expect(component.show()).toBe(true);
      expect(component.count()).toBe(500);
      expect(component.pageSize()).toBe(25);
      expect(component.paginator()).toBe(true);
    });
  });

  describe('page signal', () => {
    it('should update page signal value', () => {
      expect(component.page()).toBe(1);

      component.page.set(5);

      expect(component.page()).toBe(5);
    });
  });

  describe('snapshot creation', () => {
    it('should create snapshot with current signal values', () => {
      fixture.componentRef.setInput('count', 200);
      fixture.componentRef.setInput('pageSize', 20);
      component.page.set(3);
      fixture.detectChanges();

      const snapshot = component['getSnapshot']();

      expect(snapshot.count).toBe(200);
      expect(snapshot.page).toBe(3);
      expect(snapshot.pageSize).toBe(20);
    });
  });

  describe('refresh event emission', () => {
    it('should emit initial value on subscription', (done) => {
      fixture.componentRef.setInput('count', 100);
      fixture.componentRef.setInput('pageSize', 10);
      fixture.detectChanges();

      component.refresh.subscribe(data => {
        expect(data.count).toBe(100);
        expect(data.page).toBe(1);
        expect(data.pageSize).toBe(10);
        done();
      });
    });

    it('should emit updated snapshot when refreshView is called', (done) => {
      fixture.componentRef.setInput('count', 150);
      fixture.componentRef.setInput('pageSize', 15);
      component.page.set(3);
      fixture.detectChanges();

      let emissionCount = 0;
      component.refresh.subscribe(data => {
        emissionCount++;
        // Skip the initial emission from BehaviorSubject
        if (emissionCount === 2) {
          expect(data.count).toBe(150);
          expect(data.page).toBe(3);
          expect(data.pageSize).toBe(15);
          done();
        }
      });

      component.refreshView();
    });

    it('should emit current page value when page changes and refreshView is called', (done) => {
      fixture.detectChanges();

      component.page.set(2);
      component.refreshView();

      component.refresh.subscribe(data => {
        if (data.page === 2) {
          expect(data.page).toBe(2);
          done();
        }
      });
    });
  });
});
