import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ui-card',
  standalone: true,
  imports: [],
  templateUrl: './ui-card.html',
  styleUrl: './ui-card.scss',
  encapsulation: ViewEncapsulation.Emulated,
})
export class UiCard {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() image = '';
}
