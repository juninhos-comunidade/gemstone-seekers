package com.gemstoneseekers.exceptions;

import java.io.Serial;

public class InsufficientQuestionsException extends RuntimeException {

    @Serial
    private static final long serialVersionUID = 1L;

    public InsufficientQuestionsException(String message) {
        super(message);
    }
}
