package universitymanagement.core.service.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public record AddScheduleItemRequest(
        @JsonProperty(value = "termId", required = true) int termId,
        @JsonProperty(value = "groupId", required = true) int groupId,
        @JsonProperty(value = "roomId") Integer roomId,
        @JsonProperty(value = "week", required = true) String week,
        @JsonProperty(value = "day", required = true) String day,
        @JsonProperty(value = "timeFrom", required = true) String timeFrom,
        @JsonProperty(value = "timeTo", required = true) String timeTo) {
}
