package com.campusconnect.presidentdashboard.config;

import com.campusconnect.presidentdashboard.entity.Club;
import com.campusconnect.presidentdashboard.entity.Faculty;
import com.campusconnect.presidentdashboard.repository.ClubRepository;
import com.campusconnect.presidentdashboard.repository.FacultyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final FacultyRepository facultyRepository;
    private final ClubRepository clubRepository;

    @Bean
    CommandLineRunner seedOrganizations() {
        return args -> {
            if (facultyRepository.count() == 0) {
                facultyRepository.saveAll(List.of(
                        Faculty.builder().name("Faculty of Computing").code("FOC").build(),
                        Faculty.builder().name("Faculty of Engineering").code("FOE").build(),
                        Faculty.builder().name("Faculty of Business").code("FOB").build()
                ));
            }

            if (clubRepository.count() == 0) {
                clubRepository.saveAll(List.of(
                        Club.builder().name("IEEE Student Branch").code("IEEE").build(),
                        Club.builder().name("Rotaract Club").code("RAC").build(),
                        Club.builder().name("Media and Design Club").code("MDC").build()
                ));
            }
        };
    }
}
