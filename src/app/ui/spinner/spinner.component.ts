import { Component, inject } from '@angular/core';
import { Store } from 'src/app/store/store.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  standalone: false
})
export class SpinnerComponent {
  loadingCounter$ = inject(Store).state.loadingCounter
}
