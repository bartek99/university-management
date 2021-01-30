package universitymanagement.web.api.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import universitymanagement.core.data.User;

public record UserResponse(
        @JsonProperty("userType") String userType,
        @JsonProperty("userId") int userId,
        @JsonProperty("email") String email) {

    public static UserResponse fromUser(User user) {
        return new UserResponse(user.userType().value(), user.userId(), user.email());
    }
}
