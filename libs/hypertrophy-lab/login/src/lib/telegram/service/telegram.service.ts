import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable()
export class TelegramService {
  private window: any;
  tg: any;

  constructor(@Inject(DOCUMENT) private _document: Document) {
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
