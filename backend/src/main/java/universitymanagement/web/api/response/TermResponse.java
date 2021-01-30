package universitymanagement.web.api.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import universitymanagement.common.DateTimeUtils;
import universitymanagement.core.data.Term;

public record TermResponse(
        @JsonProperty("termId") int termId,
        @JsonProperty("name") String name,
        @JsonProperty("dateFrom") String dateFrom,
        @JsonProperty("dateTo") String dateTo) {

    public static TermResponse fromTerm(Term term) {
        return new TermResponse(
                term.termId(),
                term.name(),
                DateTimeUtils.formatDate(term.dateFrom()),
                DateTimeUtils.formatDate(term.dateTo()));
    }
}
