package com.senai.snakegame.config;

import com.senai.snakegame.handler.SnakeWebSocketHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;


@Configuration
@EnableWebSocket
@EnableScheduling
public class WebSocketConfig implements WebSocketConfigurer {

    private final SnakeWebSocketHandler snakeWebSocketHandler;

    public WebSocketConfig(SnakeWebSocketHandler snakeWebSocketHandler) {
        this.snakeWebSocketHandler = snakeWebSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(snakeWebSocketHandler, "/game")
                .setAllowedOrigins("http://localhost:4200"); // CORS resolvido aqui instantaneamente!
    }

}
