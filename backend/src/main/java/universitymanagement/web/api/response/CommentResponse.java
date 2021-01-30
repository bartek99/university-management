package universitymanagement.web.api.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import universitymanagement.common.DateTimeUtils;
import universitymanagement.core.data.Comment;

public record CommentResponse(
        @JsonProperty("commentId") int commentId,
        @JsonProperty("author") String author,
        @JsonProperty("content") String content,
        @JsonProperty("createdAt") String createdAt,
        @JsonProperty("isOwner") boolean isOwner) {

    public static CommentResponse from(Comment comment, String author, boolean isOwner) {
        return new CommentResponse(
                comment.commentId(),
                author,
                comment.content(),
                DateTimeUtils.formatDateTime(comment.createdAt()),
                isOwner
        );
    }
}

