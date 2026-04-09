package com.campusconnect.presidentdashboard.security;

import com.campusconnect.presidentdashboard.repository.PresidentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PresidentUserDetailsService implements UserDetailsService {

    private final PresidentRepository presidentRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        var president = presidentRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("President not found"));

        return User.builder()
                .username(president.getEmail())
                .password(president.getPasswordHash())
                .authorities(president.getRole().name())
                .disabled(!president.isActive())
                .build();
    }
}
