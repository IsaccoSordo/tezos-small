import {
  Component,
  inject,
  ChangeDetectionStrategy,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '../../../store/tzkt.store';

@Component({
  selector: 'app-code-tab',
  templateUrl: './code-tab.component.html',
  styleUrls: ['./code-tab.component.scss'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeTabComponent {
  private store = inject(Store);

  contractInterface = this.store.contractInterface;

  storageSchemaFormatted = computed(() => {
    const ci = this.contractInterface();
    return ci?.storageSchema
      ? JSON.stringify(ci.storageSchema, null, 2)
      : 'No schema available';
  });

  entrypointsFormatted = computed(() => {
    const ci = this.contractInterface();
    return ci?.entrypoints
      ? JSON.stringify(ci.entrypoints, null, 2)
      : 'No entrypoints available';
  });

  bigMapsFormatted = computed(() => {
    const ci = this.contractInterface();
    return ci?.bigMaps?.length
      ? JSON.stringify(ci.bigMaps, null, 2)
      : 'No big maps';
  });

  eventsFormatted = computed(() => {
    const ci = this.contractInterface();
    return ci?.events?.length
      ? JSON.stringify(ci.events, null, 2)
      : 'No events defined';
  });
}
