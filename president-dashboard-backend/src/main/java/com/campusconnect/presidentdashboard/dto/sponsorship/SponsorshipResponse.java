package com.campusconnect.presidentdashboard.dto.sponsorship;

import com.campusconnect.presidentdashboard.entity.enums.SponsorshipStatus;

import java.math.BigDecimal;

public record SponsorshipResponse(
        Long id,
        String sponsorName,
        BigDecimal amount,
        String currency,
        SponsorshipStatus status,
        Long eventId
) {
}
