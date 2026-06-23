import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { SnakeEngineService } from '../../services/snake-engine';

import { GameBoardComponent } from '../../components/game-board/game-board';
import { ScoreBoardComponent } from '../../components/score-board/score-board';
import { GameOverComponent } from '../../components/game-over/game-over';
import { LeaderboardComponent } from '../../pages/leaderboard/leaderboard';

@Component({
  selector: 'app-game-container',
  standalone: true,
  imports: [CommonModule, GameBoardComponent, ScoreBoardComponent, GameOverComponent, LeaderboardComponent],
  templateUrl: './game-container.html',
  styleUrls: ['./game-container.scss']
})
export class GameContainerComponent implements OnInit, OnDestroy {

  public highScore = 0;
  public levelUpBanner = false;

  private subscriptions = new Subscription();

  constructor(public snakeEngine: SnakeEngineService) { }

  ngOnInit(): void {
    this.loadHighScore();
    this.snakeEngine.resetGame();

    // CORREÇÃO: antes o próprio Angular controlava setInterval/velocidade
    // (startGameLoop, adjustSpeed). Agora quem decide quando a cobra se
    // move é o backend (SnakeEngine.java + GameManager.java), então o
    // componente só reage aos eventos que o service emite.
    this.subscriptions.add(
      this.snakeEngine.gameOverEvent.subscribe((finalScore) => this.saveHighScore(finalScore))
    );

    this.subscriptions.add(
      this.snakeEngine.levelUpEvent.subscribe(() => this.showLevelUpBanner())
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.snakeEngine.resetGame(); // garante que o socket é fechado ao sair da tela
  }

  private loadHighScore(): void {
    const savedScore = localStorage.getItem('snakeHighScore');
    this.highScore = savedScore ? parseInt(savedScore, 10) : 0;
  }

  private saveHighScore(finalScore: number): void {
    if (finalScore > this.highScore) {
      this.highScore = finalScore;
      localStorage.setItem('snakeHighScore', this.highScore.toString());
    }
  }

  private showLevelUpBanner(): void {
    this.levelUpBanner = true;
    setTimeout(() => (this.levelUpBanner = false), 1800);
  }

  public onRetry(): void {
    this.snakeEngine.resetGame();

  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    const key = event.key.toLowerCase();
    const validKeys = ['arrowup', 'w', 'arrowdown', 's', 'arrowleft', 'a', 'arrowright', 'd'];

    if (!validKeys.includes(key)) return;

    event.preventDefault(); 

    if (!this.snakeEngine.hasStarted && !this.snakeEngine.isGameOver) {
      this.snakeEngine.startGame();
    }

    switch (key) {
      case 'arrowup':
      case 'w':
        this.snakeEngine.changeDirection('UP');
        break;
      case 'arrowdown':
      case 's':
        this.snakeEngine.changeDirection('DOWN');
        break;
      case 'arrowleft':
      case 'a':
        this.snakeEngine.changeDirection('LEFT');
        break;
      case 'arrowright':
      case 'd':
        this.snakeEngine.changeDirection('RIGHT');
        break;
    }
  }
}