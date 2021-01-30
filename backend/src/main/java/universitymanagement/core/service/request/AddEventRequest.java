package universitymanagement.core.service.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public record AddEventRequest(
        @JsonProperty(value = "groupId", required = true) int groupId,
        @JsonProperty(value = "roomId", required = true) int roomId,
        @JsonProperty(value = "name", required = true) String name,
        @JsonProperty(value = "date", required = true) String date,
        @JsonProperty(value = "timeFrom", required = true) String timeFrom,
        @JsonProperty(value = "timeTo", required = true) String timeTo) {
}
