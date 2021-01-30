package universitymanagement.web.api;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import universitymanagement.common.DateTimeUtils;
import universitymanagement.core.data.AddressRepository;
import universitymanagement.core.data.StudentRepository;
import universitymanagement.core.data.UserRepository;
import universitymanagement.core.service.AddStudentService;
import universitymanagement.core.service.request.AddStudentRequest;
import universitymanagement.core.service.request.UpdateStudentRequest;
import universitymanagement.web.SuccessResponse;
import universitymanagement.web.api.response.StudentResponse;
import universitymanagement.web.error.RestException;

import javax.websocket.server.PathParam;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/students")
public class StudentController {

    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final StudentRepository studentRepository;
    private final AddStudentService addStudentService;

    public StudentController(
            UserRepository userRepository,
            AddressRepository addressRepository,
            StudentRepository studentRepository,
            AddStudentService addStudentService) {
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.studentRepository = studentRepository;
        this.addStudentService = addStudentService;
    }

    @PreAuthorize("hasRole('Admin') or hasRole('Employee')")
    @GetMapping
    public SuccessResponse<List<StudentResponse>> getStudents(@PathParam("groupId") Integer groupId) {
        final var students = groupId != null
                ? studentRepository.getAllByGroupId(groupId)
                : studentRepository.getAll();
        final var responses = students
                .stream()
                .map(StudentResponse::fromStudent)
                .collect(Collectors.toList());
        return new SuccessResponse<>(responses);
    }

    @PreAuthorize("hasRole('Admin') or hasRole('Employee')")
    @GetMapping("/{userId}")
    public SuccessResponse<StudentResponse> getStudent(@PathVariable("userId") int userId) {
        return studentRepository
                .getByUserId(userId)
                .map(StudentResponse::fromStudent)
                .map(SuccessResponse::new)
                .orElseThrow(() -> new RestException("Unable to get a student."));
    }

    @PreAuthorize("hasRole('Admin')")
    @PostMapping
    public SuccessResponse<StudentResponse> addStudent(@RequestBody AddStudentRequest request) {
        return addStudentService
                .addStudent(request)
                .map(StudentResponse::fromStudent)
                .map(SuccessResponse::new)
                .orElseThrow(() -> new RestException("Unable to add a student."));
    }

    @PreAuthorize("hasRole('Admin')")
    @PutMapping("/{userId}")
    public SuccessResponse<Void> updateStudent(
            @PathVariable("userId") int userId,
            @RequestBody UpdateStudentRequest request) {
        return studentRepository
                .getByUserId(userId)
                .map(student -> {
                    final var user = request.user();
                    final var address = request.address();

                    userRepository.updateUserById(
                            student.user().userId(),
                            user.email());
                    addressRepository.updateAddressById(
                            student.address().addressId(),
                            address.street(),
                            address.houseNumber(),
                            address.flatNumber(),
                            address.postcode(),
                            address.city(),
                            address.country());
                    studentRepository.updateStudentById(
                            student.studentId(),
                            request.firstName(),
                            request.lastName(),
                            DateTimeUtils.parseDate(request.birthDate()),
                            request.pesel(),
                            request.phoneNumber(),
                            request.albumNumber(),
                            Set.of());
                    return true;
                })
                .map(updated -> new SuccessResponse<Void>(null))
                .orElseThrow(() -> new RestException("Unable to update a student."));
    }

}
