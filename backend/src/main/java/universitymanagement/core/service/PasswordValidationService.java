package universitymanagement.core.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import universitymanagement.core.data.UserRepository;
import universitymanagement.web.security.JwtToken;

import java.util.Optional;

@Service
public class PasswordValidationService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public PasswordValidationService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    public Optional<Boolean> validatePassword(String token, String password) {
        final var decodedJwt = JwtToken.decode(token);
        String email = decodedJwt.getSubject();
        return userRepository
                .getByEmail(email)
                .map(user -> bCryptPasswordEncoder.matches(password, user.password()));
    }
}
