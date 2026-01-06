import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { EventsTabComponent } from './events-tab.component';
import { Store } from '../../../store/tzkt.store';

describe('EventsTabComponent', () => {
  let component: EventsTabComponent;
  let fixture: ComponentFixture<EventsTabComponent>;
  let router: Router;

  beforeEach(async () => {
    const mockStore = {
      contractEvents: signal([]),
      contractEventsCount: signal(0),
    };

    await TestBed.configureTestingModule({
      imports: [EventsTabComponent],
      providers: [
        provideRouter([]),
        { provide: Store, useValue: mockStore },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            queryParams: of({}),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EventsTabComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('formatTimestamp', () => {
    it('should format timestamp correctly', () => {
      const result = component.formatTimestamp('2024-01-15T10:30:00Z');
      expect(result).toContain('Jan');
      expect(result).toContain('15');
      expect(result).toContain('2024');
    });
  });

  describe('formatPayload', () => {
    it('should return dash for null payload', () => {
      expect(component.formatPayload(null)).toBe('-');
    });

    it('should return dash for undefined payload', () => {
      expect(component.formatPayload(undefined)).toBe('-');
    });

    it('should stringify object payload', () => {
      const payload = { key: 'value', num: 123 };
      const result = component.formatPayload(payload);
      expect(result).toContain('"key": "value"');
      expect(result).toContain('"num": 123');
    });

    it('should stringify array payload', () => {
      const payload = [1, 2, 3];
      const result = component.formatPayload(payload);
      expect(result).toBe('[\n  1,\n  2,\n  3\n]');
    });
  });

  describe('toggleEvent', () => {
    it('should add event to expanded set', () => {
      expect(component.isExpanded(1)).toBe(false);
      component.toggleEvent(1);
      expect(component.isExpanded(1)).toBe(true);
    });

    it('should remove event from expanded set when toggled again', () => {
      component.toggleEvent(1);
      expect(component.isExpanded(1)).toBe(true);
      component.toggleEvent(1);
      expect(component.isExpanded(1)).toBe(false);
    });

    it('should handle multiple events independently', () => {
      component.toggleEvent(1);
      component.toggleEvent(2);
      expect(component.isExpanded(1)).toBe(true);
      expect(component.isExpanded(2)).toBe(true);

      component.toggleEvent(1);
      expect(component.isExpanded(1)).toBe(false);
      expect(component.isExpanded(2)).toBe(true);
    });
  });

  describe('hasPayload', () => {
    it('should return false for null', () => {
      expect(component.hasPayload(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(component.hasPayload(undefined)).toBe(false);
    });

    it('should return true for objects', () => {
      expect(component.hasPayload({ key: 'value' })).toBe(true);
    });

    it('should return true for empty objects', () => {
      expect(component.hasPayload({})).toBe(true);
    });

    it('should return true for arrays', () => {
      expect(component.hasPayload([])).toBe(true);
    });

    it('should return true for strings', () => {
      expect(component.hasPayload('test')).toBe(true);
    });

    it('should return true for numbers', () => {
      expect(component.hasPayload(0)).toBe(true);
    });
  });

  describe('onPageChange', () => {
    it('should navigate with page params', () => {
      const navigateSpy = vi.spyOn(router, 'navigate');

      component.onPageChange({ page: 3, pageSize: 15 });

      expect(navigateSpy).toHaveBeenCalledWith([], {
        relativeTo: expect.anything(),
        queryParams: { page: 3, pageSize: 15 },
        queryParamsHandling: 'merge',
      });
    });
  });
});
