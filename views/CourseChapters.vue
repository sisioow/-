<template>
  <div>
    <div class="tab-bar">
      <span class="tab animated-tab" :class="{ active: currentTab === 'course/introduce' }" @click="navigateTo('course/introduce')">课程基础设置</span>
      <span class="tab animated-tab" :class="{ active: currentTab === 'course/announcement' }" @click="navigateTo('course/announcement')">课程公告设置</span>
      <span class="tab active animated-tab" :class="{ active: currentTab === 'course/chapters' }" @click="navigateTo('course/chapters')">章节测试</span>
    </div>
    <div class="course-chapters">
      <h2>章节设置</h2>
      <el-form :model="form" label-width="120px">
        <el-form-item label="章节名称">
          <el-input v-model="form.chapterName"></el-input>
        </el-form-item>
        <el-form-item label="章节内容">
          <el-input type="textarea" v-model="form.chapterContent"></el-input>
        </el-form-item>
        <el-form-item label="课时名称">
          <el-input v-model="form.lessonName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">保存</el-button>
          <el-button @click="onCancel">取消</el-button>
        </el-form-item>
      </el-form>
      <el-divider></el-divider>
      <h2>已添加的章节</h2>
      <el-table :data="chapters" style="width: 100%">
        <el-table-column prop="chapterName" label="章节名称"></el-table-column>
        <el-table-column prop="chapterContent" label="章节内容"></el-table-column>
        <el-table-column prop="lessons" label="课时安排">
          <template v-slot:default="scope">
            <ul>
              <li v-for="lesson in scope.row.lessons" :key="lesson">{{ lesson }}</li>
            </ul>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CourseChapters',
  data() {
    return {
      form: {
        chapterName: '',
        chapterContent: '',
        lessonName: ''
      },
      chapters: []
    };
  },
  methods: {
    onSubmit() {
      if (this.form.chapterName.trim() && this.form.chapterContent.trim() && this.form.lessonName.trim()) {
        const chapter = this.chapters.find(ch => ch.chapterName === this.form.chapterName);
        if (chapter) {
          chapter.lessons.push(this.form.lessonName);
        } else {
          this.chapters.push({
            chapterName: this.form.chapterName,
            chapterContent: this.form.chapterContent,
            lessons: [this.form.lessonName]
          });
        }
        this.form.chapterName = '';
        this.form.chapterContent = '';
        this.form.lessonName = '';
        this.$message.success('章节设置已保存');
      } else {
        this.$message.error('章节名称、内容和课时名称不能为空');
      }
    },
    onCancel() {
      this.$router.push('/');
    },
    navigateTo(target) {
      this.currentTab = target;
      this.$router.push(`/${target}`);
    }
  },
  computed: {
    currentTab() {
      return this.$route.path;
    }
  }
};
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

.course-chapters {
  padding: 20px;
  background: linear-gradient(to right, #ffffff, #f0f0f0);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.5s ease-in-out;
  max-width: 800px;
  margin: 40px auto;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.course-chapters:hover {
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
