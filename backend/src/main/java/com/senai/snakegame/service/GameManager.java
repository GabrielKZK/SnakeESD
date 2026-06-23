package com.senai.snakegame.service;

import com.senai.snakegame.dto.ScoreDTO;
import com.senai.snakegame.dto.StateGameDTO;
import com.senai.snakegame.dto.WsMessage;
import com.senai.snakegame.enums.Direction;

import tools.jackson.databind.ObjectMapper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class GameManager {

  private static final Logger log = LoggerFactory.getLogger(GameManager.class);

  // A cada quantos pulsos do gameLoop o leaderboard ao vivo é transmitido.
  // Com pulso de 50ms, 6 pulsos = a cada ~300ms. Evita inundar a rede
  // mandando o ranking a cada 50ms, mas ainda parece "ao vivo" pro jogador.
  private static final int LEADERBOARD_BROADCAST_EVERY_N_TICKS = 6;

  private final ConcurrentHashMap<WebSocketSession, SnakeEngine> sessions = new ConcurrentHashMap<>();


  // sessão em jogo e usamos isso para um ranking que muda em tempo real.
  private final ConcurrentHashMap<String, Integer> liveScores = new ConcurrentHashMap<>();

  private final ObjectMapper mapper = new ObjectMapper();
  private final ScoreService scoreService;
  private final LeaderboardBST leaderboard = new LeaderboardBST();

  private int pulseCounter = 0;

  @Value("${game.snake.board.rows:20}")
  private int rows;

  @Value("${game.snake.board.columns:20}")
  private int columns;

  public GameManager(ScoreService scoreService) {
    this.scoreService = scoreService;
  }

  public void addPlayer(WebSocketSession session) {
    sessions.put(session, new SnakeEngine(rows, columns));
    liveScores.put(session.getId(), 0);
    log.info("Novo jogador ingressou! Sessão: {}", session.getId());
  }

  public void removePlayer(WebSocketSession session) {
    sessions.remove(session);
    liveScores.remove(session.getId());
    log.info("Jogador saiu. Sessão: {}", session.getId());
  }

  public void changePlayerDirection(WebSocketSession session, Direction dir) {
    SnakeEngine engine = sessions.get(session);
    if (engine != null) {
      engine.changeDirection(dir);
    }
  }

  @Scheduled(fixedRateString = "${game.snake.loop.rate:50}")
  public void gameLoop() {
    for (Map.Entry<WebSocketSession, SnakeEngine> entry : sessions.entrySet()) {
      WebSocketSession session = entry.getKey();
      SnakeEngine engine = entry.getValue();

      if (!session.isOpen()) continue;

      StateGameDTO state = engine.processTick();
      if (state == null) continue; // nada mudou neste pulso (controle de velocidade)

      if (state.isGameOver()) {
        handleGameOver(session, state);
        continue;
      }

      liveScores.put(session.getId(), state.score());
      sendMessage(session, WsMessage.state(state));
    }

    pulseCounter++;
    if (pulseCounter >= LEADERBOARD_BROADCAST_EVERY_N_TICKS) {
      pulseCounter = 0;
      broadcastLiveLeaderboard();
    }
  }

  private void handleGameOver(WebSocketSession session, StateGameDTO state) {
    // Persiste o resultado final no banco (histórico permanente, usado
    // pela tela de ranking via REST em /api/scores/ranking)
    ScoreDTO scoreDTO = new ScoreDTO();
    scoreDTO.setPlayerName("Jogador-" + session.getId().substring(0, 4));
    scoreDTO.setPoints(state.score());
    scoreService.salvar(scoreDTO);

    // Mantém também na BST em memória (ranking de partidas já encerradas)
    leaderboard.insert(session.getId(), state.score());

    sendMessage(session, WsMessage.state(state));
    removePlayer(session);
    broadcastLiveLeaderboard();
  }

  private void broadcastLiveLeaderboard() {
    if (sessions.isEmpty()) return;

    List<String> liveRanking = liveScores.entrySet().stream()
      .sorted((a, b) -> b.getValue() - a.getValue())
      .limit(10)
      .map(e -> "Jogador " + e.getKey().substring(0, 4) + " - " + e.getValue() + " pts")
      .collect(Collectors.toList());

    sendToAll(WsMessage.leaderboard(liveRanking));
  }

  private void sendMessage(WebSocketSession session, WsMessage<?> message) {
    try {
      session.sendMessage(new TextMessage(mapper.writeValueAsString(message)));
    } catch (IOException e) {
      log.error("Erro ao enviar dados para a sessão: {}", session.getId(), e);
    }
  }

  private void sendToAll(WsMessage<?> message) {
    try {
      String json = mapper.writeValueAsString(message);
      for (WebSocketSession session : sessions.keySet()) {
        if (session.isOpen()) {
          session.sendMessage(new TextMessage(json));
        }
      }
    } catch (IOException e) {
      log.error("Erro ao transmitir leaderboard ao vivo", e);
    }
  }
}
