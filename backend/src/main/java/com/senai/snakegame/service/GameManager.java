package com.senai.snakegame.service;

import com.senai.snakegame.dto.StateGameDTO;
import com.senai.snakegame.enums.Direction;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class GameManager {
  private final ConcurrentHashMap<WebSocketSession, SnakeEngine> sessions = new ConcurrentHashMap<>();
  private final ObjectMapper mapper = new ObjectMapper();

  // Lê as configurações do application.properties
  @Value("${game.snake.board.rows:20}")
  private int rows;

  @Value("${game.snake.board.columns:20}")
  private int columns;

  // Adiciona um jogador e inicia uma nova Engine passando o tamanho do tabuleiro
  public void addPlayer(WebSocketSession session) {
    sessions.put(session, new SnakeEngine(rows, columns));
    System.out.println("Novo jogador ingressou! Sessão: " + session.getId());
  }

  public void removePlayer(WebSocketSession session) {
    sessions.remove(session);
    System.out.println("Jogador saiu. Sessão: " + session.getId());
  }

  public void changePlayerDirection(WebSocketSession session, Direction dir) {
    SnakeEngine engine = sessions.get(session);
    if (engine != null) {
      engine.changeDirection(dir);
    }
  }

  @Scheduled(fixedRateString = "${game.snake.loop.rate:150}")
  public void gameLoop() {
    for (Map.Entry<WebSocketSession, SnakeEngine> entry : sessions.entrySet()) {
      WebSocketSession session = entry.getKey();
      SnakeEngine engine = entry.getValue();

      if (session.isOpen()) {
        try {
          StateGameDTO state = engine.processTick();
          String jsonResponse = mapper.writeValueAsString(state);
          session.sendMessage(new TextMessage(jsonResponse));
        } catch (IOException e) {
          System.err.println("Erro ao enviar dados para a sessão: " + session.getId());
        }
      }
    }
  }
}
