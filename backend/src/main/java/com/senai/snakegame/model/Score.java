package com.senai.snakegame.model;

import com.senai.snakegame.dto.ScoreDTO;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tb_score")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Score {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
    @Column(nullable = false)
    private Integer score;
    @Column(nullable = false)
    private String playerName;

    public Score(String playerName, Integer points) {
    }
}
