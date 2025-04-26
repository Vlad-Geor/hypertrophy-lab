// import { Component } from '@angular/core';
// import { ThemeColorDirective } from '@ikigaidev/directive';

// export function ThemeComponent(options: Parameters<typeof Component>[0]): ClassDecorator {
//   // inject your color directive into every component you decorate
//   const hostDir = {
//     directive: ThemeColorDirective,
//     inputs: ['appColor', 'property'],
//   };

//   return (target: unknown) => {
//     Component({
//       ...options,
//       hostDirectives: [...(options.hostDirectives || []), hostDir],
//     } as any)(target as any);
//   };
// }

export default {};