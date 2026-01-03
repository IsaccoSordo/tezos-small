export type RouteType = 'overview' | 'details' | 'account' | 'other';

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
  return address.startsWith('KT1');
};

export const isUserAddress = (address: string): boolean => {
  return /^tz[123]/.test(address);
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
  return params.get('tab') ?? 'operations';
};

export const getPaginationParams = (url: string) => {
  const { params } = parseUrl(url);
  return {
    pageSize: +(params.get('pageSize') ?? 10),
    page: +(params.get('page') ?? 0),
  };
};

export const getDetailsLevel = (url: string): number | null => {
  const match = url.match(/\/details\/(\d+)/);
  return match ? +match[1] : null;
};
