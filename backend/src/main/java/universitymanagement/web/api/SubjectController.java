package universitymanagement.web.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import universitymanagement.core.data.FacultyRepository;
import universitymanagement.core.data.SubjectRepository;
import universitymanagement.core.service.request.AddCourseRequest;
import universitymanagement.core.service.request.AddSubjectRequest;
import universitymanagement.core.service.request.UpdateCourseRequest;
import universitymanagement.core.service.request.UpdateSubjectRequest;
import universitymanagement.web.SuccessResponse;
import universitymanagement.web.api.response.CourseResponse;
import universitymanagement.web.api.response.FacultyResponse;
import universitymanagement.web.api.response.SubjectResponse;
import universitymanagement.web.error.RestException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/subjects")
public class SubjectController {

    private final SubjectRepository subjectRepository;
    private final FacultyRepository facultyRepository;

    @Autowired
    public SubjectController(SubjectRepository subjectRepository, FacultyRepository facultyRepository) {
        this.subjectRepository = subjectRepository;
        this.facultyRepository = facultyRepository;
    }

    @PreAuthorize("hasRole('Admin')")
    @GetMapping
    public SuccessResponse<List<SubjectResponse>> getAll() {
        final var subjects = subjectRepository
                .getAll()
                .stream()
                .map(SubjectResponse::fromSubject)
                .collect(Collectors.toList());
        return new SuccessResponse<>(subjects);
    }

    @PreAuthorize("hasRole('Admin') or hasRole('Student')")
    @GetMapping("/{subjectId}")
    public SuccessResponse<SubjectResponse> getSubject(@PathVariable("subjectId") int subjectId) {
        return subjectRepository
                .getById(subjectId)
                .map(SubjectResponse::fromSubject)
                .map(SuccessResponse::new)
                .orElseThrow(() -> new RestException("Unable to get a subject."));
    }


    @PreAuthorize("hasRole('Student')")
    @GetMapping("/byFaculty/{facultyId}")
    public SuccessResponse<List<SubjectResponse>> getSubjectByFacultyId(@PathVariable("facultyId") int facultyId) {
        final var subjects = subjectRepository
                .getByFacultyId(facultyId)
                .stream()
                .map(SubjectResponse::fromSubject)
                .collect(Collectors.toList());
        return new SuccessResponse<>(subjects);
    }


    @PreAuthorize("hasRole('Admin')")
    @PostMapping
    public SuccessResponse<SubjectResponse> addSubject(@RequestBody AddSubjectRequest request) {
        return facultyRepository
                .getById(request.facultyId())
                .flatMap(faculty -> subjectRepository.add(faculty, request.name()))
                .map(SubjectResponse::fromSubject)
                .map(SuccessResponse::new)
                .orElseThrow(() -> new RestException("Unable to add a subject."));
    }

    @PreAuthorize("hasRole('Admin')")
    @PutMapping("/{subjectId}")
    public SuccessResponse<Void> updateSubject(
            @PathVariable("subjectId") int subjectId,
            @RequestBody UpdateSubjectRequest request) {
        return facultyRepository
                .getById(request.facultyId())
                .map(faculty -> subjectRepository.updateById(subjectId, faculty, request.name()))
                .filter(updated -> updated)
                .map(updated -> new SuccessResponse<Void>(null))
                .orElseThrow(() -> new RestException("Unable to update a subject."));
    }

    @PreAuthorize("hasRole('Admin')")
    @DeleteMapping("/{subjectId}")
    public SuccessResponse<Void> deleteSubject(@PathVariable("subjectId") int subjectId) {
        final var deleted = subjectRepository.deleteById(subjectId);
        if (deleted) {
            return new SuccessResponse<>(null);
        } else {
            throw new RestException("Unable to delete a subject");
        }
    }
}
