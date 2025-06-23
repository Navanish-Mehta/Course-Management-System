package com.example.courses.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.courses.model.Course;
import com.example.courses.model.CourseInstance;

public interface CourseInstanceRepository extends JpaRepository<CourseInstance, Long> {
    List<CourseInstance> findByYearAndSemester(int year, int semester);
    List<CourseInstance> findByYearAndSemesterAndCourse_CourseId(int year, int semester, String courseId);
    void deleteByYearAndSemesterAndCourse_CourseId(int year, int semester, String courseId);
    boolean existsByCourse(Course course);
} 