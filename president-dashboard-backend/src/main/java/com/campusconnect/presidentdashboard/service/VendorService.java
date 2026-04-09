package com.campusconnect.presidentdashboard.service;

import com.campusconnect.presidentdashboard.dto.vendor.VendorResponse;
import com.campusconnect.presidentdashboard.dto.vendor.VendorUpsertRequest;
import com.campusconnect.presidentdashboard.entity.Event;
import com.campusconnect.presidentdashboard.entity.President;
import com.campusconnect.presidentdashboard.entity.Vendor;
import com.campusconnect.presidentdashboard.entity.enums.OrganizationType;
import com.campusconnect.presidentdashboard.exception.ResourceNotFoundException;
import com.campusconnect.presidentdashboard.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VendorService {

    private final VendorRepository vendorRepository;
    private final CurrentPresidentService currentPresidentService;
    private final EventService eventService;

    @Transactional(readOnly = true)
    public List<VendorResponse> listMyVendors() {
        President president = currentPresidentService.getCurrentPresident();
        List<Vendor> vendors = president.getOrganizationType() == OrganizationType.FACULTY
                ? vendorRepository.findByEventFacultyIdOrderByIdDesc(president.getFaculty().getId())
                : vendorRepository.findByEventClubIdOrderByIdDesc(president.getClub().getId());
        return vendors.stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public VendorResponse getMyVendor(Long id) {
        return toResponse(findOwnedVendor(id));
    }

    @Transactional
    public VendorResponse create(VendorUpsertRequest request) {
        Event event = eventService.findOwnedEvent(request.eventId());

        Vendor vendor = Vendor.builder()
                .name(request.name())
                .contactEmail(request.contactEmail())
                .contactPhone(request.contactPhone())
                .serviceType(request.serviceType())
                .event(event)
                .build();

        return toResponse(vendorRepository.save(vendor));
    }

    @Transactional
    public VendorResponse update(Long id, VendorUpsertRequest request) {
        Vendor vendor = findOwnedVendor(id);
        Event event = eventService.findOwnedEvent(request.eventId());

        vendor.setName(request.name());
        vendor.setContactEmail(request.contactEmail());
        vendor.setContactPhone(request.contactPhone());
        vendor.setServiceType(request.serviceType());
        vendor.setEvent(event);

        return toResponse(vendorRepository.save(vendor));
    }

    @Transactional
    public void delete(Long id) {
        vendorRepository.delete(findOwnedVendor(id));
    }

    private Vendor findOwnedVendor(Long id) {
        President president = currentPresidentService.getCurrentPresident();
        return president.getOrganizationType() == OrganizationType.FACULTY
                ? vendorRepository.findByIdAndEventFacultyId(id, president.getFaculty().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found for this faculty president"))
                : vendorRepository.findByIdAndEventClubId(id, president.getClub().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found for this club president"));
    }

    private VendorResponse toResponse(Vendor vendor) {
        return new VendorResponse(
                vendor.getId(),
                vendor.getName(),
                vendor.getContactEmail(),
                vendor.getContactPhone(),
                vendor.getServiceType(),
                vendor.getEvent().getId()
        );
    }
}
