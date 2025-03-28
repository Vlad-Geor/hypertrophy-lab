import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '@ikigaidev/header';
import { NavigationComponent } from '@ikigaidev/navigation';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    HeaderComponent,
    NavigationComponent,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'hypertrophy-lab';
}
