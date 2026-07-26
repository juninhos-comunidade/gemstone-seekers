package com.gemstoneseekers.exceptions;

@SuppressWarnings("PMD.MissingSerialVersionUID")
public class AccessDeniedException extends RuntimeException {

    public AccessDeniedException(String message) {
        super(message);
    }
}
