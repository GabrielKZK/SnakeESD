import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { SnakeEngineService } from '../../services/snake-engine';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-game-container',
  templateUrl: './game-container.html',
  styleUrls: ['./game-container.scss']
})
export class GameContainerComponent implements OnInit, OnDestroy {
  private gameLoopSubscription?: Subscription;

  // Injeta o seu serviço de Lógica
  constructor(public snakeEngine: SnakeEngineService) {}

  ngOnInit() {
    this.snakeEngine.resetGame();
    this.startGameLoop();
  }

  startGameLoop() {
    // Define a velocidade do jogo (150ms). Quanto menor, mais rápido.
    this.gameLoopSubscription = interval(150).subscribe(() => {
      if (!this.snakeEngine.gameOver) {
        this.snakeEngine.moveSnake();
      }
    });
  }

  ngOnDestroy() {
    // Para o jogo se o usuário sair da tela (evita memory leaks)
    if (this.gameLoopSubscription) {
      this.gameLoopSubscription.unsubscribe();
    }
  }

  // Escuta os botões do teclado (Setas)
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    // Evita que a página role para baixo ao apertar as setas
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault(); 
    }

    switch (event.key) {
      case 'ArrowUp':
        if (this.snakeEngine.direction.y === 0) this.snakeEngine.direction = { x: 0, y: -1 };
        break;
      case 'ArrowDown':
        if (this.snakeEngine.direction.y === 0) this.snakeEngine.direction = { x: 0, y: 1 };
        break;
      case 'ArrowLeft':
        if (this.snakeEngine.direction.x === 0) this.snakeEngine.direction = { x: -1, y: 0 };
        break;
      case 'ArrowRight':
        if (this.snakeEngine.direction.x === 0) this.snakeEngine.direction = { x: 1, y: 0 };
        break;
    }
  }
}