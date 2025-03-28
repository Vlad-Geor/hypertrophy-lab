import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonComponent } from './button.component';
import { Component } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'hl-button-story',
  template: `
  <!-- <lib-button icon="expand_circle_up" iconColor="red"></lib-button> -->
  `,
  imports: [ButtonComponent]
})
export class ButtonStoryComponent {

}

const meta: Meta<ButtonStoryComponent> = {
  component: ButtonStoryComponent,
  title: 'ButtonStoryComponent',
};
export default meta;
type Story = StoryObj<ButtonStoryComponent>;

export const Primary: Story = {

};
