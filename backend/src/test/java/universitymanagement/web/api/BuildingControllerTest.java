package universitymanagement.web.api;

import org.junit.Assert;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import universitymanagement.core.service.request.AddAddressRequest;
import universitymanagement.core.service.request.AddBuildingRequest;
import universitymanagement.web.api.response.BuildingResponse;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@AutoConfigureMockMvc
@SpringBootTest
class BuildingControllerTest {

    @Autowired
    BuildingController buildingController;

    @Autowired
    MockMvc mockMvc;


    @Test
    @WithMockUser(username = "Admin", roles = {"Admin"})
    void getBuildings_CorrectPermission(){
        try {
            mockMvc.perform(get("/buildings")).andExpect(status().isOk());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    @Test
    @WithMockUser(username = "Student", roles = {"Student"})
    void getBuildings_WrongPermissionStudent(){
        try {
            mockMvc.perform(get("/buildings")).andExpect(status().isForbidden());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Test
    @WithMockUser(username = "Employee", roles = {"Employee"})
    void getBuildings_WrongPermissionEmployee(){
        try {
            mockMvc.perform(get("/buildings")).andExpect(status().isForbidden());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Test
    @WithMockUser(username = "Admin", roles = {"Admin"})
    void getBuildings() {
        List<BuildingResponse> buildingResponse=buildingController.getBuildings().result();
        int size=buildingResponse.size();
        if(size==0){
            Assert.assertNull(buildingResponse);
        }else{
            Assert.assertNotNull(buildingResponse);
        }
    }

    @Test
    @WithMockUser(username = "Admin", roles = {"Admin"})
    void getBuilding() {
        int buildingId=2;
        Assert.assertEquals(2, buildingController.getBuilding(buildingId).result().buildingId());
    }

    @Test
    @WithMockUser(username = "Admin", roles = {"Admin"})
    void addBuilding() {
        AddAddressRequest addAddressRequest=new AddAddressRequest(
                "Krakowska",
                "3",
                "",
                "14-745",
                "Kraków",
                "Polska"
        );
        AddBuildingRequest addBuildingRequest=new AddBuildingRequest(addAddressRequest,"A3");
        BuildingResponse buildingResponse=buildingController.addBuilding(addBuildingRequest).result();
        Assert.assertEquals(addBuildingRequest.name(),buildingResponse.name());
        buildingController.deleteBuilding(buildingResponse.buildingId());
    }


}