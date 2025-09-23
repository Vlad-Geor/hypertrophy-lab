import { Component } from '@angular/core';

@Component({
  selector: 'lib-pill',
  template: `
    <ng-content></ng-content>
  `,
  host: {
    class: `flex justify-center items-center gap-2 text-xs font-medium w-full py-1 border border-gray rounded-2xl`,
  },
})
export class Pill {}
