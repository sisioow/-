<template>
  <div class="learning-statistics">
    <div class="content">
      <h2>学习数据统计</h2>
      <p class="sub-heading">学生视频学习相关数据隔天更新</p>
      <div class="filter-bar">
        <el-select v-model="selectedCourse" placeholder="请选择" @change="filterLearningData">
          <el-option v-for="course in courses" :key="course.course" :label="course.course" :value="course.course"></el-option>
        </el-select>
        <el-input v-model="searchInput" placeholder="输入学生姓名能精确进行搜索" class="search-input" @input="filterLearningData"/>
        <el-button @click="exportData">导出数据</el-button>
      </div>
      <el-table :data="filteredLearningData" style="width: 100%">
        <el-table-column prop="studentName" label="学生信息" width="150"></el-table-column>
        <el-table-column prop="effectiveScore" label="有效成绩" width="150"></el-table-column>
        <el-table-column prop="videoWatchCount" label="视频观看个数" width="150"></el-table-column>
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
      courses: [
        { course: '课程1' },
        { course: '课程2' },
        { course: '课程3' }
      ],
      learningData: [
        {
          course: '课程1',
          studentNumber: '202101',
          studentName: '张三',
          effectiveScore: 90,
          videoWatchCount: 10,
          videoWatchDuration: 300,
          discussionTopics: 2,
          discussionComments: 5
        },
        {
          course: '课程1',
          studentNumber: '202102',
          studentName: '李四',
          effectiveScore: 85,
          videoWatchCount: 8,
          videoWatchDuration: 240,
          discussionTopics: 1,
          discussionComments: 3
        },
        {
          course: '课程2',
          studentNumber: '202103',
          studentName: '王五',
          effectiveScore: 92,
          videoWatchCount: 12,
          videoWatchDuration: 360,
          discussionTopics: 3,
          discussionComments: 6
        },
        {
          course: '课程2',
          studentNumber: '202104',
          studentName: '赵六',
          effectiveScore: 88,
          videoWatchCount: 9,
          videoWatchDuration: 270,
          discussionTopics: 2,
          discussionComments: 4
        },
        {
          course: '课程3',
          studentNumber: '202105',
          studentName: '孙七',
          effectiveScore: 95,
          videoWatchCount: 14,
          videoWatchDuration: 420,
          discussionTopics: 4,
          discussionComments: 7
        }
      ],
      filteredLearningData: []
    };
  },
  methods: {
    filterLearningData() {
      this.filteredLearningData = this.learningData.filter(item => {
        const matchesCourse = this.selectedCourse ? item.course === this.selectedCourse : true;
        const matchesSearch = this.searchInput ? item.studentName.includes(this.searchInput) : true;
        return matchesCourse && matchesSearch;
      });
    },
    exportData() {
      const data = this.filteredLearningData.map(item => ({
        '学生信息': `${item.studentNumber} - ${item.studentName}`,
        '有效成绩': item.effectiveScore,
        '视频观看个数': item.videoWatchCount,
        '视频观看时长': item.videoWatchDuration,
        '讨论区主题数': item.discussionTopics,
        '讨论区评论数': item.discussionComments
      }));

      const header = Object.keys(data[0]);
      const csv = [
        header.join(','), // header row first
        ...data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
      ].join('\r\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'learning_data.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  },
  mounted() {
    this.filterLearningData(); // 初始化时过滤数据
  }
};

function replacer(key, value) {
  if (value === null) return '';
  return value;
}
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
