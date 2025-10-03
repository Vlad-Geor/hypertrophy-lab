import { computed, inject } from '@angular/core';
import { InventoryItemSummary } from '@ikigaidev/hl/contracts';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { auditTime, EMPTY, exhaustMap, map, pipe } from 'rxjs';
import { SupplementService } from './supplement.service';

type SupplementsState = {
  userSupplements: InventoryItemSummary[] | null;
  userSupplementsTargetFilter: string | undefined;
  isLoading: boolean;
  isError: boolean;
};

const initialState: SupplementsState = {
  isError: false,
  isLoading: false,
  userSupplements: null,
  userSupplementsTargetFilter: undefined,
};

export const SupplementStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    userSupplementCount: computed(() => store.userSupplements()?.length),
    targetQueryFilteredUserSupplements: computed(() =>
      store
        .userSupplements()
        ?.filter((us) =>
          us.targets.some((t) => t.name === store.userSupplementsTargetFilter()),
        ),
    ),
  })),
  withMethods((store, supplementService = inject(SupplementService)) => ({
    setUserSupplementQuery(userSupplementsTargetFilter: string): void {
      patchState(store, { userSupplementsTargetFilter });
    },
    getUserSupplements: rxMethod<boolean | undefined>(
      pipe(
        map((force) => !!force),
        auditTime(0),
        exhaustMap((forceLoad) => {
          if (!forceLoad) {
            if (store.isLoading()) return EMPTY;
            const d = store.userSupplements();
            const empty =
              !d || (Array.isArray(d) ? d.length === 0 : Object.keys(d).length === 0);
            if (!empty) return EMPTY;
          }

          patchState(store, { isLoading: true });

          return supplementService.getUserSupplements().pipe(
            tapResponse({
              next: (v) => patchState(store, { userSupplements: v.items }),
              error: (e) => {
                console.error(e);
                patchState(store, { isError: true });
              },
              finalize: () => patchState(store, { isLoading: false }),
            }),
          );
        }),
      ),
    ),
  })),
);
