package com.campusconnect.presidentdashboard.controller;

import com.campusconnect.presidentdashboard.dto.sponsorship.SponsorshipResponse;
import com.campusconnect.presidentdashboard.dto.sponsorship.SponsorshipUpsertRequest;
import com.campusconnect.presidentdashboard.service.SponsorshipService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/sponsorships")
@RequiredArgsConstructor
@PreAuthorize("hasAnyAuthority('ROLE_PRESIDENT','ROLE_ADMIN')")
public class SponsorshipController {

    private final SponsorshipService sponsorshipService;

    @GetMapping
    public ResponseEntity<List<SponsorshipResponse>> list() {
        return ResponseEntity.ok(sponsorshipService.listMySponsorships());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SponsorshipResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(sponsorshipService.getMySponsorship(id));
    }

    @PostMapping
    public ResponseEntity<SponsorshipResponse> create(@Valid @RequestBody SponsorshipUpsertRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(sponsorshipService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SponsorshipResponse> update(@PathVariable Long id, @Valid @RequestBody SponsorshipUpsertRequest request) {
        return ResponseEntity.ok(sponsorshipService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        sponsorshipService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
