import { TEZOS, PAGINATION, DEFAULT_TAB } from '../../config/constants';
import { RouteType } from '../../models';

const parseUrl = (url: string) => {
  const urlObj = new URL(url, 'http://localhost');
  return {
    pathname: urlObj.pathname,
    params: urlObj.searchParams,
  };
};

export const getRouteType = (url: string): RouteType => {
  const { pathname } = parseUrl(url);
  if (pathname === '/' || pathname === '') return 'overview';
  if (pathname.startsWith('/details/')) return 'details';
  if (pathname.startsWith('/account/')) return 'account';
  return 'other';
};

export const isContractAddress = (address: string): boolean => {
  return address.startsWith(TEZOS.CONTRACT_PREFIX);
};

export const isUserAddress = (address: string): boolean => {
  return TEZOS.USER_ADDRESS_PATTERN.test(address);
};

export const getAddressType = (address: string): 'user' | 'contract' | null => {
  if (isContractAddress(address)) return 'contract';
  if (isUserAddress(address)) return 'user';
  return null;
};

export const getAccountAddress = (url: string): string | null => {
  const match = url.match(/\/account\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
};

export const getAccountTab = (url: string): string => {
  const { params } = parseUrl(url);
  return params.get('tab') ?? DEFAULT_TAB;
};

export const getPaginationParams = (url: string) => {
  const { params } = parseUrl(url);
  return {
    pageSize: +(params.get('pageSize') ?? PAGINATION.DEFAULT_PAGE_SIZE),
    page: +(params.get('page') ?? PAGINATION.DEFAULT_PAGE),
  };
};

export const getDetailsLevel = (url: string): number | null => {
  const match = url.match(/\/details\/(\d+)/);
  return match ? +match[1] : null;
};
