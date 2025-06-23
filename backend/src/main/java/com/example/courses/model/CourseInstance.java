package com.example.courses.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "course_instance")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseInstance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "instance_year", nullable = false)
    private int year;

    @Column(nullable = false)
    private int semester;

    @ManyToOne(optional = false)
    @JoinColumn(name = "course_id")
    private Course course;
}