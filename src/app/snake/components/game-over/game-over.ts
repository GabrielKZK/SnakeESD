import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-over',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-over.html',
  styleUrls: ['./game-over.scss']
})
export class GameOverComponent {
  @Input() finalScore: number = 0;
  @Output() onRetry = new EventEmitter<void>();
}