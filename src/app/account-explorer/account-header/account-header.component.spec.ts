import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AccountHeaderComponent } from './account-header.component';
import { AccountInfo, ContractInfo } from '../../models';

describe('AccountHeaderComponent', () => {
  let component: AccountHeaderComponent;
  let fixture: ComponentFixture<AccountHeaderComponent>;

  const mockAccountInfo: AccountInfo = {
    id: 1,
    type: 'user',
    address: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
    balance: 1500000,
    counter: 100,
    firstActivity: 1000,
    firstActivityTime: '2024-01-01T00:00:00Z',
    lastActivity: 2000,
    lastActivityTime: '2024-06-01T00:00:00Z',
    numContracts: 0,
    activeTokensCount: 1,
    tokenBalancesCount: 2,
    tokenTransfersCount: 10,
    activeTicketsCount: 0,
    ticketBalancesCount: 0,
    ticketTransfersCount: 0,
    numDelegations: 1,
    numOriginations: 0,
    numTransactions: 10,
  };

  const mockContractInfo: ContractInfo = {
    id: 2,
    type: 'contract',
    address: 'KT1Xobej4mc6XgEjDoJoHtTKgbD1ELMvcQuL',
    balance: 2500000000,
    counter: 0,
    firstActivity: 500,
    firstActivityTime: '2023-06-15T12:00:00Z',
    lastActivity: 3000,
    lastActivityTime: '2024-06-01T00:00:00Z',
    numContracts: 0,
    activeTokensCount: 5,
    tokenBalancesCount: 10,
    tokenTransfersCount: 500,
    activeTicketsCount: 0,
    ticketBalancesCount: 0,
    ticketTransfersCount: 0,
    numDelegations: 0,
    numOriginations: 1,
    numTransactions: 100,
    creator: { address: 'tz1creator', alias: 'Creator' },
    tzips: ['fa2', 'fa1.2'],
    kind: 'asset',
    tokensCount: 1,
    codeHash: 123456,
    typeHash: 789012,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountHeaderComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountHeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('balanceXTZ', () => {
    it('should return 0 when account is null', () => {
      fixture.detectChanges();
      expect(component.balanceXTZ()).toBe('0');
    });

    it('should convert balance from mutez to XTZ', () => {
      fixture.componentRef.setInput('account', mockAccountInfo);
      fixture.detectChanges();
      expect(component.balanceXTZ()).toBe('1.5');
    });

    it('should format balance without trailing zeroes', () => {
      fixture.componentRef.setInput('account', {
        ...mockAccountInfo,
        balance: 1000000,
      });
      fixture.detectChanges();
      expect(component.balanceXTZ()).toBe('1');
    });

    it('should handle large balances', () => {
      fixture.componentRef.setInput('account', mockContractInfo);
      fixture.detectChanges();
      expect(component.balanceXTZ()).toBe('2500');
    });
  });

  describe('contractCreator', () => {
    it('should return null for user accounts', () => {
      fixture.componentRef.setInput('account', mockAccountInfo);
      fixture.componentRef.setInput('isContract', false);
      fixture.detectChanges();
      expect(component.contractCreator()).toBeNull();
    });

    it('should return creator for contracts', () => {
      fixture.componentRef.setInput('account', mockContractInfo);
      fixture.componentRef.setInput('isContract', true);
      fixture.detectChanges();
      expect(component.contractCreator()).toEqual({
        address: 'tz1creator',
        alias: 'Creator',
      });
    });
  });

  describe('tzips', () => {
    it('should return empty array for user accounts', () => {
      fixture.componentRef.setInput('account', mockAccountInfo);
      fixture.componentRef.setInput('isContract', false);
      fixture.detectChanges();
      expect(component.tzips()).toEqual([]);
    });

    it('should return tzips for contracts', () => {
      fixture.componentRef.setInput('account', mockContractInfo);
      fixture.componentRef.setInput('isContract', true);
      fixture.detectChanges();
      expect(component.tzips()).toEqual(['fa2', 'fa1.2']);
    });
  });

  describe('contractKind', () => {
    it('should return null for user accounts', () => {
      fixture.componentRef.setInput('account', mockAccountInfo);
      fixture.componentRef.setInput('isContract', false);
      fixture.detectChanges();
      expect(component.contractKind()).toBeNull();
    });

    it('should return kind for contracts', () => {
      fixture.componentRef.setInput('account', mockContractInfo);
      fixture.componentRef.setInput('isContract', true);
      fixture.detectChanges();
      expect(component.contractKind()).toBe('asset');
    });
  });

  describe('copyAddress', () => {
    it('should copy address to clipboard', () => {
      const writeTextSpy = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: { writeText: writeTextSpy },
      });

      fixture.componentRef.setInput('account', mockAccountInfo);
      fixture.detectChanges();
      component.copyAddress();

      expect(writeTextSpy).toHaveBeenCalledWith(mockAccountInfo.address);
    });

    it('should not copy when account is null', () => {
      const writeTextSpy = vi.fn();
      Object.assign(navigator, {
        clipboard: { writeText: writeTextSpy },
      });

      fixture.detectChanges();
      component.copyAddress();

      expect(writeTextSpy).not.toHaveBeenCalled();
    });
  });

  describe('formatDate', () => {
    it('should format date string', () => {
      const result = component.formatDate('2024-01-15T10:30:00Z');
      expect(result).toContain('Jan');
      expect(result).toContain('15');
      expect(result).toContain('2024');
    });
  });
});
