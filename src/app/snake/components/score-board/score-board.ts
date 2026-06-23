import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-score-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './score-board.html',
  styleUrls: ['./score-board.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScoreBoardComponent {
  @Input() score: number = 0;
  @Input() highScore: number = 0;
  @Input() level: number = 1;
}