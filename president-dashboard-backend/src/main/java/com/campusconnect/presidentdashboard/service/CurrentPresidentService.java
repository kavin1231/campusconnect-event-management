package com.campusconnect.presidentdashboard.service;

import com.campusconnect.presidentdashboard.entity.President;
import com.campusconnect.presidentdashboard.exception.ResourceNotFoundException;
import com.campusconnect.presidentdashboard.repository.PresidentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CurrentPresidentService {

    private final PresidentRepository presidentRepository;

    public President getCurrentPresident() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return presidentRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated president not found"));
    }
}
