import {
  getRouteType,
  isContractAddress,
  isUserAddress,
  getAddressType,
  getAccountAddress,
  getAccountTab,
  getPaginationParams,
  getDetailsLevel,
} from './url-utils';

describe('url-utils', () => {
  describe('getRouteType', () => {
    it('should return overview for root path', () => {
      expect(getRouteType('/')).toBe('overview');
      expect(getRouteType('')).toBe('overview');
    });

    it('should return details for details path', () => {
      expect(getRouteType('/details/12345')).toBe('details');
      expect(getRouteType('/details/999')).toBe('details');
    });

    it('should return account for account path', () => {
      expect(getRouteType('/account/tz1abc123')).toBe('account');
      expect(getRouteType('/account/KT1xyz789')).toBe('account');
    });

    it('should return other for unknown paths', () => {
      expect(getRouteType('/login')).toBe('other');
      expect(getRouteType('/unknown/path')).toBe('other');
    });
  });

  describe('isContractAddress', () => {
    it('should return true for contract addresses', () => {
      expect(isContractAddress('KT1abc123')).toBe(true);
      expect(isContractAddress('KT1Xobej4mc6XgEjDoJoHtTKgbD1ELMvcQuL')).toBe(
        true
      );
    });

    it('should return false for user addresses', () => {
      expect(isContractAddress('tz1abc123')).toBe(false);
      expect(isContractAddress('tz2xyz789')).toBe(false);
    });
  });

  describe('isUserAddress', () => {
    it('should return true for user addresses', () => {
      expect(isUserAddress('tz1abc123')).toBe(true);
      expect(isUserAddress('tz2xyz789')).toBe(true);
      expect(isUserAddress('tz3def456')).toBe(true);
    });

    it('should return false for contract addresses', () => {
      expect(isUserAddress('KT1abc123')).toBe(false);
    });
  });

  describe('getAddressType', () => {
    it('should return contract for KT1 addresses', () => {
      expect(getAddressType('KT1abc123')).toBe('contract');
    });

    it('should return user for tz addresses', () => {
      expect(getAddressType('tz1abc123')).toBe('user');
      expect(getAddressType('tz2xyz789')).toBe('user');
    });

    it('should return null for invalid addresses', () => {
      expect(getAddressType('invalid')).toBe(null);
      expect(getAddressType('abc123')).toBe(null);
    });
  });

  describe('getAccountAddress', () => {
    it('should extract address from account URL', () => {
      expect(getAccountAddress('/account/tz1abc123')).toBe('tz1abc123');
      expect(getAccountAddress('/account/KT1xyz789?tab=storage')).toBe(
        'KT1xyz789'
      );
    });

    it('should return null for non-account URLs', () => {
      expect(getAccountAddress('/details/123')).toBe(null);
      expect(getAccountAddress('/')).toBe(null);
    });
  });

  describe('getAccountTab', () => {
    it('should return tab from query params', () => {
      expect(getAccountTab('/account/tz1abc?tab=storage')).toBe('storage');
      expect(getAccountTab('/account/KT1xyz?tab=code')).toBe('code');
    });

    it('should return default tab when not specified', () => {
      expect(getAccountTab('/account/tz1abc')).toBe('operations');
      expect(getAccountTab('/account/KT1xyz?page=1')).toBe('operations');
    });
  });

  describe('getPaginationParams', () => {
    it('should extract pagination params from URL', () => {
      expect(getPaginationParams('/?page=2&pageSize=20')).toEqual({
        page: 2,
        pageSize: 20,
      });
    });

    it('should return defaults when params missing', () => {
      expect(getPaginationParams('/')).toEqual({
        page: 0,
        pageSize: 10,
      });
    });

    it('should handle partial params', () => {
      expect(getPaginationParams('/?page=5')).toEqual({
        page: 5,
        pageSize: 10,
      });
      expect(getPaginationParams('/?pageSize=25')).toEqual({
        page: 0,
        pageSize: 25,
      });
    });
  });

  describe('getDetailsLevel', () => {
    it('should extract level from details URL', () => {
      expect(getDetailsLevel('/details/12345')).toBe(12345);
      expect(getDetailsLevel('/details/999')).toBe(999);
    });

    it('should return null for non-details URLs', () => {
      expect(getDetailsLevel('/account/tz1abc')).toBe(null);
      expect(getDetailsLevel('/')).toBe(null);
    });
  });
});
