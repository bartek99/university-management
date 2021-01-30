package universitymanagement.web.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import universitymanagement.common.DateTimeUtils;
import universitymanagement.core.data.*;
import universitymanagement.core.service.request.AddScheduleItemRequest;
import universitymanagement.core.service.request.UpdateScheduleItemRequest;
import universitymanagement.web.SuccessResponse;
import universitymanagement.web.api.response.ScheduleItemResponse;
import universitymanagement.web.error.RestException;

import javax.websocket.server.PathParam;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/schedule-items")
public class ScheduleItemController {

    private final GroupRepository groupRepository;
    private final TermRepository termRepository;
    private final RoomRepository roomRepository;
    private final ScheduleItemRepository scheduleItemRepository;

    @Autowired
    public ScheduleItemController(
            GroupRepository groupRepository,
            TermRepository termRepository,
            RoomRepository roomRepository,
            ScheduleItemRepository scheduleItemRepository) {
        this.groupRepository = groupRepository;
        this.termRepository = termRepository;
        this.roomRepository = roomRepository;
        this.scheduleItemRepository = scheduleItemRepository;
    }

    @PreAuthorize("hasRole('Admin')")
    @GetMapping
    public SuccessResponse<List<ScheduleItemResponse>> getAll(@PathParam("groupId") Integer groupId) {
        if (groupId == null) {
            return new SuccessResponse<>(List.of());
        }
        final var scheduleItems = scheduleItemRepository
                .getAllByGroupId(groupId)
                .stream()
                .map(ScheduleItemResponse::fromScheduleItem)
                .collect(Collectors.toList());
        return new SuccessResponse<>(scheduleItems);
    }

    @PreAuthorize("hasRole('Admin')")
    @GetMapping("/{scheduleItemId}")
    public SuccessResponse<ScheduleItemResponse> getById(@PathVariable("scheduleItemId") int scheduleItemId) {
        return scheduleItemRepository
                .getById(scheduleItemId)
                .map(ScheduleItemResponse::fromScheduleItem)
                .map(SuccessResponse::new)
                .orElseThrow(() -> new RestException("Unable to get a schedule item."));
    }

    @PreAuthorize("hasRole('Admin')")
    @PostMapping
    public SuccessResponse<ScheduleItemResponse> addScheduleItem(@RequestBody AddScheduleItemRequest request) {
        final var group = groupRepository.getById(request.groupId());
        final var term = termRepository.getById(request.termId());
        final var room = roomRepository.getRoomById(request.roomId());
        if (group.isEmpty() || term.isEmpty() || room.isEmpty()) {
            throw new RestException("Unable to add a schedule item.");
        }
        return scheduleItemRepository
                .add(
                        term.get(),
                        group.get(),
                        room.get(),
                        Week.from(request.week()).get(),
                        Day.from(request.day()).get(),
                        DateTimeUtils.parseTime(request.timeFrom()),
                        DateTimeUtils.parseTime(request.timeTo())
                )
                .map(ScheduleItemResponse::fromScheduleItem)
                .map(SuccessResponse::new)
                .orElseThrow(() -> new RestException("Unable to add a schedule item."));
    }

    @PreAuthorize("hasRole('Admin')")
    @PutMapping("/{scheduleItemId}")
    public SuccessResponse<Void> updateScheduleItem(
            @PathVariable("scheduleItemId") int scheduleItemId,
            @RequestBody UpdateScheduleItemRequest request) {
        final var group = groupRepository.getById(request.groupId());
        final var term = termRepository.getById(request.termId());
        final var room = roomRepository.getRoomById(request.roomId());
        if (group.isEmpty() || term.isEmpty() || room.isEmpty()) {
            throw new RestException("Unable to add a schedule item.");
        }
        final var updated = scheduleItemRepository.updateById(
                scheduleItemId,
                term.get(),
                group.get(),
                room.get(),
                Week.from(request.week()).get(),
                Day.from(request.day()).get(),
                DateTimeUtils.parseTime(request.timeFrom()),
                DateTimeUtils.parseTime(request.timeTo()));
        if (updated) {
            return new SuccessResponse<>(null);
        } else {
            throw new RestException("Unable to update a schedule item.");
        }
    }

    @PreAuthorize("hasRole('Admin')")
    @DeleteMapping("/{scheduleItemId}")
    public SuccessResponse<Void> deleteScheduleItem(@PathVariable("scheduleItemId") int scheduleItemId) {
        final var deleted = scheduleItemRepository.deleteById(scheduleItemId);
        if (deleted) {
            return new SuccessResponse<>(null);
        } else {
            throw new RestException("Unable to delete a schedule item.");
        }
    }
}
