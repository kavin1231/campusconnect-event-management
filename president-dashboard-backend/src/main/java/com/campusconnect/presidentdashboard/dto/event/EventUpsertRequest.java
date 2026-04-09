package com.campusconnect.presidentdashboard.dto.event;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record EventUpsertRequest(
        @NotBlank String title,
        String description,
        @NotNull @Future LocalDateTime startAt,
        @NotNull @Future LocalDateTime endAt,
        @NotBlank String location
) {
}
