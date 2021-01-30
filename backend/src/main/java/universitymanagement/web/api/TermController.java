package universitymanagement.web.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import universitymanagement.common.DateTimeUtils;
import universitymanagement.core.data.TermRepository;
import universitymanagement.core.service.request.AddTermRequest;
import universitymanagement.core.service.request.UpdateTermRequest;
import universitymanagement.web.SuccessResponse;
import universitymanagement.web.api.response.TermResponse;
import universitymanagement.web.error.RestException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/terms")
public class TermController {

    private final TermRepository termRepository;

    @Autowired
    public TermController(TermRepository termRepository) {
        this.termRepository = termRepository;
    }

    @PreAuthorize("hasRole('Admin')")
    @GetMapping
    public SuccessResponse<List<TermResponse>> getAll() {
        final var terms = termRepository
                .getAll()
                .stream()
                .map(TermResponse::fromTerm)
                .collect(Collectors.toList());
        return new SuccessResponse<>(terms);
    }

    @PreAuthorize("hasRole('Admin')")
    @GetMapping("/{termId}")
    public SuccessResponse<TermResponse> getTerm(@PathVariable("termId") int termId) {
        return termRepository
                .getById(termId)
                .map(TermResponse::fromTerm)
                .map(SuccessResponse::new)
                .orElseThrow(() -> new RestException("Unable to get a term."));
    }

    @PreAuthorize("hasRole('Admin')")
    @PostMapping
    public SuccessResponse<TermResponse> addTerm(@RequestBody AddTermRequest request) {
        return termRepository.add(
                request.name(),
                DateTimeUtils.parseDate(request.dateFrom()),
                DateTimeUtils.parseDate(request.dateTo()))
                .map(TermResponse::fromTerm)
                .map(SuccessResponse::new)
                .orElseThrow(() -> new RestException("Unable to add a term."));
    }

    @PreAuthorize("hasRole('Admin')")
    @PutMapping("/{termId}")
    public SuccessResponse<Void> updateTerm(
            @PathVariable("termId") int termId,
            @RequestBody UpdateTermRequest request) {
        final var updated = termRepository.updateById(
                termId,
                request.name(),
                DateTimeUtils.parseDate(request.dateFrom()),
                DateTimeUtils.parseDate(request.dateTo()));
        if (updated) {
            return new SuccessResponse<>(null);
        } else {
            throw new RestException("Unable to update a term.");
        }
    }

    @PreAuthorize("hasRole('Admin')")
    @DeleteMapping("/{termId}")
    public SuccessResponse<Void> deleteTerm(@PathVariable("termId") int termId) {
        final var deleted = termRepository.deleteById(termId);
        if (deleted) {
            return new SuccessResponse<>(null);
        } else {
            throw new RestException("Unable to delete a term.");
        }
    }
}
