import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MuscleGroupExercises } from '@ikigaidev/hl/model';
import { Subscription, interval, timer } from 'rxjs';

export const workoutObjects: MuscleGroupExercises = {
  abs: [
    {
      targetMuscle: 'abs',
      targetSubMuscle: 'lower abs',
      movement: 'crunch',
      equipment: 'dumbell',
      reps: 8,
      sets: 3,
      weight: 40,
      weightUnits: 'kg',
    },
    {
      targetMuscle: 'abs',
      targetSubMuscle: 'obliques',
      movement: 'crunch',
      equipment: 'bodyweight',
      weight: 5,
      reps: 15,
      sets: 2,
    },
    {
      targetMuscle: 'abs',
      targetSubMuscle: 'upper abs',
      movement: 'crunch',
      equipment: 'dumbell',
      reps: 20,
      sets: 2,
    },
    {
      targetMuscle: 'abs',
      targetSubMuscle: 'upper abs',
      movement: 'crunch',
      equipment: 'machine',
      reps: 15,
      sets: 2,
    },
  ],
  chest: [
    {
      targetMuscle: 'chest',
      targetSubMuscle: 'upper chest',
      movement: 'press',
      equipment: 'barbell',
      reps: 10,
      sets: 4,
      weight: 80,
      weightUnits: 'kg',
    },
    {
      targetMuscle: 'chest',
      targetSubMuscle: 'mid chest',
      movement: 'fly',
      equipment: 'machine',
      reps: 15,
      sets: 3,
      weight: 25,
      weightUnits: 'kg',
    },
  ],
  shoulders: [
    {
      targetMuscle: 'shoulders',
      targetSubMuscle: 'rear shoulder',
      movement: 'pull',
      equipment: 'machine',
      reps: 15,
      sets: 3,
      weight: 25,
      weightUnits: 'kg',
    },
  ],
};

@Component({
  selector: 'lib-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css',
})
export class CarouselComponent implements OnInit, OnDestroy {
  workouts = [
    {
      targetMuscle: 'abs',
      targetSubMuscle: 'lower abs',
      movement: 'crunch',
      equipment: 'dumbell',
      reps: 8,
      sets: 3,
      weight: 40,
      weightUnits: 'kg',
    },
    {
      targetMuscle: 'abs',
      targetSubMuscle: 'obliques',
      movement: 'crunch',
      equipment: 'bodyweight',
      weight: 5,
      reps: 15,
      sets: 2,
    },
    {
      targetMuscle: 'abs',
      targetSubMuscle: 'upper abs',
      movement: 'crunch',
      equipment: 'dumbell',
      reps: 20,
      sets: 2,
    },
    {
      targetMuscle: 'abs',
      targetSubMuscle: 'upper abs',
      movement: 'crunch',
      equipment: 'machine',
      reps: 15,
      sets: 2,
    },
  ];
  currentIndex = 0;
  timerSub$!: Subscription;
  currentPair!: [unknown, unknown];

  ngOnInit(): void {
    this.updateCurrentPair();
    this.startAutoPagination();
  }

  updateCurrentPair() {
    // Select two items based on the current index
    this.currentPair = [
      this.workouts[this.currentIndex],
      this.workouts[(this.currentIndex + 1) % this.workouts.length],
    ];
    // Increment index for the next pair
    this.currentIndex = (this.currentIndex + 2) % this.workouts.length;
  }

  startAutoPagination() {
    this.timerSub$ = interval(3000).subscribe(() => this.updateCurrentPair());
  }

  stopAutoPagination() {
    this.timerSub$.unsubscribe();
  }

  ngOnDestroy(): void {
    this.stopAutoPagination();
  }
}
