package universitymanagement.core.data;

import java.time.LocalDateTime;

public record Comment(int commentId, Announcement announcement, User user, String content, LocalDateTime createdAt) {
}
