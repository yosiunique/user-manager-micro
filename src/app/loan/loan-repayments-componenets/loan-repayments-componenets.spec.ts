import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanRepaymentsComponenets } from './loan-repayments-componenets';

describe('LoanRepaymentsComponenets', () => {
  let component: LoanRepaymentsComponenets;
  let fixture: ComponentFixture<LoanRepaymentsComponenets>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanRepaymentsComponenets]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanRepaymentsComponenets);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
