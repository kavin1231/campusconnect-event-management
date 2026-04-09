package com.campusconnect.presidentdashboard.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "clubs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Club {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 120)
    private String name;

    @Column(nullable = false, unique = true, length = 20)
    private String code;

    @Builder.Default
    @OneToMany(mappedBy = "club")
    private Set<President> presidents = new HashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "club")
    private Set<Event> events = new HashSet<>();
}
