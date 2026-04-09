package com.campusconnect.presidentdashboard.dto.vendor;

public record VendorResponse(
        Long id,
        String name,
        String contactEmail,
        String contactPhone,
        String serviceType,
        Long eventId
) {
}
