import { Component, EventEmitter, Input, Output } from '@angular/core';

export type Task = {
  id: string;
  title: string;
  state: string;
};

@Component({
  selector: 'lib-test',
  template: `
    <div class="list-item">
      <label [attr.aria-label]="task.title + ''" for="title">
        <input
          type="text"
          [value]="task.title"
          readonly="true"
          id="title"
          name="title"
        />
      </label>
    </div>
  `,
})
export default class TestComponent {
  /**
   * The shape of the task object
   */
  @Input({ required: true }) task!: Task;

  // tslint:disable-next-line: no-output-on-prefix
  @Output()
  pinTask = new EventEmitter<Event>();

  // tslint:disable-next-line: no-output-on-prefix
  @Output()
  archiveTask = new EventEmitter<Event>();
}
