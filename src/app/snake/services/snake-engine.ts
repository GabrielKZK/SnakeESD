import { Injectable } from '@angular/core';

export interface Position { x: number; y: number; }

@Injectable({ providedIn: 'root' })
export class SnakeEngineService {
  board: number[][] = [];
  boardSize = 20;
  snakeBody: Position[] = [];
  occupiedPositions: Set<string> = new Set();
  foodPosition: Position | null = null;
  
  direction: Position = { x: 1, y: 0 };
  nextDirection: Position = { x: 1, y: 0 }; // Trava para evitar colisão instantânea
  
  gameOver = false;
  score = 0;

  constructor() {
    this.resetGame();
  }

  resetGame() {
    this.snakeBody = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    this.direction = { x: 1, y: 0 };
    this.nextDirection = { x: 1, y: 0 };
    this.gameOver = false;
    this.score = 0;
    
    this.updateOccupiedPositions();
    this.spawnFood();
    this.updateBoard();
  }

  updateOccupiedPositions() {
    this.occupiedPositions.clear();
    for (let segment of this.snakeBody) {
      this.occupiedPositions.add(`${segment.x},${segment.y}`);
    }
  }

  spawnFood() {
    let emptySpaces: Position[] = [];
    for (let y = 0; y < this.boardSize; y++) {
      for (let x = 0; x < this.boardSize; x++) {
        if (!this.occupiedPositions.has(`${x},${y}`)) {
          emptySpaces.push({ x, y });
        }
      }
    }
    if (emptySpaces.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptySpaces.length);
      this.foodPosition = emptySpaces[randomIndex];
    }
  }

  setNextDirection(newDir: Position) {
    // Impede a cobra de voltar pelo próprio pescoço (180 graus)
    if (this.direction.x !== 0 && newDir.x !== 0) return;
    if (this.direction.y !== 0 && newDir.y !== 0) return;
    
    this.nextDirection = newDir;
  }

  moveSnake() {
    if (this.gameOver) return;

    // Confirma a direção do turno atual
    this.direction = { ...this.nextDirection };

    const head = this.snakeBody[0];
    const newHead: Position = { 
      x: head.x + this.direction.x, 
      y: head.y + this.direction.y 
    };

    if (this.checkCollision(newHead)) {
      this.gameOver = true;
      return;
    }

    this.snakeBody.unshift(newHead);
    this.occupiedPositions.add(`${newHead.x},${newHead.y}`);

    if (this.foodPosition && newHead.x === this.foodPosition.x && newHead.y === this.foodPosition.y) {
      this.score += 10;
      this.spawnFood(); 
    } else {
      const tail = this.snakeBody.pop();
      if (tail) this.occupiedPositions.delete(`${tail.x},${tail.y}`);
    }
    
    this.updateBoard();
  }

  checkCollision(pos: Position): boolean {
    if (pos.x < 0 || pos.x >= this.boardSize || pos.y < 0 || pos.y >= this.boardSize) return true;
    if (this.occupiedPositions.has(`${pos.x},${pos.y}`)) return true;
    return false;
  }

  updateBoard() {
    this.board = Array(this.boardSize).fill(0).map(() => Array(this.boardSize).fill(0));
    
    // Pinta o corpo (1)
    for (let i = 1; i < this.snakeBody.length; i++) {
        const segment = this.snakeBody[i];
        this.board[segment.y][segment.x] = 1; 
    }
    
    // Pinta a cabeça (3) para o HTML saber quem é quem
    if (this.snakeBody.length > 0) {
        const head = this.snakeBody[0];
        this.board[head.y][head.x] = 3;
    }

    // Pinta a comida (2)
    if (this.foodPosition) {
      this.board[this.foodPosition.y][this.foodPosition.x] = 2;
    }
  }
}