<template>
  <div class="edit-course">
    <h2>编辑课程内容</h2>
    <el-form :model="form" label-width="120px">
      <el-form-item label="课程名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="课程描述">
        <el-input type="textarea" v-model="form.description"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'EditCourse',
  data() {
    return {
      form: {
        name: '',
        description: ''
      }
    };
  },
  methods: {
    onSubmit() {
      this.$message.success('课程内容已保存');
      // 添加保存逻辑，例如 API 调用
    },
    onCancel() {
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
.edit-course {
  padding: 20px;
  background: linear-gradient(to right, #ffffff, #f0f0f0);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.5s ease-in-out;
  max-width: 800px;
  margin: 40px auto;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.edit-course:hover {
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

.el-form-item {
  margin-bottom: 20px;
}

.el-button {
  margin-right: 10px;
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
