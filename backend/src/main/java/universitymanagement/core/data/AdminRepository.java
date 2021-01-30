package universitymanagement.core.data;

import java.util.Optional;

public interface AdminRepository {

    Optional<Admin> getAdminByUserId(int userId);

    Optional<Admin> getAdminByEmail(String email);

    Optional<Admin> addAdmin(User user);
}
