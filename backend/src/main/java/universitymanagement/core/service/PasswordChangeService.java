package universitymanagement.core.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import universitymanagement.core.data.UserRepository;
import universitymanagement.web.security.JwtToken;

import java.util.Optional;

@Service
public class PasswordChangeService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public PasswordChangeService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    public Optional<Boolean> changePassword(
            String token,
            String currentPassword,
            String newPassword,
            String newPasswordConfirmation) {
        if (!newPassword.equals(newPasswordConfirmation)) {
            return Optional.of(false);
        }

        final var decodedJwt = JwtToken.decode(token);
        String email = decodedJwt.getSubject();

        return userRepository
                .getByEmail(email)
                .flatMap(user -> {
                    if (!bCryptPasswordEncoder.matches(currentPassword, user.password())) {
                        return Optional.of(false);
                    } else {
                        return userRepository.updatePasswordByUserId(
                                user.userId(),
                                bCryptPasswordEncoder.encode(newPassword));
                    }
                });
    }
}
