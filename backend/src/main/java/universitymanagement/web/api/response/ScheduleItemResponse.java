package universitymanagement.web.api.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import universitymanagement.common.DateTimeUtils;
import universitymanagement.core.data.*;

public record ScheduleItemResponse(
        @JsonProperty("scheduleItemId") int scheduleItemId,
        @JsonProperty("term") TermResponse term,
        @JsonProperty("group") GroupResponse group,
        @JsonProperty("room") RoomResponse room,
        @JsonProperty("week") String week,
        @JsonProperty("day") String day,
        @JsonProperty("timeFrom") String timeFrom,
        @JsonProperty("timeTo") String timeTo) {

    public static ScheduleItemResponse fromScheduleItem(ScheduleItem scheduleItem) {
        return new ScheduleItemResponse(
                scheduleItem.scheduleItemId(),
                TermResponse.fromTerm(scheduleItem.term()),
                GroupResponse.fromGroup(scheduleItem.group()),
                RoomResponse.fromRoom(scheduleItem.room()),
                scheduleItem.week().value(),
                scheduleItem.day().value(),
                DateTimeUtils.formatTime(scheduleItem.timeFrom()),
                DateTimeUtils.formatTime(scheduleItem.timeTo())
        );
    }
}
