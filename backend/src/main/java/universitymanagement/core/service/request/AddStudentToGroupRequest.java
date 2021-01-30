package universitymanagement.core.service.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public record AddStudentToGroupRequest(@JsonProperty(value = "studentId", required = true) int studentId) {
}
