import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingCrudComponenets } from './saving-crud-componenets';

describe('SavingCrudComponenets', () => {
  let component: SavingCrudComponenets;
  let fixture: ComponentFixture<SavingCrudComponenets>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavingCrudComponenets]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavingCrudComponenets);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
