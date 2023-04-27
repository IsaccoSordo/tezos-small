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
import { tzktReducer } from './state/tzkt.reducer';
import { TZKTEffects } from './effects/tzkt.effects';

@NgModule({
  declarations: [AppComponent, BlocksOverviewComponent],
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
