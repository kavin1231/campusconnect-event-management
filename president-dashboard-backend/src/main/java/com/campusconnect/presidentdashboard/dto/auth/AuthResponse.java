package com.campusconnect.presidentdashboard.dto.auth;

import com.campusconnect.presidentdashboard.entity.enums.OrganizationType;

public record AuthResponse(
        String token,
        String email,
        String role,
        OrganizationType organizationType,
        Long organizationId,
        String organizationName
) {
}
