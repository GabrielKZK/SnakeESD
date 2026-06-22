import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// Componente novo: exibe o leaderboard DINÂMICO que o GameManager.java
// transmite a cada ~300ms (ver broadcastLiveLeaderboard). Diferente do
// ranking histórico (REST, /api/scores/ranking), este muda durante a
// própria partida, mostrando quem está na frente agora.
@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leaderboard.html',
  styleUrls: ['./leaderboard.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeaderboardComponent {
  @Input() entries: string[] = [];
}