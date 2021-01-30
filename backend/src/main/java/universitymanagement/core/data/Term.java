package universitymanagement.core.data;

import java.time.LocalDate;

public record Term(int termId, String name, LocalDate dateFrom, LocalDate dateTo) {
}
