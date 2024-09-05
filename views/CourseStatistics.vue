<template>
  <div class="course-statistics">
    <div class="tabs-container">
      <el-tabs v-model="activeTab" class="main-tabs" @tab-click="setActiveTab">
        <el-tab-pane label="课程任务" name="courseTasks"></el-tab-pane>
        <el-tab-pane label="课时/测验/作业" name="courseSchedule"></el-tab-pane>
        <el-tab-pane label="讨论区" name="discussionArea"></el-tab-pane>
        <el-tab-pane label="成绩/考核" name="gradesEvaluation"></el-tab-pane>
      </el-tabs>
    </div>

    <div class="content-container">
      <div v-if="activeTab === 'courseTasks'">
        <el-table :data="[courseStats]" style="width: 100%">
          <el-table-column prop="courseName" label="课程名称"></el-table-column>
          <el-table-column prop="instructor" label="课程负责人"></el-table-column>
          <el-table-column prop="startDate" label="开始时间"></el-table-column>
          <el-table-column prop="endDate" label="结束时间"></el-table-column>
          <el-table-column prop="enrollment" label="选课人数"></el-table-column>
        </el-table>

        <div class="course-enrollment-title">
          <h3>课程人数</h3>
          <p></p>
          <div class="divider"></div>
        </div>

        <div class="chart-container" v-if="chartData.labels.length">
          <el-tabs v-model="activeChartTab" class="chart-tabs">
            <el-tab-pane label="选课人数" name="enrollment">
              <base-line-chart :data="chartData" class="eighty-percent-chart"></base-line-chart>
            </el-tab-pane>
          </el-tabs>
        </div>

        <div class="chart-container" v-if="overallStudyData.labels.length">
          <h3>整体学习人数</h3>
          <el-tabs v-model="activeOverallChartTab" class="chart-tabs">
            <el-tab-pane label="视频观看人数" name="videoViewers">
              <base-bar-chart :data="overallStudyData" class="eighty-percent-chart"></base-bar-chart>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>

      <div v-else-if="activeTab === 'courseSchedule'">
        <div class="weight-settings">
          <h3>权重设置</h3>
          <div class="input-container">
            <el-input placeholder="测试：" v-model="testWeight" class="input-field"></el-input>
            <el-input placeholder="作业：" v-model="homeworkWeight" class="input-field"></el-input>
            <el-button type="primary" @click="saveWeights">确定</el-button>
          </div>
        </div>

        <div class="chart-container">
          <h3>测试成绩</h3>
          <div class="chart-header">
            <span>测试成绩柱状图</span>
            <el-select v-model="selectedTest" placeholder="课程章节" class="short-select" @change="updateTestScores">
              <el-option
                v-for="item in testOptions"
                :key="item.unit_id"
                :label="item.unit_title"
                :value="item.unit_id">
              </el-option>
            </el-select>
          </div>
          <base-bar-chart :data="testScoresData" class="eighty-percent-chart"></base-bar-chart>
        </div>

        <div class="chart-container">
          <h3>作业成绩</h3>
          <div class="chart-header">
            <span>作业成绩柱状图</span>
            <el-select v-model="selectedHomework" placeholder="课程章节" class="short-select" @change="updateHomeworkScores">
              <el-option
                v-for="item in homeworkOptions"
                :key="item.unit_id"
                :label="item.unit_title"
                :value="item.unit_id">
              </el-option>
            </el-select>
          </div>
          <base-bar-chart :data="homeworkScoresData" class="eighty-percent-chart"></base-bar-chart>
        </div>
      </div>

      <div v-else-if="activeTab === 'discussionArea'">
        <div class="discussion-header">
          <h3>活跃用户列表</h3>
          <div class="search-container">
            <el-input v-model="searchQuery" placeholder="输入学生姓名或昵称等进行搜索" prefix-icon="el-icon-search" class="search-input"></el-input>
            <el-button @click="searchData">搜索</el-button>
          </div>
        </div>
        <el-table :data="filteredDiscussionStats" style="width: 100%">
          <el-table-column prop="studentId" label="学号"></el-table-column>
          <el-table-column prop="name" label="姓名"></el-table-column>
          <el-table-column prop="nickname" label="昵称"></el-table-column>
          <el-table-column prop="replyCount" label="回复帖子个数"></el-table-column>
          <el-table-column prop="replyReceivedCount" label="被回复次数"></el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="totalUsers"
            :page-size="pageSize"
            @current-change="handlePageChange">
          </el-pagination>
        </div>
      </div>

      <div v-else-if="activeTab === 'gradesEvaluation'">
        <div class="grades-header">
          <h3>成绩分布</h3>
          <span>最高分: {{ maxScore }}</span> 
          <span>平均分: {{ avgScore }}</span> 
          <span>参加人数: {{ participantCount }}</span>
          <el-button @click="exportGradesData">导出数据</el-button>
        </div>
        <div class="chart-container">
          <base-line-chart :data="gradesDistributionData" class="eighty-percent-chart"></base-line-chart>
        </div>
        <div class="chart-container">
          <h3>考试通过情况</h3>
          <base-pie-chart :data="examPassData" class="eighty-percent-chart"></base-pie-chart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseLineChart from '@/components/BaseLineChart.vue';
import BaseBarChart from '@/components/BaseBarChart.vue';
import BasePieChart from '@/components/BasePieChart.vue';
import axios from '@/api/axios'; // 确保导入 axios 实例

axios.defaults.timeout = 10000; // 设置全局默认超时时间为10秒

export default {
  name: 'CourseStatistics',
  components: {
    BaseLineChart,
    BaseBarChart,
    BasePieChart
  },
  data() {
    return {
      activeTab: 'courseTasks',
      activeChartTab: 'enrollment',
      activeOverallChartTab: 'videoViewers',
      courseStats: {},
      scheduleStats: [],
      chartData: { labels: [], datasets: [] }, // 初始化为空数组
      overallStudyData: { labels: [], datasets: [] }, // 初始化为空数组
      discussionStats: [
        { studentId: '202201', name: '张三', nickname: 'ZhangSan', replyCount: 10, replyReceivedCount: 5 },
        { studentId: '202202', name: '李四', nickname: 'LiSi', replyCount: 8, replyReceivedCount: 6 },
        { studentId: '202203', name: '王五', nickname: 'WangWu', replyCount: 12, replyReceivedCount: 7 },
        { studentId: '202204', name: '老六', nickname: 'LaoLiu', replyCount: 14, replyReceivedCount: 8 },
        { studentId: '202205', name: '蔡徐坤', nickname: 'ikun', replyCount: 16, replyReceivedCount: 9 },
        { studentId: '202206', name: '科比', nickname: 'Kobe', replyCount: 18, replyReceivedCount: 10 },
        { studentId: '202207', name: '丁真', nickname: 'Smoke', replyCount: 20, replyReceivedCount: 11 },
        // 添加更多测试数据
      ],
      filteredDiscussionStats: [],
      totalUsers: 3,
      pageSize: 10,
      gradesDistributionData: {
        labels: ['0-59', '60-69', '70-79', '80-89', '90-100'],
        datasets: [
          {
            label: '成绩分布',
            backgroundColor: '#42A5F5',
            data: [5, 10, 20, 30, 15]
          }
        ]
      },
      examPassData: {
        labels: ['通过', '未通过'],
        datasets: [
          {
            label: '考试通过情况',
            backgroundColor: ['#66BB6A', '#EF5350'],
            data: [80, 20]
          }
        ]
      },
      searchQuery: '',
      testWeight: '',
      homeworkWeight: '',
      testScoresData: {
        labels: ['0-59', '60-69', '70-79', '80-89', '90-100'],
        datasets: [
          {
            label: '测验成绩',
            backgroundColor: '#42A5F5',
            data: [5, 10, 20, 25, 10]
          }
        ]
      },
      homeworkScoresData: {
        labels: ['0-59', '60-69', '70-79', '80-89', '90-100'],
        datasets: [
          {
            label: '作业成绩',
            backgroundColor: '#42A5F5',
            data: [3, 8, 15, 22, 17]
          }
        ]
      },
      selectedTest: '',
      selectedHomework: '',
      testOptions: [
        { unit_id: '1', unit_title: '第一章' },
        { unit_id: '2', unit_title: '第二章' },
        { unit_id: '3', unit_title: '第三章' }
      ],
      homeworkOptions: [
        { unit_id: '1', unit_title: '第一章' },
        { unit_id: '2', unit_title: '第二章' },
        { unit_id: '3', unit_title: '第三章' }
      ],
      testScoresByUnit: {
        '1': { labels: ['0-59', '60-69', '70-79', '80-89', '90-100'], data: [5, 10, 20, 25, 10] },
        '2': { labels: ['0-59', '60-69', '70-79', '80-89', '90-100'], data: [6, 11, 15, 20, 8] },
        '3': { labels: ['0-59', '60-69', '70-79', '80-89', '90-100'], data: [7, 12, 10, 15, 5] }
      },
      homeworkScoresByUnit: {
        '1': { labels: ['0-59', '60-69', '70-79', '80-89', '90-100'], data: [3, 8, 15, 22, 17] },
        '2': { labels: ['0-59', '60-69', '70-79', '80-89', '90-100'], data: [4, 9, 12, 18, 10] },
        '3': { labels: ['0-59', '60-69', '70-79', '80-89', '90-100'], data: [5, 10, 20, 25, 12] }
      },
      maxScore: 100,
      avgScore: 75,
      participantCount: 50,
      semester_id: 1 // Assuming semester_id is known and fixed for now
    };
  },
  methods: {
    setActiveTab(tab) {
      this.activeTab = tab.name;
      this.fetchData();
    },
    fetchData() {
      this.fetchCourseStats();
      this.fetchUnits();
      this.fetchDiscussionStats();
      this.fetchGradesStats();
    },
    fetchCourseStats() {
      axios.get('/course/stats', {
        params: {
          semester_id: this.semester_id
        }
      })
      .then(response => {
        if (response.data && response.data.data) {
          this.courseStats = response.data.data;
        } else {
          console.error('Unexpected response format:', response.data);
          this.courseStats = {};
        }
      })
      .catch(error => {
        console.error(error);
        this.$message.error('获取课程任务数据失败');
      });

      axios.get('/course/enrollment-chart', {
        params: {
          semester_id: this.semester_id
        }
      })
      .then(response => {
        if (response.data && response.data.data) {
          const { labels, data } = response.data.data;
          this.chartData = {
            labels: labels,
            datasets: [{ data: data }]
          };
        } else {
          console.error('Unexpected response format for enrollment chart:', response.data);
          this.chartData = { labels: [], datasets: [] };
        }
      })
      .catch(error => {
        console.error(error);
        this.$message.error('获取选课人数图表数据失败');
      });

      axios.get('/course/video-viewers-chart', {
        params: {
          semester_id: this.semester_id
        }
      })
      .then(response => {
        if (response.data && response.data.data) {
          const { labels, data } = response.data.data;
          this.overallStudyData = {
            labels: labels,
            datasets: [{ data: data }]
          };
        } else {
          console.error('Unexpected response format for video viewers chart:', response.data);
          this.overallStudyData = { labels: [], datasets: [] };
        }
      })
      .catch(error => {
        console.error(error);
        this.$message.error('获取视频观看人数图表数据失败');
      });
    },
    fetchUnits() {
      axios.get('/course/getUnits', {
        params: {
          semester_id: this.semester_id
        }
      })
      .then(response => {
        if (response.data && Array.isArray(response.data)) {
          this.testOptions = response.data.map(item => ({ unit_id: item.unit_id, unit_title: item.unit_title }));
          this.homeworkOptions = response.data.map(item => ({ unit_id: item.unit_id, unit_title: item.unit_title }));
        } else {
          console.error('Expected an array but got:', response.data);
        }
      })
      .catch(error => {
        console.error(error);
      });
    },
    updateTestScores(unitId) {
      if (unitId) {
        const testScores = this.testScoresByUnit[unitId];
        this.testScoresData = {
          labels: testScores.labels,
          datasets: [
            {
              label: '测验成绩',
              backgroundColor: '#42A5F5',
              data: testScores.data
            }
          ]
        };
      }
    },
    updateHomeworkScores(unitId) {
      if (unitId) {
        const homeworkScores = this.homeworkScoresByUnit[unitId];
        this.homeworkScoresData = {
          labels: homeworkScores.labels,
          datasets: [
            {
              label: '作业成绩',
              backgroundColor: '#42A5F5',
              data: homeworkScores.data
            }
          ]
        };
      }
    },
    fetchDiscussionStats() {
      this.filteredDiscussionStats = this.discussionStats;
    },
    fetchGradesStats() {
      // 使用本地测试数据
      this.gradesDistributionData = {
        labels: ['0-59', '60-69', '70-79', '80-89', '90-100'],
        datasets: [
          {
            label: '成绩分布',
            backgroundColor: '#42A5F5',
            data: [5, 10, 20, 30, 15]
          }
        ]
      };
      this.examPassData = {
        labels: ['通过', '未通过'],
        datasets: [
          {
            label: '考试通过情况',
            backgroundColor: ['#66BB6A', '#EF5350'],
            data: [80, 20]
          }
        ]
      };
      this.maxScore = 100;
      this.avgScore = 75;
      this.participantCount = 50;
    },
    exportGradesData() {
      const csvData = [];
      csvData.push(['分数范围', '人数']);
      this.gradesDistributionData.labels.forEach((label, index) => {
        csvData.push([label, this.gradesDistributionData.datasets[0].data[index]]);
      });

      let csvContent = "data:text/csv;charset=utf-8,";

      csvData.forEach(row => {
        csvContent += row.join(",") + "\n";
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "grades_distribution.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    handlePageChange() {
      this.fetchDiscussionStats();
    },
    searchData() {
      const query = this.searchQuery.toLowerCase();
      this.filteredDiscussionStats = this.discussionStats.filter(student =>
        student.studentId.includes(query) ||
        student.name.includes(query) ||
        student.nickname.toLowerCase().includes(query)
      );
    },
    saveWeights() {
      axios.post('/course/permissions', {
        semesterId: this.semester_id,
        testPermission: this.testWeight,
        homeworkPermission: this.homeworkWeight
      })
      .then(() => {
        this.$message.success('保存权重设置成功');
      })
      .catch(error => {
        console.error(error);
        this.$message.error('保存权重设置失败');
      });
    }
  },
  watch: {
    selectedTest(newVal) {
      this.updateTestScores(newVal);
    },
    selectedHomework(newVal) {
      this.updateHomeworkScores(newVal);
    }
  },
  mounted() {
    this.selectedTest = this.testOptions.length ? this.testOptions[0].unit_id : '';
    this.selectedHomework = this.homeworkOptions.length ? this.homeworkOptions[0].unit_id : '';
    this.updateTestScores(this.selectedTest);
    this.updateHomeworkScores(this.selectedHomework);
    this.fetchData(); // 确保在挂载时调用 fetchData
  }
};
</script>

<style scoped>
.course-statistics {
  padding: 20px;
  background: #f5f7fa;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Arial', sans-serif;
}

.tabs-container {
  margin-bottom: 20px;
}

.main-tabs {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 0 20px;
}

.content-container {
  margin-bottom: 20px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.course-enrollment-title {
  text-align: left;
  margin: 30px 0;
}

.course-enrollment-title h3 {
  font-size: 20px;
  color: #333;
  margin: 0;
}

.course-enrollment-title p {
  font-size: 14px;
  color: #666;
  margin: 10px 0 20px 0;
}

.divider {
  height: 2px;
  background: #e8e8e8;
  margin: 0 auto;
  width: 100%;
}

.chart-container {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.chart-tabs .el-tab-pane {
  padding: 20px;
}

.eighty-percent-chart {
  width: 80%;
  height: auto;
  margin: 0 auto;
}

.short-select {
  width: 60%;
  max-width: 200px;
}

.discussion-header, .grades-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-container {
  display: flex;
  align-items: center;
}

.search-input {
  border-radius: 20px;
  margin-right: 10px;
}

.export-button {
  margin-left: 10px;
}

.input-container {
  display: flex; 
  align-items: center;
  margin-bottom: 20px;
}

.input-field {
  margin-right: 10px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.pagination {
  display: flex; 
  justify-content: center;
  margin-top: 20px;
}
</style>
