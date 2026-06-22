import { Component, ChangeDetectorRef,OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnakeEngineService } from '../../services/snake-engine';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-board.html',
  styleUrls: ['./game-board.scss']
})
export class GameBoardComponent implements OnInit {

  constructor(public engine: SnakeEngineService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.engine.stateUpdated.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  get board(): number[][] {
    return this.engine.board;
  }

}