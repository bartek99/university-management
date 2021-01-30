package universitymanagement.web.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import universitymanagement.core.data.AdminRepository;
import universitymanagement.core.data.UserRepository;
import universitymanagement.core.service.request.AddAdminRequest;
import universitymanagement.core.service.request.UpdateAdminRequest;
import universitymanagement.core.service.AddAdminService;
import universitymanagement.web.SuccessResponse;
import universitymanagement.web.api.response.AdminResponse;
import universitymanagement.web.error.RestException;

@RestController
@RequestMapping("/admins")
public class AdminController {

    private final AdminRepository adminRepository;
    private final UserRepository userRepository;
    private final AddAdminService addAdminService;

    @Autowired
    public AdminController(
            AdminRepository adminRepository,
            UserRepository userRepository,
            AddAdminService addAdminService) {
        this.adminRepository = adminRepository;
        this.userRepository = userRepository;
        this.addAdminService = addAdminService;
    }

    @PreAuthorize("hasRole('Admin')")
    @GetMapping("/{userId}")
    public SuccessResponse<AdminResponse> getAdmin(@PathVariable("userId") int userId) {
        return adminRepository
                .getAdminByUserId(userId)
                .map(AdminResponse::fromAdmin)
                .map(SuccessResponse::new)
                .orElseThrow(() -> new RestException("Unable to get an admin."));
    }

    @PreAuthorize("hasRole('Admin')")
    @PostMapping
    public SuccessResponse<AdminResponse> addAdmin(@RequestBody AddAdminRequest request) {
        return addAdminService
                .addAdmin(
                        request.user().email(),
                        request.user().password(),
                        request.user().passwordConfirmation())
                .map(AdminResponse::fromAdmin)
                .map(SuccessResponse::new)
                .orElseThrow(() -> new RestException("Unable to add an admin."));
    }

    @PreAuthorize("hasRole('Admin')")
    @PutMapping("/{userId}")
    public SuccessResponse<Void> updateAdmin(
            @PathVariable("userId") int userId,
            @RequestBody UpdateAdminRequest request) {
        return userRepository
                .updateUserById(userId, request.user().email())
                .map(updated -> new SuccessResponse<Void>(null))
                .orElseThrow(() -> new RestException("Unable to update an admin."));
    }
}
