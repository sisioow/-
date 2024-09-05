<template>
  <div class="learning-statistics">

    <div class="content">
      <h2>学习数据统计</h2>
      <p class="sub-heading">学生视频学习相关数据隔天更新</p>
      <div class="filter-bar">
        <el-select v-model="selectedCourse" placeholder="请选择">
          <el-option v-for="course in courses" :key="course" :label="course" :value="course"></el-option>
        </el-select>
        <el-input v-model="searchInput" placeholder="输入学生姓名能精确进行搜索" class="search-input" />
        <el-button @click="exportData">导出数据</el-button>
      </div>
      <el-table :data="learningData" style="width: 100%">
        <el-table-column prop="studentInfo" label="学生信息" width="150"></el-table-column>
        <el-table-column prop="studentScore" label="学生分组" width="150"></el-table-column>
        <el-table-column prop="effectiveScore" label="有效成绩" width="150"></el-table-column>
        <el-table-column prop="videoWatchCount" label="视频观看个数" width="150"></el-table-column>
        <el-table-column prop="videoWatchFrequency" label="视频观看次数" width="150"></el-table-column>
        <el-table-column prop="videoWatchDuration" label="视频观看时长" width="150"></el-table-column>
        <el-table-column prop="discussionTopics" label="讨论区主题数" width="150"></el-table-column>
        <el-table-column prop="discussionComments" label="讨论区评论数" width="150"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LearningStatistics',
  data() {
    return {
      selectedCourse: '',
      searchInput: '',
      courses: ['课程1', '课程2', '课程3'],
      learningData: [
        { studentInfo: '刘刘刘', studentScore: '111', effectiveScore: '111', videoWatchCount: '111', videoWatchFrequency: '111', videoWatchDuration: '88', discussionTopics: '88', discussionComments: '88' },
        { studentInfo: '刘刘刘', studentScore: '111', effectiveScore: '111', videoWatchCount: '111', videoWatchFrequency: '111', videoWatchDuration: '88', discussionTopics: '88', discussionComments: '88' },
        { studentInfo: '刘刘刘', studentScore: '111', effectiveScore: '111', videoWatchCount: '111', videoWatchFrequency: '111', videoWatchDuration: '88', discussionTopics: '88', discussionComments: '88' },
        { studentInfo: '刘刘刘', studentScore: '111', effectiveScore: '111', videoWatchCount: '111', videoWatchFrequency: '111', videoWatchDuration: '88', discussionTopics: '88', discussionComments: '88' },
        { studentInfo: '刘刘刘', studentScore: '111', effectiveScore: '111', videoWatchCount: '111', videoWatchFrequency: '111', videoWatchDuration: '88', discussionTopics: '88', discussionComments: '88' }
      ]
    };
  },
  methods: {
    exportData() {
      console.log('Exporting data...');
    }
  }
};
</script>

<style scoped>
.learning-statistics {
  padding: 20px;
  background: #f5f7fa;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Arial', sans-serif;
}


.main-tabs {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 0 20px;
}

.content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.content h2 {
  font-size: 20px;
  margin-bottom: 10px;
}

.sub-heading {
  color: #666;
  font-size: 14px;
  margin-bottom: 20px;
}

.filter-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.el-select {
  width: 200px;
  margin-right: 20px;
}

.search-input {
  flex: 1;
  margin-right: 20px;
}

.el-button {
  width: 100px;
}

.el-table {
  margin-top: 20px;
}

.el-table th, .el-table td {
  text-align: center;
}
</style>
