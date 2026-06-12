package com.senai.snakegame.service;

import com.senai.snakegame.enums.Direction;
import com.senai.snakegame.dto.StateGameDTO;
import com.senai.snakegame.model.Partes;
import java.util.*;


public class SnakeEngine {
  private final int ROWS;
  private final int COLUMNS;

  private Deque<Partes> snake; // Fila dupla para o corpo
  private Set<Partes> snakeBodySet; // Set para busca O(1) de colisões
  private int[][] board; // Matriz bidimensional

  private Partes food;
  private int score;
  private boolean isGameOver;
  private volatile Direction currentDirection;

  public SnakeEngine(int rows, int columns) {
    this.ROWS = rows;
    this.COLUMNS = columns;
    startGame();
  }

  public void startGame() {
    snake = new LinkedList<>();
    snakeBodySet = new HashSet<>();
    board = new int[ROWS][COLUMNS];
    score = 0;
    isGameOver = false;
    currentDirection = Direction.RIGHT;

    // Cobra nasce no meio (tamanho 3)
    for (int i = 2; i >= 0; i--) {
      Partes p = new Partes(COLUMNS / 2 - i, ROWS / 2);
      snake.addFirst(p);
      snakeBodySet.add(p);
    }
    spawnFood();
  }

  private void spawnFood() {
    Random rand = new Random();
    Partes newFood;
    if (snakeBodySet.size() == ROWS * COLUMNS) {
      isGameOver = true; // O jogador venceu!
      return;
    }
    do {
      newFood = new Partes(rand.nextInt(COLUMNS), rand.nextInt(ROWS));
    } while (snakeBodySet.contains(newFood)); // Garante que a comida não caia dentro da cobra
    this.food = newFood;
  }

  public void changeDirection(Direction dir) {
    if (dir != null && !isOpposite(dir)) {
      this.currentDirection = dir;
    }
  }

  public StateGameDTO processTick() {
    if (isGameOver) return getGameState();

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

    // Verifica Colisão com Paredes
    if (newX < 0 || newX >= COLUMNS || newY < 0 || newY >= ROWS) {
      isGameOver = true;
      return getGameState();
    }

    // Verifica Colisão com o Próprio Corpo
    if (snakeBodySet.contains(newHead)) {
      isGameOver = true;
      return getGameState();
    }

    // Move a cobra
    snake.addFirst(newHead);
    snakeBodySet.add(newHead);

    // Verifica se comeu a comida
    if (newHead.equals(food)) {
      score += 10;
      spawnFood();
    } else {
      // Se não comeu, remove o rabo da Fila (Deque)
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

  // Monta a Matriz Bidimensional atualizada para enviar ao Angular
  private StateGameDTO getGameState() {
    // Limpa a matriz: 0 = Vazio
    for (int i = 0; i < ROWS; i++) {
      for (int j = 0; j < COLUMNS; j++) {
        board[i][j] = 0;
      }
    }
    // Coloca a comida: 2 = Comida
    board[food.y()][food.x()] = 2;

    // Coloca a cobra: 1 = Cobra
    for (Partes p : snake) {
      board[p.y()][p.x()] = 1;
    }

    return new StateGameDTO(board, score, isGameOver);
  }
}
