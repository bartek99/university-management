package universitymanagement.web.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import universitymanagement.core.data.FacultyRepository;
import universitymanagement.core.service.request.*;
import universitymanagement.web.SuccessResponse;
import universitymanagement.web.api.response.FacultyResponse;
import universitymanagement.web.error.RestException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/faculties")
public class FacultyController {

    private final FacultyRepository facultyRepository;

    @Autowired
    public FacultyController(FacultyRepository facultyRepository) {
        this.facultyRepository = facultyRepository;
    }

    @PreAuthorize("hasRole('Admin') or hasRole('Student')")
    @GetMapping
    public SuccessResponse<List<FacultyResponse>> getAll() {
        final var faculties = facultyRepository
                .getAll()
                .stream()
                .map(FacultyResponse::fromFaculty)
                .collect(Collectors.toList());
        return new SuccessResponse<>(faculties);
    }

    @PreAuthorize("hasRole('Admin') or hasRole('Student')")
    @GetMapping("/{facultyId}")
    public SuccessResponse<FacultyResponse> getFaculty(@PathVariable("facultyId") int facultyId) {
        return facultyRepository
                .getById(facultyId)
                .map(FacultyResponse::fromFaculty)
                .map(SuccessResponse::new)
                .orElseThrow(() -> new RestException("Unable to get a faculty."));
    }

    @PreAuthorize("hasRole('Admin')")
    @PostMapping
    public SuccessResponse<FacultyResponse> addFaculty(@RequestBody AddFacultyRequest request) {
        return facultyRepository
                .add(request.name())
                .map(FacultyResponse::fromFaculty)
                .map(SuccessResponse::new)
                .orElseThrow(() -> new RestException("Unable to add a faculty."));
    }

    @PreAuthorize("hasRole('Admin')")
    @PutMapping("/{facultyId}")
    public SuccessResponse<Void> updateFaculty(
            @PathVariable("facultyId") int facultyId,
            @RequestBody UpdateFacultyRequest request) {
        final var updated = facultyRepository.updateById(facultyId, request.name());
        if (updated) {
            return new SuccessResponse<Void>(null);
        } else {
            throw new RestException("Unable to update a faculty.");
        }
    }

    @PreAuthorize("hasRole('Admin')")
    @DeleteMapping("/{facultyId}")
    public SuccessResponse<Void> deleteFaculty(@PathVariable("facultyId") int facultyId) {
        final var deleted = facultyRepository.deleteById(facultyId);
        if (deleted) {
            return new SuccessResponse<>(null);
        } else {
            throw new RestException("Unable to delete a user.");
        }
    }
}
