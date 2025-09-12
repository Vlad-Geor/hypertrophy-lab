import { DOCUMENT, Injectable, inject } from '@angular/core';

@Injectable()
export class TelegramService {
  private readonly _document = inject(DOCUMENT);

  private window: any;
  tg: any;

  constructor() {
    this.window = this._document?.defaultView;
    this.tg = this.window?.Telegram?.WebApp;
  }

  get mainButton(): any {
    return this.tg.MainButton;
  }

  get backButton(): any {
    return this.tg.BackButton;
  }

  get telegram(): any {
    return this.tg;
  }

  get initData(): any {
    return this.tg.initDataUnsafe;
  }

  sendData(data: object) {
    this.tg.sendData(JSON.stringify(data));
  }

  ready() {
    this.tg.ready();
  }

  closeApp() {
    this.tg.close();
  }
}
