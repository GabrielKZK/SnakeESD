import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.html',
  styleUrls: ['./game-board.scss']
})
export class GameBoardComponent {
  @Input() matriz: number[][] = [];
}