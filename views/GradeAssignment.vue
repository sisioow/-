<template>
  <div class="grade-assignment">
    <h2>作业批改</h2>
    <el-table :data="assignments" style="width: 100%">
      <el-table-column prop="id" label="作业ID" width="180"></el-table-column>
      <el-table-column prop="studentName" label="学生姓名"></el-table-column>
      <el-table-column prop="grade" label="成绩"></el-table-column>
      <el-table-column label="操作" width="240">
        <template #default="scope">
          <el-button @click="viewAssignment(scope.row)" type="info" size="small">查看作业</el-button>
          <el-button @click="editGrade(scope.row)" type="primary" size="small">修改成绩</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'GradeAssignment',
  data() {
    return {
      assignments: [
        { id: 'A001', studentName: '张三', grade: '85', content: '张三的作业内容...' },
        { id: 'A002', studentName: '李四', grade: '90', content: '李四的作业内容...' }
      ]
    };
  },
  methods: {
    viewAssignment(row) {
      this.$alert(row.content, '查看作业', {
        confirmButtonText: '确定'
      });
    },
    editGrade(row) {
      this.$prompt('修改成绩', '编辑成绩', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: row.grade
      }).then(({ value }) => {
        row.grade = value;
        this.$message.success('成绩已修改');
      }).catch(() => {
        this.$message.info('取消修改');
      });
    }
  }
};
</script>

<style scoped>
.grade-assignment {
  padding: 20px;
  background: linear-gradient(to right, #ffffff, #f0f0f0);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.5s ease-in-out;
  max-width: 800px;
  margin: 40px auto;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.grade-assignment:hover {
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
