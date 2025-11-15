import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanRepaymentsCrudComponenets } from './loan-repayments-crud-componenets';

describe('LoanRepaymentsCrudComponenets', () => {
  let component: LoanRepaymentsCrudComponenets;
  let fixture: ComponentFixture<LoanRepaymentsCrudComponenets>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanRepaymentsCrudComponenets]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanRepaymentsCrudComponenets);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
