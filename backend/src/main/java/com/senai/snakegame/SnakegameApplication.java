package com.senai.snakegame;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SnakegameApplication {

    public static void main(String[] args) {
        SpringApplication.run(SnakegameApplication.class, args);
    }

}
