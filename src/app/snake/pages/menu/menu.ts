import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.html',
  styleUrls: ['./menu.scss']
})
export class MenuComponent {

  constructor(private router: Router) {}

  iniciarJogo() {
    this.router.navigate(['/game']);
  }
}