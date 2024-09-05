<template>
  <div class="historical-course">
    <h2>历史课程管理</h2>
    <el-table :data="courses" style="width: 100%; margin-top: 20px;">
      <el-table-column prop="id" label="课程ID" width="180"></el-table-column>
      <el-table-column prop="title" label="课程标题"></el-table-column>
      <el-table-column prop="date" label="开课时间"></el-table-column>
      <el-table-column label="操作" width="300">
        <template #default="scope">
          <el-button @click="viewCourse(scope.row)" type="primary" size="small">查看课程</el-button>
          <el-button @click="downloadCourse(scope.row)" type="success" size="small">下载课程</el-button>
          <el-button @click="deleteCourse(scope.row)" type="danger" size="small">删除课程</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'HistoricalCourse',
  data() {
    return {
      courses: [
        { id: 'C001', title: '历史课程 1', date: '2023-01-01~2024-01-01' },
        { id: 'C002', title: '历史课程 2', date: '2023-02-01~2024-02-02' }
      ]
    };
  },
  methods: {
    viewCourse(row) {
      window.open(row.url, '_blank');
    },
    downloadCourse(row) {
      const link = document.createElement('a');
      link.href = row.url;
      link.download = row.title;
      link.click();
    },
    deleteCourse(row) {
      this.$confirm('此操作将永久删除该课程, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.courses = this.courses.filter(course => course.id !== row.id);
        this.$message.success('课程已删除');
      }).catch(() => {
        this.$message.info('取消删除');
      });
    }
  }
};
</script>

<style scoped>
.historical-course {
  padding: 20px;
  background: linear-gradient(to right, #ffffff, #f0f0f0);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.5s ease-in-out;
  max-width: 800px;
  margin: 40px auto;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.historical-course:hover {
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
