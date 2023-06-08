import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorNotificationComponent } from './error-notification/error-notification.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { TableComponent } from './table/table.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [SpinnerComponent, ErrorNotificationComponent, TableComponent],
  imports: [CommonModule, NgbModule],
  exports: [SpinnerComponent, ErrorNotificationComponent, TableComponent],
})
export class UiModule {}
