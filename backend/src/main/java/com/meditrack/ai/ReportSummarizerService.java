package com.meditrack.ai;
import org.springframework.ai.chat.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class ReportSummarizerService {
    private final ChatClient chatClient;
    public ReportSummarizerService(ChatClient chatClient) { this.chatClient = chatClient; }
    public String summarizeReport(String reportText){
        String prompt = String.format(PromptTemplates.REPORT_SUMMARIZER, reportText);
        return chatClient.call(prompt);
    }
}
