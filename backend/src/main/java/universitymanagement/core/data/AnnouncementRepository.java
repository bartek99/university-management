package universitymanagement.core.data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AnnouncementRepository {

    List<Announcement> getAll();

    Optional<Announcement> getById(int announcementId);

    Optional<Announcement> add(Employee employee, String title, String description, String content, LocalDateTime createdAt);

    boolean deleteById(int announcementId);
}
