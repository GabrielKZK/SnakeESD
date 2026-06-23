package com.senai.snakegame.dto;

public record StateGameDTO(
      int[][] matrix,
      int score,
      int level,
      boolean isLevelUp, // <-- Primeiro o isLevelUp (Igual na SnakeEngine)
      boolean isGameOver // <-- Depois o isGameOver
) {
}