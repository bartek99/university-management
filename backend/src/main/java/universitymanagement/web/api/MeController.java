package universitymanagement.web.api;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import universitymanagement.common.DateTimeUtils;
import universitymanagement.core.data.*;
import universitymanagement.core.service.PasswordChangeService;
import universitymanagement.core.service.PasswordValidationService;
import universitymanagement.core.service.request.AddEventRequest;
import universitymanagement.core.service.request.UpdateEventRequest;
import universitymanagement.web.SuccessResponse;
import universitymanagement.core.service.request.PasswordChangeRequest;
import universitymanagement.core.service.request.PasswordValidationRequest;
import universitymanagement.web.api.response.*;
import universitymanagement.web.error.RestException;
import universitymanagement.web.security.JwtToken;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/me")
public class MeController {

    private final AdminRepository adminRepository;
    private final EmployeeRepository employeeRepository;
    private final StudentRepository studentRepository;
    private final ScheduleItemRepository scheduleItemRepository;
    private final GroupRepository groupRepository;
    private final CourseRepository courseRepository;
    private final GradeRepository gradeRepository;

    private final EventRepository eventRepository;
    private final RoomRepository roomRepository;

    private final PasswordValidationService passwordValidationService;
    private final PasswordChangeService passwordChangeService;

    public MeController(
            AdminRepository adminRepository,
            EmployeeRepository employeeRepository,
            StudentRepository studentRepository,
            ScheduleItemRepository scheduleItemRepository,
            PasswordValidationService passwordValidationService,
            PasswordChangeService passwordChangeService,
            GroupRepository groupRepository,
            CourseRepository courseRepository,
            GradeRepository gradeRepository,
            EventRepository eventRepository,
            RoomRepository roomRepository) {
        this.adminRepository = adminRepository;
        this.employeeRepository = employeeRepository;
        this.studentRepository = studentRepository;
        this.scheduleItemRepository = scheduleItemRepository;
        this.passwordValidationService = passwordValidationService;
        this.passwordChangeService = passwordChangeService;
        this.groupRepository=groupRepository;
        this.courseRepository=courseRepository;
        this.gradeRepository=gradeRepository;
        this.eventRepository = eventRepository;
        this.roomRepository = roomRepository;
    }

    @PreAuthorize("hasRole('Admin')")
    @GetMapping("/admin")
    public SuccessResponse<AdminResponse> getAdmin(@RequestHeader("Authorization") String token) {
        final var decodedJwt = JwtToken.decode(token);
        String email = decodedJwt.getSubject();
        return adminRepository
                .getAdminByEmail(email)
                .map(AdminResponse::fromAdmin)
                .map(SuccessResponse::new)
                .orElseThrow(() -> new RestException("Unable to get an admin."));
    }

    @PreAuthorize("hasRole('Employee')")
    @GetMapping("/employee")
    public SuccessResponse<EmployeeResponse> getEmployee(@RequestHeader("Authorization") String token) {
        final var decodedJwt = JwtToken.decode(token);
        String email = decodedJwt.getSubject();
        return employeeRepository
                .getByEmail(email)
                .map(EmployeeResponse::fromEmployee)
                .map(SuccessResponse::new)
                .orElseThrow(() -> new RestException("Unable to get an employee."));
    }


    @PreAuthorize("hasRole('Admin') or hasRole('Employee')")
    @GetMapping("/employee/events")
    public SuccessResponse<List<EventResponse>> getEmployeeEvents(@RequestHeader("Authorization") String token) {
        final var decodedJwt = JwtToken.decode(token);
        String email = decodedJwt.getSubject();
        final var events = employeeRepository
                .getByEmail(email)
                .map(employee -> eventRepository
                        .getAllByEmployeeId(employee.employeeId())
                        .stream()
                        .map(EventResponse::fromEvent)
                        .collect(Collectors.toList()))
                .orElse(List.of());
        return new SuccessResponse<>(events);
    }

    @PreAuthorize("hasRole('Student')")
    @GetMapping("/student")
    public SuccessResponse<StudentResponse> getStudent(@RequestHeader("Authorization") String token) {
        final var decodedJwt = JwtToken.decode(token);
        String email = decodedJwt.getSubject();
        return studentRepository
                .getByEmail(email)
                .map(StudentResponse::fromStudent)
                .map(SuccessResponse::new)
                .orElseThrow(() -> new RestException("Unable to get a student."));
    }


    @PreAuthorize("hasRole('Student')")
    @GetMapping("/student/groups")
    public SuccessResponse<List<GroupResponse>> getGroups(@RequestHeader("Authorization") String token) {
        final var decodedJwt = JwtToken.decode(token);
        String email = decodedJwt.getSubject();
        final var groups = groupRepository
                .getGroupsByStudent(email)
                .stream()
                .map(GroupResponse::fromGroup)
                .collect(Collectors.toList());
        return new SuccessResponse<>(groups);
    }

    @PreAuthorize("hasRole('Admin') or hasRole('Student')")
    @GetMapping("/student/events")
    public SuccessResponse<List<EventResponse>> getStudentEvents(@RequestHeader("Authorization") String token) {
        final var decodedJwt = JwtToken.decode(token);
        String email = decodedJwt.getSubject();
        final List<EventResponse> events = studentRepository
                .getByEmail(email)
                .map(student -> groupRepository
                        .getAllByStudentId(student.studentId())
                        .stream()
                        .flatMap(group -> eventRepository
                                .getAllByGroupId(group.groupId())
                                .stream()
                                .map(EventResponse::fromEvent))
                        .collect(Collectors.toList()))
                .orElse(List.of());
        return new SuccessResponse<>(events);
    }


    @PreAuthorize("hasRole('Admin') or hasRole('Employee')")
    @PostMapping("/employee/events")
    public SuccessResponse<EventResponse> addEvent(@RequestHeader("Authorization") String token, @RequestBody AddEventRequest request) {
        final var decodedJwt = JwtToken.decode(token);
        String email = decodedJwt.getSubject();
        final var employee = employeeRepository.getByEmail(email);
        final var group = groupRepository.getById(request.groupId());
        final var room = roomRepository.getRoomById(request.roomId());
        if (employee.isEmpty() || group.isEmpty() || room.isEmpty()) {
            throw new RestException("Unable to add an event.");
        }
        return eventRepository
                .add(
                        employee.get(),
                        group.get(),
                        room.get(),
                        request.name(),
                        DateTimeUtils.parseDate(request.date()),
                        DateTimeUtils.parseTime(request.timeFrom()),
                        DateTimeUtils.parseTime(request.timeTo())
                )
                .map(EventResponse::fromEvent)
                .map(SuccessResponse::new)
                .orElseThrow(() -> new RestException("Unable to add an event."));
    }

    @PreAuthorize("hasRole('Admin') or hasRole('Employee')")
    @PutMapping("/employee/events/{eventId}")
    public SuccessResponse<Void> updateEvent(
            @PathVariable("eventId") int eventId,
            @RequestHeader("Authorization") String token,
            @RequestBody UpdateEventRequest request) {
        final var decodedJwt = JwtToken.decode(token);
        String email = decodedJwt.getSubject();
        final var employee = employeeRepository.getByEmail(email);
        final var group = groupRepository.getById(request.groupId());
        final var room = roomRepository.getRoomById(request.roomId());
        final var updated = eventRepository.updateById(
                eventId,
                employee.get(),
                group.get(),
                room.get(),
                request.name(),
                DateTimeUtils.parseDate(request.date()),
                DateTimeUtils.parseTime(request.timeFrom()),
                DateTimeUtils.parseTime(request.timeTo()));
        if (updated) {
            return new SuccessResponse<>(null);
        } else {
            throw new RestException("Unable to update an event.");
        }
    }

    @PreAuthorize("hasRole('Employee')")
    @GetMapping("/employee/groups")
    public SuccessResponse<List<GroupResponse>> getEmployeeGroups(@RequestHeader("Authorization") String token) {
        final var decodedJwt = JwtToken.decode(token);
        String email = decodedJwt.getSubject();
        final var groups = groupRepository
                .getGroupsByEmployee(email)
                .stream()
                .map(GroupResponse::fromGroup)
                .collect(Collectors.toList());
        return new SuccessResponse<>(groups);
    }

    @PreAuthorize("hasRole('Student')")
    @GetMapping("/student/courses")
    public SuccessResponse<List<CourseResponse>> getStudentCourses(@RequestHeader("Authorization") String token) {
        final var decodedJwt = JwtToken.decode(token);
        String email = decodedJwt.getSubject();
        final var courses= courseRepository
                .getCourseByStudent(email)
                .stream()
                .map(CourseResponse::fromCourse)
                .collect(Collectors.toList());
        return new SuccessResponse<>(courses);
    }


    @PreAuthorize("hasRole('Student')")
    @GetMapping("/student/grades")
    public SuccessResponse<List<GradeResponse>> getStudentGrades(@RequestHeader("Authorization") String token) {
        final var decodedJwt = JwtToken.decode(token);
        String email = decodedJwt.getSubject();
        final var grades= gradeRepository
                .getGradesByStudent(email)
                .stream()
                .map(GradeResponse::fromGrade)
                .collect(Collectors.toList());
        return new SuccessResponse<>(grades);
    }


    @PreAuthorize("hasRole('Employee')")
    @GetMapping("/employee/grades")
    public SuccessResponse<List<GradeResponse>> getEmployeeGrades(@RequestHeader("Authorization") String token) {
        final var decodedJwt = JwtToken.decode(token);
        String email = decodedJwt.getSubject();
        final var grades= gradeRepository
                .getGradesByEmployee(email)
                .stream()
                .map(GradeResponse::fromGrade)
                .collect(Collectors.toList());
        return new SuccessResponse<>(grades);
    }

    @PreAuthorize("hasRole('Student')")
    @GetMapping("/student/schedule-items")
    public SuccessResponse<List<ScheduleItemResponse>> getScheduleItems(@RequestHeader("Authorization") String token) {
        final var decodedJwt = JwtToken.decode(token);
        String email = decodedJwt.getSubject();
        final var scheduleItems = studentRepository
                .getByEmail(email)
                .map(student -> scheduleItemRepository
                        .getAllByStudentId(student.studentId())
                        .stream()
                        .map(ScheduleItemResponse::fromScheduleItem)
                        .collect(Collectors.toList()))
                .orElse(List.of());
        return new SuccessResponse<>(scheduleItems);
    }

    @PostMapping("/password-validation")
    public SuccessResponse<Boolean> validatePassword(
            @RequestHeader("Authorization") String token,
            @RequestBody PasswordValidationRequest request) {
        return passwordValidationService
                .validatePassword(token, request.password())
                .map(SuccessResponse::new)
                .orElseThrow(() -> new RestException("Unable to validate a password"));
    }

    @PostMapping("/password-change")
    public SuccessResponse<Void> changePassword(
            @RequestHeader("Authorization") String token,
            @RequestBody PasswordChangeRequest request) {
        return passwordChangeService
                .changePassword(
                        token,
                        request.currentPassword(),
                        request.newPassword(),
                        request.newPasswordConfirmation())
                .filter(changed -> changed)
                .map(changed -> new SuccessResponse<Void>(null))
                .orElseThrow(() -> new RestException("Unable to change a password."));
    }
}
