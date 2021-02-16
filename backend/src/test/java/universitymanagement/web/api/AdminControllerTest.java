package universitymanagement.web.api;

import org.junit.Assert;
import org.junit.Before;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import universitymanagement.core.data.UserType;
import universitymanagement.core.service.request.AddAdminRequest;
import universitymanagement.core.service.request.AddUserRequest;
import universitymanagement.core.service.request.UpdateAdminRequest;
import universitymanagement.core.service.request.UpdateUserRequest;
import universitymanagement.web.api.response.AdminResponse;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@AutoConfigureMockMvc
@SpringBootTest
class AdminControllerTest {
    @Autowired
    private AdminController adminController;

    @Autowired
    private UserController userController;

    @Autowired
    MockMvc mockMvc;

    @Before
    void setUp(){
        mockMvc= MockMvcBuilders.standaloneSetup(adminController).build();
    }

    @Test
    @WithMockUser(username = "Admin", roles = {"Admin"})
    void getAdmin_CorrectPermission(){
        try {
            mockMvc.perform(get("/admins/1")).andExpect(status().isOk());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Test
    @WithMockUser(username = "Employee", roles = {"Employee"})
    void getAdmin_WrongPermissionEmployee(){
        try {
            mockMvc.perform(get("/admins/1")).andExpect(status().isForbidden());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }



    @Test
    @WithMockUser(username = "Student", roles = {"Student"})
    void getAdmin_WrongPermissionStudent(){
        try {
            mockMvc.perform(get("/admins/1")).andExpect(status().isForbidden());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    @Test
    @WithMockUser(username = "Admin", roles = {"Admin"})
    void getAdmin() {
        int userId=1;
        Assert.assertEquals(UserType.ADMIN.value(),adminController.getAdmin(userId).result().user().userType());
    }


//    @Test
//    @WithMockUser(username = "Admin", roles = {"Admin"})
//    void addAdminTest(){
//        AddUserRequest addUserRequest=new AddUserRequest(
//                "admin1@gmail.com",
//                "password1",
//                "password1"
//        );
//        AddAdminRequest addAdminRequest=new AddAdminRequest(addUserRequest);
//        AdminResponse adminResponse=adminController.addAdmin(addAdminRequest).result();
//        int id=adminResponse.user().userId();
//        Assert.assertEquals(addAdminRequest.user().email(),adminResponse.user().email());
//        userController.deleteUser(id);
//    }
}