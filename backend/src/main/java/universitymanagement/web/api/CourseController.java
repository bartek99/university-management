package universitymanagement.web.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import universitymanagement.core.data.CourseRepository;
import universitymanagement.core.data.SubjectRepository;
import universitymanagement.core.service.request.AddAdminRequest;
import universitymanagement.core.service.request.AddCourseRequest;
import universitymanagement.core.service.request.UpdateCourseRequest;
import universitymanagement.core.service.request.UpdateFacultyRequest;
import universitymanagement.web.SuccessResponse;
import universitymanagement.web.api.response.AdminResponse;
import universitymanagement.web.api.response.CourseResponse;
import universitymanagement.web.api.response.SubjectResponse;
import universitymanagement.web.error.RestException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/courses")
public class CourseController {

    private final CourseRepository courseRepository;
    private final SubjectRepository subjectRepository;

    @Autowired
    public CourseController(CourseRepository courseRepository, SubjectRepository subjectRepository) {
        this.courseRepository = courseRepository;
        this.subjectRepository = subjectRepository;
    }

    @PreAuthorize("hasRole('Admin')")
    @GetMapping
    public SuccessResponse<List<CourseResponse>> getAll() {
        final var courses = courseRepository
                .getAll()
                .stream()
                .map(CourseResponse::fromCourse)
                .collect(Collectors.toList());
        return new SuccessResponse<>(courses);
    }

    @PreAuthorize("hasRole('Admin')")
    @GetMapping("/{courseId}")
    public SuccessResponse<CourseResponse> getCourse(@PathVariable("courseId") int courseId) {
        return courseRepository
                .getById(courseId)
                .map(CourseResponse::fromCourse)
                .map(SuccessResponse::new)
                .orElseThrow(() -> new RestException("Unable to get a course."));
    }

    @PreAuthorize("hasRole('Employee')")
    @GetMapping("/byGroup/{groupId}")
    public SuccessResponse<CourseResponse> getCourseByGroupId(@PathVariable("groupId") int groupId) {
        return courseRepository
                .getByGroupId(groupId)
                .map(CourseResponse::fromCourse)
                .map(SuccessResponse::new)
                .orElseThrow(() -> new RestException("Unable to get a course."));
    }

    @PreAuthorize("hasRole('Student')")
    @GetMapping("/bySubject/{subjectId}")
    public SuccessResponse<List<CourseResponse>> getCourseBySubjectId(@PathVariable("subjectId") int subjectId) {
        final var courses = courseRepository
                .getBySubjectId(subjectId)
                .stream()
                .map(CourseResponse::fromCourse)
                .collect(Collectors.toList());
        return new SuccessResponse<>(courses);
    }

    @PreAuthorize("hasRole('Admin')")
    @PostMapping
    public SuccessResponse<CourseResponse> addCourse(@RequestBody AddCourseRequest request) {
        return subjectRepository
                .getById(request.subjectId())
                .flatMap(subject -> courseRepository.add(subject, request.name()))
                .map(CourseResponse::fromCourse)
                .map(SuccessResponse::new)
                .orElseThrow(() -> new RestException("Unable to add a course."));
    }

    @PreAuthorize("hasRole('Admin')")
    @PutMapping("/{courseId}")
    public SuccessResponse<Void> updateCourse(
            @PathVariable("courseId") int courseId,
            @RequestBody UpdateCourseRequest request) {
        return subjectRepository
                .getById(request.subjectId())
                .map(subject -> courseRepository.updateById(courseId, subject, request.name()))
                .filter(updated -> updated)
                .map(updated -> new SuccessResponse<Void>(null))
                .orElseThrow(() -> new RestException("Unable to update a course."));
    }

    @PreAuthorize("hasRole('Admin')")
    @DeleteMapping("/{courseId}")
    public SuccessResponse<Void> deleteCourse(@PathVariable("courseId") int courseId) {
        final var deleted = courseRepository.deleteById(courseId);
        if (deleted) {
            return new SuccessResponse<>(null);
        } else {
            throw new RestException("Unable to delete a course.");
        }
    }
}
