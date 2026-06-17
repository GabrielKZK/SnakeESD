import { Injectable } from '@angular/core';

export interface Position {
  x: number;
  y: number;
}

@Injectable({ providedIn: 'root' })
export class SnakeEngineService {
  public board: number[][] = [];
  public readonly boardSize = 20;
  
  public snakeBody: Position[] = [];
  private occupiedPositions: Set<string> = new Set();
  public foodPosition: Position | null = null;
  
  public currentDirection: Position = { x: 1, y: 0 };
  public nextDirection: Position = { x: 1, y: 0 };
  
  public score = 0;
  public isGameOver = false;
  public hasStarted = false;

  constructor() {
    this.resetGame();
  }

  // Prepara o estado inicial sem rodar o jogo
  public resetGame(): void {
    // Cobra nasce alinhada na horizontal: Cabeça no x:5, corpo no 4 e 3.
    this.snakeBody = [{ x: 5, y: 10 }, { x: 4, y: 10 }, { x: 3, y: 10 }];
    this.currentDirection = { x: 1, y: 0 };
    this.nextDirection = { x: 1, y: 0 };
    this.isGameOver = false;
    this.hasStarted = false;
    this.score = 0;
    
    this.updateOccupiedPositions();
    this.generateFood();
    this.updateBoard();
  }

  // Altera o status para iniciado
  public startGame(): void {
    this.hasStarted = true;
  }

  // Valida e registra a intenção de mudança de direção do jogador
  public changeDirection(newDir: Position): void {
    // Impede inversão de 180 graus baseada na direção ATUAL do frame
    if (this.currentDirection.x !== 0 && newDir.x !== 0) return;
    if (this.currentDirection.y !== 0 && newDir.y !== 0) return;
    
    this.nextDirection = newDir;
  }

  // Lógica principal de movimentação executada a cada frame
  public moveSnake(): void {
    if (this.isGameOver || !this.hasStarted) return;

    // Trava a direção que será executada neste frame
    this.currentDirection = { ...this.nextDirection };

    const head = this.snakeBody[0];
    const newHead: Position = { 
      x: head.x + this.currentDirection.x, 
      y: head.y + this.currentDirection.y 
    };

    if (this.checkCollision(newHead)) {
      this.isGameOver = true;
      return;
    }

    // Verifica se a nova cabeça está na mesma posição da comida
    const ateFood = this.foodPosition && newHead.x === this.foodPosition.x && newHead.y === this.foodPosition.y;

    if (ateFood) {
      this.growSnake(newHead);
    } else {
      // Movimento normal: adiciona nova cabeça e remove a cauda
      this.snakeBody.unshift(newHead);
      this.occupiedPositions.add(`${newHead.x},${newHead.y}`);
      
      const tail = this.snakeBody.pop();
      if (tail) {
        this.occupiedPositions.delete(`${tail.x},${tail.y}`);
      }
    }
    
    this.updateBoard();
  }

  private growSnake(newHead: Position): void {
    // Adiciona nova cabeça sem remover a cauda (crescimento)
    this.snakeBody.unshift(newHead);
    this.occupiedPositions.add(`${newHead.x},${newHead.y}`);
    this.score += 10;
    this.generateFood();
  }

  private checkCollision(pos: Position): boolean {
    // Colisão com as paredes
    if (pos.x < 0 || pos.x >= this.boardSize || pos.y < 0 || pos.y >= this.boardSize) {
      return true;
    }
    // Colisão com o próprio corpo (utilizando Set para performance O(1))
    if (this.occupiedPositions.has(`${pos.x},${pos.y}`)) {
      return true;
    }
    return false;
  }

  private generateFood(): void {
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

  private updateOccupiedPositions(): void {
    this.occupiedPositions.clear();
    for (const segment of this.snakeBody) {
      this.occupiedPositions.add(`${segment.x},${segment.y}`);
    }
  }

  public updateBoard(): void {
    // Zera a matriz
    this.board = Array(this.boardSize).fill(0).map(() => Array(this.boardSize).fill(0));
    
    // Pinta o corpo (1)
    for (let i = 1; i < this.snakeBody.length; i++) {
        const segment = this.snakeBody[i];
        this.board[segment.y][segment.x] = 1; 
    }
    
    // Pinta a cabeça (3)
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