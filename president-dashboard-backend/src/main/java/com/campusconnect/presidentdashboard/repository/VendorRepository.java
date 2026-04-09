package com.campusconnect.presidentdashboard.repository;

import com.campusconnect.presidentdashboard.entity.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VendorRepository extends JpaRepository<Vendor, Long> {
    List<Vendor> findByEventFacultyIdOrderByIdDesc(Long facultyId);

    List<Vendor> findByEventClubIdOrderByIdDesc(Long clubId);

    Optional<Vendor> findByIdAndEventFacultyId(Long id, Long facultyId);

    Optional<Vendor> findByIdAndEventClubId(Long id, Long clubId);

    long countByEventFacultyId(Long facultyId);

    long countByEventClubId(Long clubId);
}
