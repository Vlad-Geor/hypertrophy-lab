import { JsonPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { ImagePlaceholderDirective } from '@ikigaidev/directive';
import { CustomListItemComponent, TagComponent } from '@ikigaidev/elements';
import { SupplementCatalogSummary } from '@ikigaidev/hl/contracts';
import { ListItem, Size } from '@ikigaidev/model';

export type ExistingSuppItemData = SupplementCatalogSummary;

@Component({
  selector: 'hl-existing-supplement-item',
  templateUrl: './existing-supplement-item.component.html',
  imports: [JsonPipe, TagComponent, ImagePlaceholderDirective],
  host: {
    class:
      'flex items-center gap-3 flex-1 p-2 rounded-md hover:cursor-pointer border transition-all duration-100 ease-in-out',
    '[class.border-transparent]': '!selected()',
    '[class.bg-gray-subtle]': 'selected()',
    '[class.border-gray-soft]': 'selected()',
    '[attr.tabindex]': '0',
    '(click)': 'onSelfClick()',
  },
})
export class ExistingSupplementItem
  implements CustomListItemComponent<ExistingSuppItemData>
{
  data = input<ExistingSuppItemData>();
  listItem = input<ListItem<ExistingSuppItemData> | undefined>();
  selectable = input(true);
  selected = input<boolean | undefined>();
  size = input<Extract<Size, 'sm' | 'md' | 'lg'> | undefined>();

  itemClicked = output<ListItem<ExistingSuppItemData> | undefined>();

  onSelfClick(): void {
    if (this.selectable()) {
      const item = this.listItem();
      if (item) {
        this.itemClicked.emit(item);
      }
    }
  }
}
