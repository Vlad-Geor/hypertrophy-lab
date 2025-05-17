// import { Component, ElementRef, signal, effect, inject } from '@angular/core';
// import { animationFrames, concatMap, fromEvent, map, merge, takeUntil } from 'rxjs';

// @Component({
//   standalone: true,
//   // eslint-disable-next-line @angular-eslint/component-selector
//   selector: 'iki-carousel',
//   template: `
//     <button (pointerdown)="start(-1)" (pointerup)="stop()" (pointerleave)="stop()">‹</button>
//     <div class="viewport" #vp>
//       <ng-content></ng-content>
//     </div>
//     <button (pointerdown)="start(1)" (pointerup)="stop()" (pointerleave)="stop()">›</button>
//   `,
//   styles: [`
//     :host { display:flex; align-items:center; overflow:hidden; }
//     .viewport { flex:1; display:flex; scroll-behavior:auto; }
//     ::ng-deep > * { flex:0 0 var(--card-width, 280px); }
//   `]
// })
// export class Carousel {
//   private vp = inject(ElementRef<HTMLDivElement>);
//   private direction = signal<1 | -1>(1);
//   private holding = signal(false);

//   /** one-click scroll — queues until each tween ends */
//   scrollCard(dir: 1 | -1) {
//     const cardW = this.vp.nativeElement.querySelector<HTMLElement>('::ng-deep > *').offsetWidth;
//     const from = this.vp.nativeElement.scrollLeft;
//     const to = from + dir * cardW;

//     return animationFrames().pipe(
//       map(({elapsed}) => Math.min(elapsed / 300, 1)),      // 300 ms tween
//       map(t => from + (to - from) * (t*t*(3-2*t))),        // smoothstep ease
//     ).pipe(
//       takeUntil(this.holding.asObservable().pipe(filter(Boolean))) // abort if user starts holding
//     ).pipe(
//       tap(x => this.vp.nativeElement.scrollLeft = x)
//     );
//   }

//   /** called from template on pointerdown */
//   start(dir: 1 | -1) {
//     this.direction.set(dir);
//     this.holding.set(true);

//     /* continuous press-and-hold loop */
//     const hold$ = animationFrames().pipe(
//       map(({elapsed}) => {
//         // ease-in curve: min(t, 300 ms)² scaled → 0-1
//         const t = Math.min(elapsed, 300);
//         const ease = (t*t)/90000;
//         return dir * (200 + 400*ease);                      // px s⁻¹
//       }),
//       tap(v => this.vp.nativeElement.scrollLeft += v / 60)  // 60 fps approximation
//     );

//     /* merge one-click + hold streams */
//     merge(
//       this.scrollCard(dir),                // complete click first
//       hold$                                // then keep moving while held
//     ).pipe(
//       takeUntil(fromEvent(window,'pointerup'))
//     ).subscribe();
//   }

//   stop() { this.holding.set(false); }
// }
