<template>
  <div class="course-settings">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="课程简介" name="introduction">
        <el-input type="textarea" v-model="form.courseIntro" placeholder="请输入课程简介"></el-input>
      </el-tab-pane>
      <el-tab-pane label="课程公告设置" name="announcements">
        <el-input v-model="form.courseAnnouncement" placeholder="请输入课程公告"></el-input>
      </el-tab-pane>
      <el-tab-pane label="开课时间设置" name="startDate">
        <el-date-picker v-model="form.courseStartDate" type="date" placeholder="请选择开课日期"></el-date-picker>
      </el-tab-pane>
      <el-tab-pane label="章节测试" name="chapters">
        <el-input v-model="form.courseChapters" placeholder="请输入章节测试信息"></el-input>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'CourseSettings',
  data() {
    return {
      activeTab: 'introduction',
      form: {
        courseIntro: '',
        courseAnnouncement: '',
        courseStartDate: '',
        courseChapters: ''
      }
    };
  },
  methods: {
    saveCourseSettings() {
      // 你的保存逻辑
      console.log('Course Settings Saved:', this.form);
    }
  }
};
</script>

<style scoped>
.course-settings {
  padding: 20px;
  background-color: #f9f9f9;
}
.el-tabs__header {
  background-color: #2196f3;
  color: #fff;
  padding: 10px;
  border-radius: 5px 5px 0 0;
}
.el-tab-pane {
  padding: 20px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 0 0 5px 5px;
}
</style>
