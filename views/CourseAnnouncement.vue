<template>
  <div class="tab-bar"> 
    <span class="tab active animated-tab" :class="{ active: currentTab === 'course/announcement' }" @click="navigateTo('course/announcement')">课程公告设置</span>
     </div>

  <div class="course-announcement">
    <div class="settings">
      <div class="course-announcement-settings" id="announcement">
        <h2>课程公告设置</h2>
        <div class="form-group">
        <label for="announcementTitle">公告标题:</label>
        <input v-model="notice_title" id="announcementTitle" type="text" placeholder="请输入"/>
      </div>
        <div class="form-group">
        <label for="announcementContent">公告内容:</label>
        <textarea v-model="notice_content" id="announcementContent" placeholder="请输入"></textarea>
      </div>
        <div class="b1">
        <button @click="submitAnnouncement">发布</button>
      </div>
      </div>
      <div class="course-announcement-show" id="show" style="text-align: center;">
        <el-table :data="sortedTableData" height="300" style="width: 90%; margin: 0 auto;">
        <el-table-column prop="date" label="日期" width="450" />
        <el-table-column prop="name" label="标题" width="300" />
       <el-table-column prop="content" label="内容" width="200">
        <template #default="scope">
          {{ truncateText(scope.row.content) }}
        </template>
      </el-table-column>
        <el-table-column label="操作" width="400">  
      <template #default="scope">  
        <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>  
        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>  
      </template>  
    </el-table-column>
      </el-table>
      </div>
    </div>
  </div>
  <!-- 编辑对话框 -->
  <el-dialog
    v-model="centerDialogVisible"
    title="编辑公告"
    width="500"
    align-center
  >
  <div class="form-group">
        <label for="announcementTitle1">公告标题:</label>
        <input v-model="notice_title1" id="announcementTitle1" type="text" placeholder="请输入"/>
      </div>
        <div class="form-group">
        <label for="announcementContent1">公告内容:</label>
        <textarea v-model="notice_content1" id="announcementContent1"  placeholder="请输入"></textarea>
      </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取消</el-button>
        <el-button type="primary"  @click="confirmEdit">
          确定修改
        </el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 删除对话框 -->
  <el-dialog
    v-model="centerDialogVisible2"
    title="删除公告"
    width="500"
    align-center
  >
    <span>是否删除</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmDelete">
          确定删除
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import axios from 'axios'
import { ref } from 'vue'
export default {
  data() {
    return {
      //发布公告
      notice_id: '',
      notice_title: '',
      notice_content: '',
      semesterId:'',
      course_id:'',
      semester_id:'',
      /* ----下方列表---- */
      centerDialogVisible :ref(false),
      centerDialogVisible2 :ref(false),
 /*      tableData : [
  {
    date: '2016-05-03',
    name: 'Tom',
    content: '',
  },
  {
    date: '2017-05-02',
    name: 'haha',
    content: '',
  },
] */
     /*  tableData :[{date: '',name: '',content: ''}], */
     tableData: [], // 初始化为空数组，用于存放从后端获取的公告列表数据
      notice_title1: '', // 编辑框中的公告标题
      notice_content1: '', // 编辑框中的公告内容
      editingIndex: -1, // 当前正在编辑的公告在tableData中的索引
      detailIndex: -1, // 当前正在删除的公告在tableData中的索引
      deletingIndex: -1, // 当前正在删除的公告在tableData中的索引
    };
  },
  computed: {
    sortedTableData() {
      // Create a copy of tableData and sort it by date in descending order
      return this.tableData.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  },
  methods: {
    /* 后端添加公告 */
    submitAnnouncement() {
      /* 封装添加课堂、后端接口 */
      const newAnnouncement = {
        semester_id:this.semester_id,
        notice_title: this.notice_title,
        notice_content:this.notice_content,
      };
      axios.post('http://10.33.124.200:8080/semester/addnotice',newAnnouncement)
      .then(response => {
        console.log('成功提交发布公告表单：', response.data.data);
        // 提交成功后可以进行其他操作，例如清空表单
        this.clearForm();
      })
      .catch(error => {
        console.error('提交表单数据失败：', error);
        // 处理错误情况，例如显示错误提示
      });
      // 提交后清空表单或者进行其他操作
    },
    clearForm() {
      // 清空表单数据
      this.notice_title = '';
      this.notice_content = '';
      alert('发布成功！');
      this.fetchGonggao();
    },
    /* ---------无后端---------- */
    /* submitAnnouncement() {
      if (this.notice_title && this.notice_content) {
        const currentDate = new Date().toISOString().slice(0, 10);
        this.tableData.push({
          date: currentDate,
          name: this.notice_title,
          content: this.notice_content
        });
        alert('发布成功');
        this.notice_title = '';
        this.notice_content = '';
      } else {
        alert('请填写公告标题和内容');
      }
    }, */
    handleEdit(index, row) {
    console.log('编辑', index, row);
    this.editingIndex = index;
    this.notice_title1 = row.name; // 将公告标题填入编辑框
    this.notice_content1 = row.content; // 将公告内容填入编辑框
    this.centerDialogVisible = true;
  }, 
  confirmEdit() {
      if (this.editingIndex !== -1) {
        //const noticeIdToEdit = this.tableData[this.editingIndex].notice_id;
        const newData = {
            notice_id:this.tableData[this.editingIndex].notice_id,
            notice_title: this.notice_title1,
            notice_content: this.notice_content1
          };
          axios.put('http://10.33.124.200:8080/notice/update',newData).then(response => {
          console.log('修改成功:', response.data);
          alert('修改公告成功！');
          // 更新 tableData 中对应索引的公告信息
          this.tableData[this.editingIndex].name = this.notice_title1;
          this.tableData[this.editingIndex].content = this.notice_content1;
          this.fetchGonggao();
        }).catch(error => {
          console.error('修改失败:', error);
        }).finally(() => {
          this.centerDialogVisible = false;
          this.editingIndex = -1;
          this.notice_title1 = '';
          this.notice_content1 = '';
          
        });
      }
    },
    handleDelete(index, row) {  
      console.log('删除', index, row); 
      this.deletingIndex = index;
      this.centerDialogVisible2 = true;
     
    },
  confirmDelete() {
      if (this.deletingIndex !== -1) {
        const noticeIdToDelete = this.tableData[this.deletingIndex].notice_id;
        axios({
          method: 'delete',
          url: `http://10.33.124.200:8080/notice/${noticeIdToDelete}`
        }).then(response => {
          console.log('删除成功:', response);
          // 从 tableData 中删除对应索引的公告
          this.tableData.splice(this.deletingIndex, 1);
          this.fetchGonggao();
        }).catch(error => {
          console.error('删除失败:', error);
        }).finally(() => {
          this.centerDialogVisible2 = false;
          this.deletingIndex = -1;
        });
      }
    },
  fetchGonggao() {
        axios({
        method: 'get',
        url: 'http://10.33.124.200:8080/notice/showList',
        params: {
        semester_id: this.semester_id
        }
      }).then(response => {
        console.log('API 响应公告：', response.data.data);
        const apiAnnouncement = response.data.data;
          this.tableData = apiAnnouncement.map(notice => ({
          date: notice.update_time,
          name: notice.notice_title, // 假设 API 返回的字段是 semester_name
          content:notice.notice_content,
          notice_id:notice.notice_id,
          }));
      }).catch(error => {
        console.error('响应失败:', error);
      });
      },
      truncateText(text) {
      const maxLength = 5; // 最大显示长度
      if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
      } else {
        return text;
      }
    },
  },
  mounted() {
    /* this.semester_id = this.$route.query.semester_id;
    console.log('公告收到semester_id：', this.semester_id); */
    this.semester_id = localStorage.getItem("semester_id");
    console.log('公告收到本地semester_id：', this.semester_id);
    this.fetchGonggao();
  },
}// 返回需要在模板中使用的数据和方法


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

.course-announcement-settings {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 5px;
}
.course-announcement-show{
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 5px;
  
}
 
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}


input[type="text"],
textarea {
  width: 90%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
#announcementContent{
  height: 100px;
}
#announcementContent1{
  height: 90px;
}
#announcementContent2{
  height: 90px;
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
