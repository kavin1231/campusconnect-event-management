package com.campusconnect.presidentdashboard.controller;

import com.campusconnect.presidentdashboard.dto.vendor.VendorResponse;
import com.campusconnect.presidentdashboard.dto.vendor.VendorUpsertRequest;
import com.campusconnect.presidentdashboard.service.VendorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/vendors")
@RequiredArgsConstructor
@PreAuthorize("hasAnyAuthority('ROLE_PRESIDENT','ROLE_ADMIN')")
public class VendorController {

    private final VendorService vendorService;

    @GetMapping
    public ResponseEntity<List<VendorResponse>> list() {
        return ResponseEntity.ok(vendorService.listMyVendors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VendorResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(vendorService.getMyVendor(id));
    }

    @PostMapping
    public ResponseEntity<VendorResponse> create(@Valid @RequestBody VendorUpsertRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(vendorService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VendorResponse> update(@PathVariable Long id, @Valid @RequestBody VendorUpsertRequest request) {
        return ResponseEntity.ok(vendorService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        vendorService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
