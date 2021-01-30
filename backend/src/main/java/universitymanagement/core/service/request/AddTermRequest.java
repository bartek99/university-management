package universitymanagement.core.service.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public record AddTermRequest(
        @JsonProperty(value = "name", required = true) String name,
        @JsonProperty(value = "dateFrom", required = true) String dateFrom,
        @JsonProperty(value = "dateTo", required = true) String dateTo) {
}
