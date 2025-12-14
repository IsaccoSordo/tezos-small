import {
  Component,
  OnInit,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TzktService } from '../services/tzkt.service';
import { Store } from '../store/store.service';
import { TableComponent } from '../ui/table/table.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  standalone: true,
  imports: [CommonModule, TableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private service = inject(TzktService);
  private destroyRef = takeUntilDestroyed();

  store = inject(Store);
  transactions = this.store.transactions;

  columns = [
    { field: 'sender', header: 'Sender' },
    { field: 'target', header: 'Target' },
    { field: 'amount', header: 'Amount' },
    { field: 'status', header: 'Status' },
  ];

  ngOnInit(): void {
    const level: number = +(
      this.route.snapshot.paramMap.get('level') ?? 'error'
    );

    if (!isNaN(level)) {
      this.service.getTransactions(level).pipe(this.destroyRef).subscribe();
    }
  }
}
