import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { TokensTabComponent } from './tokens-tab.component';
import { Store } from '../../../store/tzkt.store';
import { TokenBalance } from '../../../models';

describe('TokensTabComponent', () => {
  let component: TokensTabComponent;
  let fixture: ComponentFixture<TokensTabComponent>;
  let router: Router;

  const mockTokenWithMetadata: TokenBalance = {
    id: 1,
    account: { address: 'tz1test' },
    balance: '1500000000',
    transfersCount: 10,
    firstLevel: 1000,
    firstTime: '2024-01-01T00:00:00Z',
    lastLevel: 2000,
    lastTime: '2024-06-01T00:00:00Z',
    token: {
      id: 1,
      contract: { address: 'KT1abc123' },
      tokenId: '0',
      standard: 'fa2',
      metadata: {
        name: 'Test Token',
        symbol: 'TST',
        decimals: '6',
      },
    },
  };

  const mockTokenWithoutMetadata: TokenBalance = {
    id: 2,
    account: { address: 'tz1test' },
    balance: '100',
    transfersCount: 5,
    firstLevel: 1000,
    firstTime: '2024-01-01T00:00:00Z',
    lastLevel: 2000,
    lastTime: '2024-06-01T00:00:00Z',
    token: {
      id: 2,
      contract: { address: 'KT1xyz789' },
      tokenId: '1',
      standard: 'fa1.2',
    },
  };

  beforeEach(async () => {
    const mockStore = {
      tokenBalances: signal([]),
      tokenBalancesCount: signal(0),
    };

    await TestBed.configureTestingModule({
      imports: [TokensTabComponent],
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

    fixture = TestBed.createComponent(TokensTabComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getTokenName', () => {
    it('should return token name from metadata', () => {
      expect(component.getTokenName(mockTokenWithMetadata)).toBe('Test Token');
    });

    it('should return Unknown Token when no metadata', () => {
      expect(component.getTokenName(mockTokenWithoutMetadata)).toBe(
        'Unknown Token'
      );
    });
  });

  describe('getTokenSymbol', () => {
    it('should return token symbol from metadata', () => {
      expect(component.getTokenSymbol(mockTokenWithMetadata)).toBe('TST');
    });

    it('should return empty string when no metadata', () => {
      expect(component.getTokenSymbol(mockTokenWithoutMetadata)).toBe('');
    });
  });

  describe('formatBalance', () => {
    it('should format balance with decimals', () => {
      expect(component.formatBalance(mockTokenWithMetadata)).toBe('1500');
    });

    it('should return raw balance when decimals is 0', () => {
      expect(component.formatBalance(mockTokenWithoutMetadata)).toBe('100');
    });

    it('should handle fractional balances', () => {
      const tokenWithFraction: TokenBalance = {
        ...mockTokenWithMetadata,
        balance: '1500500000',
        token: {
          ...mockTokenWithMetadata.token,
          metadata: { decimals: '6' },
        },
      };
      expect(component.formatBalance(tokenWithFraction)).toBe('1500.5');
    });

    it('should remove trailing zeroes from decimal part', () => {
      const tokenWithTrailingZeroes: TokenBalance = {
        ...mockTokenWithMetadata,
        balance: '1500100000',
        token: {
          ...mockTokenWithMetadata.token,
          metadata: { decimals: '6' },
        },
      };
      expect(component.formatBalance(tokenWithTrailingZeroes)).toBe('1500.1');
    });
  });

  describe('truncateAddress', () => {
    it('should truncate address correctly', () => {
      const address = 'KT1Xobej4mc6XgEjDoJoHtTKgbD1ELMvcQuL';
      const result = component.truncateAddress(address);
      expect(result).toBe('KT1Xobej...MvcQuL');
    });
  });

  describe('onPageChange', () => {
    it('should navigate with page params', () => {
      const navigateSpy = vi.spyOn(router, 'navigate');

      component.onPageChange({ page: 2, pageSize: 25 });

      expect(navigateSpy).toHaveBeenCalledWith([], {
        relativeTo: expect.anything(),
        queryParams: { page: 2, pageSize: 25 },
        queryParamsHandling: 'merge',
      });
    });
  });
});
