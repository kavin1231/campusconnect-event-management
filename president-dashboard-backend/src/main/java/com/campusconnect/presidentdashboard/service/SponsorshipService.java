package com.campusconnect.presidentdashboard.service;

import com.campusconnect.presidentdashboard.dto.sponsorship.SponsorshipResponse;
import com.campusconnect.presidentdashboard.dto.sponsorship.SponsorshipUpsertRequest;
import com.campusconnect.presidentdashboard.entity.Event;
import com.campusconnect.presidentdashboard.entity.President;
import com.campusconnect.presidentdashboard.entity.Sponsorship;
import com.campusconnect.presidentdashboard.entity.enums.OrganizationType;
import com.campusconnect.presidentdashboard.exception.ResourceNotFoundException;
import com.campusconnect.presidentdashboard.repository.SponsorshipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SponsorshipService {

    private final SponsorshipRepository sponsorshipRepository;
    private final CurrentPresidentService currentPresidentService;
    private final EventService eventService;

    @Transactional(readOnly = true)
    public List<SponsorshipResponse> listMySponsorships() {
        President president = currentPresidentService.getCurrentPresident();
        List<Sponsorship> sponsorships = president.getOrganizationType() == OrganizationType.FACULTY
                ? sponsorshipRepository.findByEventFacultyIdOrderByIdDesc(president.getFaculty().getId())
                : sponsorshipRepository.findByEventClubIdOrderByIdDesc(president.getClub().getId());
        return sponsorships.stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public SponsorshipResponse getMySponsorship(Long id) {
        return toResponse(findOwnedSponsorship(id));
    }

    @Transactional
    public SponsorshipResponse create(SponsorshipUpsertRequest request) {
        Event event = eventService.findOwnedEvent(request.eventId());

        Sponsorship sponsorship = Sponsorship.builder()
                .sponsorName(request.sponsorName())
                .amount(request.amount())
                .currency(request.currency())
                .status(request.status())
                .event(event)
                .build();

        return toResponse(sponsorshipRepository.save(sponsorship));
    }

    @Transactional
    public SponsorshipResponse update(Long id, SponsorshipUpsertRequest request) {
        Sponsorship sponsorship = findOwnedSponsorship(id);
        Event event = eventService.findOwnedEvent(request.eventId());

        sponsorship.setSponsorName(request.sponsorName());
        sponsorship.setAmount(request.amount());
        sponsorship.setCurrency(request.currency());
        sponsorship.setStatus(request.status());
        sponsorship.setEvent(event);

        return toResponse(sponsorshipRepository.save(sponsorship));
    }

    @Transactional
    public void delete(Long id) {
        sponsorshipRepository.delete(findOwnedSponsorship(id));
    }

    private Sponsorship findOwnedSponsorship(Long id) {
        President president = currentPresidentService.getCurrentPresident();
        return president.getOrganizationType() == OrganizationType.FACULTY
                ? sponsorshipRepository.findByIdAndEventFacultyId(id, president.getFaculty().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Sponsorship not found for this faculty president"))
                : sponsorshipRepository.findByIdAndEventClubId(id, president.getClub().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Sponsorship not found for this club president"));
    }

    private SponsorshipResponse toResponse(Sponsorship sponsorship) {
        return new SponsorshipResponse(
                sponsorship.getId(),
                sponsorship.getSponsorName(),
                sponsorship.getAmount(),
                sponsorship.getCurrency(),
                sponsorship.getStatus(),
                sponsorship.getEvent().getId()
        );
    }
}
