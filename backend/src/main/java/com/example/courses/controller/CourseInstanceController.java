package com.example.courses.controller;

import com.example.courses.model.CourseInstance;
import com.example.courses.service.CourseInstanceService;
import jakarta.validation.Valid;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/instances")
public class CourseInstanceController {
    @Autowired
    private CourseInstanceService courseInstanceService;

    @PostMapping
    public ResponseEntity<?> createInstance(@Valid @RequestBody InstanceRequest request) {
        try {
            CourseInstance instance = courseInstanceService.createInstance(request.getYear(), request.getSemester(), request.getCourseId());
            return ResponseEntity.status(HttpStatus.CREATED).body(instance);
        } catch (NoSuchElementException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{year}/{semester}")
    public List<CourseInstance> getInstances(@PathVariable int year, @PathVariable int semester) {
        return courseInstanceService.getInstancesByYearAndSemester(year, semester);
    }

    @GetMapping("/{year}/{semester}/{courseId}")
    public ResponseEntity<?> getInstanceDetails(@PathVariable int year, @PathVariable int semester, @PathVariable String courseId) {
        List<CourseInstance> details = courseInstanceService.getInstanceDetails(year, semester, courseId);
        if (details.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Instance not found"));
        }
        return ResponseEntity.ok(details);
    }

    @DeleteMapping("/{year}/{semester}/{courseId}")
    public ResponseEntity<?> deleteInstance(@PathVariable int year, @PathVariable int semester, @PathVariable String courseId) {
        try {
            courseInstanceService.deleteInstance(year, semester, courseId);
            return ResponseEntity.noContent().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    @Data
    public static class InstanceRequest {
        private int year;
        private int semester;
        private String courseId;
    }
} 