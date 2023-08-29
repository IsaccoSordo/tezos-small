import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TzktService } from '../services/tzkt.service';
import { Store } from '../store/store.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  route = inject(ActivatedRoute);
  store = inject(Store);
  service = inject(TzktService);

  transactions = this.store.state.transactions;

  ngOnInit(): void {
    const level: number = +(
      this.route.snapshot.paramMap.get('level') ?? 'error'
    );
    !isNaN(level) && this.service.getTransactions(level);
  }
}
