package universitymanagement.core.service.request;

import org.springframework.lang.Nullable;

public record SearchUserRequest(@Nullable String email, @Nullable Integer notUserId) {
}
