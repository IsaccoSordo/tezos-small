import { TestBed } from '@angular/core/testing';

import { TzktService } from './tzkt.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('TzktService', () => {
  let service: TzktService;
  const httpSpy = jasmine.createSpyObj('http', ['get']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpSpy }],
    });
    service = TestBed.inject(TzktService);
    httpSpy.get.and.returnValue(of());
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should run getBlocksCount', (done) => {
    httpSpy.get.and.returnValue(of(1));
    const res = service.getBlocksCount();
    expect(httpSpy.get).toHaveBeenCalled();
    res.subscribe((data) => {
      expect(data).toEqual(1);
      done();
    });
  });

  it('should run getBlocks', (done) => {
    httpSpy.get.and.returnValue(of([{ level: 0 }]));
    const res = service.getBlocks(0, 0);
    expect(httpSpy.get).toHaveBeenCalled();
    res.subscribe((data) => {
      expect(data).toHaveSize(1);
      expect(data[0].level).toEqual(0);
      done();
    });
  });

  it('should run getTransactionsCount', (done) => {
    httpSpy.get.and.returnValue(of(1));
    const res = service.getTransactionsCount(0);
    expect(httpSpy.get).toHaveBeenCalled();
    res.subscribe((data) => {
      expect(data).toEqual(1);
      done();
    });
  });

  it('should run getTransactions', (done) => {
    httpSpy.get.and.returnValue(of([{ amount: 0 }]));
    const res = service.getTransactions(0);
    expect(httpSpy.get).toHaveBeenCalled();
    res.subscribe((data) => {
      expect(data).toHaveSize(1);
      expect(data[0].amount).toEqual(0);
      done();
    });
  });
});
