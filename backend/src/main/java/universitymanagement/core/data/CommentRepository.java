package universitymanagement.core.data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface CommentRepository {

    List<Comment> getAllByAnnouncementId(int announcementId);

    Optional<Comment> add(Announcement announcement, User user, String content, LocalDateTime createdAt);

    boolean deleteById(int commentId);
}
