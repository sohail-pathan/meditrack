package com.meditrack.ai;
import org.springframework.ai.chat.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class SymptomAnalyzerService {
    private final ChatClient chatClient;
    public SymptomAnalyzerService(ChatClient chatClient) { this.chatClient = chatClient; }
    public String analyzeSymptoms(String symptoms){
        String prompt = String.format(PromptTemplates.SYMPTOM_ANALYZER, symptoms);
        return chatClient.call(prompt);
    }
}
