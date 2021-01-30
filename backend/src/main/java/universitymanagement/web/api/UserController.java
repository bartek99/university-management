package universitymanagement.web.api;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import universitymanagement.core.data.UserRepository;
import universitymanagement.web.SuccessResponse;
import universitymanagement.web.api.response.UserResponse;
import universitymanagement.web.error.RestException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PreAuthorize("hasRole('Admin')")
    @GetMapping
    public SuccessResponse<List<UserResponse>> getUsers() {
        final var users = userRepository
                .getUsers()
                .stream()
                .map(UserResponse::fromUser)
                .collect(Collectors.toList());
        return new SuccessResponse<>(users);
    }

    @PreAuthorize("hasRole('Admin')")
    @GetMapping("/search")
    public SuccessResponse<List<UserResponse>> searchUsers(
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "notUserId", required = false) Integer notUserId) {
        if (email != null) {
            var users = userRepository.getByEmail(email).map(List::of).orElse(List.of());
            if (notUserId != null) {
                users = users
                        .stream()
                        .filter(user -> user.userId() != notUserId)
                        .collect(Collectors.toList());
            }
            return new SuccessResponse<>(users.stream().map(UserResponse::fromUser).collect(Collectors.toList()));
        } else {
            return new SuccessResponse<>(List.of());
        }
    }

    @PreAuthorize("hasRole('Admin')")
    @DeleteMapping("/{userId}")
    public SuccessResponse<Void> deleteUser(@PathVariable("userId") int userId) {
        return userRepository
                .deleteUserById(userId)
                .map(deleted -> new SuccessResponse<Void>(null))
                .orElseThrow(() -> new RestException(("Unable to delete a user")));
    }
}
