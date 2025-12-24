/**
 * URL parsing utilities for route-driven state management.
 * Shared across signal store features.
 */

export type RouteType = 'overview' | 'details' | 'other';

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
  if (url.startsWith('/details/')) return 'details';
  return 'other';
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
