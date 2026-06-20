package com.senai.snakegame.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ScoreDTO {
  @NotBlank(message = "O nome não pode ser vazio")
  @Size(min = 3, max = 15, message = "O nome deve ter entre 3 e 15 caracteres")
  private String playerName;
  @PositiveOrZero(message = "A puntação não pode ser negativa")
  private Integer points;
}