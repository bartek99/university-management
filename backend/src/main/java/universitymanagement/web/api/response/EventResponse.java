package universitymanagement.web.api.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import universitymanagement.common.DateTimeUtils;
import universitymanagement.core.data.*;

public record EventResponse(
        @JsonProperty(value = "eventId", required = true) int eventId,
        @JsonProperty(value = "employee", required = true) EmployeeResponse employee,
        @JsonProperty(value = "group", required = true) GroupResponse group,
        @JsonProperty(value = "room", required = true) RoomResponse room,
        @JsonProperty(value = "name", required = true) String name,
        @JsonProperty(value = "date", required = true) String date,
        @JsonProperty(value = "timeFrom", required = true) String timeFrom,
        @JsonProperty(value = "timeTo", required = true) String timeTo) {

    public static EventResponse fromEvent(Event event) {
        return new EventResponse(
                event.eventId(),
                EmployeeResponse.fromEmployee(event.employee()),
                GroupResponse.fromGroup(event.group()),
                RoomResponse.fromRoom(event.room()),
                event.name(),
                DateTimeUtils.formatDate(event.date()),
                DateTimeUtils.formatTime(event.timeFrom()),
                DateTimeUtils.formatTime(event.timeTo()));
    }
}

