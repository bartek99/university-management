package universitymanagement.web.api;

import com.fasterxml.jackson.annotation.JsonProperty;
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
import universitymanagement.core.service.request.AddAnnouncementRequest;
import universitymanagement.web.api.response.AnnouncementResponse;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
public class AnnouncementControllerTest {

    @Autowired
    AnnouncementController announcementController;

    @Autowired
    MockMvc mockMvc;

    @Before
    void setUp(){
        mockMvc= MockMvcBuilders.standaloneSetup(announcementController).build();
    }


    @Test
    @WithMockUser(username = "Employee", roles = {"Employee"})
    void addAnnouncement(){
        String token="Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJwcmFjb3duaWtAZXhhbXBsZS5jb20iLCJyb2xlcyI6IkVtcGxveWVlIiwiZXhwIjoxNjEyNDM5MjM3fQ.BXNKraLna7XD7K1Kqeb853o_tgtS4K2PwR-A-nrTgUkpJnP5vQsbamW5LGUzlLFU5jOORgTbYP2c_osBJ5s9sA";
        AddAnnouncementRequest addAnnouncementRequest=new AddAnnouncementRequest("Title", "Description", "Content");
        AnnouncementResponse announcementResponse=announcementController.addAnnouncement(token, addAnnouncementRequest).result();
        Assert.assertEquals(addAnnouncementRequest.description(),announcementResponse.description());
        announcementController.deleteAnnouncement(announcementResponse.announcementId());
    }

//    @Test
//    @WithMockUser(username = "Employee", roles = {"Employee"})
//    void getAll_CorrectPermission(){
//
//        try {
//            mockMvc.perform(get("/announcements")).andExpect(status().isOk());
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//    }


    @Test
    @WithMockUser(username = "Employee", roles = {"Employee"})
    void getAll(){
        String token="Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJwcmFjb3duaWtAZXhhbXBsZS5jb20iLCJyb2xlcyI6IkVtcGxveWVlIiwiZXhwIjoxNjEyNDM5MjM3fQ.BXNKraLna7XD7K1Kqeb853o_tgtS4K2PwR-A-nrTgUkpJnP5vQsbamW5LGUzlLFU5jOORgTbYP2c_osBJ5s9sA";
        AddAnnouncementRequest addAnnouncementRequest=new AddAnnouncementRequest("Title", "Description", "Content");
        AnnouncementResponse announcementResponse=announcementController.addAnnouncement(token, addAnnouncementRequest).result();
        Assert.assertNotEquals(0,announcementController.getAll(token).result().size());
        announcementController.deleteAnnouncement(announcementResponse.announcementId());

    }

    @Test
    @WithMockUser(username = "Student", roles = {"Student"})
    void getAllForStudent(){
        List<AnnouncementResponse> announcementResponse=announcementController.getAllForStudent().result();
        int size=announcementResponse.size();
        if(size==0){
            Assert.assertNull(announcementResponse);
        }else{
        Assert.assertNotNull(announcementResponse);
        }
    }

    @Test
    @WithMockUser(username = "Employee", roles = {"Employee"})
    void getById(){
        String token="Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJwcmFjb3duaWtAZXhhbXBsZS5jb20iLCJyb2xlcyI6IkVtcGxveWVlIiwiZXhwIjoxNjEyNDM5MjM3fQ.BXNKraLna7XD7K1Kqeb853o_tgtS4K2PwR-A-nrTgUkpJnP5vQsbamW5LGUzlLFU5jOORgTbYP2c_osBJ5s9sA";
        AddAnnouncementRequest addAnnouncementRequest=new AddAnnouncementRequest("Title","Description","Content");
        int announcementId = announcementController.addAnnouncement(token, addAnnouncementRequest).result().announcementId();
        AnnouncementResponse announcementResponse=announcementController.getById(token, announcementId).result();
        Assert.assertEquals(announcementId,announcementResponse.announcementId());
        announcementController.deleteAnnouncement(announcementId);
    }

    @Test
    @WithMockUser(username = "Student", roles = {"Student"})
    void getByIdForStudent(){
        String token="Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzdHVkZW50QGV4YW1wbGUuY29tIiwicm9sZXMiOiJTdHVkZW50IiwiZXhwIjoxNjEyNDU0OTcwfQ.k50cT7-4UXS9SNDbKsWpf9OAbWm_rqU7K5Deo18UPe0aBsn_X_a2ajk_mEKapMNdzekxEDZoCaEbkSvtmzKAmg";
        int announcementId=1;
        AnnouncementResponse announcementResponse=announcementController.getByIdForStudent(token, announcementId).result();
        if(announcementResponse!=null){
            Assert.assertEquals(announcementId,announcementResponse.announcementId());
        }else{
            Assert.assertNull(announcementResponse);
        }
    }
}
