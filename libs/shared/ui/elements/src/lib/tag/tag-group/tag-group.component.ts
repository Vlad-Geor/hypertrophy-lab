import {
  AfterViewInit,
  Component,
  TemplateRef,
  contentChildren,
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
        [brigtness]="tag.brigtness()"
        [rounded]="tag.rounded()"
        [size]="tag.size()"
        [theme]="tag.theme()"
        [inputContent]="tag.content()"
      ></lib-tag>
    }
    @if (tags().length > 2) {
      <span class="text-center text-xs">{{ '+' + (tags().length - 2) + ' more' }}</span>
    }
  `,
  styleUrl: './tag-group.component.scss',
  imports: [TagComponent],
})
export class TagGroupComponent implements AfterViewInit {
  tpl = viewChild(TemplateRef);
  tags = contentChildren(TagComponent);
  visibleTags = signal<readonly TagComponent[] | null>(null);

  ngAfterViewInit(): void {
    console.log(this.tpl());
    console.log(this.tags());
    this.visibleTags.set(this.tags().length > 2 ? this.tags().slice(0, 2) : this.tags());
  }
}
