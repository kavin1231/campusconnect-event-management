package com.campusconnect.presidentdashboard.dto.sponsorship;

import com.campusconnect.presidentdashboard.entity.enums.SponsorshipStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record SponsorshipUpsertRequest(
        @NotBlank String sponsorName,
        @NotNull @DecimalMin("0.01") BigDecimal amount,
        @NotBlank String currency,
        @NotNull SponsorshipStatus status,
        @NotNull Long eventId
) {
}
