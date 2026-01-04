import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractView } from '../../../models';

@Component({
  selector: 'app-views-tab',
  templateUrl: './views-tab.component.html',
  styleUrls: ['./views-tab.component.scss'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewsTabComponent {
  views = input<ContractView[]>([]);

  expandedViews = new Set<string>();

  formatType(type: unknown): string {
    return JSON.stringify(type, null, 2);
  }

  toggleView(name: string): void {
    if (this.expandedViews.has(name)) {
      this.expandedViews.delete(name);
    } else {
      this.expandedViews.add(name);
    }
  }

  isExpanded(name: string): boolean {
    return this.expandedViews.has(name);
  }
}
