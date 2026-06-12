import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-score-board',
  templateUrl: './score-board.html',
  styleUrls: ['./score-board.scss']
})
export class ScoreBoardComponent {
  @Input() score: number = 0;
  @Input() highScore: number = 0;
}