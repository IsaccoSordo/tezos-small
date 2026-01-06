import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '../../../store/tzkt.store';

@Component({
  selector: 'app-storage-tab',
  templateUrl: './storage-tab.component.html',
  styleUrls: ['./storage-tab.component.scss'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StorageTabComponent {
  private store = inject(Store);

  storage = this.store.storage;

  formatStorage(): string {
    const s = this.storage();
    return s ? JSON.stringify(s, null, 2) : '';
  }

  getStorageKeys(): string[] {
    const s = this.storage();
    return s ? Object.keys(s) : [];
  }

  getStorageValue(key: string): string {
    const s = this.storage();
    if (!s) return '';
    const value = s[key];
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  }

  isObject(key: string): boolean {
    const s = this.storage();
    if (!s) return false;
    return typeof s[key] === 'object';
  }
}
