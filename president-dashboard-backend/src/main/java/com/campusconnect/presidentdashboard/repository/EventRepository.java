package com.campusconnect.presidentdashboard.repository;

import com.campusconnect.presidentdashboard.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByFacultyIdOrderByStartAtDesc(Long facultyId);

    List<Event> findByClubIdOrderByStartAtDesc(Long clubId);

    Optional<Event> findByIdAndFacultyId(Long id, Long facultyId);

    Optional<Event> findByIdAndClubId(Long id, Long clubId);

    long countByFacultyId(Long facultyId);

    long countByClubId(Long clubId);

    long countByFacultyIdAndStartAtAfter(Long facultyId, LocalDateTime dateTime);

    long countByClubIdAndStartAtAfter(Long clubId, LocalDateTime dateTime);
}
