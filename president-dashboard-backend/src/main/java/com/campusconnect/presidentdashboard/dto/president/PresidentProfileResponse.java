package com.campusconnect.presidentdashboard.dto.president;

import com.campusconnect.presidentdashboard.entity.enums.OrganizationType;

public record PresidentProfileResponse(
        Long id,
        String email,
        String role,
        OrganizationType organizationType,
        Long organizationId,
        String organizationName,
        String organizationCode,
        boolean active
) {
}
