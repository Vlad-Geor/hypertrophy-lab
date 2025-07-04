import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Renderer2, inject } from '@angular/core';
import { TelegramService } from '../telegram/service/telegram.service';

const APP_URL = 'https://68fe-2a06-c701-4cfc-3800-b148-bbd8-477f-cae0.ngrok-free.app';

@Component({
  selector: 'hl-login',
  imports: [CommonModule, NgTemplateOutlet],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [TelegramService],
})
export class LoginComponent implements AfterViewInit {
  private readonly renderer = inject(Renderer2);
  private readonly http = inject(HttpClient);
  telegram = inject(TelegramService);

  API_URL = `${APP_URL}/api/v1`;

  ngAfterViewInit(): void {
    this.loadTelegramWidget();
  }

  loadTelegramWidget(): void {
    // Create the script element
    const script = this.renderer.createElement('script');
    this.renderer.setAttribute(
      script,
      'src',
      'https://telegram.org/js/telegram-widget.js?22',
    );
    this.renderer.setAttribute(script, 'async', 'true');
    this.renderer.setAttribute(script, 'data-telegram-login', 'vlads_fitness_bot');
    this.renderer.setAttribute(script, 'data-size', 'large');
    this.renderer.setAttribute(script, 'data-auth-url', `${this.API_URL}/auth/telegram`);
    this.renderer.setAttribute(script, 'data-callback', 'onTelegramAuth');
    // Append the script to the desired DOM element
    const targetElement = this.renderer.selectRootElement('#telegram-login-btn', true);
    this.renderer.appendChild(targetElement, script);
  }

  onTelegramAuth(authData: any) {
    console.log('entered onTelegramAuth');
    this.http
      .post(`${this.API_URL}/login-success`, authData)
      .subscribe((response: any) => {
        localStorage.setItem('authToken', response.token);
      });
  }
}
