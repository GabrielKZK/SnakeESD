package com.senai.snakegame.handler;

import com.senai.snakegame.enums.Direction;
import com.senai.snakegame.service.GameManager;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
public class SnakeWebSocketHandler extends TextWebSocketHandler {

  private final GameManager gameManager;

  // Injeção de dependência via construtor
  public SnakeWebSocketHandler(GameManager gameManager) {
    this.gameManager = gameManager;
  }

  @Override
  public void afterConnectionEstablished(@NonNull WebSocketSession session) {
    gameManager.addPlayer(session); // Avisa o manager que alguém chegou
  }

  @Override
  protected void handleTextMessage(@NonNull WebSocketSession session, TextMessage message) {
    try {
      Direction directionCommand = Direction.valueOf(message.getPayload().toUpperCase());
      gameManager.changePlayerDirection(session, directionCommand); // Avisa o manager da nova direção
    } catch (IllegalArgumentException e) {
      System.out.println("Comando inválido recebido do Angular: " + message.getPayload());
    }
  }

  @Override
  public void afterConnectionClosed(@NonNull WebSocketSession session, @NonNull CloseStatus status) {
    gameManager.removePlayer(session); // Avisa o manager para limpar a memória
  }
}
