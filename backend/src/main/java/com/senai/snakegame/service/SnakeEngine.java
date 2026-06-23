package com.senai.snakegame.service;

import com.senai.snakegame.enums.Direction;
import com.senai.snakegame.dto.StateGameDTO;
import com.senai.snakegame.model.Partes;

import java.util.*;

public class SnakeEngine {

  // fase 1. Quanto menor o número, mais rápida a cobra. A cada fase
  private static final int BASE_TICKS_PER_MOVE = 2;
  private static final int MIN_TICKS_PER_MOVE = 1;

  private final int ROWS;
  private final int COLUMNS;
  private final Random rand = new Random();

  private Deque<Partes> snake;
  private Set<Partes> snakeBodySet;
  private int[][] board;

  private Partes food;
  private int score;
  private int level;
  private boolean isGameOver;
  private boolean isLevelUp;
  private volatile Direction currentDirection;

  private int ticksPerMove;
  private int tickCounter;

  public SnakeEngine(int rows, int columns) {
    this.ROWS = rows;
    this.COLUMNS = columns;
    startGame();
  }

  public void startGame() {
    board = new int[ROWS][COLUMNS];
    score = 0;
    level = 1;
    isGameOver = false;
    isLevelUp = false;
    ticksPerMove = BASE_TICKS_PER_MOVE;
    tickCounter = 0;

    spawnSnake();
    spawnFood();
  }

<<<<<<< HEAD
=======
  // Recoloca a cobra no centro com o tamanho inicial (3). Usado tanto no
  // começo do jogo quanto ao avançar de fase.
>>>>>>> 4dc9e723c7610734083ffbc037c08f5f137d542c
  private void spawnSnake() {
    snake = new LinkedList<>();
    snakeBodySet = new HashSet<>();
    for (int i = 2; i >= 0; i--) {
      Partes p = new Partes(COLUMNS / 2 - i, ROWS / 2);
      snake.addFirst(p);
      snakeBodySet.add(p);
    }
    currentDirection = Direction.RIGHT;
  }

  private void spawnFood() {
<<<<<<< HEAD
=======
    // ANTES: quando a cobra preenchia o tabuleiro inteiro, isso marcava
    // isGameOver = true (fim de jogo / "vitória"). AGORA: em vez de
    // terminar, avança para a próxima fase, mantendo a pontuação e ficando mais rápido na próxima fase.
>>>>>>> 4dc9e723c7610734083ffbc037c08f5f137d542c
    if (snakeBodySet.size() == ROWS * COLUMNS) {
      advanceLevel();
      return;
    }
    Partes newFood;
    do {
      newFood = new Partes(rand.nextInt(COLUMNS), rand.nextInt(ROWS));
    } while (snakeBodySet.contains(newFood));
    this.food = newFood;
  }

  private void advanceLevel() {
    level++;
<<<<<<< HEAD
    isLevelUp = true; 
    spawnSnake();
    ticksPerMove = Math.max(MIN_TICKS_PER_MOVE, BASE_TICKS_PER_MOVE - (level - 1));
    spawnFood(); 
=======
    isLevelUp = true; // flag de um único tick, consumida em getGameState()
    spawnSnake();
    ticksPerMove = Math.max(MIN_TICKS_PER_MOVE, BASE_TICKS_PER_MOVE - (level - 1));
    spawnFood(); // agora o tabuleiro não está mais cheio, gera comida normalmente
>>>>>>> 4dc9e723c7610734083ffbc037c08f5f137d542c
  }

  public void changeDirection(Direction dir) {
    if (dir != null && !isOpposite(dir)) {
      this.currentDirection = dir;
    }
  }


  public StateGameDTO processTick() {
    if (isGameOver) return getGameState();

    tickCounter++;
    if (tickCounter < ticksPerMove) {
      return null;
    }
    tickCounter = 0;
    //Para que a cabeça não nasça dentro do corpo, assim ela não morre instantânemente.
    Partes head = snake.peekFirst();
    assert head != null;
    int newX = head.x();
    int newY = head.y();

    switch (currentDirection) {
      case UP -> newY--;
      case DOWN -> newY++;
      case LEFT -> newX--;
      case RIGHT -> newX++;
    }

    Partes newHead = new Partes(newX, newY);

    if (newX < 0 || newX >= COLUMNS || newY < 0 || newY >= ROWS) {
      isGameOver = true;
      return getGameState();
    }

    if (snakeBodySet.contains(newHead)) {
      isGameOver = true;
      return getGameState();
    }

    snake.addFirst(newHead);
    snakeBodySet.add(newHead);

    if (newHead.equals(food)) {
      score += 10;
      spawnFood();
    } else {
      Partes tail = snake.removeLast();
      snakeBodySet.remove(tail);
    }

    return getGameState();
  }

  private boolean isOpposite(Direction dir) {
    return (currentDirection == Direction.UP && dir == Direction.DOWN) ||
      (currentDirection == Direction.DOWN && dir == Direction.UP) ||
      (currentDirection == Direction.LEFT && dir == Direction.RIGHT) ||
      (currentDirection == Direction.RIGHT && dir == Direction.LEFT);
  }

  private StateGameDTO getGameState() {
    for (int[] row : board) {
      Arrays.fill(row, 0);
    }

    board[food.y()][food.x()] = 2;

    for (Partes p : snake) {
      board[p.y()][p.x()] = 1;
    }

<<<<<<< HEAD
=======
    // CORREÇÃO: a cabeça era marcada igual ao resto do corpo (1), então
    // o triângulo de rotação no Angular (celula === 3) nunca aparecia.
    // Agora a cabeça sobrescreve sua própria célula com o valor 3.
>>>>>>> 4dc9e723c7610734083ffbc037c08f5f137d542c
    Partes head = snake.peekFirst();
    if (head != null) {
      board[head.y()][head.x()] = 3;
    }

    StateGameDTO state = new StateGameDTO(board, score, level, isLevelUp, isGameOver);
<<<<<<< HEAD
    isLevelUp = false; 
=======
    isLevelUp = false; // a flag só deve viajar "true" no tick exato da mudança de fase
>>>>>>> 4dc9e723c7610734083ffbc037c08f5f137d542c
    return state;
  }
}