import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '@ikigaidev/footer';
import { HeaderComponent } from '@ikigaidev/header';
import { NavigationComponent } from '@ikigaidev/navigation';

@Component({
  standalone: true,
  imports: [
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
