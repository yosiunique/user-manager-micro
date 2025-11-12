import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreteUpdateUser } from './crete-update-user';

describe('CreteUpdateUser', () => {
  let component: CreteUpdateUser;
  let fixture: ComponentFixture<CreteUpdateUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreteUpdateUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreteUpdateUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
