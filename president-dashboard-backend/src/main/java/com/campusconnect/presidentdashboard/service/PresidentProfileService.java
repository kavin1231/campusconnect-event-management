package com.campusconnect.presidentdashboard.service;

import com.campusconnect.presidentdashboard.dto.president.PresidentProfileResponse;
import com.campusconnect.presidentdashboard.entity.President;
import com.campusconnect.presidentdashboard.entity.enums.OrganizationType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PresidentProfileService {

    private final CurrentPresidentService currentPresidentService;

    @Transactional(readOnly = true)
    public PresidentProfileResponse getMyProfile() {
        President president = currentPresidentService.getCurrentPresident();
        boolean facultyPresident = president.getOrganizationType() == OrganizationType.FACULTY;

        return new PresidentProfileResponse(
                president.getId(),
                president.getEmail(),
                president.getRole().name(),
                president.getOrganizationType(),
                facultyPresident ? president.getFaculty().getId() : president.getClub().getId(),
                facultyPresident ? president.getFaculty().getName() : president.getClub().getName(),
                facultyPresident ? president.getFaculty().getCode() : president.getClub().getCode(),
                president.isActive()
        );
    }
}
