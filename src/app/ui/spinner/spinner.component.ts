import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Store } from 'src/app/store/store.service';

@Component({
  selector: 'app-spinner',
  template: `
    @if (loadingCounter$()) {
      <div class="spinner-backdrop">
        <div class="spinner-container">
          <p-progressSpinner
            [style]="{ width: '70px', height: '70px' }"
            strokeWidth="4"
            fill="transparent"
            animationDuration="1s"
          ></p-progressSpinner>
        </div>
      </div>
    }
  `,
  styleUrls: ['./spinner.component.scss'],
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpinnerComponent {
  loadingCounter$ = inject(Store).state.loadingCounter
}
