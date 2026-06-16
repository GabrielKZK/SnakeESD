package com.senai.snakegame.service;

import java.util.ArrayList;
import java.util.List;

public class LeaderboardBST {
  private ScoreNode root;

  public void insert(String sessionId, int score) {
    root = insertRec(root, sessionId, score);
  }

  // Lógica recursiva de inserção da BST
  private ScoreNode insertRec(ScoreNode root, String sessionId, int score) {
    if (root == null) {
      return new ScoreNode(sessionId, score);
    }

    if (score < root.score) {
      root.left = insertRec(root.left, sessionId, score);
    } else {
      root.right = insertRec(root.right, sessionId, score);
    }
    return root;
  }

 // Lista os melhores pontuadores
  public List<String> getTopScores(int limit) {
    List<String> topScores = new ArrayList<>();
    reverseInOrder(root, topScores, limit);
    return topScores;
  }

  // Navega na árvore da Direita (Maiores) para a Esquerda (Menores)
  private void reverseInOrder(ScoreNode node, List<String> result, int limit) {
    if (node == null || result.size() >= limit) {
      return;
    }


    reverseInOrder(node.right, result, limit);


    if (result.size() < limit) {
      result.add("Jogador " + node.sessionId.substring(0, 4) + " - " + node.score + " pts");
    }

    reverseInOrder(node.left, result, limit);
  }
}
