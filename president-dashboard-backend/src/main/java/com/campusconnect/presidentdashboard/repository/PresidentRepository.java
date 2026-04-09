package com.campusconnect.presidentdashboard.repository;

import com.campusconnect.presidentdashboard.entity.President;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PresidentRepository extends JpaRepository<President, Long> {
    Optional<President> findByEmail(String email);

    boolean existsByFacultyId(Long facultyId);

    boolean existsByClubId(Long clubId);
}
