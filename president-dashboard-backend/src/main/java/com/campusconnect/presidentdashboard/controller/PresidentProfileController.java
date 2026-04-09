package com.campusconnect.presidentdashboard.controller;

import com.campusconnect.presidentdashboard.dto.president.PresidentProfileResponse;
import com.campusconnect.presidentdashboard.service.PresidentProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/presidents")
@RequiredArgsConstructor
@PreAuthorize("hasAnyAuthority('ROLE_PRESIDENT','ROLE_ADMIN')")
public class PresidentProfileController {

    private final PresidentProfileService presidentProfileService;

    @GetMapping("/me")
    public ResponseEntity<PresidentProfileResponse> me() {
        return ResponseEntity.ok(presidentProfileService.getMyProfile());
    }
}
