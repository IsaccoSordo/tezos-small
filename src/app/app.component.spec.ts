import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { AppComponent } from './app.component';
import { BlocksOverviewComponent } from './blocks-overview/blocks-overview.component';
import { DetailsComponent } from './details/details.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SpinnerComponent } from './ui/spinner/spinner.component';
import { ErrorNotificationComponent } from './ui/error-notification/error-notification.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        AppComponent,
        BlocksOverviewComponent,
        DetailsComponent,
        SpinnerComponent,
        NavbarComponent,
        ErrorNotificationComponent,
      ],
      providers: [provideMockStore({})],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'tezos-small'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('tezos-small');
  });
});
