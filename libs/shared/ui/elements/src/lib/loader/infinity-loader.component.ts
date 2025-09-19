import { Component } from '@angular/core';

@Component({
  selector: 'lib-infinity-loader',
  template: `
    <svg viewBox="0 0 600 320" width="240" height="128" role="img" aria-label="Loading">
      <!-- dark vignette background -->
      <defs>
        <!-- <radialGradient id="bg" cx="55%" cy="45%">
        <stop offset="0%" stop-color="#0b1e22" />
        <stop offset="100%" stop-color="#071316" />
      </radialGradient> -->

        <!-- teal glow -->
        <linearGradient id="teal" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#00e5ff" />
          <stop offset="100%" stop-color="#7fffd4" />
        </linearGradient>

        <!-- soft outer glow -->
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="100%" height="100%" fill="transparent" />

      <!-- subtle static outline -->
      <path
        d="M 100 160
           C 100 80, 260 80, 300 160
           C 340 240, 500 240, 500 160
           C 500 80, 340 80, 300 160
           C 260 240, 100 240, 100 160 Z"
        fill="none"
        stroke="#1b3c41"
        stroke-width="16"
        opacity=".25"
      />

      <!-- animated bright segment -->
      <path
        id="loop"
        d="M 100 160
           C 100 80, 260 80, 300 160
           C 340 240, 500 240, 500 160
           C 500 80, 340 80, 300 160
           C 260 240, 100 240, 100 160 Z"
        fill="none"
        stroke="url(#teal)"
        stroke-linecap="round"
        stroke-width="16"
        filter="url(#glow)"
        stroke-dasharray="120 620"
      >
        <animate
          attributeName="stroke-dashoffset"
          values="0;-740"
          dur="1.6s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  `,
})
export class InifinityLoaderComponent {}
