<template>
  <div class="manage-student">
    <h2>管理学生</h2>
    <el-table :data="students" style="width: 100%">
      <el-table-column prop="id" label="学生ID" width="180"></el-table-column>
      <el-table-column prop="name" label="学生姓名"></el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button @click="editStudent(scope.row)" type="primary" size="small">编辑</el-button>
          <el-button @click="deleteStudent(scope.row)" type="danger" size="small">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'ManageStudent',
  data() {
    return {
      students: [
        { id: '001', name: '张三' },
        { id: '002', name: '李四' }
      ]
    };
  },
  methods: {
    editStudent(row) {
      this.$prompt('编辑学生姓名', '编辑学生', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: row.name
      }).then(({ value }) => {
        row.name = value;
        this.$message.success('学生信息已修改');
      }).catch(() => {
        this.$message.info('取消修改');
      });
    },
    deleteStudent(row) {
      this.$confirm('确定移除该学生吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = this.students.indexOf(row);
        if (index !== -1) {
          this.students.splice(index, 1);
          this.$message.success('学生已移除');
        }
      }).catch(() => {
        this.$message.info('取消移除');
      });
    }
  }
};
</script>

<style scoped>
.manage-student {
  padding: 20px;
  background: linear-gradient(to right, #ffffff, #f0f0f0);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.5s ease-in-out;
  max-width: 800px;
  margin: 40px auto;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.manage-student:hover {
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
