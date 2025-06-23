package com.example.courses.service;

import com.example.courses.model.Course;
import com.example.courses.model.CourseInstance;
import com.example.courses.repository.CourseInstanceRepository;
import com.example.courses.repository.CourseRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class CourseInstanceService {
    @Autowired
    private CourseInstanceRepository courseInstanceRepository;
    @Autowired
    private CourseRepository courseRepository;

    @Transactional
    public CourseInstance createInstance(int year, int semester, String courseId) {
        Course course = courseRepository.findByCourseId(courseId)
                .orElseThrow(() -> new NoSuchElementException("Course not found: " + courseId));
        CourseInstance instance = CourseInstance.builder()
                .year(year)
                .semester(semester)
                .course(course)
                .build();
        return courseInstanceRepository.save(instance);
    }

    public List<CourseInstance> getInstancesByYearAndSemester(int year, int semester) {
        return courseInstanceRepository.findByYearAndSemester(year, semester);
    }

    public List<CourseInstance> getInstanceDetails(int year, int semester, String courseId) {
        return courseInstanceRepository.findByYearAndSemesterAndCourse_CourseId(year, semester, courseId);
    }

    @Transactional
    public void deleteInstance(int year, int semester, String courseId) {
        List<CourseInstance> instances = courseInstanceRepository.findByYearAndSemesterAndCourse_CourseId(year, semester, courseId);
        if (instances.isEmpty()) {
            throw new NoSuchElementException("Instance not found");
        }
        courseInstanceRepository.deleteByYearAndSemesterAndCourse_CourseId(year, semester, courseId);
    }
} 