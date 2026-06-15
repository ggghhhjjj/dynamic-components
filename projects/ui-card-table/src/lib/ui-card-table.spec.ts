import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiCardTable } from './ui-card-table';

describe('UiCardTable', () => {
  let component: UiCardTable;
  let fixture: ComponentFixture<UiCardTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiCardTable],
    }).compileComponents();

    fixture = TestBed.createComponent(UiCardTable);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render header cells for each column', async () => {
    component.columns = [
      { key: 'name', label: 'Name' },
      { key: 'role', label: 'Role' },
    ];
    fixture.detectChanges();
    await fixture.whenStable();
    const headers = fixture.nativeElement.querySelectorAll('thead th');
    expect(headers.length).toBe(2);
    expect(headers[0].textContent.trim()).toBe('Name');
  });

  it('should set data-label on body cells from column labels', async () => {
    component.columns = [{ key: 'name', label: 'Name' }];
    component.data = [{ name: 'Alice' }];
    fixture.detectChanges();
    await fixture.whenStable();
    const cell = fixture.nativeElement.querySelector('tbody td');
    expect(cell.getAttribute('data-label')).toBe('Name');
    expect(cell.textContent.trim()).toBe('Alice');
  });

  it('should show the empty message when data is empty', async () => {
    component.columns = [{ key: 'name', label: 'Name' }];
    component.data = [];
    fixture.detectChanges();
    await fixture.whenStable();
    const empty = fixture.nativeElement.querySelector('.card-table__empty');
    expect(empty).toBeTruthy();
  });
});
