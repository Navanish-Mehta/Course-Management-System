package com.example.courses.controller;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.courses.model.Course;
import com.example.courses.service.CourseService;

import jakarta.validation.Valid;
import lombok.Data;

@RestController
@RequestMapping("/api/courses")
public class CourseController {
    @Autowired
    private CourseService courseService;

    @GetMapping
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }

    @GetMapping("/{courseId}")
    public ResponseEntity<?> getCourse(@PathVariable String courseId) {
        return courseService.getCourseByCourseId(courseId)
                .<ResponseEntity<?>>map(course -> ResponseEntity.ok().body(course))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Course not found")));
    }

    @PostMapping
    public ResponseEntity<?> createCourse(@Valid @RequestBody CourseRequest request) {
        try {
            Course course = Course.builder()
                    .courseId(request.getCourseId())
                    .title(request.getTitle())
                    .description(request.getDescription())
                    .build();
            Course saved = courseService.createCourse(course, request.getPrerequisites());
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{courseId}")
    public ResponseEntity<?> updateCourse(@PathVariable String courseId, @Valid @RequestBody CourseRequest request) {
        try {
            Course courseDetails = Course.builder()
                    .title(request.getTitle())
                    .description(request.getDescription())
                    .build();
            Course updated = courseService.updateCourse(courseId, courseDetails, request.getPrerequisites());
            return ResponseEntity.ok(updated);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{courseId}")
    public ResponseEntity<?> deleteCourse(@PathVariable String courseId) {
        try {
            courseService.deleteCourse(courseId);
            return ResponseEntity.noContent().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
        }
    }

    @Data
    public static class CourseRequest {
        private String courseId;
        private String title;
        private String description;
        private List<String> prerequisites;
    }
} 