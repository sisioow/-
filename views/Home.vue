<template>
  <div class="head">
    <div class="avatar" @click="showDialog = true">
    <!-- 头像内容，可以是图片或者其他元素 -->
    <img :src="avatarUrl" alt="Avatar">
  </div>
  <!-- 个人信息 -->
  <el-dialog v-model="showDialog" :show-close="false" width="800">
  <template #header="{ close, titleId, titleClass }">
    <div class="my-header1">
      <h3 :id="titleId" :class="titleClass">编辑个人信息</h3>
      <el-button type="danger" @click="close">
        <el-icon class="el-icon--left"><CircleCloseFilled />关闭</el-icon>
      </el-button>
    </div>
  </template>
  <form >
    <!-- @submit.prevent="submitForm" -->
    <div class="form-group">
      <label>头像：</label>
      <div class="avatar-upload">
        <input type="file" @change="handleFileChange">
        <img v-if="newAvatar" :src="newAvatar" alt="New Avatar" class="avatar-preview">
      </div>
    </div>
    <div class="form-group">
      <label>用户简介：</label>
      <textarea v-model="userDescription" class="textarea"></textarea>
    </div>
    <div class="form-group">
      <label>学校：</label>
      <input type="text" v-model="school" class="el-input">
    </div>
    <div class="form-group">
      <label>电话：</label>
      <input type="text" v-model="phone" class="el-input">
    </div>
    <div class="dialog-buttons">
      <el-button plain type="submit" @click="submitForm" >保存</el-button>
      <el-button type="primary" plain @click="cancelEdit">取消</el-button>
    </div>
  </form>
</el-dialog>
  <div class="info">
    <div class="name" >{{ userName }}</div>
    <div class="bio">{{ userBio }}</div>
  </div>
  </div>
  <!-- 导航栏 -->
      <div class="tab-bar">
      <span class="tab" :class="{ 'active': currentTab === 'video' }" @click="changeTab('video')" data-target="video">在线课程</span>
      <span class="tab" :class="{ 'active': currentTab === 'Question-bank' }" @click="changeTab('Question-bank')" data-target="Question-bank">历史课程</span>
    </div>
  <div class="course-intro">
    <div class="settings">
      <div v-if="currentTab === 'Question-bank'">
       <!-- 历史课程 -->
       <div class="resource-test-settings">
        <div class="header-setting-background">
       <div class="card-container">
      <el-card v-for="(course, index) in paginatedQuestionBankCourses" :key="index" style="max-width: 300px;" shadow="hover">
        <div class="card-content"  @click="goToHistoricalCourseDetail(course)" @contextmenu.prevent="showContextMenu($event, course)">        <img :src="course.resource_url" alt="Card Image" class="card-image">
        <span class="card-text">已经截止</span>
        <span id="course-title">{{ course.title }}</span>
        <span id="course-time">{{ course.time }}</span>
        <span id="course-code">{{ course.code }}</span>
      </div>
    </el-card>
        </div>
        <div class="card-page">
          <el-pagination
          @size-change="handleQuestionBankSizeChange"
          @current-change="handleQuestionBankCurrent"
          v-model:current-page="currentQuestionBankPage"
          :page-sizes="[8]"
          :page-size="questionBankPageSize"
          layout="sizes, prev, pager, next, jumper, total"
          :total="filteredQuestionBankCourses.length"
      /> </div>
        </div>
       </div>
      </div>
      <div v-if="currentTab === 'video'">
      <!-- 在线课程 -->
      <div class="resource-test-settings">
        <div class="header-setting-background">
          <div class="Top"> 
            <!--  课程设置-->
            <el-button class="b3" type="primary" plain @click="kecheng=true">课程设置</el-button>
            <el-dialog v-model="kecheng" :show-close="false" width="1000">
            <template #header="{ close }">
        <div class="my-header">
          <h4 class="title">课程设置</h4>
          <el-button type="danger" @click="close">
            <el-icon class="el-icon--left">关闭</el-icon>
          </el-button>
        </div>
      </template>
      <!-- 在这里引入 CourseSetting 组件 -->
      <CourseSetting />
            </el-dialog>
            <!-- 添加新课堂 -->
            <el-button class="b1" type="primary" plain @click="showCourseIntroduce">添加新课堂</el-button>
            <el-dialog v-model="visible" :show-close="false" width="1000">
            <template #header="{ close }">
        <div class="my-header">
          <h4 class="title">添加新课堂</h4>
          <el-button type="danger" @click="close">
            <el-icon class="el-icon--left">关闭</el-icon>
          </el-button>
        </div>
      </template>
      <!-- 在这里引入 CourseIntroduce 组件 -->
      <CourseIntroduce />
            </el-dialog>
            <div class="right-section">
            <el-input v-model="searchText" placeholder="搜索课程"></el-input>
            <el-button class="b2" type="primary" @click="handleSearch">搜索</el-button>
          </div>
          </div>
       <div class="card-container">
        <el-card v-for="(course, index) in paginatedCourses" :key="index" style="max-width: 300px;" shadow="hover">
      <div class="card-content" @click="goToCourseDetail(course)" @contextmenu.prevent="showContextMenu($event, course)">
        <img :src="course.resource_url" alt="Card Image" class="card-image">
        <span class="card-text">正在进行</span>
        <span id="course-title">{{ course.title }}</span>
        <span id="course-time">{{ course.time }}</span>
        <span id="course-code">{{"加课码："+ course.code }}</span>
      </div>
    </el-card>
        </div>
        <div class="card-page">
          <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrent"
          v-model:current-page="currentPage"
          :page-sizes="[8]"
          :page-size="pageSize"
          layout="sizes, prev, pager, next, jumper, total"
          :total="filteredCourses.length"
      /> </div>
        </div>
       </div>
      </div>
      <!-- :total="courses.length" -->
  </div>
</div>

</template>

<script>
import axios from 'axios';
import { ElMessageBox } from 'element-plus'
import { ElMessage} from 'element-plus'
import CourseIntroduce from '@/views/CourseIntroduce.vue';
import CourseSetting from '@/views/CourseSetting.vue';
import { ref } from 'vue'
export default {
  name: 'HomeComponent',
  components: {
    CourseIntroduce, // 注册 AddCourseForm 组件
    CourseSetting,
  },
  data() {
    return {
      showDialog: false,
      avatarUrl: 'https://via.placeholder.com/150', // 初始头像 URL
      userName: '',
      userBio: '',
      newAvatar: 'https://via.placeholder.com/150',
      userDescription: '', // 用户简介
      school: '', // 学校
      phone:'',//电话
      /*  -------- */
    visible : ref(false),
    kecheng:ref(false),
    currentTab: 'video', // 初始选中的选项卡，默认为 'all'  
    currentPage: 1 ,   // 当前页数
    searchText: '', // 搜索文本
    pageSize: 8,
    currentQuestionBankPage: 1,
    questionBankPageSize: 8,
      ///* 连接后端 */
      courses: [{resource_url: '',title: '',time: '',id:'',code:''}],
      /* 课程 */
      tech_id:'',
      course_id:'',
      semester_id:'',
      course:[{course_id:'',course_intro:'',resource_id:'',resource_url: '',tech_id:''}]
    }
    },
    
    computed: {
    paginatedQuestionBankCourses() {
      const startIndex = (this.currentQuestionBankPage - 1) * this.questionBankPageSize;
      const endIndex = startIndex + this.questionBankPageSize;
      return this.filteredQuestionBankCourses.slice(startIndex, endIndex);
    },
    filteredQuestionBankCourses() {
      let today = new Date();
      today.setHours(0, 0, 0, 0);

      return this.courses.filter(course => {
        let courseTime = new Date(course.time);
        return courseTime < today; // 过滤出今天之前的题库课程
      });
    },
    paginatedCourses() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.filteredCourses.slice(startIndex, endIndex);
      // return this.courses.slice(startIndex, endIndex);
    },
    filteredCourses() {
      let today = new Date();
      today.setHours(0, 0, 0, 0);
      let filtered = this.courses.filter(course => {
        let courseTime = new Date(course.time);
        return courseTime >= today;
      });
      if (this.searchText.trim() !== '') {
        filtered = filtered.filter(course => {
          return course.title.toLowerCase().includes(this.searchText.trim().toLowerCase());
        });
      }
      return filtered;
    },
    
  },
  mounted() {
    // 组件挂载后立即调用获取数据的方法
    this.fetchCourses();
    this.fetchCourses1();
    this.fetchUserInfo();
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrent(val) {
      this.currentPage = val;
    },
    changeTab(tab) {
      this.currentTab = tab; // 更新选项卡状态
    },
    goToCourseDetail(course) {
      // 导航到课程详情页面，使用 Vue Router 的编程式导航
      this.$router.push({ name: 'EditCourseContent', query: {  semester_id:course.semester_id} });
      console.log('Home选中课堂的id', course.semester_id);

      localStorage.setItem("semester_id", course.semester_id);
    },
    goToHistoricalCourseDetail(course){//course  course.title
      this.$router.push({name:'HistoricalCourseDetail', query: { courseId: course.semester_id ,courseName:course.title,courseImg:course.resource_url}});
      // this.$router.push({name:'HistLayout', query: { courseName:'xx课程'}});
      console.log('去历史课程简介界面',course.semester_id);
    },

    showContextMenu(event, course) {
  event.preventDefault(); // Prevent default right-click menu
  // Display confirmation dialog
  ElMessageBox.confirm('确定要删除这门课程吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // User clicked confirm button, proceed with deletion
    const semesterId = course.semester_id; // Assuming course has a semester_id
    // Make a DELETE request using Axios
    axios.delete(`http://10.33.124.200:8080/semesters/${semesterId}`)
      .then(response => {
        // Successful deletion
        console.log('删除成功', response.data);
        // Remove the course from the frontend interface
        const index = this.courses.findIndex(c => c.semester_id === semesterId);
        if (index !== -1) {
          this.courses.splice(index, 1);
          ElMessage.success('课程删除成功！');
        } else {
          ElMessage.error('找不到要删除的课程！');
        }
      })
      .catch(error => {
        // Error handling for deletion request
        console.error('删除失败', error);
        ElMessage.error('删除课程时出错！');
      });

  }).catch(() => {
    // User canceled deletion, no action needed
  });
},
    // 使用 Axios 获取数据的方法
    /* --获取课堂 */
    fetchCourses() {
        axios({
        method: 'get',
        url: 'http://10.33.124.200:8080/semesters/showlist',
        params: {
          tech_id: 1
        }
      }).then(response => {
        console.log('API 响应：', response.data.data);
        const apiCourses = response.data.data;
          this.courses = apiCourses.map(course => ({
          resource_url: course.resource_url,
          title: course.semester_name, // 假设 API 返回的字段是 semester_name
          time: course.end_time,
          id:course.semester_id,
          code:course.semester_code,
          semester_id:course.semester_id
          }));
      }).catch(error => {
        console.error('响应失败:', error);
      });


      },
    /* --获取课程id */
    fetchCourses1() {
      axios({
        method: 'get',
        url: 'http://10.33.124.200:8080/course/getCourse',
        params: {
          tech_id: 1
        }
      }).then(response => {
        console.log('API 响应：', response.data.data);
        // 判断 response.data.data 是否为 null
    if (response.data.data === null) {
      this.$router.push({ name: 'CourseSetting', query: { } });
    } else {
  const { course_id,  resource_id, resource_url, course_intro, tech_id } = response.data.data;
  this.$router.push({ 
    name: 'CourseSetting', 
    query: { 
      course_id,
      resource_id,
      resource_url,
      course_intro,
      tech_id,
      // 将其他属性依次添加
    } 
  });
  this.course_id=course_id,
  this.tech_id=tech_id
}
      }).catch(error => {
        console.error('响应失败:', error);
      });
    },

    showCourseIntroduce() {
      this.visible = true;
      this.$router.push({ 
        name: 'CourseIntroduce', 
        query: { 
          course_id: this.course_id,
          tech_id: this.tech_id,
          // 其他属性
        } 
      });
      console.log('收到course_id：', this.course_id);
      console.log('收到tech_id：', this.tech_id);
    },
    /* ---------------------------- */
    // 处理点击搜索按钮的事件
    handleSearch() {
      // 重新计算分页数据
      this.currentPage = 1; // 搜索后回到第一页
    },
    handleQuestionBankSizeChange(val) {
      this.questionBankPageSize = val;
    },
    handleQuestionBankCurrent(val) {
      this.currentQuestionBankPage = val;
    },
    /* -----个人信息------ */
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.newAvatar = URL.createObjectURL(file);
      }else {
      this.newAvatar = 'https://via.placeholder.com/150'; // 或者设置为空字符串，以恢复到默认头像
  }
    },
    submitForm() {
      // 可以在这里提交表单，保存用户修改的信息
      // 示例中只是简单地打印出修改后的信息
      try {
        const formData = new FormData();
        formData.append('id', 1); // 假设需要上传头像
        formData.append('img_url', this.newAvatar); // 假设需要上传头像
        formData.append('user_intro', this.userDescription);
        formData.append('university_name', this.school);
        formData.append('phone_num', this.phone);

        const response = axios.put('http://10.33.124.200:8080/teacher/updateTeacher', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('提交成功:', response.data);
        this.cancelEdit(); // 提交成功后关闭编辑框
        window.location.reload(true); // 刷新页面
      } catch (error) {
        console.error('提交失败:', error);
        // 可以在这里处理提交失败的逻辑，例如显示错误信息
      }
      console.log('img_url:', this.newAvatar);
      console.log('user_intro:', this.userDescription);
      console.log('university_name:', this.school);
      console.log('phone_num:', this.phone);
      this.cancelEdit();
    },
    cancelEdit() {
      // 取消编辑，关闭对话框并重置数据
      this.showDialog = false;
    },
    fetchUserInfo() {
        axios({
        method: 'post',
        url: 'http://10.33.124.200:8080/teacher/showTeacher',
        params: {
          tech_id: 1
        }
      }).then(response => {
        console.log('获取到的人：', response.data);
        this.avatarUrl=response.data.data.img_url;
        this.userName = response.data.data.username; // 假设后端返回的姓名字段为 name
        this.userBio = response.data.data.user_intro;   // 假设后端返回的简介字段为 intro

        this.newAvatar=response.data.data.img_url;
        this.userDescription=response.data.data.user_intro;
        this.school=response.data.data.university_name;
        this.phone=response.data.data.phone_num;
      }).catch(error => {
        console.error('响应失败:', error);
      });
      },
  },
  
};
</script>

<style scoped>
.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
}
.head {
  display: flex;
  align-items: center;
  background-color: #52a2f8;
  height: 200px;
}

.avatar {
  flex: 0 0 auto; /* 不伸缩，固定宽度 */
  margin-right: 10px; /* 调整头像和文字之间的间距 */
  margin-left: 380px;
}

.avatar img {
  width: 150px; /* 调整头像的宽度 */
  height: 150px; /* 调整头像的高度 */
  border-radius: 50%; /* 圆形头像效果 */
}

.info {
  flex: 1; /* 填充剩余空间 */
}

.name {
  font-weight: bold;
  margin-bottom: 5px; /* 调整名字和简介之间的垂直间距 */
  font-size: 25px;
}
/* 个人信息 */
.my-header1 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #f0f0f0;
  border-bottom: 1px solid #ccc;
}

.avatar-upload {
  display: inline-block;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.avatar-preview {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-top: 8px;
}

.form-group {
  margin-bottom: 16px;
}

.textarea {
  width: 100%;
  height: 120px;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
}

.el-input {
  width: 100%;
  max-width: 300px;
}

.dialog-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
}

.dialog-buttons .el-button {
  padding: 10px 20px;
}
/* ------------- */
.bio {
  color: #353131;
  font-size: 20px;
}
/* ------- */
.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); /* 自动填充，最小宽度250px */
  gap: 20px; /* Adjust as needed */
  justify-items: center;
}
.Top {
  display: grid;
  grid-template-columns: 1 10; /* 将顶部分为两列 */
  align-items: center;
}

.b1 {
  grid-column: 2; /* 第一列 */
  margin-bottom: 20px;
  margin-left: 30px;
}
.b3 {
  grid-column: 1; /* 第一列 */
  margin-bottom: 20px;
}
.right-section {
  grid-column: 10; /* 第二列 */
  display: flex;
  justify-content: flex-end; /* 右对齐 */
  align-items: center;
  margin-bottom: 20px;
}

.right-section el-input {
  margin-right: 10px; /* 调整文本框和按钮之间的间距 */
}
.b2{
  margin-left: 20px;
}
.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-image {
  width: 250px;
  height: 200px;
  margin-bottom: 10px;
}
.card-text {
  background-color: rgba(59, 150, 255, 1);
  color: white;
  padding: 5px 20px;
  border-radius: 5px;
  margin-bottom: 10px;
  align-self: flex-start; /* 将文字内容左对齐 */
}
#course-title{
  padding: 3px 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  align-self: flex-start;
  font-weight: bold; /* 加粗 */
  font-size: 18px; /* 增大字号 */
}
#course-time{
  color: #a3a3a3;
  padding: 3px 10px;
  align-self: flex-start;
}
.card-page{
  margin-top: 20px;
  display: flex;
  justify-content: center; /* 水平居中 */
  transform: scale(1.2); /* 放大 1.2 倍，根据需要调整 */
  transform-origin: center; /* 缩放中心为元素中心 */
}
/* ================ */
  .tab-bar {
    display: flex;
    background-color: white;
    padding: 10px;
    border-bottom: 1px solid #e0e0e0;
    margin-bottom: 20px;
    margin-left: 150px;
  margin-right: 150px;
  }
  .tab {
    padding: 10px 20px;
    cursor: pointer;
    transition: background 0.3s ease-in-out;
  }
  
  .tab:hover {
    background-color: #f1f1f1;
  }
  
  .tab.active {
    border-bottom: 2px solid #007bff;
    color: #007bff;
    animation: tabAnimation 2s infinite;
  }
.course-intro {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-left: 150px;
  margin-right: 150px;
}

.settings {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.resource-test-settings {
  position: relative;
  background-color: #f8f9fa;
  padding: 20px;
  padding-bottom: 50px;
  border-radius: 5px;
}
.header-setting-background{
  background: #ffffff;
  padding: 20px;
}

</style>
