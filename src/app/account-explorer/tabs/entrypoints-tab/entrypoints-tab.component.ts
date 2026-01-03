import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractEntrypoint } from '../../../models';

@Component({
  selector: 'app-entrypoints-tab',
  templateUrl: './entrypoints-tab.component.html',
  styleUrls: ['./entrypoints-tab.component.scss'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntrypointsTabComponent {
  entrypoints = input<ContractEntrypoint[]>([]);

  expandedEntrypoints = new Set<string>();

  formatParameters(params: unknown): string {
    return JSON.stringify(params, null, 2);
  }

  toggleEntrypoint(name: string): void {
    if (this.expandedEntrypoints.has(name)) {
      this.expandedEntrypoints.delete(name);
    } else {
      this.expandedEntrypoints.add(name);
    }
  }

  isExpanded(name: string): boolean {
    return this.expandedEntrypoints.has(name);
  }
}
