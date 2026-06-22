import { Injectable, EventEmitter } from '@angular/core';

export interface GameState {
  matrix: number[][];
  score: number;
  level: number;
  isLevelUp: boolean;
  isGameOver: boolean;
}

interface WsEnvelope<T> {
  type: 'STATE' | 'LEADERBOARD';
  payload: T;
}

@Injectable({ providedIn: 'root' })
export class SnakeEngineService {

  private readonly wsUrl = 'ws://localhost:8080/game';
  private socket: WebSocket | null = null;
  private pendingDirection: string | null = null; // Guarda a primeira tecla!

  public board: number[][] = [];
  public score = 0;
  public level = 1;
  public isGameOver = false;
  public hasStarted = false;
  public currentDirection = { x: 1, y: 0 };
  public liveLeaderboard: string[] = [];

  public gameOverEvent = new EventEmitter<number>();
  public levelUpEvent = new EventEmitter<number>();

  resetGame(): void {
    this.closeSocket();
    const emptyBoard = Array.from({ length: 20 }, () => Array(20).fill(0));
    
    // Cobra de enfeite neon
    emptyBoard[10][10] = 3; 
    emptyBoard[10][9] = 1;  
    emptyBoard[10][8] = 1;  
    emptyBoard[5][15] = 2;  
    
    this.board = emptyBoard;
    this.score = 0;
    this.level = 1;
    this.isGameOver = false;
    this.hasStarted = false;
    this.currentDirection = { x: 1, y: 0 };
    this.pendingDirection = null;
  }

  startGame(): void {
    if (this.hasStarted) return;
    this.hasStarted = true;
    this.connect();
  }

  changeDirection(command: string): void {
    switch (command) {
      case 'UP':    this.currentDirection = { x: 0, y: -1 }; break;
      case 'DOWN':  this.currentDirection = { x: 0, y: 1 }; break;
      case 'LEFT':  this.currentDirection = { x: -1, y: 0 }; break;
      case 'RIGHT': this.currentDirection = { x: 1, y: 0 }; break;
    }

    // Se o socket ainda não abriu, guarda o comando para mandar depois
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      this.pendingDirection = command;
      return;
    }

    this.socket.send(command);
  }

  private connect(): void {
    this.socket = new WebSocket(this.wsUrl);

    // MÁGICA AQUI: Quando conectar, manda o comando que ficou esperando
    this.socket.onopen = () => {
      if (this.pendingDirection) {
        this.socket?.send(this.pendingDirection);
        this.pendingDirection = null;
      } else {
        this.socket?.send('RIGHT'); // Garante que o Java inicie
      }
    };

    this.socket.onmessage = (event: MessageEvent) => this.handleMessage(event);

    this.socket.onerror = (err) => console.error('Erro no WebSocket:', err);
    this.socket.onclose = () => { this.socket = null; };
  }

  private handleMessage(event: MessageEvent): void {
    const msg: WsEnvelope<any> = JSON.parse(event.data);

    switch (msg.type) {
      case 'STATE':
        const statePayload = msg.payload; 
        const state: GameState = {
          matrix: statePayload.matrix || statePayload.board, // Funciona independente do nome no Java
          score: statePayload.score,
          level: statePayload.level,         
          isLevelUp: statePayload.isLevelUp, 
          isGameOver: statePayload.isGameOver || statePayload.gameOver 
        };
        this.applyState(state);
        break;

      case 'LEADERBOARD':
        this.liveLeaderboard = msg.payload;
        break;
    }
  }

  private applyState(state: GameState): void {
    if (!state.matrix) return; // Proteção contra pacotes vazios
    
    this.board = state.matrix;
    this.score = state.score;
    this.level = state.level;

    if (state.isLevelUp) {
      this.levelUpEvent.emit(state.level);
    }

    if (state.isGameOver && !this.isGameOver) {
      this.isGameOver = true;
      this.gameOverEvent.emit(state.score);
      this.closeSocket();
    } else {
      this.isGameOver = state.isGameOver;
    }
  }

  private closeSocket(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}