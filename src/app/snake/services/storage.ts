import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private highScoreKey = 'snakeHighScore';

  constructor() { }

  getHighScore(): number {
    const score = localStorage.getItem(this.highScoreKey);
    return score ? parseInt(score, 10) : 0;
  }

  saveHighScore(score: number): void {
    const currentHighScore = this.getHighScore();
    if (score > currentHighScore) {
      localStorage.setItem(this.highScoreKey, score.toString());
    }
  }
}