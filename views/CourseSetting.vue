<template>
  <div class="tab-bar"> 
      <span class="tab" :class="{ 'active': currentTab === 'intro' }" @click="changeTab('intro')"
      data-target="intro">课程基础设置</span>
      <span class="tab" :class="{ 'active': currentTab === 'team' }" @click="changeTab('team')"
      data-target="team">课程团队设置</span>
      
    </div>
  <div class="course-announcement">
    <div class="settings">
      <!-- 课程基础设置 -->
      <div v-if="currentTab === 'intro'">
      <div class="course-basic-settings" id="intro">
        <h2>课程基础设置</h2>
        <div class="form-group">
          <div class="course-cover" @click="openFilePicker">
          <span v-if="!resource_url">课程封面</span>
          <img v-else :src="resource_url"  alt="Course Cover"  style="max-width: 100%; max-height: 100%;">
        </div>
        <input type="file" ref="fileInput" style="display: none;" @change="handleFileChange">
        </div>
        <div class="jichu">
    <div class="jichu2">
      <div class="form-group">
        <label for="courseDescription">课程简介:</label>
        <textarea id="courseDescription" v-model="course_intro" placeholder="请输入"></textarea>
      </div>
    </div>
  </div> 
  <div class="b1">

 <button @click="handleSubmit" :disabled="submitDisabled" :style="{ visibility: submitDisabled ? 'hidden' : 'visible' }">提交</button>
  <button @click="handleSubmit" :disabled="modifyDisabled" :style="{ visibility: modifyDisabled ? 'hidden' : 'visible' }">修改</button>
</div>
      </div>
    </div>
      <!-- 团队 -->
      <div v-if="currentTab === 'team'">
      <div class="course-team-settings" id="team">
        <h2>课程团队设置</h2>
        <h3>课程负责人</h3>
<!-- 教师列表 -->
      <div class="teacher-list">
      <!-- 循环显示已添加的教师 -->
      <div v-for="teacher in teachers" :key="teacher.id" class="teacher">
        <img :src="teacher.avatar" alt="Teacher Avatar" @click="showTeacherDetails(teacher)">
        <p>{{ teacher.username }}</p>
      </div>
      
      <!-- 添加教师的按钮 -->
      <div class="teacher add-teacher">
        <img src="https://via.placeholder.com/150" alt="Add Teacher" @click="showDialog1">
        <p>添加教师</p>
      </div>
    </div>
    <!-- 弹窗 -->
    <div v-if="showDialog" class="dialog-overlay">
      <div class="dialog">
        <h3>{{ dialogTitle }}</h3>
        <div class="dialog-content">
          <label for="phone">手机号</label>
          <input type="tel" v-model="newTeacher.phone" id="phone">
        </div>
        <div class="dialog-actions">
          <button @click="addTeacher">保存</button>
          <button @click="closeDialog">取消</button>
        </div>
      </div>
    </div>

    <!-- 教师详细信息弹窗 -->
    <div v-if="showTeacherDetailsDialog" class="dialog-overlay">
      <div class="dialog">
        <h3>{{ selectedTeacher.username }} 的详细信息</h3>
        <div class="dialog-content">
          <img :src="selectedTeacher.avatar" alt="Teacher Avatar">
          <p>姓名: {{ selectedTeacher.username }}</p>
          <!-- 可以添加更多教师信息 -->
        </div>
        <div class="dialog-actions">
          <button @click="closeTeacherDetails">关闭</button>
        </div>
      </div>
    </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      /* 团队 */
      teachers:[{avatar:'',username:''}],
      showDialog: false,
      showTeacherDetailsDialog: false,
      newTeacher: {
      /* name: '', */
      email:'',
      phone:'',
      avatar: 'https://via.placeholder.com/150',
    },
    selectedTeacher: {},
      dialogTitle: '',
      name: '',
      phone_num: '',
      /*  */
      currentTab: 'intro',
      file:null,//封面
      /* ----课程后端设置---- */
      course_id: null,
      resourceId: null,
      tech_id:null,
      resource_url:null,
      course_intro:null,
      /* 按钮 */
      submitDisabled: true,
      modifyDisabled: true,
    };
  },
  
  methods: {
    changeTab(tab) {
      this.currentTab = tab; // 更新选项卡状态
    },
    openFilePicker() {
      this.$refs.fileInput.click();
    },
    handleFileChange(event) {
      this. file = event.target.files[0];
      if (this.file && this.file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          this.resource_url = reader.result;
        };
        reader.readAsDataURL(this.file);
      } else {
        alert('Please select an image file.');
      }
    },
    /* 课程信息提交 */
    handleSubmit() {
/* 后端接口 */
if(this.course_id==null){

    const formData = new FormData();
    formData.append('file', this.file);//封面
    formData.append('resource_type', "pic");//封面
    formData.append('tech_id', this.tech_id);
    formData.append('course_intro', this.course_intro);//简介
      axios.post('http://10.33.124.200:8080/course/addCourse',formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
}}) // 替换为实际的 API 地址
        .then(response => {
          console.log('API 响应：', response.data.data); // 检查 response.data 的结构
          window.location.reload(true); // 刷新页面
        })
        .catch(error => {
          console.error('响应失败:', error);
        });
    }else{
      const formData = new FormData();
      formData.append('course_id', this.course_id);
      formData.append('course_intro', this.course_intro);
      formData.append('file', this.file);

      axios.put('http://10.33.124.200:8080/course/updatecourse',formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
}}) // 替换为实际的 API 地址
        .then(response => {
          console.log('API 响应：', response.data.data); // 检查 response.data 的结构
        })
        .catch(error => {
          console.error('响应失败:', error);
        });
}
    
  },
    clearForm() {
      // 清空表单数据
      this.course_intro = '';
      this.file='';
      alert('提交成功！');
    },
    /* 团设置队 */
    
    
    showDialog1() {
      this.showDialog = true;
    },
    closeDialog() {
      this.showDialog = false;
      this.newTeacher.name = '';
      this.newTeacher.email = '';
      this.newTeacher.phone = '';
      this.newTeacher.avatar = '';
    },
    addTeacher() {
      /* 后端添加教师 */
      const newTeacher = {
        course_id:this.course_id,
        phone_num:this.newTeacher.phone,
        email:this.newTeacher.email,
      };
      // 发送 POST 请求
      axios.post('http://10.33.124.200:8080/teacher/addteam', newTeacher)
        .then(response => {
          // 在成功响应后更新教师列表或做其他操作
          alert(response.data.msg);
          console.log('Teacher added successfully', response.data);
          // 可选：如果需要更新列表，可以再次获取教师列表
          this.fetchTeachers(); // 假设定义了一个获取教师列表的方法
          
          // 清空输入框
          this.newTeacher.phone = '';
          this.newTeacher.email = '';
        })
        .catch(error => {
          console.error('Error adding teacher', error);
        });
      this.closeDialog();
    },
    showTeacherDetails(teacher) {
      this.selectedTeacher = teacher;
      this.showTeacherDetailsDialog = true;
    },
    closeTeacherDetails() {
      this.showTeacherDetailsDialog = false;
      this.selectedTeacher = {};
    },


    /* ----后台团队设置---- */
    fetchTeachers() {
      // 使用 Axios 发送 GET 请求
      axios({
        method: 'get',
        url: 'http://10.33.124.200:8080/teacher/showteam',
        params: {
          course_id: this.course_id
        }
      }).then(response => {
        console.log('获取老师传的id：', this.course_id); 
        console.log('老师：', response.data); 
        console.log('老师1：', response.data.data); 
        let responseData = response.data.data; // 将返回的教师列表存储在组件的 data 中
        console.log('获取老师', this.teachers);
        // 将从后端获取到的老师数组赋值给你的 teachers 数组
        this.teachers = responseData.map(item => ({
        username: item.username,
        avatar: item.img_url,
}));

        // 判断 response.data.data 是否为 null
      }).catch(error => {
        console.error('响应失败:', error);
      });
    },

  },
  mounted() {
    this.course_id = this.$route.query.course_id;
    this.resourceId = this.$route.query.resource_id;
    this.tech_id = this.$route.query.tech_id;
    this.resource_url = this.$route.query.resource_url;
    this.course_intro = this.$route.query.course_intro;
    console.log('course_id：', this.course_id);
    console.log('resourceId：', this.resourceId);
    console.log('tech_id：', this.tech_id);
    console.log('resource_url', this.resource_url);
    console.log('course_intro', this.course_intro);
    if(this.course_id!=null){
      this.modifyDisabled = false; // 恢复修改按钮可用
    }else{
      this.submitDisabled = false; // 恢复提交按钮可用
    }

    this.fetchTeachers();
  }
}

</script>

<style scoped>
.tab-bar {
  display: flex;
  background-color: white;
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 20px;
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

.animated-tab {
  animation: tabTextAnimation 2s infinite;
}

.b1{
  display: flex;
  flex-direction: column;
  justify-content: flex-end; /* 垂直底部对齐 */
  align-items: flex-end; /* 水平右对齐 */
  margin-right: 10%;
}
.jichu {
  display: flex; /* 使用Flexbox布局 */
  flex-wrap: nowrap; /* 不换行 */
}

.jichu2 {
  flex: 1; /* 平分父容器的宽度 */
  padding: 10px; /* 可选：添加内边距 */
}
.course-team {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.settings {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.course-basic-settings,
.course-team-settings {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 5px;
}
.course-basic-settings {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.course-cover {
  width: 50%;
  height: 200px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  margin-bottom: 10px;
  margin-left: auto;
  margin-right: auto;
}

input[type="text"],
textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
#courseDescription {
  height: 200px;
  padding: 8px; /* 可选：添加内边距 */
  box-sizing: border-box; /* 让padding不会撑大textarea */
}

button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: fit-content; /* 让按钮宽度仅包裹文字内容 */
  bottom: 20px; /* 距离底部的距离 */
  right: 20px; /* 距离右侧的距离 */
}

button:hover {
  background-color: #0056b3;
}

/* 团队 */
.teacher-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }

  .teacher {
    text-align: center;
    width: 120px;
  }

  .teacher img {
    width: 80px;
    height: 80px;
    border-radius: 50%; /* 设置为圆形 */
    object-fit: cover; /* 确保头像不变形 */
    margin-bottom: 8px;
    cursor: pointer;
  }

  .teacher p {
    margin: 0;
    font-size: 14px;
    font-weight: bold;
  }
.divider {
  border: none;
  border-top: 1px solid #ccc;
  margin: 10px 0;
}

.add-button-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #f2f2f2;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin: 10px 0;
  border: 1px solid #ccc;
  position: relative;
}

.add-button-circle img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.add-button-circle span {
  color: #90e0f4;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog {
  background: white;
  padding: 20px;
  border-radius: 5px;
  width: 400px;
  position: relative;
}

.dialog-content {
  margin-top: 20px;
}
.dialog-content img {
  width: 100px;
  height: 100px;
}
.dialog-content label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.dialog-content input[type="text"],
.dialog-content input[type="email"],
.dialog-content input[type="tel"] {
  width: 93%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

.dialog-actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.dialog-actions button {
  padding: 10px 20px;
  margin-left: 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.dialog-actions button:first-child {
  background: #479bd3;
  color: white;
}

.dialog-actions button:last-child {
  background: #ccc;
}
</style>
