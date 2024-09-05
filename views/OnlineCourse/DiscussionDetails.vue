<template>
    
    <router-link to="/onlinecourse/discussionboard">返回</router-link>
    <div class="online-course">
        
    <h2>当前评论</h2>
    <el-table :data="courses" style="width: 100%">
      <el-table-column prop="id" label="课程ID" width="180"></el-table-column>
      <el-table-column prop="name" label="课程名称"></el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button @click="editCourse(scope.row)" type="primary" size="small">编辑</el-button>
          <el-button @click="deleteCourse(scope.row)" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" @click="addCourse">添加课程</el-button>
    </div>
    </template>
    <script>
    //import DiscussionDetails from './DiscussionDetails.vue';
    
    export default {
    name: 'DiscussionDetails',
    data() {
    return {
      courses: [
        { id: '1', name: '示例课程1' },
        { id: '2', name: '示例课程2' }
      ]
    };
    },
    methods: {
    addCourse() {
      this.$prompt('请输入新课程名称', '添加课程', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        this.courses.push({ id: this.courses.length + 1, name: value });
        this.$message.success('课程已添加');
      }).catch(() => {
        this.$message.info('取消添加');
      });
    },
    editCourse(row) {
      this.$prompt('编辑课程名称', '编辑课程', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: row.name
      }).then(({ value }) => {
        row.name = value;
        this.$message.success('课程已编辑');
      }).catch(() => {
        this.$message.info('取消编辑');
      });
    },
    deleteCourse(row) {
      this.$confirm('确定删除该课程吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = this.courses.indexOf(row);
        if (index !== -1) {
          this.courses.splice(index, 1);
          this.$message.success('课程已删除');
        }
      }).catch(() => {
        this.$message.info('取消删除');
      });
    }
    }
    };
    </script>
    
    <style scoped>
    .tab.active {
    border-bottom: 2px solid #007bff;
    color: #007bff;
    animation: tabAnimation 2s infinite;
    }
    .tab {
    padding: 10px 20px;
    cursor: pointer;
    transition: background 0.3s ease-in-out;
    }
    .animated-tab {
    animation: tabTextAnimation 2s infinite;
    }
    .tab-bar {
    display: flex;
    background-color: white;
    padding: 10px;
    border-bottom: 1px solid #e0e0e0;
    margin-bottom: 20px;
    }
    .online-course {
    padding: 20px;
    background: linear-gradient(to right, #ffffff, #f0f0f0);
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    animation: fadeIn 0.5s ease-in-out;
    /* max-width: 800px; */
    width: 90%;
    margin: 40px auto;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .online-course:hover {
    transform: translateY(-10px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    }
    
    h2 {
    color: #409EFF;
    text-align: center;
    margin-bottom: 20px;
    font-size: 24px;
    animation: slideIn 0.5s ease;
    }
    
    .el-table {
    margin-bottom: 20px;
    }
    
    .el-button {
    margin-top: 20px;
    transition: background-color 0.3s ease, transform 0.3s ease;
    }
    
    .el-button:hover {
    background-color: #66b1ff;
    transform: scale(1.05);
    }
    
    @keyframes fadeIn {
    from {
    opacity: 0;
    transform: translateY(-20px);
    }
    to {
    opacity: 1;
    transform: translateY(0);
    }
    }
    
    @keyframes slideIn {
    from {
    opacity: 0;
    transform: translateX(-50px);
    }
    to {
    opacity: 1;
    transform: translateX(0);
    }
    }
    </style>
    
    
    
    
    