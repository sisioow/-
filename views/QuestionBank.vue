<template>
  <div class="question-bank">
    <h2>题库</h2>
    <el-table :data="questions" style="width: 100%">
      <el-table-column prop="id" label="题目ID" width="80"></el-table-column>
      <el-table-column prop="question" label="题目"></el-table-column>
      <el-table-column label="操作" width="180">
        <template v-slot="scope">
          <el-button @click="editQuestion(scope.row)" type="primary" size="small">编辑</el-button>
          <el-button @click="deleteQuestion(scope.row)" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" @click="addQuestion">添加题目</el-button>
  </div>
</template>

<script>
export default {
  name: 'QuestionBank',
  data() {
    return {
      questions: [
        { id: 1, question: '题目1' },
        { id: 2, question: '题目2' },
        // 其他示例题目
      ]
    };
  },
  methods: {
    addQuestion() {
      this.$prompt('请输入新题目', '添加题目', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        this.questions.push({ id: this.questions.length + 1, question: value });
        this.$message.success('题目已添加');
      }).catch(() => {
        this.$message.info('取消添加');
      });
    },
    editQuestion(row) {
      this.$prompt('编辑题目', '编辑题目', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: row.question
      }).then(({ value }) => {
        row.question = value;
        this.$message.success('题目已编辑');
      }).catch(() => {
        this.$message.info('取消编辑');
      });
    },
    deleteQuestion(row) {
      this.$confirm('确定删除该题目吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = this.questions.indexOf(row);
        if (index !== -1) {
          this.questions.splice(index, 1);
          this.$message.success('题目已删除');
        }
      }).catch(() => {
        this.$message.info('取消删除');
      });
    }
  }
};
</script>

<style scoped>
.question-bank {
  padding: 20px;
  background: linear-gradient(to right, #ffffff, #f0f0f0);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.5s ease-in-out;
  max-width: 800px;
  margin: 40px auto;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.question-bank:hover {
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
