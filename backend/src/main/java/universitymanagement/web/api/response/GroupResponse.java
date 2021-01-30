package universitymanagement.web.api.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import universitymanagement.core.data.Group;

public record GroupResponse(
        @JsonProperty("groupId") int groupId,
        @JsonProperty("course") CourseResponse course,
        @JsonProperty("name") String name) {

    public static GroupResponse fromGroup(Group group) {
        return new GroupResponse(
                group.groupId(),
                CourseResponse.fromCourse(group.course()),
                group.name());
    }
}
