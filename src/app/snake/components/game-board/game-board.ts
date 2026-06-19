import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-board.html',
  styleUrls: ['./game-board.scss']
})
export class GameBoardComponent {
  @Input() matriz: number[][] = [];
  @Input() direction: { x: number, y: number } = { x: 1, y: 0 };

  // Função para girar a cabeça do triângulo dependendo de onde a cobra vai
  getHeadRotation(): string {
    if (this.direction.x === 1) return 'rotate(90deg)';   // Direita
    if (this.direction.x === -1) return 'rotate(-90deg)'; // Esquerda
    if (this.direction.y === 1) return 'rotate(180deg)';  // Baixo
    return 'rotate(0deg)';                                // Cima
  }
}