import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { OperationsTabComponent } from './operations-tab.component';
import { CursorDirection } from '../../../models';

describe('OperationsTabComponent', () => {
  let component: OperationsTabComponent;
  let fixture: ComponentFixture<OperationsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperationsTabComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(OperationsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('formatAmount', () => {
    it('should format amount from mutez to XTZ with symbol', () => {
      expect(component.formatAmount(1500000)).toBe('1.5 ꜩ');
    });

    it('should return 0 with symbol for undefined amount', () => {
      expect(component.formatAmount(undefined)).toBe('0 ꜩ');
    });

    it('should remove trailing zeroes', () => {
      expect(component.formatAmount(1000000)).toBe('1 ꜩ');
      expect(component.formatAmount(2000000000)).toBe('2000 ꜩ');
    });
  });

  describe('formatTimestamp', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-01-15T12:00:00Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return minutes ago for recent timestamps', () => {
      const timestamp = '2024-01-15T11:30:00Z';
      expect(component.formatTimestamp(timestamp)).toBe('30m ago');
    });

    it('should return hours ago for timestamps within 24 hours', () => {
      const timestamp = '2024-01-15T06:00:00Z';
      expect(component.formatTimestamp(timestamp)).toBe('6h ago');
    });

    it('should return days ago for timestamps within 7 days', () => {
      const timestamp = '2024-01-12T12:00:00Z';
      expect(component.formatTimestamp(timestamp)).toBe('3d ago');
    });

    it('should return formatted date for older timestamps', () => {
      const timestamp = '2024-01-01T12:00:00Z';
      const result = component.formatTimestamp(timestamp);
      expect(result).toContain('1');
      expect(result).toContain('2024');
    });
  });

  describe('truncateHash', () => {
    it('should truncate long hash', () => {
      const hash = 'ooabc123def456ghi789jkl012mno345pqr678stu901vwx234yz';
      const result = component.truncateHash(hash);
      // PREFIX_LENGTH=8, SUFFIX_LENGTH=6
      expect(result).toBe('ooabc123...x234yz');
    });

    it('should return dash for undefined hash', () => {
      expect(component.truncateHash(undefined)).toBe('-');
    });
  });

  describe('getTypeClass', () => {
    it('should return correct class for known types', () => {
      expect(component.getTypeClass('transaction')).toBe('type-transaction');
      expect(component.getTypeClass('origination')).toBe('type-origination');
      expect(component.getTypeClass('delegation')).toBe('type-delegation');
      expect(component.getTypeClass('reveal')).toBe('type-reveal');
    });

    it('should return default class for unknown types', () => {
      expect(component.getTypeClass('unknown')).toBe('type-default');
    });
  });

  describe('getStatusClass', () => {
    it('should return correct class for known statuses', () => {
      expect(component.getStatusClass('applied')).toBe('status-applied');
      expect(component.getStatusClass('failed')).toBe('status-failed');
      expect(component.getStatusClass('backtracked')).toBe(
        'status-backtracked'
      );
    });

    it('should return empty string for undefined status', () => {
      expect(component.getStatusClass(undefined)).toBe('');
    });

    it('should return empty string for unknown status', () => {
      expect(component.getStatusClass('unknown')).toBe('');
    });
  });

  describe('navigate', () => {
    it('should emit navigate event with direction', () => {
      let emittedDirection: CursorDirection | undefined;
      component.navigate.subscribe((direction) => {
        emittedDirection = direction;
      });

      component.onNavigate('next');
      expect(emittedDirection).toBe('next');

      component.onNavigate('prev');
      expect(emittedDirection).toBe('prev');

      component.onNavigate('first');
      expect(emittedDirection).toBe('first');
    });
  });

  describe('hasData', () => {
    it('should return false when operations is empty', () => {
      fixture.componentRef.setInput('operations', []);
      fixture.detectChanges();
      expect(component.hasData()).toBe(false);
    });

    it('should return true when operations has items', () => {
      fixture.componentRef.setInput('operations', [{ id: 1 }]);
      fixture.detectChanges();
      expect(component.hasData()).toBe(true);
    });
  });
});
