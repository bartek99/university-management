package universitymanagement.core.service.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public record AddAnnouncementRequest(
        @JsonProperty(value = "title", required = true) String title,
        @JsonProperty(value = "description", required = true) String description,
        @JsonProperty(value = "content", required = true) String content) {
}
