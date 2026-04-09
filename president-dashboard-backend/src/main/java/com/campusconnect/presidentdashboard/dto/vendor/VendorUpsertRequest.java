package com.campusconnect.presidentdashboard.dto.vendor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record VendorUpsertRequest(
        @NotBlank String name,
        String contactEmail,
        String contactPhone,
        String serviceType,
        @NotNull Long eventId
) {
}
