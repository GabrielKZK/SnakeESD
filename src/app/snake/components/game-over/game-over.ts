import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-game-over',
  templateUrl: './game-over.html',
  styleUrls: ['./game-over.scss']
})
export class GameOverComponent {
  @Input() finalScore: number = 0;
  @Output() onRetry = new EventEmitter<void>();

  public retry(): void {
    this.onRetry.emit();
  }
}