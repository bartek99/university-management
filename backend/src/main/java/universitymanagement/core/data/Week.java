package universitymanagement.core.data;

import java.util.Optional;

public enum Week {

    BOTH("Parzysty i Nieparzysty"),
    EVEN("Parzysty"),
    ODD("Nieparzysty");

    private final String value;

    Week(String value) {
        this.value = value;
    }

    public static Optional<Week> from(String value) {
        return switch (value) {
            case "Parzysty i Nieparzysty" -> Optional.of(Week.BOTH);
            case "Parzysty" -> Optional.of(Week.EVEN);
            case "Nieparzysty" -> Optional.of(Week.ODD);
            default -> Optional.empty();
        };
    }

    public String value() {
        return value;
    }
}
