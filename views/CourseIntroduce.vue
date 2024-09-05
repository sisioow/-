<template>
  <div class="tab-bar"> 
      <span class="tab" :class="{ 'active': activeTab === 'intro' }" @click="scrollToSection('intro')">课程基础设置</span>
   </div>

  <div class="course-announcement">
    <div class="settings">
      <div class="course-basic-settings" id="intro">
        <h2>课程基础设置</h2>
        <div class="jichu">
    <div class="jichu1">
      <div class="form-group">
        <label for="courseName">课程名称:</label>
        <input id="courseName" type="text" v-model="semesterName" placeholder="请输入"/>
      </div>
      <div class="form-group">
        <label for="courseCopy">课程复制:</label>
        <input id="courseCopy" type="text" v-model="semesterCode" placeholder="请输入课程码"/>
      </div>
      <div class="form-group">
        <label for="duration">持续时间:</label>
        <div class="demo-datetime-picker">
          <el-date-picker
            v-model="duration"
            type="datetimerange"
            start-placeholder="Start date"
            end-placeholder="End date"
            format="YYYY-MM-DD HH:mm:ss"
            date-format="YYYY/MM/DD ddd"
            time-format="A hh:mm:ss"
          />
        </div>
      </div>
    </div>
  </div> 
  <div class="b1">
    <button @click="handleSubmit">添加</button>
  </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'
export default {
  setup() {
    const value2 = ref('');
    return {    
      value2,
    };
  },
  data() {
    return {
      activeTab: 'intro',
      imageUrl: '',

      semesterName: '',
      semesterCode: '',

      duration: [], // duration will be an array with [start, end]
      startTime: '',
      endTime: '',

      semesterIntro: '',
      file:null,
      /* 添加课堂 */
      course_id: '',
      tech_id:'',
    };
  },
  methods: {
  handleSubmit() {
    const formData = new FormData();
   /*  formData.append('tech_id', '1');
    formData.append('course_id', '1');//课程id */
    formData.append('semester_name', this.semesterName);
    formData.append('semester_code', this.semesterCode);
    var dateString = this.duration[0];
    var dateString1 = this.duration[1];
    var date = new Date(dateString);
    var date1 = new Date(dateString1);
    var formattedDate = this.formatDate(date);
    var formattedDate1 = this.formatDate(date1);
    formData.append('start_time', formattedDate);
    formData.append('end_time', formattedDate1);

/* 封装添加课堂、后端接口 */
      const newSemester = {
        course_id:this.course_id,
        tech_id:this.tech_id,
        start_time:formattedDate,
        end_time:formattedDate1,
        semester_name:this.semesterName,
      };
      
      const newSemester1 = {
        tech_id:this.tech_id,
        start_time:formattedDate,
        end_time:formattedDate1,
        semester_name:this.semesterName,
        semester_code:this.semesterCode,
      };
      /* ---------------- */
    if (this.semesterCode) {
        // 如果 semesterCode 已填写，则使用带有 semesterCode 的 Axios 请求
        axios.post('http://10.33.124.200:8080/semesters/copysemester',newSemester1)
        .then(response => {
          console.log('课堂复制成功', response.data);
          this.clearForm();
          // 这里可以添加成功后的处理逻辑
        })
        .catch(error => {
          console.error('课程复制添加失败', error);
          // 这里可以处理添加失败的情况
        });
      } else {
        // 如果 semesterCode 未填写，则使用不带 semesterCode 的 Axios 请求
      // 发送 POST 请求
      axios.post('http://10.33.124.200:8080/semesters/addsemester', newSemester)
        .then(response => {
          alert('新建成功'+newSemester);
          console.log('Submitting new semester:', newSemester); // 确认 newSemester 的值是否正确
          // 在成功响应后更新教师列表或做其他操作
          console.log('newSemester added successfully', response.data.data);
          // 清空输入框
          this.clearForm();
        })
        .catch(error => {
          console.error('Error adding teacher', error);
        });
      }
  },
    clearForm() {
      // 清空表单数据
      this.semesterName = '';
      this.semesterCode = '';
      this.duration = [];
      //alert('提交成功！');
      //window.location.reload(true); // 刷新页面
    },
    // 定义格式化函数
    formatDate(date) {
    var year = date.getFullYear();
    var month = ('0' + (date.getMonth() + 1)).slice(-2); // 月份从0开始，需要加1并且保证两位
    var day = ('0' + date.getDate()).slice(-2); // 天数保证两位
    var hours = ('0' + date.getHours()).slice(-2);
    var minutes = ('0' + date.getMinutes()).slice(-2);
    var seconds = ('0' + date.getSeconds()).slice(-2);

  return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
    },
  },
  mounted() {
    this.course_id = this.$route.query.course_id;
    this.tech_id = this.$route.query.tech_id;
    console.log('新建课堂收到course_id：', this.course_id);
    console.log('新建课堂收到tech_id：', this.tech_id);
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
.demo-datetime-picker {
  display: flex;
  width: 60%;
  padding: 0;
  flex-wrap: wrap;
  
}
.demo-datetime-picker .block {
  padding: 0px 0;
  text-align: center;
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

.jichu1,
.jichu2 {
  flex: 1; /* 平分父容器的宽度 */
  padding: 10px; /* 可选：添加内边距 */
}
.course-announcement {
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
.course-announcement-settings {
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
  height: 300px;
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
  width: 80%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
#courseDescription {
  height: 200px;
  padding: 8px; /* 可选：添加内边距 */
  box-sizing: border-box; /* 让padding不会撑大textarea */
}
#announcementContent{
  height: 100px;
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
</style>
