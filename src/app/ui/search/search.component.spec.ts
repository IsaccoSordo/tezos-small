import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { signal } from '@angular/core';
import { SearchComponent } from './search.component';
import { Store } from '../../store/tzkt.store';
import { SearchResult } from '../../models';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let router: Router;
  let mockStore: {
    searchSuggestions: ReturnType<typeof signal<SearchResult[]>>;
    searchAccounts: ReturnType<typeof vi.fn>;
    clearSearchSuggestions: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    mockStore = {
      searchSuggestions: signal<SearchResult[]>([]),
      searchAccounts: vi.fn(),
      clearSearchSuggestions: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [SearchComponent],
      providers: [provideRouter([]), { provide: Store, useValue: mockStore }],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSearch', () => {
    it('should clear suggestions when query is too short', () => {
      component.onSearch({ query: 'a', originalEvent: new Event('input') });

      expect(mockStore.clearSearchSuggestions).toHaveBeenCalled();
      expect(mockStore.searchAccounts).not.toHaveBeenCalled();
    });

    it('should trigger store search for valid query', () => {
      component.onSearch({
        query: 'plenty',
        originalEvent: new Event('input'),
      });

      expect(mockStore.searchAccounts).toHaveBeenCalledWith('plenty');
    });

    it('should trim query before searching', () => {
      component.onSearch({
        query: '  plenty  ',
        originalEvent: new Event('input'),
      });

      expect(mockStore.searchAccounts).toHaveBeenCalledWith('plenty');
    });
  });

  describe('onSelect', () => {
    it('should navigate to block details for block type', () => {
      const navigateSpy = vi.spyOn(router, 'navigate');

      component.onSelect({
        type: 'block',
        label: 'Block 12345',
        value: '12345',
      });

      expect(navigateSpy).toHaveBeenCalledWith(['/details', '12345']);
      expect(component.searchQuery).toBe('');
    });

    it('should navigate to account for account type', () => {
      const navigateSpy = vi.spyOn(router, 'navigate');

      component.onSelect({
        type: 'account',
        label: 'Test Account',
        value: 'tz1abc123',
      });

      expect(navigateSpy).toHaveBeenCalledWith(['/account', 'tz1abc123']);
      expect(component.searchQuery).toBe('');
    });

    it('should clear suggestions after selection', () => {
      component.onSelect({ type: 'account', label: 'test', value: 'test' });

      expect(mockStore.clearSearchSuggestions).toHaveBeenCalled();
    });
  });

  describe('onKeyDown', () => {
    it('should navigate to block when pressing Enter with numeric query', () => {
      const navigateSpy = vi.spyOn(router, 'navigate');
      component.searchQuery = '12345';

      component.onKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));

      expect(navigateSpy).toHaveBeenCalledWith(['/details', '12345']);
      expect(component.searchQuery).toBe('');
    });

    it('should navigate to account when pressing Enter with address query', () => {
      const navigateSpy = vi.spyOn(router, 'navigate');
      component.searchQuery = 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb';

      component.onKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));

      expect(navigateSpy).toHaveBeenCalledWith([
        '/account',
        'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
      ]);
      expect(component.searchQuery).toBe('');
    });

    it('should not navigate when pressing Enter with invalid query', () => {
      const navigateSpy = vi.spyOn(router, 'navigate');
      component.searchQuery = 'some text';

      component.onKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));

      expect(navigateSpy).not.toHaveBeenCalled();
    });

    it('should not navigate for non-Enter keys', () => {
      const navigateSpy = vi.spyOn(router, 'navigate');
      component.searchQuery = '12345';

      component.onKeyDown(new KeyboardEvent('keydown', { key: 'Tab' }));

      expect(navigateSpy).not.toHaveBeenCalled();
    });
  });

  describe('suggestions signal', () => {
    it('should read suggestions from store', () => {
      const testSuggestions: SearchResult[] = [
        { type: 'account', label: 'Test', value: 'tz1test' },
      ];
      mockStore.searchSuggestions.set(testSuggestions);

      expect(component.suggestions()).toEqual(testSuggestions);
    });
  });
});
