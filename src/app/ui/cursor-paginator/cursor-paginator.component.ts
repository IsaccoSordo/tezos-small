import {
  Component,
  input,
  output,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CursorDirection } from '../../models';

@Component({
  selector: 'app-cursor-paginator',
  template: `
    <div class="cursor-paginator">
      <p-button
        icon="pi pi-angle-double-left"
        [text]="true"
        [disabled]="!canGoPrev()"
        (onClick)="navigate('first')"
        pTooltip="First page"
      />
      <p-button
        icon="pi pi-angle-left"
        [text]="true"
        [disabled]="!canGoPrev()"
        (onClick)="navigate('prev')"
        pTooltip="Previous"
      />
      <span class="page-info">Page {{ currentPage() }}</span>
      <p-button
        icon="pi pi-angle-right"
        [text]="true"
        [disabled]="!canGoNext()"
        (onClick)="navigate('next')"
        pTooltip="Next"
      />
    </div>
  `,
  styles: [
    `
      .cursor-paginator {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 1rem;
      }

      .page-info {
        min-width: 80px;
        text-align: center;
        font-size: 0.875rem;
        color: var(--text-color-secondary);
      }
    `,
  ],
  standalone: true,
  imports: [CommonModule, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CursorPaginatorComponent {
  currentIndex = input<number>(0);
  hasMore = input<boolean>(true);
  hasData = input<boolean>(false);

  navigationChange = output<CursorDirection>();

  currentPage = computed(() => this.currentIndex() + 1);
  canGoPrev = computed(() => this.currentIndex() > 0);
  canGoNext = computed(() => this.hasMore() && this.hasData());

  navigate(direction: CursorDirection): void {
    this.navigationChange.emit(direction);
  }
}
