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
import universitymanagement.core.service.request.AddCourseRequest;
import universitymanagement.web.api.response.CourseResponse;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
public class CourseControllerTest {

    @Autowired
    CourseController courseController;

    @Autowired
    MockMvc mockMvc;

    @Before
    void setUp(){
        mockMvc= MockMvcBuilders.standaloneSetup(courseController).build();
    }



    @Test
    @WithMockUser(username = "Admin", roles = {"Admin"})
    void getAll_CorrectPermission(){

        try {
            mockMvc.perform(get("/courses")).andExpect(status().isOk());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Test
    @WithMockUser(username = "Employee", roles = {"Employee"})
    void getAll_WrongPermissionEmployee(){
        try {
            mockMvc.perform(get("/courses")).andExpect(status().isForbidden());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Test
    @WithMockUser(username = "Student", roles = {"Student"})
    void getAll_WrongPermissionStudent(){
        try {
            mockMvc.perform(get("/courses")).andExpect(status().isForbidden());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    @Test
    @WithMockUser(username = "Admin", roles = {"Admin"})
    void getAll(){
        AddCourseRequest addCourseRequest =new AddCourseRequest(1,"Systemy wbudowane");
        int courseId = courseController.addCourse(addCourseRequest).result().courseId();
        List<CourseResponse> courseResponse=courseController.getAll().result();
        Assert.assertNotNull(courseResponse);
        courseController.deleteCourse(courseId);
    }

    @Test
    @WithMockUser(username = "Admin", roles = {"Admin"})
    void getCourseById(){
        AddCourseRequest addCourseRequest=new AddCourseRequest(1,"Systemy wbudowane");
        int courseId=courseController.addCourse(addCourseRequest).result().courseId();
        Assert.assertEquals(courseId, courseController.getCourse(courseId).result().courseId());
        courseController.deleteCourse(courseId);
    }

    @Test
    @WithMockUser(username = "Employee", roles = {"Employee"})
    void getCourseByGroupId(){
        int groupId=1;
        CourseResponse courseResponse=courseController.getCourseByGroupId(groupId).result();
        if(courseResponse!=null) {
            Assert.assertNotNull(courseResponse);
        }else{
            Assert.assertNull(courseResponse);
        }
    }

    @Test
    @WithMockUser(username = "Student", roles = {"Student"})
    void getCourseBySubjectId(){
        int subjectId=1;
        List<CourseResponse> courseResponse=courseController.getCourseBySubjectId(subjectId).result();
        if(courseResponse!=null) {
            Assert.assertEquals(subjectId,courseResponse.get(0).subject().subjectId());
        }else{
            Assert.assertNull(courseResponse);
        }
    }

}
