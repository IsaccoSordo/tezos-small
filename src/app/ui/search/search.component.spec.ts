import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { SearchComponent } from './search.component';
import { SearchService } from '../../services/search.service';
import { AccountSuggestion } from '../../models';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let router: Router;
  let searchService: SearchService;

  const mockSuggestions: AccountSuggestion[] = [
    { alias: 'Plenty DEX', address: 'KT1PlentyAddress123456789012345678901' },
    { alias: 'Quipuswap', address: 'KT1QuipuAddress1234567890123456789012' },
  ];

  beforeEach(async () => {
    vi.useFakeTimers();

    await TestBed.configureTestingModule({
      imports: [SearchComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    searchService = TestBed.inject(SearchService);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSearch', () => {
    it('should clear suggestions when query is too short', () => {
      component.suggestions.set([
        { type: 'account', label: 'test', value: 'test' },
      ]);

      component.onSearch({ query: 'a', originalEvent: new Event('input') });

      expect(component.suggestions()).toEqual([]);
    });

    it('should trigger search for valid query', () => {
      vi.spyOn(searchService, 'suggestAccounts').mockReturnValue(
        of(mockSuggestions)
      );

      component.onSearch({
        query: 'plenty',
        originalEvent: new Event('input'),
      });
      vi.advanceTimersByTime(350);

      expect(searchService.suggestAccounts).toHaveBeenCalledWith('plenty');
    });

    it('should add block suggestion for numeric query', () => {
      vi.spyOn(searchService, 'suggestAccounts').mockReturnValue(of([]));

      component.onSearch({ query: '12345', originalEvent: new Event('input') });
      vi.advanceTimersByTime(350);

      const suggestions = component.suggestions();
      expect(
        suggestions.some((s) => s.type === 'block' && s.value === '12345')
      ).toBe(true);
    });

    it('should add address suggestion for valid address query', () => {
      const address = 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb';

      component.onSearch({ query: address, originalEvent: new Event('input') });
      vi.advanceTimersByTime(350);

      const suggestions = component.suggestions();
      expect(
        suggestions.some((s) => s.type === 'account' && s.value === address)
      ).toBe(true);
    });

    it('should handle API errors gracefully', () => {
      vi.spyOn(searchService, 'suggestAccounts').mockReturnValue(
        throwError(() => new Error('API Error'))
      );

      component.onSearch({ query: 'error', originalEvent: new Event('input') });
      vi.advanceTimersByTime(350);

      expect(component.suggestions()).toEqual([]);
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
      component.suggestions.set([
        { type: 'account', label: 'test', value: 'test' },
      ]);

      component.onSelect({ type: 'account', label: 'test', value: 'test' });

      expect(component.suggestions()).toEqual([]);
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

  describe('address validation', () => {
    it('should recognize tz1 addresses', () => {
      const address = 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb';

      component.onSearch({ query: address, originalEvent: new Event('input') });
      vi.advanceTimersByTime(350);

      expect(component.suggestions().some((s) => s.type === 'account')).toBe(
        true
      );
    });

    it('should recognize tz2 addresses', () => {
      const address = 'tz2BFTyPeYRzxd5aiBchbXN3WCZhx7BqbMBq';

      component.onSearch({ query: address, originalEvent: new Event('input') });
      vi.advanceTimersByTime(350);

      expect(component.suggestions().some((s) => s.type === 'account')).toBe(
        true
      );
    });

    it('should recognize tz3 addresses', () => {
      const address = 'tz3RDC3Jdn4j15J7bBHZd29EUee9gVB1CxD9';

      component.onSearch({ query: address, originalEvent: new Event('input') });
      vi.advanceTimersByTime(350);

      expect(component.suggestions().some((s) => s.type === 'account')).toBe(
        true
      );
    });

    it('should recognize KT1 addresses', () => {
      const address = 'KT1Xobej4mc6XgEjDoJoHtTKgbD1ELMvcQuL';

      component.onSearch({ query: address, originalEvent: new Event('input') });
      vi.advanceTimersByTime(350);

      expect(component.suggestions().some((s) => s.type === 'account')).toBe(
        true
      );
    });
  });
});
