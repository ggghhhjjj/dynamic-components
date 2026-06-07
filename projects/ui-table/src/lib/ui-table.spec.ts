import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiTable } from './ui-table';

describe('UiTable', () => {
  let component: UiTable;
  let fixture: ComponentFixture<UiTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiTable],
    }).compileComponents();

    fixture = TestBed.createComponent(UiTable);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the correct number of header cells', async () => {
    component.columns = [
      { key: 'name', label: 'Name' },
      { key: 'age', label: 'Age' },
    ];
    fixture.detectChanges();
    await fixture.whenStable();
    const cells = fixture.nativeElement.querySelectorAll('[role="columnheader"]');
    expect(cells.length).toBe(2);
  });

  it('should render the correct number of data rows', async () => {
    component.columns = [{ key: 'name', label: 'Name' }];
    component.data = [{ name: 'Alice' }, { name: 'Bob' }];
    fixture.detectChanges();
    await fixture.whenStable();
    const rows = fixture.nativeElement.querySelectorAll('.table__body [role="row"]');
    expect(rows.length).toBe(2);
  });

  it('should show the empty message when data is empty', async () => {
    component.columns = [{ key: 'name', label: 'Name' }];
    component.data = [];
    fixture.detectChanges();
    await fixture.whenStable();
    const empty = fixture.nativeElement.querySelector('.table__empty');
    expect(empty).toBeTruthy();
  });
});
