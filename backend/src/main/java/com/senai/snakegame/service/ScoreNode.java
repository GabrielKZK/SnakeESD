package com.senai.snakegame.service;

public class ScoreNode {
  public String sessionId;
  public int score;
  public ScoreNode left;
  public ScoreNode right;

  public ScoreNode(String sessionId, int score) {
    this.sessionId = sessionId;
    this.score = score;
    this.left = null;
    this.right = null;
  }
}
