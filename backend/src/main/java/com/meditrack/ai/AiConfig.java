package com.meditrack.ai;

import org.springframework.ai.openai.OpenAiChatClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AiConfig {
    // OpenAiChatClient is auto-configured by Spring AI starter
    // via spring.ai.openai.api-key in application.properties
    // Additional beans can be added here if needed
}
