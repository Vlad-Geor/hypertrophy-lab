import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed, inject } from '@angular/core';
import { Group, GroupSupplementListItem } from '@ikigaidev/contracts';
import { InventoryItemSummary } from '@ikigaidev/hl/contracts';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import {
  auditTime,
  catchError,
  debounceTime,
  EMPTY,
  exhaustMap,
  forkJoin,
  map,
  pipe,
  switchMap,
  tap,
} from 'rxjs';
import { UserSupplementOverview } from '../supplement-card/supplement-card.component';
import { GroupsService } from './groups.service';
import {
  fromGroupSupplementListItem,
  fromInventoryItemSummary,
} from './mapper/to-user-supplement-overview.model';
import { SupplementService } from './supplement.service';

type SupplementsState = {
  userPrivateSupplements: InventoryItemSummary[];
  userGroupSupplements: GroupSupplementListItem[];
  groupsResponse: Group[];
  searchFilter: string;
  userSupplementsLoading: boolean;
  groupSupplementsLoading: boolean;
  groupRequestError: string | null;
  isError: boolean;
};

const initialState: SupplementsState = {
  isError: false,
  userSupplementsLoading: false,
  groupSupplementsLoading: false,
  groupRequestError: null,
  userPrivateSupplements: [],
  userGroupSupplements: [],
  groupsResponse: [],
  searchFilter: '',
};

export const SupplementStore = signalStore(
  withDevtools('supplements'),
  withState(initialState),
  withComputed((store) => ({
    supplementDataLoading: computed(
      () => store.userSupplementsLoading || store.groupSupplementsLoading,
    ),
    userSupplementData: computed<UserSupplementOverview[]>(() => [
      ...store.userPrivateSupplements().map(fromInventoryItemSummary),
      ...store.userGroupSupplements().map(fromGroupSupplementListItem),
    ]),
  })),
  withComputed((store) => ({
    userSupplementCount: computed(() => store.userSupplementData()?.length),
    filteredUserSupplements: computed(() =>
      store
        .userSupplementData()
        ?.filter((us) =>
          us.catalogName?.toLowerCase().startsWith(store.searchFilter().toLowerCase()),
        ),
    ),
  })),
  withMethods(
    (
      store,
      supplementService = inject(SupplementService),
      groupsService = inject(GroupsService),
    ) => ({
      setSearchFilter(query: string): void {
        updateState(store, '[Supplements] Search Filter Input', (_) => ({
          searchFilter: query,
        }));
      },
      getGroupSupplements: rxMethod<void>(
        pipe(
          debounceTime(8000),
          tap(() =>
            updateState(store, '[Groups] Get All Groups', {
              groupSupplementsLoading: true,
            }),
          ),
          switchMap(() =>
            groupsService.getAllGroups().pipe(
              tap((groups) =>
                updateState(store, '[Groups] Get All Groups Success', {
                  groupSupplementsLoading: false,
                  groupsResponse: groups,
                }),
              ),
            ),
          ),
          switchMap((groups) => {
            if (!groups.length) {
              return EMPTY;
            }
            const perGroup$ = groups.map((g) =>
              groupsService
                .getGroupSupplements(g.id)
                .pipe(map((groupSupps) => [g.id, groupSupps] as const)),
            );

            return forkJoin(perGroup$).pipe(
              tap((entries) => {
                const allGroupSupps = entries.flatMap(([groupName, supps]) => supps);
                updateState(store, '[Groups] Get Supplements Per Group Success', {
                  groupsResponse: groups,
                  userGroupSupplements: allGroupSupps,
                  groupSupplementsLoading: false,
                });
              }),
              catchError((err) => {
                updateState(store, '[Groups] Get Supplements Per Group Error', {
                  groupSupplementsLoading: false,
                  groupRequestError: err,
                });
                return EMPTY;
              }),
            );
          }),
        ),
      ),
      getUserSupplements: rxMethod<boolean | undefined>(
        pipe(
          map((force) => !!force),
          auditTime(0),
          exhaustMap((forceLoad) => {
            if (!forceLoad) {
              if (store.userSupplementsLoading()) return EMPTY;
              const userSupps = store.userPrivateSupplements();
              const empty =
                !userSupps ||
                (Array.isArray(userSupps)
                  ? userSupps.length === 0
                  : Object.keys(userSupps).length === 0);
              if (!empty) return EMPTY;
            }
            updateState(store, '[Supplements] Get user Supplements', {
              userSupplementsLoading: true,
            });
            return supplementService.getUserSupplements().pipe(
              tapResponse({
                next: (v) =>
                  updateState(store, '[Supplements] Get user Supplements Success', {
                    userPrivateSupplements: v.items,
                  }),
                error: (e) => {
                  console.error(e);
                  patchState(store, { isError: true });
                },
                finalize: () =>
                  updateState(store, '[Supplements] Get user finalize', {
                    userSupplementsLoading: false,
                  }),
              }),
            );
          }),
        ),
      ),
    }),
  ),
  withHooks({
    onInit: (store) => {
      store.getGroupSupplements();
    },
  }),
);
