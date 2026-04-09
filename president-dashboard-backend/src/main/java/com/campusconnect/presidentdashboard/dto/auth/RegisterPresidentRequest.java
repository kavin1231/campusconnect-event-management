package com.campusconnect.presidentdashboard.dto.auth;

import com.campusconnect.presidentdashboard.entity.enums.OrganizationType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterPresidentRequest(
        @NotBlank @Email String email,
        @NotBlank @Size(min = 8, max = 100) String password,
        @NotNull OrganizationType organizationType,
        Long facultyId,
        Long clubId
) {
}
