import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ui-foo',
  standalone: true,
  imports: [],
  templateUrl: './ui-foo.html',
  styleUrl: './ui-foo.scss',
  encapsulation: ViewEncapsulation.Emulated,
})
export class UiFoo {
  @Input() label = 'Default label';
  @Input() disabled = false;
}
