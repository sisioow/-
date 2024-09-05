<template>
  <div class="exam-papers">
    <h2>试卷库</h2>
    <el-table :data="papers" style="width: 100%">
      <el-table-column prop="id" label="试卷ID" width="80"></el-table-column>
      <el-table-column prop="name" label="试卷名称"></el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button @click="editPaper(scope.row)" type="primary" size="small">编辑</el-button>
          <el-button @click="deletePaper(scope.row)" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" @click="addPaper">添加试卷</el-button>
  </div>
</template>

<script>
export default {
  name: 'ExamPapers',
  data() {
    return {
      papers: [
        { id: 1, name: '示例试卷1' },
        { id: 2, name: '示例试卷2' }
      ]
    };
  },
  methods: {
    addPaper() {
      this.$prompt('请输入新试卷名称', '添加试卷', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        this.papers.push({ id: this.papers.length + 1, name: value });
        this.$message.success('试卷已添加');
      }).catch(() => {
        this.$message.info('取消添加');
      });
    },
    editPaper(row) {
      this.$prompt('编辑试卷', '编辑试卷', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: row.name
      }).then(({ value }) => {
        row.name = value;
        this.$message.success('试卷已编辑');
      }).catch(() => {
        this.$message.info('取消编辑');
      });
    },
    deletePaper(row) {
      this.$confirm('确定删除该试卷吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = this.papers.indexOf(row);
        if (index !== -1) {
          this.papers.splice(index, 1);
          this.$message.success('试卷已删除');
        }
      }).catch(() => {
        this.$message.info('取消删除');
      });
    }
  }
};
</script>

<style scoped>
.exam-papers {
  padding: 20px;
  background: linear-gradient(to right, #ffffff, #f0f0f0);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.5s ease-in-out;
  max-width: 800px;
  margin: 40px auto;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.exam-papers:hover {
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
