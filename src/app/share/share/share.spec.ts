import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShareComponent } from './share';
import { Share } from '../../saving/model/saving';

describe('Share', () => {
  let  component: ShareComponent;
  let fixture: ComponentFixture<ShareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShareComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
