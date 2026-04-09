package com.campusconnect.presidentdashboard.dto.organization;

import com.campusconnect.presidentdashboard.entity.enums.OrganizationType;

public record OrganizationResponse(
        Long id,
        String name,
        String code,
        OrganizationType type
) {
}
