package com.gemstoneseekers.services;

import com.gemstoneseekers.dtos.response.AiQuestionBatchResponse;
import com.gemstoneseekers.enums.QuestionDifficulty;
import com.gemstoneseekers.exceptions.AiGenerationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.converter.BeanOutputConverter;
import org.springframework.ai.retry.NonTransientAiException;
import org.springframework.ai.retry.TransientAiException;
import org.springframework.stereotype.Service;

@Service
public class AiQuestionGeneratorService {

    private static final Logger log = LoggerFactory.getLogger(AiQuestionGeneratorService.class);

    private final ChatClient chatClient;

    public AiQuestionGeneratorService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    public AiQuestionBatchResponse generateQuestions(String technologyName, QuestionDifficulty difficulty, int amount) {
        log.info("[AI_SERVICE] Generating {} new questions for {} ({})", amount, technologyName, difficulty);

        var converter = new BeanOutputConverter<>(AiQuestionBatchResponse.class);
        String formatInstructions = converter.getFormat();

        String prompt = """
                Você é um Engenheiro de Software Sênior especializado na criação de testes técnicos.
                Sua tarefa é gerar %d questões originais de múltipla escolha sobre a tecnologia '%s'
                com nível de dificuldade '%s'.

                REGRAS ABSOLUTAS:
                1. Cada questão deve ter exatamente 4 opções de resposta.
                2. Apenas UMA opção pode ser verdadeira (isCorrect = true). As outras devem ser falsas.
                3. As opções incorretas devem ser plausíveis para confundir candidatos não preparados.
                4. Não repita questões clássicas ou clichês.
                5. O formato da saída deve obedecer ESTRITAMENTE ao esquema JSON fornecido.

                %s
                """.formatted(amount, technologyName, difficulty.name(), formatInstructions);

        try {
            String rawResponse = chatClient.prompt().user(prompt).call().content();

            if (rawResponse == null || rawResponse.isBlank()) {
                throw new AiGenerationException("A API retornou um payload nulo ou vazio.");
            }

            return converter.convert(rawResponse);

        } catch (AiGenerationException e) {

            if (log.isErrorEnabled()) {
                log.error("[AI_SERVICE] AI content generation for {} ({}) failed: {}", technologyName, difficulty, e.getMessage());
            }
            throw e;
        } catch (TransientAiException | NonTransientAiException e) {
            if (log.isErrorEnabled()) {
                log.error("[AI_SERVICE] AI content generation failed for {} ({}). Root cause: {}", technologyName,
                        difficulty, e.getMessage());
            }
            throw new AiGenerationException(
                    "AI content generation failed. Check API quotas or upstream service status.", e);
        }
    }
}
