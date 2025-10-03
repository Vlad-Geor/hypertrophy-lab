import { Component } from '@angular/core';

@Component({
  selector: 'hl-error-page',
  template: `
    <div class="flex items-center justify-center">
      <img
        class="max-w-40 brightness-125"
        [src]="'/assets/images/hl-supplement-error.png'"
        alt="HL-no-data-image"
      />
      <div class="flex flex-col gap-1">
        <p class="text-2xl font-medium mb-1">Something went wrong.</p>
        <p class="text-gray-text text-sm">
          This one's on us! Please try again later, or refresh the page.
        </p>
      </div>
    </div>
  `,
})
export class ErrorPage {}
