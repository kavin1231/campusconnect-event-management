package com.campusconnect.presidentdashboard.service;

import com.campusconnect.presidentdashboard.dto.organization.OrganizationResponse;
import com.campusconnect.presidentdashboard.entity.enums.OrganizationType;
import com.campusconnect.presidentdashboard.repository.ClubRepository;
import com.campusconnect.presidentdashboard.repository.FacultyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrganizationService {

    private final FacultyRepository facultyRepository;
    private final ClubRepository clubRepository;

    @Transactional(readOnly = true)
    public List<OrganizationResponse> listFaculties() {
        return facultyRepository.findAll().stream()
                .map(faculty -> new OrganizationResponse(
                        faculty.getId(),
                        faculty.getName(),
                        faculty.getCode(),
                        OrganizationType.FACULTY
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<OrganizationResponse> listClubs() {
        return clubRepository.findAll().stream()
                .map(club -> new OrganizationResponse(
                        club.getId(),
                        club.getName(),
                        club.getCode(),
                        OrganizationType.CLUB
                ))
                .toList();
    }
}
