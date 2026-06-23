package com.senai.snakegame.service;

import com.senai.snakegame.dto.ScoreDTO;
import com.senai.snakegame.model.Score;
import com.senai.snakegame.repository.ScoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScoreService {
    @Autowired
    ScoreRepository scoreRepository;


    public List<Score> buscarMaioresPontuacoes(){
        return scoreRepository.findTop10ByOrderByScoreDesc();
      }

    public Score salvar(ScoreDTO dto) {
        if (dto.getPoints() == null || dto.getPoints() < 0) {
            throw new IllegalArgumentException("Pontuação inválida!");
        }
        if (dto.getPlayerName() == null || dto.getPlayerName().trim().isEmpty()) {
            throw new IllegalArgumentException("O nome do jogador é obrigatório!");
        }
        Score novoScore = new Score(dto.getPlayerName(), dto.getPoints());

        return scoreRepository.save(novoScore);
    }
}
