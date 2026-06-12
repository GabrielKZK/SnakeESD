package com.senai.snakegame.dto;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
public class StateGameDTO {
  public int[][] matrix;
  public int score;
  public boolean gameOver;

}
