import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '@ikigaidev/footer';
import { HeaderComponent } from '@ikigaidev/header';
import { NavigationComponent } from '@ikigaidev/navigation';
import { NxWelcomeComponent } from './nx-welcome.component';

@Component({
  standalone: true,
  imports: [
    NxWelcomeComponent,
    RouterModule,
    FooterComponent,
    HeaderComponent,
    NavigationComponent,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'hypertrophy-lab';
}
