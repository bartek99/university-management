package universitymanagement.web.api.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import universitymanagement.core.data.Admin;

public record AdminResponse(
        @JsonProperty("adminId") int adminId,
        @JsonProperty("user") UserResponse user) {
    
    public static AdminResponse fromAdmin(Admin admin) {
        return new AdminResponse(admin.adminId(), UserResponse.fromUser(admin.user()));
    }
}
