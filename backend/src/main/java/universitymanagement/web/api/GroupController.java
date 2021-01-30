package universitymanagement.web.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import universitymanagement.core.data.CourseRepository;
import universitymanagement.core.data.EmployeeRepository;
import universitymanagement.core.data.GroupRepository;
import universitymanagement.core.data.StudentRepository;
import universitymanagement.core.service.request.*;
import universitymanagement.web.SuccessResponse;
import universitymanagement.web.api.response.GroupResponse;
import universitymanagement.web.error.RestException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/groups")
public class GroupController {

    private final GroupRepository groupRepository;
    private final CourseRepository courseRepository;
    private final EmployeeRepository employeeRepository;
    private final StudentRepository studentRepository;

    @Autowired
    public GroupController(
            GroupRepository groupRepository,
            CourseRepository courseRepository,
            EmployeeRepository employeeRepository,
            StudentRepository studentRepository) {
        this.groupRepository = groupRepository;
        this.courseRepository = courseRepository;
        this.employeeRepository = employeeRepository;
        this.studentRepository = studentRepository;
    }

    @PreAuthorize("hasRole('Admin') or hasRole('Employee')")
    @GetMapping
    public SuccessResponse<List<GroupResponse>> getAll() {
        final var groups = groupRepository
                .getAll()
                .stream()
                .map(GroupResponse::fromGroup)
                .collect(Collectors.toList());
        return new SuccessResponse<>(groups);
    }

    @PreAuthorize("hasRole('Admin') or hasRole('Employee')")
    @GetMapping("/{groupId}")
    public SuccessResponse<GroupResponse> getGroup(@PathVariable("groupId") int groupId) {
        return groupRepository
                .getById(groupId)
                .map(GroupResponse::fromGroup)
                .map(SuccessResponse::new)
                .orElseThrow(() -> new RestException("Unable to get a group."));
    }

    @PreAuthorize("hasRole('Admin')")
    @PostMapping
    public SuccessResponse<GroupResponse> addGroup(@RequestBody AddGroupRequest request) {
        return courseRepository
                .getById(request.courseId())
                .flatMap(course -> groupRepository.add(course, request.name()))
                .map(GroupResponse::fromGroup)
                .map(SuccessResponse::new)
                .orElseThrow(() -> new RestException("Unable to add a group."));
    }

    @PreAuthorize("hasRole('Admin')")
    @PutMapping("/{groupId}")
    public SuccessResponse<Void> updateGroup(
            @PathVariable("groupId") int groupId,
            @RequestBody UpdateGroupRequest request) {
        return courseRepository
                .getById(request.courseId())
                .map(course -> groupRepository.updateById(groupId, course, request.name()))
                .filter(updated -> updated)
                .map(updated -> new SuccessResponse<Void>(null))
                .orElseThrow(() -> new RestException("Unable to update a group."));
    }

    @PreAuthorize("hasRole('Admin')")
    @DeleteMapping("/{groupId}")
    public SuccessResponse<Void> deleteGroup(@PathVariable("groupId") int groupId) {
        final var deleted = groupRepository.deleteById(groupId);
        if (deleted) {
            return new SuccessResponse<>(null);
        } else {
            throw new RestException("Unable to delete a group.");
        }
    }

    @PreAuthorize("hasRole('Admin')")
    @PostMapping("/{groupId}/employees")
    public SuccessResponse<Void> addEmployee(
            @PathVariable("groupId") int groupId,
            @RequestBody AddEmployeeToGroupRequest request) {
        final var group = groupRepository.getById(groupId);
        final var employee = employeeRepository.getById(request.employeeId());
        if (group.isEmpty() || employee.isEmpty()) {
            throw new RestException("Unable to add a employee to group.");
        } else {
            final var added = groupRepository.addEmployee(group.get(), employee.get());
            if (added) {
                return new SuccessResponse<>(null);
            } else {
                throw new RestException("Unable to add a employee to group.");
            }
        }
    }

    @PreAuthorize("hasRole('Admin')")
    @PostMapping("/{groupId}/students")
    public SuccessResponse<Void> addStudent(
            @PathVariable("groupId") int groupId,
            @RequestBody AddStudentToGroupRequest request) {
        final var group = groupRepository.getById(groupId);
        final var student = studentRepository.getById(request.studentId());
        if (group.isEmpty() || student.isEmpty()) {
            throw new RestException("Unable to add a student to group.");
        } else {
            final var added = groupRepository.addStudent(group.get(), student.get());
            if (added) {
                return new SuccessResponse<>(null);
            } else {
                throw new RestException("Unable to add a student to group.");
            }
        }
    }
}
