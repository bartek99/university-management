package universitymanagement.core.data;

import java.time.LocalDateTime;

public record Announcement(
        int announcementId,
        Employee employee,
        String title,
        String description,
        String content,
        LocalDateTime createdAt) {
}
