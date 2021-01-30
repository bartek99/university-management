package universitymanagement.core.data;

public record User (int userId, UserType userType, String email, String password) {
}
