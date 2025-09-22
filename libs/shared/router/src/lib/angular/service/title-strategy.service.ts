import { Injectable } from '@angular/core';
import { TitleStrategy, RouterStateSnapshot } from '@angular/router';
import { RouteMeta } from '../model/route-meta';

@Injectable({ providedIn: 'root' })
export class MetaTitleStrategy extends TitleStrategy {
  override updateTitle(snapshot: RouterStateSnapshot) {
    const deepest = this.buildTitle(snapshot); // uses route.data['title'] if present
    const meta = snapshot.root.firstChild?.data?.['meta'] as RouteMeta | undefined;
    const header = meta?.header && typeof meta.header === 'string' ? meta.header : undefined;
    const title = header ?? deepest ?? 'Hypertrophy Lab';
    document.title = title;
  }
}
