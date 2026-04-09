package com.campusconnect.presidentdashboard.repository;

import com.campusconnect.presidentdashboard.entity.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FacultyRepository extends JpaRepository<Faculty, Long> {
}
