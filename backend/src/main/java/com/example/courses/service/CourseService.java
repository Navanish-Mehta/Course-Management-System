package com.example.courses.service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.courses.model.Course;
import com.example.courses.repository.CourseInstanceRepository;
import com.example.courses.repository.CourseRepository;

import jakarta.transaction.Transactional;

@Service
public class CourseService {
    @Autowired
    private CourseRepository courseRepository;
    @Autowired
    private CourseInstanceRepository courseInstanceRepository;

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Optional<Course> getCourseByCourseId(String courseId) {
        return courseRepository.findByCourseId(courseId);
    }

    @Transactional
    public Course createCourse(Course course, List<String> prerequisiteIds) {
        // Validate prerequisites
        List<Course> prerequisites = new ArrayList<>();
        for (String preId : prerequisiteIds) {
            Course pre = courseRepository.findByCourseId(preId)
                    .orElseThrow(() -> new IllegalArgumentException("Prerequisite course not found: " + preId));
            prerequisites.add(pre);
        }
        course.setPrerequisites(prerequisites);
        return courseRepository.save(course);
    }

    @Transactional
    public void deleteCourse(String courseId) {
        Course course = courseRepository.findByCourseId(courseId)
                .orElseThrow(() -> new NoSuchElementException("Course not found: " + courseId));
        // Check if this course is a prerequisite for any other course
        List<Course> allCourses = courseRepository.findAll();
        for (Course c : allCourses) {
            if (c.getPrerequisites() != null && c.getPrerequisites().contains(course)) {
                throw new IllegalStateException("Course is a prerequisite for another course and cannot be deleted.");
            }
        }
        // Check if this course has any instances
        if (courseInstanceRepository.existsByCourse(course)) {
            throw new IllegalStateException("Course has instances and cannot be deleted.");
        }
        courseRepository.delete(course);
    }

    @Transactional
    public Course updateCourse(String courseId, Course updatedCourse, List<String> prerequisiteIds) {
        Course course = courseRepository.findByCourseId(courseId)
                .orElseThrow(() -> new NoSuchElementException("Course not found: " + courseId));

        List<Course> prerequisites = new ArrayList<>();
        if (prerequisiteIds != null) {
            for (String preId : prerequisiteIds) {
                Course pre = courseRepository.findByCourseId(preId)
                        .orElseThrow(() -> new IllegalArgumentException("Prerequisite course not found: " + preId));
                prerequisites.add(pre);
            }
        }

        course.setTitle(updatedCourse.getTitle());
        course.setDescription(updatedCourse.getDescription());
        course.setPrerequisites(prerequisites);

        return courseRepository.save(course);
    }
} 