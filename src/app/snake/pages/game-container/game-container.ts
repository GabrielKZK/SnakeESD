import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnakeEngineService } from '../../services/snake-engine'; // Ajuste o caminho se necessário

// Importe seus componentes visuais
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
  private intervalId: any;
  
  public highScore: number = 0;
  private baseSpeed: number = 180; // Inicia um pouco mais devagar
  private currentSpeed: number = 180;
  private minimumSpeed: number = 60; // Limite máximo de velocidade (menor tempo)

  constructor(public snakeEngine: SnakeEngineService) {}

  ngOnInit(): void {
    this.loadHighScore();
    this.snakeEngine.resetGame();
  }

  ngOnDestroy(): void {
    this.clearGameLoop();
  }

  private loadHighScore(): void {
    const savedScore = localStorage.getItem('snakeHighScore');
    this.highScore = savedScore ? parseInt(savedScore, 10) : 0;
  }

  private saveHighScore(): void {
    if (this.snakeEngine.score > this.highScore) {
      this.highScore = this.snakeEngine.score;
      localStorage.setItem('snakeHighScore', this.highScore.toString());
    }
  }

  private startGameLoop(): void {
    this.clearGameLoop();
    this.intervalId = setInterval(() => {
      if (this.snakeEngine.isGameOver) {
        this.saveHighScore();
        this.clearGameLoop();
        return;
      }

      this.snakeEngine.moveSnake();
      this.adjustSpeed();
    }, this.currentSpeed);
  }

  private clearGameLoop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private adjustSpeed(): void {
    // Aumenta a velocidade (diminui o intervalo em ms) a cada 50 pontos
    const speedReduction = Math.floor(this.snakeEngine.score / 50) * 15;
    const newSpeed = Math.max(this.minimumSpeed, this.baseSpeed - speedReduction);

    if (newSpeed !== this.currentSpeed) {
      this.currentSpeed = newSpeed;
      this.startGameLoop(); // Reinicia o intervalo com a nova velocidade
    }
  }

  public onRetry(): void {
    this.snakeEngine.resetGame();
    this.currentSpeed = this.baseSpeed;
    // O loop só começa quando o jogador apertar uma tecla
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    const validKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    
    if (validKeys.includes(event.key)) {
      event.preventDefault(); 
      
      // Inicia o jogo no primeiro clique válido
      if (!this.snakeEngine.hasStarted && !this.snakeEngine.isGameOver) {
        this.snakeEngine.startGame();
        this.startGameLoop();
      }

      switch (event.key) {
        case 'ArrowUp': this.snakeEngine.changeDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': this.snakeEngine.changeDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': this.snakeEngine.changeDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': this.snakeEngine.changeDirection({ x: 1, y: 0 }); break;
      }
    }
  }
}