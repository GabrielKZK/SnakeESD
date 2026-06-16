package com.senai.snakegame.dto;

public record StateGameDTO(
   int[][] matrix,
   int score,
   boolean isGameOver
)
{
}
