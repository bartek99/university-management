package universitymanagement.core.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import universitymanagement.core.data.Admin;
import universitymanagement.core.data.AdminRepository;
import universitymanagement.core.data.UserRepository;
import universitymanagement.core.data.UserType;

import java.util.Optional;

@Service
public class AddAdminService {

    private final UserRepository userRepository;
    private final AdminRepository adminRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public AddAdminService(
            UserRepository userRepository,
            AdminRepository adminRepository,
            BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.adminRepository = adminRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    public Optional<Admin> addAdmin(
            String email,
            String password,
            String passwordConfirmation) {
        if (!password.equals(passwordConfirmation)) {
            return Optional.empty();
        }
        final var encryptedPassword = bCryptPasswordEncoder.encode(password);
        return userRepository
                .addUser(UserType.ADMIN, email, encryptedPassword)
                .flatMap(adminRepository::addAdmin);
    }
}
