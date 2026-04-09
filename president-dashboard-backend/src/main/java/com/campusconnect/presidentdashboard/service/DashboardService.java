package com.campusconnect.presidentdashboard.service;

import com.campusconnect.presidentdashboard.dto.dashboard.DashboardSummaryResponse;
import com.campusconnect.presidentdashboard.entity.President;
import com.campusconnect.presidentdashboard.entity.enums.OrganizationType;
import com.campusconnect.presidentdashboard.repository.EventRepository;
import com.campusconnect.presidentdashboard.repository.SponsorshipRepository;
import com.campusconnect.presidentdashboard.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final CurrentPresidentService currentPresidentService;
    private final EventRepository eventRepository;
    private final VendorRepository vendorRepository;
    private final SponsorshipRepository sponsorshipRepository;

    @Transactional(readOnly = true)
    public DashboardSummaryResponse getSummary() {
        President president = currentPresidentService.getCurrentPresident();

        long events;
        long upcomingEvents;
        long vendors;
        long sponsorships;
        BigDecimal totalSponsorshipAmount;

        if (president.getOrganizationType() == OrganizationType.FACULTY) {
            Long facultyId = president.getFaculty().getId();
            events = eventRepository.countByFacultyId(facultyId);
            upcomingEvents = eventRepository.countByFacultyIdAndStartAtAfter(facultyId, LocalDateTime.now());
            vendors = vendorRepository.countByEventFacultyId(facultyId);
            sponsorships = sponsorshipRepository.countByEventFacultyId(facultyId);
            totalSponsorshipAmount = sponsorshipRepository.sumAmountByFacultyId(facultyId);
        } else {
            Long clubId = president.getClub().getId();
            events = eventRepository.countByClubId(clubId);
            upcomingEvents = eventRepository.countByClubIdAndStartAtAfter(clubId, LocalDateTime.now());
            vendors = vendorRepository.countByEventClubId(clubId);
            sponsorships = sponsorshipRepository.countByEventClubId(clubId);
            totalSponsorshipAmount = sponsorshipRepository.sumAmountByClubId(clubId);
        }

        return new DashboardSummaryResponse(events, upcomingEvents, vendors, sponsorships, totalSponsorshipAmount);
    }
}
