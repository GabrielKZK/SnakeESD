package com.senai.snakegame.dto;

public record StateGameDTO(
   int[][] matrix,
   int score,
   int level,
   boolean isGameOver,
   boolean isLevelUp
)
{
}