package com.gemstoneseekers.exceptions;

@SuppressWarnings("PMD.MissingSerialVersionUID")
public class ConflictException extends RuntimeException {

    public ConflictException(String message) {
        super(message);
    }
}
