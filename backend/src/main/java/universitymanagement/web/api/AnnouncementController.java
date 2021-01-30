package universitymanagement.web.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import universitymanagement.core.data.*;
import universitymanagement.core.service.request.AddAnnouncementRequest;
import universitymanagement.core.service.request.AddCommentRequest;
import universitymanagement.web.SuccessResponse;
import universitymanagement.web.api.response.AnnouncementResponse;
import universitymanagement.web.api.response.CommentResponse;
import universitymanagement.web.error.RestException;
import universitymanagement.web.security.JwtToken;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/announcements")
public class AnnouncementController {

    private final AnnouncementRepository announcementRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final StudentRepository studentRepository;

    @Autowired
    public AnnouncementController(
            AnnouncementRepository announcementRepository,
            CommentRepository commentRepository,
            UserRepository userRepository,
            EmployeeRepository employeeRepository,
            StudentRepository studentRepository) {
        this.announcementRepository = announcementRepository;
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.studentRepository = studentRepository;
    }

    @PreAuthorize("hasAnyRole('Employee')")
    @GetMapping
    public SuccessResponse<List<AnnouncementResponse>> getAll(
            @RequestHeader("Authorization") String token) {
        final var decodedJwt = JwtToken.decode(token);
        String email = decodedJwt.getSubject();
        final var announcements = employeeRepository
                .getByEmail(email)
                .map(employee -> announcementRepository
                        .getAll()
                        .stream()
                        .map(announcement -> AnnouncementResponse.from(announcement, announcement.employee().user().userId() == employee.user().userId()))
                        .collect(Collectors.toList()))
                .orElse(List.of());
        return new SuccessResponse<>(announcements);
    }


    @PreAuthorize("hasAnyRole('Student')")
    @GetMapping("/student")
    public SuccessResponse<List<AnnouncementResponse>> getAllForStudent() {
        return new SuccessResponse<>(announcementRepository.getAll().stream().map(announcement -> AnnouncementResponse.from(announcement, false)).collect(Collectors.toList()));
    }

    @PreAuthorize("hasAnyRole('Employee')")
    @GetMapping("/{announcementId}")
    public SuccessResponse<AnnouncementResponse> getById(
            @RequestHeader("Authorization") String token,
            @PathVariable int announcementId) {
        final var decodedJwt = JwtToken.decode(token);
        String email = decodedJwt.getSubject();
        return employeeRepository
                .getByEmail(email)
                .flatMap(employee -> announcementRepository
                        .getById(announcementId)
                        .map(announcement -> AnnouncementResponse.from(announcement, announcement.employee().user().userId() == employee.user().userId())))
                .map(SuccessResponse::new)
                .orElseThrow(() -> new RestException("Unable to get an announcement."));
    }

    @PreAuthorize("hasAnyRole('Student')")
    @GetMapping("/{announcementId}/student")
    public SuccessResponse<AnnouncementResponse> getByIdForStudent(
            @RequestHeader("Authorization") String token,
            @PathVariable int announcementId) {
        return announcementRepository
                .getById(announcementId)
                .map(announcement -> AnnouncementResponse.from(announcement, false))
                .map(SuccessResponse::new)
                .orElseThrow(() -> new RestException("Unable to get an announcement."));
    }

    @PreAuthorize("hasAnyRole('Employee')")
    @PostMapping
    public SuccessResponse<AnnouncementResponse> addAnnouncement(
            @RequestHeader("Authorization") String token,
            @RequestBody AddAnnouncementRequest request) {
        final var decodedJwt = JwtToken.decode(token);
        String email = decodedJwt.getSubject();
        String content = Arrays.stream(request.content().split("\n"))
                .filter(line -> !line.isBlank() && !line.isEmpty())
                .collect(Collectors.joining("\n"));
        return employeeRepository
                .getByEmail(email)
                .flatMap(employee -> announcementRepository
                        .add(employee, request.title(), request.description(), content, LocalDateTime.now())
                        .map(announcement -> AnnouncementResponse.from(announcement, announcement.employee().user().userId() == employee.user().userId())))
                .map(SuccessResponse::new)
                .orElseThrow(() -> new RestException("Unable to add an announcement."));
    }

    @PreAuthorize("hasAnyRole('Employee')")
    @DeleteMapping("/{announcementId}")
    public SuccessResponse<Void> deleteAnnouncement(@PathVariable int announcementId) {
        final var deleted = announcementRepository.deleteById(announcementId);
        if (deleted) {
            return new SuccessResponse<>(null);
        } else {
            throw new RestException("Unable to delete an announcement.");
        }
    }

    @PreAuthorize("hasAnyRole('Student', 'Employee')")
    @GetMapping("/{announcementId}/comments")
    public SuccessResponse<List<CommentResponse>> getComments(
            @RequestHeader("Authorization") String token,
            @PathVariable int announcementId) {
        final var decodedJwt = JwtToken.decode(token);
        String email = decodedJwt.getSubject();
        final var comments = userRepository
                .getByEmail(email)
                .map(user -> commentRepository
                        .getAllByAnnouncementId(announcementId)
                        .stream()
                        .map(comment -> {
                            final var author = getAuthor(comment.user().userId());
                            return CommentResponse.from(comment, author, comment.user().userId() == user.userId());
                        })
                        .collect(Collectors.toList()))
                .orElse(List.of());
        return new SuccessResponse<>(comments);
    }

    @PreAuthorize("hasAnyRole('Employee', 'Student')")
    @PostMapping("/{announcementId}/comments")
    public SuccessResponse<CommentResponse> addComment(
            @RequestHeader("Authorization") String token,
            @PathVariable int announcementId,
            @RequestBody AddCommentRequest request) {
        final var decodedJwt = JwtToken.decode(token);
        String email = decodedJwt.getSubject();

        return userRepository
                .getByEmail(email)
                .flatMap(user -> announcementRepository
                        .getById(announcementId)
                        .flatMap(announcement -> commentRepository.add(announcement, user, request.content(), LocalDateTime.now()))
                        .map(comment -> CommentResponse.from(comment, getAuthor(user.userId()), comment.user().userId() == user.userId())))
                .map(SuccessResponse::new)
                .orElseThrow(() -> new RestException("Unable to add a comment."));
    }

    @PreAuthorize("hasAnyRole('Employee', 'Student')")
    @DeleteMapping("/{announcementId}/comments/{commentId}")
    public SuccessResponse<Void> deleteComment(
            @PathVariable int announcementId,
            @PathVariable int commentId) {
        final var deleted = commentRepository.deleteById(commentId);
        if (deleted) {
            return new SuccessResponse<>(null);
        } else {
            throw new RestException("Unable to delete a comment.");
        }
    }

    private String getAuthor(int userId) {
        return employeeRepository
                .getByUserId(userId)
                .map(Employee::fullName)
                .or(() -> studentRepository
                        .getByUserId(userId)
                        .map(Student::fullName))
                .orElse("Anonim");
    }
}
