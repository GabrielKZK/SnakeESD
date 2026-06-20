package com.senai.snakegame.dto;

public record WsMessage<T>(String Type, T payload) {
  public static <T> WsMessage<T> state(T payload) {
    return new WsMessage<>("STATE", payload);
  }

  public static <T> WsMessage<T> leaderboard(T payload) {
    return new WsMessage<>("LEADERBOARD", payload);
  }
}
