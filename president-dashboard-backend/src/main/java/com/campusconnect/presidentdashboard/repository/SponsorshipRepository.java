package com.campusconnect.presidentdashboard.repository;

import com.campusconnect.presidentdashboard.entity.Sponsorship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface SponsorshipRepository extends JpaRepository<Sponsorship, Long> {
    List<Sponsorship> findByEventFacultyIdOrderByIdDesc(Long facultyId);

    List<Sponsorship> findByEventClubIdOrderByIdDesc(Long clubId);

    Optional<Sponsorship> findByIdAndEventFacultyId(Long id, Long facultyId);

    Optional<Sponsorship> findByIdAndEventClubId(Long id, Long clubId);

    long countByEventFacultyId(Long facultyId);

    long countByEventClubId(Long clubId);

    @Query("select coalesce(sum(s.amount), 0) from Sponsorship s where s.event.faculty.id = :facultyId")
    BigDecimal sumAmountByFacultyId(@Param("facultyId") Long facultyId);

    @Query("select coalesce(sum(s.amount), 0) from Sponsorship s where s.event.club.id = :clubId")
    BigDecimal sumAmountByClubId(@Param("clubId") Long clubId);
}
