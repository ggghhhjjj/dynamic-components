import { Component, Input, ViewEncapsulation } from '@angular/core';

export interface TableColumn {
  key: string;
  label: string;
}

@Component({
  selector: 'ui-table',
  standalone: true,
  imports: [],
  templateUrl: './ui-table.html',
  styleUrl: './ui-table.scss',
  encapsulation: ViewEncapsulation.Emulated,
})
export class UiTable {
  @Input() columns: TableColumn[] = [];
  @Input() data: Record<string, unknown>[] = [];
}
