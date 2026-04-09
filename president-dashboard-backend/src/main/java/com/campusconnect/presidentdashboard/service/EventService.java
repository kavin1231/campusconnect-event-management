package com.campusconnect.presidentdashboard.service;

import com.campusconnect.presidentdashboard.dto.event.EventResponse;
import com.campusconnect.presidentdashboard.dto.event.EventUpsertRequest;
import com.campusconnect.presidentdashboard.entity.Event;
import com.campusconnect.presidentdashboard.entity.President;
import com.campusconnect.presidentdashboard.entity.enums.OrganizationType;
import com.campusconnect.presidentdashboard.exception.BadRequestException;
import com.campusconnect.presidentdashboard.exception.ResourceNotFoundException;
import com.campusconnect.presidentdashboard.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final CurrentPresidentService currentPresidentService;

    @Transactional(readOnly = true)
    public List<EventResponse> listMyEvents() {
        President president = currentPresidentService.getCurrentPresident();
        List<Event> events = president.getOrganizationType() == OrganizationType.FACULTY
                ? eventRepository.findByFacultyIdOrderByStartAtDesc(president.getFaculty().getId())
                : eventRepository.findByClubIdOrderByStartAtDesc(president.getClub().getId());

        return events.stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public EventResponse getMyEvent(Long id) {
        return toResponse(findOwnedEvent(id));
    }

    @Transactional
    public EventResponse create(EventUpsertRequest request) {
        if (request.endAt().isBefore(request.startAt())) {
            throw new BadRequestException("Event endAt must be after startAt");
        }

        President president = currentPresidentService.getCurrentPresident();
        Event event = Event.builder()
                .title(request.title())
                .description(request.description())
                .startAt(request.startAt())
                .endAt(request.endAt())
                .location(request.location())
                .createdBy(president)
                .build();

        if (president.getOrganizationType() == OrganizationType.FACULTY) {
            event.setFaculty(president.getFaculty());
        } else {
            event.setClub(president.getClub());
        }

        return toResponse(eventRepository.save(event));
    }

    @Transactional
    public EventResponse update(Long id, EventUpsertRequest request) {
        if (request.endAt().isBefore(request.startAt())) {
            throw new BadRequestException("Event endAt must be after startAt");
        }

        Event event = findOwnedEvent(id);
        event.setTitle(request.title());
        event.setDescription(request.description());
        event.setStartAt(request.startAt());
        event.setEndAt(request.endAt());
        event.setLocation(request.location());

        return toResponse(eventRepository.save(event));
    }

    @Transactional
    public void delete(Long id) {
        Event event = findOwnedEvent(id);
        eventRepository.delete(event);
    }

    @Transactional(readOnly = true)
    public Event findOwnedEvent(Long id) {
        President president = currentPresidentService.getCurrentPresident();
        return president.getOrganizationType() == OrganizationType.FACULTY
                ? eventRepository.findByIdAndFacultyId(id, president.getFaculty().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found for this faculty president"))
                : eventRepository.findByIdAndClubId(id, president.getClub().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found for this club president"));
    }

    private EventResponse toResponse(Event event) {
        return new EventResponse(
                event.getId(),
                event.getTitle(),
                event.getDescription(),
                event.getStartAt(),
                event.getEndAt(),
                event.getLocation(),
                event.getFaculty() != null ? event.getFaculty().getId() : null,
                event.getClub() != null ? event.getClub().getId() : null
        );
    }
}
