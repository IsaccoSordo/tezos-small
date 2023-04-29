import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { BlocksOverviewComponent } from './blocks-overview/blocks-overview.component';
import { TzktService } from './services/tzkt.service';
import { tzktReducer } from './store/tzkt.reducer';
import { TZKTEffects } from './effects/tzkt.effects';
import { DetailsComponent } from './details/details.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [AppComponent, BlocksOverviewComponent, DetailsComponent, SpinnerComponent, NavbarComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    StoreModule.forRoot({tzkt: tzktReducer}),
    EffectsModule.forRoot([TZKTEffects]),
  ],
  providers: [TzktService],
  bootstrap: [AppComponent],
})
export class AppModule {}
