package com.campusconnect.presidentdashboard.dto.event;

import java.time.LocalDateTime;

public record EventResponse(
        Long id,
        String title,
        String description,
        LocalDateTime startAt,
        LocalDateTime endAt,
        String location,
        Long facultyId,
        Long clubId
) {
}
