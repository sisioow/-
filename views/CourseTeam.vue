<template>
  <div>
    <h2>课程团队设置</h2>
    <h3>课程负责人</h3>
    <div class="team-member">
      <div class="add-button-circle" @click="editMember('leader')">
        <img v-if="leader.avatar" :src="leader.avatar" alt="leader avatar" />
        <span v-else>+ 添加负责人</span>
      </div>
      <div v-if="leader.name" class="member-info">
        <div>{{ leader.name }}</div>
        <a href="#">{{ leader.profileLink }}</a>
      </div>
    </div>
    <div class="teachers">
      <h3>讲师</h3>
      <hr class="divider" />
      <div class="team-member">
        <div class="add-button-circle" @click="editMember('teacher')">
          <img v-if="teachers.length" :src="teachers[teachers.length - 1].avatar" alt="teacher avatar" />
          <span v-else>+ 添加讲师</span>
        </div>
        <div v-if="teachers.length" class="member-info">
          <div>{{ teachers[teachers.length - 1].name }}</div>
          <a href="#">{{ teachers[teachers.length - 1].profileLink }}</a>
        </div>
      </div>
    </div>
    <!-- <div class="assistants">
      <h3>讲师</h3>
      <hr class="divider" />
      <div class="team-member">
        <div class="add-button-circle" @click="editMember('assistant')">
          <img v-if="assistants.length" :src="assistants[assistants.length - 1].avatar" alt="assistant avatar" />
          <span v-else>+ 讲师</span>
        </div>
        <div v-if="assistants.length" class="member-info">
          <div>{{ assistants[assistants.length - 1].name }}</div>
          <a href="#">{{ assistants[assistants.length - 1].profileLink }}</a>
        </div>
      </div>
    </div> -->

    <div v-if="showDialog" class="dialog-overlay">
      <div class="dialog">
        <h3>{{ dialogTitle }}</h3>
        <button class="close-button" @click="closeDialog">×</button>
        <div class="dialog-content">
          <label for="name">名字</label>
          <input type="text" v-model="name" id="name">
          <label for="email">邮箱</label>
          <input type="email" v-model="email" id="email">
          <label for="phone">手机号</label>
          <input type="tel" v-model="phone" id="phone">
        </div>
        <div class="dialog-actions">
          <button @click="saveMember">保存</button>
          <button @click="closeDialog">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      leader: {
        avatar: '',
        name: '',
        profileLink: '查看主页'
      },
      showDialog: false,
      dialogTitle: '',
      editingRole: '',
      teachers: [],
      //assistants: [],
      name: '',
      email: '',
      phone: ''
    };
  },
  methods: {
    editMember(role) {
      this.editingRole = role;
      this.dialogTitle = role === 'leader' ? '添加负责人' : role === 'teacher' ? '添加讲师' : '添加助教';

      if (role === 'leader') {
        /* 利用接口 */
        axios.get('/api/leader')
          .then(response => {
            const leaderData = response.data;
            this.name = leaderData.name;
            this.email = leaderData.email;
            this.phone = leaderData.phone;
            // 如果有头像，也从后端获取，类似处理
          })
          .catch(error => {
            console.error('Error fetching leader data', error);
          });
          /*  */
        /* this.avatar=this.leader.avatar;
        this.name = this.leader.name;
        this.email = this.leader.email;
        this.phone = this.leader.phone; */
      } else if (role === 'teacher' && this.teachers.length) {
        /* 从后端 */
        axios.post('http://10.33.124.200:8080/teacher/addteam')
          .then(response => {
            const latestTeacher = response.data;
            this.name = latestTeacher.name;
            this.email = latestTeacher.email;
            this.phone = latestTeacher.phone;
            // 如果有头像，也从后端获取，类似处理
          })
          .catch(error => {
            console.error('Error fetching latest teacher data', error);
          });
        /* ---- */
        /* const teacher = this.teachers[this.teachers.length - 1];
        this.name = teacher.name;
        this.email = teacher.email;
        this.phone = teacher.phone; */
      } 
      
      /* else if (role === 'assistant' && this.assistants.length) {
        const assistant = this.assistants[this.assistants.length - 1];
        this.name = assistant.name;
        this.email = assistant.email;
        this.phone = assistant.phone;
      } */

      this.showDialog = true;
    },
    saveMember() {
      const avatarUrl = 'path/to/avatar.jpg'; // 这个URL应该从后端获取
      const member = { name: this.name, email: this.email, phone: this.phone, avatar: avatarUrl, profileLink: '查看主页' };

      if (this.editingRole === 'leader') {
        this.leader = member;
      } else if (this.editingRole === 'teacher') {
        this.teachers.push(member);
      }
      /*  else if (this.editingRole === 'assistant') {
        this.assistants.push(member);
      } */

      this.closeDialog();
    },
    closeDialog() {
      this.showDialog = false;
      this.clearForm();
    },
    clearForm() {
      this.name = '';
      this.email = '';
      this.phone = '';
    }
  }
};
</script>

<style scoped>
.team-member {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  
}

.team-member .add-button-circle {
  margin-right: 10px;
}

.team-member img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.member-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.teachers, .assistants {
  margin-bottom: 20px;
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
  color: #4CAF50;
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

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.dialog-content {
  margin-top: 20px;
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
  background: #4CAF50;
  color: white;
}

.dialog-actions button:last-child {
  background: #ccc;
}
</style>
