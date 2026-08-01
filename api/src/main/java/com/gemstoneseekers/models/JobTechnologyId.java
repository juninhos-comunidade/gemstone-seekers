package com.gemstoneseekers.models;

import java.io.Serial;
import java.io.Serializable;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class JobTechnologyId implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    private UUID job;
    private Integer technology;
}
