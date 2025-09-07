import {
  AfterViewInit,
  Component,
  TemplateRef,
  contentChildren,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { TagComponent } from '../tag.component';

@Component({
  selector: 'lib-tag-group',
  template: `
    <ng-template><ng-content></ng-content></ng-template>
    @for (tag of visibleTags(); track $index) {
      <lib-tag
        [rounded]="tag.rounded()"
        [size]="tag.size()"
        [theme]="tag.theme()"
        [inputContent]="tag.content()"
      ></lib-tag>
    }
    @if (tags().length > (visibleChipCount() ?? 2)) {
      <span class="text-center text-xxs text-white">
        {{ '+' + (tags().length - (visibleChipCount() ?? 2)) + ' more' }}
      </span>
    }
  `,
  styleUrl: './tag-group.component.scss',
  imports: [TagComponent],
})
export class TagGroupComponent implements AfterViewInit {
  tpl = viewChild(TemplateRef);
  tags = contentChildren(TagComponent);
  visibleChipCount = input<number>();
  visibleTags = signal<readonly TagComponent[] | null>(null);

  ngAfterViewInit(): void {
    this.visibleTags.set(
      this.tags().length > (this.visibleChipCount() ?? 2)
        ? this.tags().slice(0, this.visibleChipCount() ?? 2)
        : this.tags(),
    );
  }
}
