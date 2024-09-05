<template>
  <div class="resource-management">
    <el-card class="box-card">
      <h3>Resource Management</h3>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="Question Bank" name="questions">
          <QuestionBank />
        </el-tab-pane>
        <el-tab-pane label="Video Resources" name="videos">
          <VideoResources />
        </el-tab-pane>
        <el-tab-pane label="Exam Papers" name="exams">
          <ExamPapers />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import QuestionBank from '@/components/QuestionBank.vue';
import VideoResources from '@/components/VideoResources.vue';
import ExamPapers from '@/components/ExamPapers.vue';

export default {
  name: 'ResourceManagement',
  components: {
    QuestionBank,
    VideoResources,
    ExamPapers
  },
  data() {
    return {
      activeTab: 'questions'
    };
  }
};
</script>

<style scoped>
.resource-management {
  padding: 50px;
}
.box-card {
  max-width: 800px;
  margin: 0 auto;
}
</style>
