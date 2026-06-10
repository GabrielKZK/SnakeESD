package com.senai.snakegame.handler;

import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.logging.SocketHandler;


@Component
public class SnakeWebSocketHandler extends TextWebSocketHandler {
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println("Jogador conectado ao jogo: " + session.getId());
    }

    // Quando o Angular enviar uma mensagem (Comando de direção da cobra)
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String comandoDirecao = message.getPayload(); // Ex: "UP", "DOWN", "LEFT", "RIGHT"
        String jsonSimulado = "{\"status\": \"playing\", \"score\": 10}";
        session.sendMessage(new TextMessage(jsonSimulado));
    }

    // Se o jogador fechar o navegador ou der Game Over
    @Override
    public void afterConnectionClosed(WebSocketSession session, org.springframework.web.socket.CloseStatus status) throws Exception {
        System.out.println("Jogador desconectado.");
    }
}
