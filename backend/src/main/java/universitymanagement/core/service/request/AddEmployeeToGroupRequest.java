package universitymanagement.core.service.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public record AddEmployeeToGroupRequest(@JsonProperty(value = "employeeId", required = true) int employeeId) {
}
