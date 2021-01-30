package universitymanagement.core.data;

import java.util.List;
import java.util.Optional;

public interface UserRepository {

    List<User> getUsers();

    Optional<User> getUserById(int userId);

    Optional<User> getByEmail(String email);

    Optional<User> addUser(UserType userType, String email, String password);

    Optional<Boolean> updateUserById(int userId, String email);

    Optional<Boolean> updatePasswordByUserId(int userId, String password);

    Optional<Boolean> deleteUserById(int userId);
}
