package com.campusconnect.presidentdashboard.service;

import com.campusconnect.presidentdashboard.dto.auth.AuthResponse;
import com.campusconnect.presidentdashboard.dto.auth.LoginRequest;
import com.campusconnect.presidentdashboard.dto.auth.RegisterPresidentRequest;
import com.campusconnect.presidentdashboard.entity.President;
import com.campusconnect.presidentdashboard.entity.enums.OrganizationType;
import com.campusconnect.presidentdashboard.entity.enums.Role;
import com.campusconnect.presidentdashboard.exception.BadRequestException;
import com.campusconnect.presidentdashboard.repository.ClubRepository;
import com.campusconnect.presidentdashboard.repository.FacultyRepository;
import com.campusconnect.presidentdashboard.repository.PresidentRepository;
import com.campusconnect.presidentdashboard.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final PresidentRepository presidentRepository;
    private final FacultyRepository facultyRepository;
    private final ClubRepository clubRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse register(RegisterPresidentRequest request) {
        if (presidentRepository.findByEmail(request.email()).isPresent()) {
            throw new BadRequestException("Email already exists");
        }

        President president = President.builder()
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .role(Role.ROLE_PRESIDENT)
                .organizationType(request.organizationType())
                .active(true)
                .build();

        if (request.organizationType() == OrganizationType.FACULTY) {
            if (request.facultyId() == null || request.clubId() != null) {
                throw new BadRequestException("Faculty president must provide facultyId only");
            }
            if (presidentRepository.existsByFacultyId(request.facultyId())) {
                throw new BadRequestException("A president already exists for this faculty");
            }
            president.setFaculty(facultyRepository.findById(request.facultyId())
                    .orElseThrow(() -> new BadRequestException("Faculty not found")));
        } else {
            if (request.clubId() == null || request.facultyId() != null) {
                throw new BadRequestException("Club president must provide clubId only");
            }
            if (presidentRepository.existsByClubId(request.clubId())) {
                throw new BadRequestException("A president already exists for this club");
            }
            president.setClub(clubRepository.findById(request.clubId())
                    .orElseThrow(() -> new BadRequestException("Club not found")));
        }

        President saved = presidentRepository.save(president);
        return buildAuthResponse(saved);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        President president = presidentRepository.findByEmail(request.email())
                .orElseThrow(() -> new BadRequestException("Invalid credentials"));

        return buildAuthResponse(president);
    }

    private AuthResponse buildAuthResponse(President president) {
        Long organizationId = president.getOrganizationType() == OrganizationType.FACULTY
                ? president.getFaculty().getId()
                : president.getClub().getId();
        String organizationName = president.getOrganizationType() == OrganizationType.FACULTY
                ? president.getFaculty().getName()
                : president.getClub().getName();

        String token = jwtService.generateToken(
                org.springframework.security.core.userdetails.User
                        .withUsername(president.getEmail())
                        .password(president.getPasswordHash())
                        .authorities(president.getRole().name())
                        .build(),
                Map.of(
                        "role", president.getRole().name(),
                        "organizationType", president.getOrganizationType().name(),
                        "organizationId", organizationId
                )
        );

        return new AuthResponse(
                token,
                president.getEmail(),
                president.getRole().name(),
                president.getOrganizationType(),
                organizationId,
                organizationName
        );
    }
}
