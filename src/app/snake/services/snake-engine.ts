import { Injectable } from '@angular/core';

export interface Position {
  x: number;
  y: number;
}

@Injectable({
  providedIn: 'root'
})
export class SnakeEngineService {
  // 1. ESTRUTURA DE DADOS: Matriz 2D
  // Representa o tabuleiro (0 = vazio, 1 = cobra, 2 = comida)
  board: number[][] = [];
  boardSize = 20;

  // 2. ESTRUTURA DE DADOS: Fila (Deque)
  // O índice 0 é a cabeça. Usamos unshift() para andar e pop() para remover o rabo.
  snakeBody: Position[] = [];

  // 3. ESTRUTURA DE DADOS: Hash Set
  // Guarda as posições do corpo em String ('x,y') para checar colisões em tempo O(1)
  occupiedPositions: Set<string> = new Set();

  foodPosition: Position | null = null;
  direction: Position = { x: 1, y: 0 }; // Inicia movendo para a direita
  gameOver = false;
  score = 0;

  constructor() {
    this.resetGame();
  }

  resetGame() {
    this.snakeBody = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    this.direction = { x: 1, y: 0 };
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
        // Usa o Hash Set para checar rapidamente se o espaço está vazio
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

  moveSnake() {
    if (this.gameOver) return;

    const head = this.snakeBody[0];
    const newHead: Position = {
      x: head.x + this.direction.x,
      y: head.y + this.direction.y
    };

    if (this.checkCollision(newHead)) {
      this.gameOver = true;
      return;
    }

    // Move a cabeça (Adiciona no Início da Fila)
    this.snakeBody.unshift(newHead);
    this.occupiedPositions.add(`${newHead.x},${newHead.y}`);

    // Verifica se comeu a comida
    if (this.foodPosition && newHead.x === this.foodPosition.x && newHead.y === this.foodPosition.y) {
      this.score += 10;
      this.spawnFood(); // Cria nova comida (não remove a cauda, então ela cresce)
    } else {
      // Se não comeu, remove a ponta da cauda (Remove do Fim da Fila)
      const tail = this.snakeBody.pop();
      if (tail) {
        this.occupiedPositions.delete(`${tail.x},${tail.y}`);
      }
    }

    this.updateBoard();
  }

  checkCollision(pos: Position): boolean {
    // Verifica colisão com as paredes
    if (pos.x < 0 || pos.x >= this.boardSize || pos.y < 0 || pos.y >= this.boardSize) {
      return true;
    }
    // Verifica auto-colisão usando o Hash Set (O(1) de performance)
    if (this.occupiedPositions.has(`${pos.x},${pos.y}`)) {
      return true;
    }
    return false;
  }

  updateBoard() {
    // Zera a matriz preenchendo com zeros
    this.board = Array(this.boardSize).fill(0).map(() => Array(this.boardSize).fill(0));

    // Pinta o corpo da cobra com número 1
    for (let segment of this.snakeBody) {
      this.board[segment.y][segment.x] = 1;
    }

    // Pinta a comida com o número 2
    if (this.foodPosition) {
      this.board[this.foodPosition.y][this.foodPosition.x] = 2;
    }
  }
}