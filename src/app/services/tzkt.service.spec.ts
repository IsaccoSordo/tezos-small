import { TestBed } from '@angular/core/testing';

import { TzktService } from './tzkt.service';
import { of } from 'rxjs';
import { Block } from '../common';

describe('TzktService', () => {
  let service: TzktService;
  const httpSpy = jasmine.createSpyObj('http', ['get']);
  const errorSpy = jasmine.createSpyObj('error', ['handleError']);

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TzktService);
    httpSpy.get.and.returnValue(of());
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should run getBlocksCount', () => {
    service.getBlocksCount();
  });

  it('should run getBlocks', () => {
    service.getBlocks(0, 0);
  });

  it('should run getTransactionsCount', () => {
    service.getTransactionsCount({} as Block);
  });

  it('should run getTransactions', () => {
    service.getTransactions(0);
  });
});
