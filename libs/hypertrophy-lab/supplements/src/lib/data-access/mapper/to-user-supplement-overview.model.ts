import { InventoryItemSummary } from '@ikigaidev/hl/contracts';
import { UserSupplementOverview } from '../../supplement-card/supplement-card.component';
import { GroupSupplementListItem } from '@ikigaidev/contracts';

export const fromInventoryItemSummary: (
  data: InventoryItemSummary,
) => UserSupplementOverview = ({
  brandName,
  catalogName,
  images,
  onHand,
  servingUnits,
  targets,
}) =>
  ({
    brandName,
    catalogName,
    images,
    onHand,
    servingUnits,
    targets,
    supplementBatchTrackingMode: 'personal',
  }) as UserSupplementOverview;

export const fromGroupSupplementListItem: (
  data: GroupSupplementListItem,
) => UserSupplementOverview = ({
  brandName,
  catalogName,
  images,
  onHand,
  servingUnits,
  targets,
  groupName,
}) =>
  ({
    brandName,
    catalogName,
    images,
    onHand,
    servingUnits,
    targets,
    groupName,
    supplementBatchTrackingMode: 'shared',
  }) as UserSupplementOverview;
