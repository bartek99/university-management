package universitymanagement.web.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import universitymanagement.core.data.*;
import universitymanagement.core.service.request.AddGradeRequest;
import universitymanagement.core.service.request.AddGroupRequest;
import universitymanagement.core.service.request.UpdateGradeRequest;
import universitymanagement.core.service.request.UpdateRoomRequest;
import universitymanagement.web.SuccessResponse;
import universitymanagement.web.api.response.EmployeeResponse;
import universitymanagement.web.api.response.FacultyResponse;
import universitymanagement.web.api.response.GradeResponse;
import universitymanagement.web.api.response.GroupResponse;
import universitymanagement.web.error.RestException;
import universitymanagement.web.security.JwtToken;

import java.util.Optional;

@RestController
@RequestMapping("/grades")
public class GradeController {

        private final GradeRepository gradeRepository;
        private final CourseRepository courseRepository;
        private final StudentRepository studentRepository;
        private final EmployeeRepository employeeRepository;

        @Autowired
        public GradeController(GradeRepository gradeRepository,
                               CourseRepository courseRepository,
                               StudentRepository studentRepository,
                               EmployeeRepository employeeRepository){
            this.gradeRepository=gradeRepository;
            this.courseRepository=courseRepository;
            this.studentRepository=studentRepository;
            this.employeeRepository=employeeRepository;
        }


    @PreAuthorize("hasRole('Employee')")
    @PostMapping
    public SuccessResponse<GradeResponse> addGrade(@RequestHeader("Authorization") String token, @RequestBody AddGradeRequest request) {
        final var decodedJwt = JwtToken.decode(token);
        String email = decodedJwt.getSubject();
        Course course=courseRepository.getById(request.courseId()).get();
        Student student=studentRepository.getById(request.studentId()).get();
        Employee employee=employeeRepository.getByEmail(email).get();
        System.out.println(course);
        System.out.println(student);
        System.out.println(employee);
        return gradeRepository
                .addGrade(course, student, employee, request.name(), request.description(), request.value())
                .map(GradeResponse::fromGrade)
                .map(SuccessResponse::new)
                .orElseThrow(() -> new RestException("Unable to add a group."));
    }

    @PreAuthorize("hasRole('Student') or hasRole('Employee')")
    @GetMapping("/{gradeId}")
    public SuccessResponse<GradeResponse> getGrade(@PathVariable("gradeId") int gradeId) {
        return gradeRepository
                .getGradeById(gradeId)
                .map(GradeResponse::fromGrade)
                .map(SuccessResponse::new)
                .orElseThrow(() -> new RestException("Unable to get a grade."));
    }


    @PreAuthorize("hasRole('Employee')")
    @PutMapping("/{gradeId}")
    public SuccessResponse<Void> updateGrade(
            @RequestHeader("Authorization") String token,
            @PathVariable("gradeId") int gradeId,
            @RequestBody UpdateGradeRequest request) {

        final var decodedJwt = JwtToken.decode(token);
        String email = decodedJwt.getSubject();
        Student student=studentRepository.getById(request.studentId()).get();
        Employee employee=employeeRepository.getByEmail(email).get();
        return courseRepository.getById(request.studentId())
                .map(course -> gradeRepository.updateGradeById(gradeId, course, student, employee, request.value(), request.name(), request.description()))
                .filter(updated -> updated)
                .map(updated -> new SuccessResponse<Void>(null))
                .orElseThrow(() -> new RestException("Unable to update a grade."));
    }

    @PreAuthorize("hasRole('Employee')")
    @DeleteMapping("/{gradeId}")
    public SuccessResponse<Void> deleteGrade(@PathVariable("gradeId") int gradeId) {
        final var deleted = gradeRepository.deleteGradeById(gradeId);
        if (deleted) {
            return new SuccessResponse<>(null);
        } else {
            throw new RestException("Unable to delete a grade");
        }
    }
}
