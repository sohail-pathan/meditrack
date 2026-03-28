package com.meditrack.ai;
import com.meditrack.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {
    private final SymptomAnalyzerService symptomAnalyzerService;
    private final ReportSummarizerService reportSummarizerService;

    public AiController(SymptomAnalyzerService symptomAnalyzerService, ReportSummarizerService reportSummarizerService) {
        this.symptomAnalyzerService = symptomAnalyzerService;
        this.reportSummarizerService = reportSummarizerService;
    }

    @PostMapping("/symptoms")
    public ResponseEntity<ApiResponse<?>> analyzeSymptoms(@RequestBody Map<String,String> body){
        String result = symptomAnalyzerService.analyzeSymptoms(body.get("symptoms"));
        return ResponseEntity.ok(ApiResponse.success("Analysis complete", Map.of("analysis", result)));
    }

    @PostMapping("/summarize")
    public ResponseEntity<ApiResponse<?>> summarizeReport(@RequestBody Map<String,String> body){
        String result = reportSummarizerService.summarizeReport(body.get("reportText"));
        return ResponseEntity.ok(ApiResponse.success("Summary complete", Map.of("summary", result)));
    }
}
