import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableComponent, PageChangeEvent } from './table.component';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
  });

  describe('initialization', () => {
    it('should create', () => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

    it('should have default values for all inputs', () => {
      expect(component.data()).toEqual([]);
      expect(component.columns()).toEqual([]);
      expect(component.totalRecords()).toBe(0);
      expect(component.rows()).toBe(10);
      expect(component.paginator()).toBe(false);
      expect(component.scrollable()).toBe(true);
      expect(component.scrollHeight()).toBe('600px');
    });
  });

  describe('input signals', () => {
    it('should accept and update input values', () => {
      const columns = [
        { field: 'name', header: 'Name' },
        { field: 'age', header: 'Age' },
        { field: 'email', header: 'Email' },
      ];
      const data = [
        { name: 'John', age: 30, email: 'john@example.com' },
        { name: 'Jane', age: 25, email: 'jane@example.com' },
      ];

      fixture.componentRef.setInput('columns', columns);
      fixture.componentRef.setInput('data', data);
      fixture.componentRef.setInput('totalRecords', 500);
      fixture.componentRef.setInput('rows', 25);
      fixture.componentRef.setInput('paginator', true);
      fixture.componentRef.setInput('scrollable', false);
      fixture.detectChanges();

      expect(component.columns()).toEqual(columns);
      expect(component.data()).toEqual(data);
      expect(component.totalRecords()).toBe(500);
      expect(component.rows()).toBe(25);
      expect(component.paginator()).toBe(true);
      expect(component.scrollable()).toBe(false);
    });
  });

  describe('page change event', () => {
    it('should emit pageChange event when user changes page', () => {
      let emittedEvent: PageChangeEvent | undefined;

      // Subscribe to the output
      component.pageChange.subscribe((event) => {
        emittedEvent = event;
      });

      // Simulate PrimeNG lazy load event (has 'first' instead of 'page')
      // first = page * rows, so for page 2 with 25 rows: first = 50
      const primeNgLazyEvent = { first: 50, rows: 25 };
      component.onPageChange(primeNgLazyEvent);

      expect(emittedEvent).toEqual({ page: 2, pageSize: 25 });
    });

    it('should emit correct page size when rows change', () => {
      let emittedEvent: PageChangeEvent | undefined;

      component.pageChange.subscribe((event) => {
        emittedEvent = event;
      });

      // first = 0 means page 0
      const primeNgLazyEvent = { first: 0, rows: 50 };
      component.onPageChange(primeNgLazyEvent);

      expect(emittedEvent).toEqual({ page: 0, pageSize: 50 });
    });

    it('should handle first page correctly', () => {
      let emittedEvent: PageChangeEvent | undefined;

      component.pageChange.subscribe((event) => {
        emittedEvent = event;
      });

      const primeNgLazyEvent = { first: 0, rows: 10 };
      component.onPageChange(primeNgLazyEvent);

      expect(emittedEvent).toEqual({ page: 0, pageSize: 10 });
    });
  });
});
