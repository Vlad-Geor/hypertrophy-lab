import { Component, inject, input } from '@angular/core';
import { GlobalOverlay } from '@ikigaidev/overlay';
import { Meta, StoryObj } from '@storybook/angular';
import { ButtonComponent } from '../button/button.component';
import { DividerComponent } from '../divider/divider.component';
import { ToasterComponent } from './toaster.component';
import { ToasterOverlayData } from './toaster.model';

@Component({
  selector: 'lib-toaster-story',
  template: `
    <lib-button [style]="'margin-bottom: 12px;'" (click)="openToaster()">
      Open Toaster
    </lib-button>
    <lib-divider></lib-divider>
    {{ 'Action clicked: ' + clickedActionType }}
  `,
  imports: [ButtonComponent, DividerComponent],
})
export class ToasterStoriesComponent {
  private readonly overlay = inject(GlobalOverlay);

  config = input<ToasterOverlayData>();
  clickedActionType!: 'link' | 'button';

  openToaster(): void {
    const c = this.config();
    if (c)
      this.overlay.openComponent(ToasterComponent, {
        data: {
          showCloseBtn: c.showCloseBtn || false,
          message: c.message || 'Storybook toaster demo',
          buttonLabel: c.buttonLabel || 'Button Action',
          type: c.type || 'info',
          contentType: c.contentType || 'overflow',
          linkLabel: c.linkLabel || 'Custom link',
          onLinkClick: c.onLinkClick
            ? c.onLinkClick()
            : () => (this.clickedActionType = 'link'),
          onButtonClick: c.onButtonClick
            ? c.onButtonClick()
            : () => (this.clickedActionType = 'button'),
        },
        position: {
          bottom: 400,
          left: 400,
        },
      });
  }
}

const meta = {
  title: 'Design System/NDS-Toaster',
  argTypes: {
    showCloseBtn: { control: 'boolean' },
    type: { control: 'select', options: ['info', 'danger', 'warning', 'success'] },
    contentType: { control: 'radio', options: ['standard', 'overflow'] },
    message: { control: 'text' },
    buttonLabel: { control: 'text' },
    linkLabel: { control: 'text' },
  },
  render: (args: ToasterOverlayData) => {
    const handlers = {
      // linkClickHandler: () => console.log('link Clicked'),
      // btnClickHandler: () => console.log('btn Clicked'),
      // closeClickHandler: () => console.log('close Clicked'),
    };

    return {
      props: { config: { ...args, ...handlers } },
      template: `<toaster-story [config]="config"></toaster-story>`,
      moduleMetadata: {
        imports: [ButtonComponent, ToasterStoriesComponent],
      },
    };
  },
  tags: ['autodocs'],
} satisfies Meta<ToasterOverlayData>;

export default meta;

type Story = StoryObj<ToasterOverlayData>;

export const Info: Story = {
  args: {
    showCloseBtn: true,
    message: 'Storybook toaster demo',
    buttonLabel: 'Button Action',
    type: 'info',
    contentType: 'overflow',
    linkLabel: 'Custom link',
    onLinkClick: () => console.log('helloo'),
    onButtonClick: () => console.log('btnnn'),
  },
};

export const Overflow: Story = {
  args: {
    showCloseBtn: true,
    message: 'Storybook toaster demo',
    buttonLabel: 'Button Action',
    type: 'info',
    contentType: 'overflow',
    linkLabel: 'Custom link',
    onLinkClick: () => console.log('helloo'),
    onButtonClick: () => console.log('btnnn'),
  },
};

export const Danger: Story = {
  args: {
    showCloseBtn: true,
    message: 'Storybook toaster demo',
    buttonLabel: 'Button Action',
    type: 'danger',
    contentType: 'standard',
    linkLabel: 'Custom link',
    onLinkClick: () => console.log('helloo'),
    onButtonClick: () => console.log('btnnn'),
  },
};

export const Success: Story = {
  args: {
    showCloseBtn: true,
    message: 'Storybook toaster demo',
    buttonLabel: 'Button Action',
    type: 'success',
    contentType: 'standard',
    linkLabel: 'Custom link',
    onLinkClick: () => console.log('helloo'),
    onButtonClick: () => console.log('btnnn'),
  },
};

export const Warning: Story = {
  args: {
    showCloseBtn: true,
    message: 'Storybook toaster demo',
    buttonLabel: 'Button Action',
    type: 'warning',
    contentType: 'standard',
    linkLabel: 'Custom link',
    onLinkClick: () => console.log('helloo'),
    onButtonClick: () => console.log('btnnn'),
  },
};
