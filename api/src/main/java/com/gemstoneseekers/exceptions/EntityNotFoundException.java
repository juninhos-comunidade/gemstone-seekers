package com.gemstoneseekers.exceptions;

public class EntityNotFoundException extends RuntimeException {
    private final String entityName;
    private final Object id;

    public EntityNotFoundException(String entityName, Object id) {
        super(entityName + " with id " + id + " not found");
        this.entityName = entityName;
        this.id = id;
    }

    public String getEntityName() {
        return entityName;
    }

    public Object getId() {
        return id;
    }
}
