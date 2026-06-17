import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnakeEngineService } from '../../services/snake-engine';
import { Subscription, interval } from 'rxjs';

import { GameBoardComponent } from '../../components/game-board/game-board';
import { ScoreBoardComponent } from '../../components/score-board/score-board';
import { GameOverComponent } from '../../components/game-over/game-over';

@Component({
  selector: 'app-game-container',
  standalone: true,
  imports: [CommonModule, GameBoardComponent, ScoreBoardComponent, GameOverComponent],
  templateUrl: './game-container.html',
  styleUrls: ['./game-container.scss']
})
export class GameContainerComponent implements OnInit, OnDestroy {
  private gameLoopSubscription?: Subscription;
  highScore: number = 0;

  constructor(public snakeEngine: SnakeEngineService) {}

  ngOnInit() {
    this.highScore = Number(localStorage.getItem('snakeHighScore')) || 0;
    this.iniciar();
  }

  iniciar() {
    this.snakeEngine.resetGame();
    this.startGameLoop();
  }

  startGameLoop() {
    if (this.gameLoopSubscription) this.gameLoopSubscription.unsubscribe();
    
    // Velocidade do jogo (120ms = fluido igual ao do Google)
    this.gameLoopSubscription = interval(120).subscribe(() => {
      if (!this.snakeEngine.gameOver) {
        this.snakeEngine.moveSnake();
      } else {
        if (this.snakeEngine.score > this.highScore) {
          this.highScore = this.snakeEngine.score;
          localStorage.setItem('snakeHighScore', this.highScore.toString());
        }
      }
    });
  }

  reiniciarJogo() {
    this.iniciar();
  }

  ngOnDestroy() {
    if (this.gameLoopSubscription) this.gameLoopSubscription.unsubscribe();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault(); 
    }
    
    switch (event.key) {
      case 'ArrowUp': 
        this.snakeEngine.setNextDirection({ x: 0, y: -1 }); 
        break;
      case 'ArrowDown': 
        this.snakeEngine.setNextDirection({ x: 0, y: 1 }); 
        break;
      case 'ArrowLeft': 
        this.snakeEngine.setNextDirection({ x: -1, y: 0 }); 
        break;
      case 'ArrowRight': 
        this.snakeEngine.setNextDirection({ x: 1, y: 0 }); 
        break;
    }
  }
}