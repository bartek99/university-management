package universitymanagement.web.api.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import universitymanagement.common.DateTimeUtils;
import universitymanagement.core.data.Announcement;

public record AnnouncementResponse(
        @JsonProperty("announcementId") int announcementId,
        @JsonProperty("author") String author,
        @JsonProperty("title") String title,
        @JsonProperty("description") String description,
        @JsonProperty("content") String content,
        @JsonProperty("createdAt") String createdAt,
        @JsonProperty("isOwner") boolean isOwner) {

    public static AnnouncementResponse from(Announcement announcement, boolean isOwner) {
        return new AnnouncementResponse(
                announcement.announcementId(),
                announcement.employee().firstName() + " " + announcement.employee().lastName(),
                announcement.title(),
                announcement.description(),
                announcement.content(),
                DateTimeUtils.formatDateTime(announcement.createdAt()),
                isOwner
        );
    }
}
