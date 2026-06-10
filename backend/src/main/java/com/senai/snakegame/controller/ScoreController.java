package com.senai.snakegame.controller;

import com.senai.snakegame.dto.ScoreDTO;
import com.senai.snakegame.model.Score;
import com.senai.snakegame.service.ScoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/scores")
@CrossOrigin(origins = "http://localhost:4200")
public class ScoreController {

    @Autowired
    ScoreService scoreService;

    @GetMapping("/ranking")
    public ResponseEntity<List<Score>> getTop10() {
        return ResponseEntity.ok(scoreService.buscarMaioresPontuacoes());
    }

    @PostMapping
    public ResponseEntity<Score> salvarPontuacao(@RequestBody ScoreDTO dto) {
        Score novoScore = scoreService.salvar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoScore);
    }

}
