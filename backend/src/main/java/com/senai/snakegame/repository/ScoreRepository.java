package com.senai.snakegame.repository;

import com.senai.snakegame.model.Score;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScoreRepository extends JpaRepository<Score,Integer> {
  List<Score> findTop10ByOrderByScoreDesc();
}
