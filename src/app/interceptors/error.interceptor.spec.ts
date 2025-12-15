import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { errorInterceptor } from './error.interceptor';

/**
 * Error Interceptor Test Suite
 *
 * Testing Best Practices Applied:
 * - Helper functions reduce code duplication
 * - Each test has single responsibility
 * - Tests cover error handling scenarios
 * - Mocks MessageService for toast notifications
 */
describe('errorInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let messageService: MessageService;

  const TEST_URL = '/api/test';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        MessageService,
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    messageService = TestBed.inject(MessageService);

    vi.spyOn(messageService, 'add');
    vi.spyOn(console, 'error');
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Server-Side Errors', () => {
    it('should handle 404 errors and show toast', async () => {
      httpClient.get(TEST_URL).subscribe({
        next: () => expect.fail('Should not succeed'),
        error: () => expect.fail('Error should be handled by interceptor'),
        complete: () => {
          expect(messageService.add).toHaveBeenCalledWith({
            severity: 'error',
            summary: 'Error 404',
            detail: 'Not Found',
            life: 5000,
          });
          expect(console.error).toHaveBeenCalled();
        },
      });

      const req = httpMock.expectOne(TEST_URL);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle 500 errors and show toast', async () => {
      httpClient.get(TEST_URL).subscribe({
        next: () => expect.fail('Should not succeed'),
        error: () => expect.fail('Error should be handled by interceptor'),
        complete: () => {
          expect(messageService.add).toHaveBeenCalledWith({
            severity: 'error',
            summary: 'Error 500',
            detail: 'Internal Server Error',
            life: 5000,
          });
        },
      });

      const req = httpMock.expectOne(TEST_URL);
      req.flush('Internal Server Error', {
        status: 500,
        statusText: 'Internal Server Error',
      });
    });

    it('should extract backend error message from error.message', async () => {
      const backendError = { message: 'Custom backend error message' };

      httpClient.get(TEST_URL).subscribe({
        next: () => expect.fail('Should not succeed'),
        error: () => expect.fail('Error should be handled by interceptor'),
        complete: () => {
          expect(messageService.add).toHaveBeenCalledWith({
            severity: 'error',
            summary: 'Error 400',
            detail: 'Custom backend error message',
            life: 5000,
          });
        },
      });

      const req = httpMock.expectOne(TEST_URL);
      req.flush(backendError, { status: 400, statusText: 'Bad Request' });
    });

    it('should extract backend error message from error.error.message', async () => {
      const backendError = {
        error: { message: 'Nested backend error message' },
      };

      httpClient.get(TEST_URL).subscribe({
        next: () => expect.fail('Should not succeed'),
        error: () => expect.fail('Error should be handled by interceptor'),
        complete: () => {
          expect(messageService.add).toHaveBeenCalledWith({
            severity: 'error',
            summary: 'Error 400',
            detail: 'Nested backend error message',
            life: 5000,
          });
        },
      });

      const req = httpMock.expectOne(TEST_URL);
      req.flush(backendError, { status: 400, statusText: 'Bad Request' });
    });

    it('should extract backend error message from error.reason', async () => {
      const backendError = { reason: 'Invalid input' };

      httpClient.get(TEST_URL).subscribe({
        next: () => expect.fail('Should not succeed'),
        error: () => expect.fail('Error should be handled by interceptor'),
        complete: () => {
          expect(messageService.add).toHaveBeenCalledWith({
            severity: 'error',
            summary: 'Error 422',
            detail: 'Invalid input',
            life: 5000,
          });
        },
      });

      const req = httpMock.expectOne(TEST_URL);
      req.flush(backendError, {
        status: 422,
        statusText: 'Unprocessable Entity',
      });
    });

    it('should handle string error messages', async () => {
      httpClient.get(TEST_URL).subscribe({
        next: () => expect.fail('Should not succeed'),
        error: () => expect.fail('Error should be handled by interceptor'),
        complete: () => {
          expect(messageService.add).toHaveBeenCalledWith({
            severity: 'error',
            summary: 'Error 400',
            detail: 'String error message',
            life: 5000,
          });
        },
      });

      const req = httpMock.expectOne(TEST_URL);
      req.flush('String error message', {
        status: 400,
        statusText: 'Bad Request',
      });
    });
  });

  describe('Client-Side Errors', () => {
    it('should handle client-side ErrorEvent', async () => {
      const errorEvent = new ErrorEvent('Network error', {
        message: 'Failed to fetch',
      });

      httpClient.get(TEST_URL).subscribe({
        next: () => expect.fail('Should not succeed'),
        error: () => expect.fail('Error should be handled by interceptor'),
        complete: () => {
          expect(messageService.add).toHaveBeenCalledWith({
            severity: 'error',
            summary: 'Client Error',
            detail: 'Failed to fetch',
            life: 5000,
          });
        },
      });

      const req = httpMock.expectOne(TEST_URL);
      req.error(errorEvent);
    });

    it('should handle client-side error without message', async () => {
      const errorEvent = new ErrorEvent('Network error');

      httpClient.get(TEST_URL).subscribe({
        next: () => expect.fail('Should not succeed'),
        error: () => expect.fail('Error should be handled by interceptor'),
        complete: () => {
          expect(messageService.add).toHaveBeenCalledWith({
            severity: 'error',
            summary: 'Client Error',
            detail: 'A client error occurred',
            life: 5000,
          });
        },
      });

      const req = httpMock.expectOne(TEST_URL);
      req.error(errorEvent);
    });
  });

  describe('Error Handling Flow', () => {
    it('should return EMPTY observable after handling error', async () => {
      let nextCalled = false;
      let errorCalled = false;

      httpClient.get(TEST_URL).subscribe({
        next: () => {
          nextCalled = true;
        },
        error: () => {
          errorCalled = true;
        },
        complete: () => {
          // The interceptor returns EMPTY, so complete is called without next or error
          expect(nextCalled).toBe(false);
          expect(errorCalled).toBe(false);
          expect(messageService.add).toHaveBeenCalled();
        },
      });

      const req = httpMock.expectOne(TEST_URL);
      req.flush('Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('Console Logging', () => {
    it('should log error details to console', async () => {
      httpClient.get(TEST_URL).subscribe({
        next: () => expect.fail('Should not succeed'),
        error: () => expect.fail('Error should be handled by interceptor'),
        complete: () => {
          expect(console.error).toHaveBeenCalledWith(
            'HTTP Error:',
            expect.objectContaining({
              status: 404,
              url: TEST_URL,
            })
          );
        },
      });

      const req = httpMock.expectOne(TEST_URL);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });
});
