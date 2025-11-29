import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  private http = inject(HttpClient);

  private usdToIls$ = this.http
    .get<{
      rates: { ILS: number };
    }>('https://api.frankfurter.dev/v1/latest?from=USD&to=ILS')
    .pipe(map((r) => r.rates.ILS));

  private usdToIlsRate = toSignal(this.usdToIls$);

  usdToIls = (usdAmount: number) => (this.usdToIlsRate() ?? 1) * usdAmount;
}
