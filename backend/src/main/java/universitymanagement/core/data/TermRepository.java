package universitymanagement.core.data;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TermRepository {

    List<Term> getAll();

    Optional<Term> getById(int termId);

    Optional<Term> add(
            String name,
            LocalDate dateFrom,
            LocalDate dateTo);

    boolean updateById(
            int termId ,
            String name,
            LocalDate dateFrom,
            LocalDate dateTo);

    boolean deleteById(int termId);
}
