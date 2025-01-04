import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExerciseDetailsCardComponent } from './exercise-details-card.component';

describe('ExerciseDetailsCardComponent', () => {
  let component: ExerciseDetailsCardComponent;
  let fixture: ComponentFixture<ExerciseDetailsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseDetailsCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseDetailsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
