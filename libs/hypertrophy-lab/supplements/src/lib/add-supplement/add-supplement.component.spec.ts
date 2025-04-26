import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddSupplementComponent } from './add-supplement.component';

describe('AddSupplementComponent', () => {
  let component: AddSupplementComponent;
  let fixture: ComponentFixture<AddSupplementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSupplementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddSupplementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
