import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BlocksOverviewComponent } from './blocks-overview/blocks-overview.component';
import { TzktService } from './services/tzkt.service';
import { DetailsComponent } from './details/details.component';
import { UiModule } from './ui/ui.module';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    BlocksOverviewComponent,
    DetailsComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    UiModule,
  ],
  providers: [TzktService],
  bootstrap: [AppComponent],
})
export class AppModule {}
