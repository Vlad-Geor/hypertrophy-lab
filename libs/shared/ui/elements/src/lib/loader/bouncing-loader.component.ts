import { Component } from '@angular/core';

@Component({
  selector: 'lib-bouncing-loader',
  template: `
    <div class="loader">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `,
  styles: `
    .loader {
      display: flex;
      gap: 12px;
      justify-content: center;
      align-items: center;
    }
    .loader span {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: currentColor;
      animation: springy 0.8s infinite;
      transform-origin: center;
    }
    .loader span:nth-child(1) {
      color: #9b4dff;
      animation-delay: 0s;
    }
    .loader span:nth-child(2) {
      color: #ff4db6;
      animation-delay: 0.2s;
    }
    .loader span:nth-child(3) {
      color: #4db6ff;
      animation-delay: 0.4s;
    }

    @keyframes springy {
      0%,
      100% {
        transform: scaleX(0.6) scaleY(0.6);
        opacity: 0.6;
      }
      30% {
        transform: scaleX(1.3) scaleY(0.7);
        opacity: 1;
      }
      60% {
        transform: scaleX(0.8) scaleY(1.2);
      }
    }
  `,
})
export class BouncingLoaderComponent {}
