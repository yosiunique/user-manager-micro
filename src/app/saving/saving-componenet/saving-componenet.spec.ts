import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingComponenet } from './saving-componenet';

describe('SavingComponenet', () => {
  let component: SavingComponenet;
  let fixture: ComponentFixture<SavingComponenet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavingComponenet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavingComponenet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
