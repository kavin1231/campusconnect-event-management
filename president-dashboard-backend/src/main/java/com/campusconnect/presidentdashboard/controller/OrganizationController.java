package com.campusconnect.presidentdashboard.controller;

import com.campusconnect.presidentdashboard.dto.organization.OrganizationResponse;
import com.campusconnect.presidentdashboard.service.OrganizationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/organizations")
@RequiredArgsConstructor
public class OrganizationController {

    private final OrganizationService organizationService;

    @GetMapping("/faculties")
    public ResponseEntity<List<OrganizationResponse>> listFaculties() {
        return ResponseEntity.ok(organizationService.listFaculties());
    }

    @GetMapping("/clubs")
    public ResponseEntity<List<OrganizationResponse>> listClubs() {
        return ResponseEntity.ok(organizationService.listClubs());
    }
}
