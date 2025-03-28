import { MatIconModule } from '@angular/material/icon';
import { moduleMetadata } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const decorators = [
  moduleMetadata({
    imports: [
      BrowserAnimationsModule, // Required for Angular Material animations
      MatIconModule,
      // Add other modules as necessary
    ],
  }),
];
