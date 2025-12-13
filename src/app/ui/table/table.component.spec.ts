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

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have default values for inputs', () => {
    expect(component.headers()).toEqual([]);
    expect(component.show()).toBe(false);
    expect(component.count()).toBe(100);
    expect(component.pageSize()).toBe(10);
    expect(component.maxSize()).toBe(10);
    expect(component.paginator()).toBe(false);
  });

  it('should have page signal initialized to 1', () => {
    expect(component.page()).toBe(1);
  });

  it('should create snapshot with current values', () => {
    fixture.componentRef.setInput('count', 200);
    fixture.componentRef.setInput('pageSize', 20);
    fixture.detectChanges();

    const snapshot = component['getSnapshot']();
    expect(snapshot.count).toBe(200);
    expect(snapshot.page).toBe(1);
    expect(snapshot.pageSize).toBe(20);
  });

  it('should emit refresh event when refreshView is called', (done) => {
    fixture.componentRef.setInput('count', 150);
    fixture.componentRef.setInput('pageSize', 15);
    component.page.set(3);
    fixture.detectChanges();

    component.refresh.subscribe(data => {
      expect(data.count).toBe(150);
      expect(data.page).toBe(3);
      expect(data.pageSize).toBe(15);
      done();
    });

    component.refreshView();
  });

  it('should update page signal', () => {
    expect(component.page()).toBe(1);

    component.page.set(5);

    expect(component.page()).toBe(5);
  });

  it('should accept custom headers input', () => {
    const headers = ['Name', 'Age', 'Email'];
    fixture.componentRef.setInput('headers', headers);
    fixture.detectChanges();

    expect(component.headers()).toEqual(headers);
  });

  it('should accept show input', () => {
    fixture.componentRef.setInput('show', true);
    fixture.detectChanges();

    expect(component.show()).toBe(true);
  });

  it('should accept count input', () => {
    fixture.componentRef.setInput('count', 500);
    fixture.detectChanges();

    expect(component.count()).toBe(500);
  });

  it('should accept pageSize input', () => {
    fixture.componentRef.setInput('pageSize', 25);
    fixture.detectChanges();

    expect(component.pageSize()).toBe(25);
  });

  it('should accept paginator input', () => {
    fixture.componentRef.setInput('paginator', true);
    fixture.detectChanges();

    expect(component.paginator()).toBe(true);
  });

  it('should have BehaviorSubject refresh output', () => {
    expect(component.refresh).toBeDefined();
    expect(component.refresh.subscribe).toBeDefined();
  });

  it('should emit initial value on refresh subscription', (done) => {
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

  it('should update snapshot when page changes', (done) => {
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
