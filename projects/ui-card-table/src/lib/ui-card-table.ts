import { Component, Input, ViewEncapsulation } from '@angular/core';

export interface CardTableColumn {
  key: string;
  label: string;
}

@Component({
  selector: 'ui-card-table',
  standalone: true,
  imports: [],
  templateUrl: './ui-card-table.html',
  styleUrl: './ui-card-table.scss',
  encapsulation: ViewEncapsulation.Emulated,
})
export class UiCardTable {
  @Input() columns: CardTableColumn[] = [];
  @Input() data: Record<string, unknown>[] = [];
}
