import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Uploadingfile } from './uploadingfile';

describe('Uploadingfile', () => {
  let component: Uploadingfile;
  let fixture: ComponentFixture<Uploadingfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Uploadingfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Uploadingfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
