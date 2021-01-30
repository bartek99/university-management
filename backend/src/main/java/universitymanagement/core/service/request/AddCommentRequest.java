package universitymanagement.core.service.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public record AddCommentRequest(@JsonProperty(value = "content", required = true) String content) {
}
