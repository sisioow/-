<template>
  <!-- 导航栏 -->
  <div class="tab-bar">
    <span class="tab" :class="{ 'active': currentTab === 'Tab-all' }" @click="changeTab('Tab-all')"
      data-target="Tab-all">全部</span>
    <span class="tab" :class="{ 'active': currentTab === 'Question-bank' }" @click="changeTab('Question-bank')"
      data-target="Question-bank">题库</span>
    <span class="tab" :class="{ 'active': currentTab === 'video' }" @click="changeTab('video')"
      data-target="video">教学视频资源</span>
    <span class="tab" :class="{ 'active': currentTab === 'data' }" @click="changeTab('data')"
      data-target="data">资料库</span>
  </div>

  <div class="course-intro">
    <div class="settings">
      <div v-if="currentTab === 'Tab-all' || currentTab === 'Question-bank'">
        <!-- 题库 -->
        <div class="resource-test-settings">
          <h2>题库</h2>
          <el-button type="primary" plain @click="showDialog">添加单选题</el-button>
          <el-button type="primary" plain @click="showMultiDialog">添加多选题</el-button>
          <el-button type="primary" plain @click="showJudgmentDialog">添加判断题</el-button>

          <el-dialog title="添加单题目" v-model="dialogVisible" :append-to-body="true">
            <el-form :model="form">
              <el-form-item label="题目">
                <el-input v-model="form.title"></el-input>
              </el-form-item>
              <el-form-item label="选项A">
                <el-input v-model="form.a_option"></el-input>
              </el-form-item>
              <el-form-item label="选项B">
                <el-input v-model="form.b_option"></el-input>
              </el-form-item>
              <el-form-item label="选项C">
                <el-input v-model="form.c_option"></el-input>
              </el-form-item>
              <el-form-item label="选项D">
                <el-input v-model="form.d_option"></el-input>
              </el-form-item>
              <el-form-item label="正确答案">
                <el-radio-group v-model="form.right_ans">
                  <el-radio label="A">A</el-radio>
                  <el-radio label="B">B</el-radio>
                  <el-radio label="C">C</el-radio>
                  <el-radio label="D">D</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="分值">
                <el-input v-model="form.max_score" type="number"></el-input>
              </el-form-item>
            </el-form>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitForm">提交</el-button>
              </span>
            </template>
          </el-dialog>

          <el-dialog title="添加多选题" v-model="multiDialogVisible" :append-to-body="true">
            <el-form :model="multiForm">
              <el-form-item label="题目">
                <el-input v-model="multiForm.title"></el-input>
              </el-form-item>
              <el-form-item label="选项A">
                <el-input v-model="multiForm.a_option"></el-input>
              </el-form-item>
              <el-form-item label="选项B">
                <el-input v-model="multiForm.b_option"></el-input>
              </el-form-item>
              <el-form-item label="选项C">
                <el-input v-model="multiForm.c_option"></el-input>
              </el-form-item>
              <el-form-item label="选项D">
                <el-input v-model="multiForm.d_option"></el-input>
              </el-form-item>
              <el-form-item label="正确答案">
                <el-checkbox-group v-model="multiForm.right_ans">
                  <el-checkbox label="A">A</el-checkbox>
                  <el-checkbox label="B">B</el-checkbox>
                  <el-checkbox label="C">C</el-checkbox>
                  <el-checkbox label="D">D</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="分值">
                <el-input v-model="multiForm.max_score" type="number"></el-input>
              </el-form-item>
            </el-form>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="multiDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitMultiForm">提交</el-button>
              </span>
            </template>
          </el-dialog>

          <el-dialog title="添加判断题" v-model="judgmentDialogVisible" :append-to-body="true">
            <el-form :model="judgmentForm">
              <el-form-item label="题目">
                <el-input v-model="judgmentForm.title"></el-input>
              </el-form-item>
              <el-form-item label="正确答案">
                <el-radio-group v-model="judgmentForm.right_ans">
                  <el-radio label="true">正确</el-radio>
                  <el-radio label="false">错误</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="分值">
                <el-input v-model="judgmentForm.max_score" type="number"></el-input>
              </el-form-item>
            </el-form>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="judgmentDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitJudgmentForm">提交</el-button>
              </span>
            </template>
          </el-dialog>

          <div class="tabs-table-container">
            <el-tabs v-model="activeTab" class="custom-tabs" style="margin-top:15px;">
              <el-tab-pane label="全部" name="all">
                <el-table :data="paginatedQsData" ref="singleTable" @selection-change="handleAllSelectionChange"
                  :height="tableHeight" :row-key="row => row.id" :show-header="false">
                  <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
                  <el-table-column prop="title" label="题目">
                    <template v-slot:default="scope">
                      {{ scope.row.title }}</template>
                  </el-table-column>
                  <el-table-column width="140">
                    <template #default="scope">
                      <el-button @click="editCourse(scope.row)" type="text">编辑</el-button>
                      <el-button @click="deleteCourse(scope.row)" type="text">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>

                <div class="qs">
                  <div class="btn">
                    <el-button type="text" @click="selectAll">全部选择</el-button>
                  </div>
                  <div class="page-info">
                    共 {{ total }} 条数据
                  </div>
                  <el-pagination style="margin-left: auto;" layout="prev, pager, next" :total="total"
                    :page-size="page_size" v-model:current-page="currentPage" @current-change="handleAllCurrentChange">
                  </el-pagination>
                </div>
              </el-tab-pane>

              <el-tab-pane label="单选题" name="single">
                <el-table :data="paginatedQsSingleData" ref="singleTable"
                  @selection-change="handleSingleSelectionChange" :height="tableHeight" :row-key="row => row.id"
                  :show-header="false">
                  <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
                  <el-table-column prop="title" label="题目">
                    <template v-slot:default="scope">
                      {{ scope.row.title }}</template>
                  </el-table-column>
                  <el-table-column width="140">
                    <template #default="scope">
                      <el-button @click="editCourse(scope.row)" type="text">编辑</el-button>
                      <el-button @click="deleteCourse(scope.row)" type="text">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>

                <div class="qs">
                  <div class="btn">
                    <el-button type="text" @click="selectAll">全部选择</el-button>
                  </div>
                  <div class="page-info">
                    共 {{ SingleTotal }} 条数据
                  </div>
                  <el-pagination style="margin-left: auto;" layout="prev, pager, next" :total="SingleTotal"
                    :page-size="page_size" v-model:current-page="SinglePage"
                    @current-change="handleSingleCurrentChange">
                  </el-pagination>
                </div>

              </el-tab-pane>

              <el-tab-pane label="多选题" name="multiple">
                <el-table :show-header="false" :data="paginatedQsMultipleData"
                  @selection-change="handleMultipleSelectionChange" :height="tableHeight" :row-key="row => row.id">
                  <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
                  <el-table-column prop="title" label="题目">
                    <template v-slot:default="scope">
                      {{ scope.row.title }}</template>
                  </el-table-column>
                  <el-table-column width="140">
                    <template #default="scope">
                      <el-button @click="editCourse(scope.row)" type="text">编辑</el-button>
                      <el-button @click="deleteCourse(scope.row)" type="text">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="qs">
                  <div class="btn">
                    <el-button type="text" @click="selectAll">全部选择</el-button>
                  </div>
                  <div class="page-info">
                    共 {{ multipleTotal }} 条数据
                  </div>
                  <el-pagination style="margin-left: auto;" layout="prev, pager, next" :total="multipleTotal"
                    :page-size="page_size" v-model:current-page="MultiplePage"
                    @current-change="handleMultipleCurrentChange">
                  </el-pagination>
                </div>

              </el-tab-pane>

              <el-tab-pane label="判断题" name="judgment">
                <el-table :show-header="false" :data="paginatedQsJudgmentData"
                  @selection-change="handleJudgmentSelectionChange" :height="tableHeight" :row-key="row => row.id">
                  <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
                  <el-table-column prop="title" label="题目">
                    <template v-slot:default="scope">
                      {{ scope.row.title }}</template>
                  </el-table-column>
                  <el-table-column width="140">
                    <template #default="scope">
                      <el-button @click="editCourse(scope.row)" type="text">编辑</el-button>
                      <el-button @click="deleteCourse(scope.row)" type="text">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="qs">
                  <div class="btn">
                    <el-button type="text" @click="selectAll">全部选择</el-button>
                  </div>
                  <div class="page-info">
                    共 {{ JudgmentTotal }} 条数据
                  </div>
                  <el-pagination style="margin-left: auto;" layout="prev, pager, next" :total="JudgmentTotal"
                    :page-size="page_size" v-model:current-page="JudgmentPage"
                    @current-change="handleJudgmentCurrentChange">
                  </el-pagination>
                </div>

              </el-tab-pane>

            </el-tabs>

          </div>
        </div>
      </div>

      <div v-if="currentTab === 'Tab-all' || currentTab === 'video'">
        <!-- 教学视频资源 -->
        <div class="resource-video-settings">
          <h2>教学视频资源</h2>
          <div class="header-setting-background">
            <div class="header-setting">
              <span>视频列表</span>
              <el-button type="primary" plain class="header-setting-el-button"
                @click="handleUploadVideo">上传视频</el-button>
            </div>
            <el-divider style="margin-bottom: 0;margin-top: 5px;"></el-divider>
            <el-table ref="CourseIntro" :data="paginatedVideoData" highlight-current-row
              @selection-change="handleCurrentChange" style="width: 100%" max-height="245" :show-header="false">
              <el-table-column type="index" label="序号" width="60">
                <template v-slot:default="scope">
                  {{ scope.row.index }}
                </template>
              </el-table-column>
              <el-table-column prop="title" label="视频列表" width="450">
                <template v-slot:default="scope">
                  {{ scope.row.title }}</template>
              </el-table-column>
              <el-table-column prop="date" width="200" align="right">
                <template v-slot:default="scope">{{ scope.row.date }}</template>
              </el-table-column>
              <el-table-column width="140">
                <template #default="scope">
                  <el-button @click="editVideo(scope.row)" type="text">编辑</el-button>
                  <el-button @click="deleteVideo(scope.row)" type="text">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <!-- 分页 -->
            <div class="mt15">
              <div class="page-info-down">
                共 {{ videoTotal }} 条数据
              </div>
              <div class="pagination">

                <el-pagination style="margin-left: auto;" layout="prev, pager, next" :total="videoTotal"
                  :page-size="page_size" v-model:current-page="videoPage" @current-change="handleCurrentChange">
                </el-pagination>
              </div>
            </div>

          </div>

        </div>

      </div>

      <div v-if="currentTab === 'Tab-all' || currentTab === 'data'">
        <!--        资料库        -->
        <div class="resource-data-settings">
          <h2>资料库</h2>
          <div class="header-setting-background">
            <div class="header-setting headerdata">
              <span>资料列表</span>
              <el-button type="primary" plain class="header-setting-el-button"
                @click="handleUploadData">上传资料</el-button>
              <div class="classification">
                <el-button plain class="header-setting-el-button classification-button"
                  :class="{ 'active-button': activeButton === 'all' }" type="primary"
                  @click="updateTable('all')">所有文件</el-button>
                <el-button plain class="header-setting-el-button classification-button"
                  :class="{ 'active-button': activeButton === 'PPT' }" type="primary"
                  @click="updateTable('PPT')">PPT幻灯片</el-button>
                <el-button plain class="header-setting-el-button classification-button"
                  :class="{ 'active-button': activeButton === 'Word' }" type="primary"
                  @click="updateTable('Word')">Word文档</el-button>
                <el-button plain class="header-setting-el-button classification-button"
                  :class="{ 'active-button': activeButton === '图片' }" type="primary"
                  @click="updateTable('图片')">图片</el-button>
                <el-button plain class="header-setting-el-button classification-button"
                  :class="{ 'active-button': activeButton === '其它' }" type="primary"
                  @click="updateTable('其它')">其它</el-button>
                <div class="search-data">
                  <el-input class="search-input" v-model="searchKeyword" placeholder="请输入搜索关键字"></el-input>
                  <el-button plain class="header-setting-el-button " :class="{ 'active-button': activeButton === '搜索' }"
                    type="primary" @click="searchData">搜索</el-button>
                </div>
              </div>
            </div>
            <el-divider style="margin-bottom: 0;margin-top: 5px;"></el-divider>
            <el-table ref="CourseIntro" :data="dataPage" highlight-current-row style="width: 100%" :max-height="none">
              <el-table-column label="序号" width="60" align="center">
                <template v-slot:default="scope">
                  {{ scope.$index + 1 + (page_size * (currentDataPageNum - 1)) }}
                </template>
              </el-table-column>
              <el-table-column prop="resource_name" label="资料名称" width="400" align="left">
                <template v-slot:default="scope">
                  {{ scope.row.resource_name }}
                </template>
              </el-table-column>
              <el-table-column label="文件类型" width="120" align="center">
                <template v-slot:default="scope">
                  {{ getFileType(scope.row.resource_name) }}
                </template>
              </el-table-column>
              <el-table-column prop="resource_id" label="资源ID" width="80" align="center">
                <template v-slot:default="scope">{{ scope.row.resource_id }}</template>
              </el-table-column>
              <el-table-column prop="update_time" label="更新时间" width="200" align="center">
                <template v-slot:default="scope">{{ scope.row.update_time }}</template>
              </el-table-column>
              <el-table-column label="操作" width="140" align="center">
                <template #default="scope">
                  <el-button @click="editFile(scope.row)" type="text">编辑</el-button>
                  <el-button @click="deleteFile(scope.row)" type="text">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="mt15" style="display: flex; align-items: center;">
              <div class="page-info-down">
                共 {{ dataTotal }} 条数据
              </div>
              <el-pagination style="margin-left: auto;" layout="prev, pager, next" :total="dataTotal"
                :page-size="page_size" v-model:current-page="dataPage" @current-change="handleDataCurrentChange">
              </el-pagination>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>

</template>

<script>
import axios from 'axios'; // 引入 Axios 库
// import { ElMessageBox } from 'element-plus'
// import { ElMessage} from 'element-plus'

export default {
  name: 'CourseIntro',
  data() {
    return {
      dialogVisible: false,
      multiDialogVisible: false,
      judgmentDialogVisible: false,
      // 单选表格弹窗
      form: {
        max_score: 0,
        title: '',
        a_option: '',
        b_option: '',
        c_option: '',
        d_option: '',
        right_ans: ''

      },
      // 多选题弹窗
      multiForm: {
        max_score: 0,
        title: '',
        a_option: '',
        b_option: '',
        c_option: '',
        d_option: '',
        right_ans: []

      },
      // 判断题弹窗
      judgmentForm: {
        max_score: 0,
        title: '',
        right_ans: ''
      },
      currentTab: 'Tab-all', // 初始选中的选项卡，默认为 'all'  
      tableAll: [], // 所有的数据
      AllChoiceData: [],//所有题目
      singleChoiceData: [], // 单选题数据
      multipleChoiceData: [], // 多选题数据
      JudgmentChoiceData: [], // 判断题数据
      selectList: [], // 选中的数据
      page: 1,
      totalSingle: 0,
      singlePage: 1, // 单选题当前页
      multiplePage: 1, // 多选题当前页
      page_size: 5,
      AllTotal: 0,
      total: 0,
      singleTotal: 0, // 单选题总数
      multipleTotal: 0, // 多选题总数
      JudgmentTotal: 0, // 判断题总数
      activeTab: 'all', // 默认激活的选项卡
      videoData: [], // 用于存放视频表格数据
      paginatedVideoData: [], // 当前页显示的视频数据
      videoTotal: 0, // 总数据条数，用于分页
      videoPage: 1, // 当前页数，默认第一页
      currentPage: 1,   // 当前页数
      paginatedQsData: [],// 当前页显示的题库数据
      SinglePage: 1,   // 当前单选页数
      MultiplePage: 1,   // 当前多选页数
      JudgmentPage: 1,// 当前判断页数

      dataAll: [],  // 资料库接收数据
      dataPage: [],  // 资料库当前页的数据
      currentDataPageNum: 1,// 当前资料库页码
      filteredData: [],  // 资料库页面相关
      activeButton: 'all',  // 资料库分类标签
      searchKeyword: '',  // 资料库搜索词
      dataTotal: 0, // 总数据条数，用于分页
    }
  },

  computed: {
    tableHeight() {
      return '245px'; // 表格高度
    },
  },

  methods: {
    // 导航栏更改
    changeTab(tab) {
      this.currentTab = tab; // 更新选项卡状态
    },
    // 添加单选题弹框
    showDialog() {
      this.dialogVisible = true;
    },
    // 添加多选题题弹框
    showMultiDialog() {
      this.multiDialogVisible = true;
    },
    // 添加判断题弹框
    showJudgmentDialog() {
      this.judgmentDialogVisible = true;
    },
    // 单选题添加提交按钮
    submitForm() {
      this.form.qs_type = 'only_sel';
      axios.post('http://10.60.60.179:8080/QSSelect/setQSSelect', this.form)
        .then(() => {
          this.$message.success('题目添加成功');
          this.dialogVisible = false;
          this.resetForm();
          this.fetchAllChoiceData();
        })
        .catch((error) => {
          console.error(error);
          this.$message.error('题目添加失败');
        });
    },
    // 多选题添加提交按钮
    submitMultiForm() {
      // 将 right_ans 数组转换为字符串
      const postData = {
        ...this.multiForm,
        right_ans: this.multiForm.right_ans.join(''),
        qs_type: 'many_sel',
      };

      axios.post('http://10.60.60.179:8080/QSSelect/setQSSelect', postData)
        .then(() => {
          this.$message.success('多选题添加成功');
          this.multiDialogVisible = false;
          this.resetMultiForm();
          this.fetchMultipleChoiceData();
        })
        .catch((error) => {
          console.error(error);
          this.$message.error('多选题添加失败');
        });
    },

    // 判断题添加提交按钮
    submitJudgmentForm() {
      const postData = {
        ...this.judgmentForm,
        right_ans: this.judgmentForm.right_ans === 'true' ? '正确' : '错误'
      };

      axios.post('http://10.60.60.179:8080/QSSelect/setQSSelect', postData)
        .then(() => {
          this.$message.success('判断题添加成功');
          this.judgmentDialogVisible = false;
          this.resetJudgmentForm();
          this.fetchJudgmentChoiceData();
        })
        .catch((error) => {
          console.error(error);
          this.$message.error('判断题添加失败');
        });
    },

    resetForm() {
      this.form = {
        title: '',
        a_option: '',
        b_option: '',
        c_option: '',
        d_option: '',
        right_ans: '',
        max_score: 0
      };
    },
    resetMultiForm() {
      this.multiForm = {
        title: '',
        a_option: '',
        b_option: '',
        c_option: '',
        d_option: '',
        right_ans: [],
        max_score: 0
      };
    },
    resetJudgmentForm() {
      this.judgmentForm = {
        title: '',
        right_ans: '',
        max_score: 0
      };
    },

    // 编辑题目
    editCourse(row) {
      this.$prompt('编辑课程名称', '编辑课程', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: row.name
      }).then(({ value }) => {
        row.name = value;
        this.$message.success('课程已编辑');
      }).catch(() => {
        this.$message.info('取消编辑');
      });
    },

    // 删除题目
    deleteCourse(row) {
      // 弹出确认对话框
      this.$confirm('确定要删除这个题目吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 用户点击了确定按钮
          console.log('选中的题目行id', row.id);

          const apiUrl = `http://10.60.60.179:8080/QSSelect/deleteQSSelect/${row.id}`;
          axios.delete(apiUrl)
            .then(() => {
              // 请求成功后，从列表中移除该条数据并提示用户删除成功
              //this.$refs.CourseIntro.doRemove(row); // 如果table组件支持删除操作，可以使用这个方法
              //this.fetchVideoData(); // 更新视频数据列表
              this.$message({
                type: 'success',
                message: '题目删除成功!'
              });

            })
            .catch(error => {
              console.error('题目删除失败', error);
              //window.location.reload(true); // 刷新页面
              this.$message.error('删除题目时发生错误，请检查网络或联系管理员');
            });

        })
        .catch(() => {
          // 用户点击了取消按钮，不执行任何操作
        });
    },

    handleAllSelectionChange(val) {
      this.selectList = val;
    },
    handleMultipleSelectionChange(val) {
      this.selectList = val;
    },
    handleSingleSelectionChange(val) {
      this.selectList = val;
    },
    handleJudgmentSelectionChange(val) {
      this.selectList = val;
    },
    // 全部选择按钮
    selectAll() {
      this.AllChoiceData.forEach(row => {
        this.$refs.singleTable.toggleRowSelection(row, true);
      });

      const otherData = this.AllChoiceData.filter(item => !this.AllChoiceData.some(x => x.id === item.id));
      otherData.forEach(row => {
        this.$refs.singleTable.toggleRowSelection(row, true);
      });
    },

    // 题库
    fetchAllChoiceData() {
      const formData = new FormData();
      formData.append('qs_id', '1');
      axios({
        method: 'get',
        url: 'http://10.60.60.179:8080/QSSelect/getQSSelect',
        params: {
          qs_id: 1
        }
      }).then(response => {
        console.log('API 响应：', response.data.data);
        const apiQsData = response.data.data;
        this.total = apiQsData.length; // 设置总记录数
        this.AllChoiceData = apiQsData.map((qs, index) => ({
          title: qs.title,
          a_option: qs.a_option,
          b_option: qs.b_option,
          c_option: qs.c_option,
          d_option: qs.d_option,
          max_score: qs.max_score,
          right_ans: qs.right_ans,
          index: index + 1, // 添加序号字段
          id: qs.qs_id,
          qs_type: qs.qs_type,
        }));
        this.handleAllCurrentChange(this.currentPage); // 初始化时加载第一页数据
        console.log('所有题库信息：', this.AllChoiceData);
      }).catch(error => {
        console.error('Error fetching video:', error);
      });
    },

    // 单选题
    fetchSingleChoiceData() {
      const params = {
        qs_type: 'only_sel', // 添加筛选条件 qs_type
        qs_id: 1 // 如果需要，还可以添加其他参数
      };
      axios.get('http://10.60.60.179:8080/QSSelect/getQSSelect', { params })
        .then(response => {
          console.log('题库API 响应：', response.data.data);
          const apiQsData = response.data.data;
          // 过滤符合条件的数据
          const filteredData = apiQsData.filter(qs => qs.qs_type === 'only_sel');
          // 设置总记录数
          this.SingleTotal = filteredData.length;
          // 格式化数据，准备加载到表格中
          this.singleChoiceData = filteredData.map((qs, index) => ({
            title: qs.title,
            a_option: qs.a_option,
            b_option: qs.b_option,
            c_option: qs.c_option,
            d_option: qs.d_option,
            max_score: qs.max_score,
            right_ans: qs.right_ans,
            index: index + 1, // 添加序号字段
            id: qs.qs_id,
            qs_type: qs.qs_type,
          }));

          // 加载第一页数据
          this.handleSingleCurrentChange(this.SinglePage);

          console.log('所有单选题库信息：', this.singleChoiceData);
        })
        .catch(error => {
          console.error('Error fetching video:', error);
        });
    },
    // 多选题
    fetchMultipleChoiceData() {
      const params = {
        qs_type: 'many_sel', // 添加筛选条件 qs_type
        qs_id: 1 // 如果需要，还可以添加其他参数
      };
      axios.get('http://10.60.60.179:8080/QSSelect/getQSSelect', { params })
        .then(response => {
          console.log('题库API 响应：', response.data.data);
          const apiQsData = response.data.data;
          // 过滤符合条件的数据
          const filteredData = apiQsData.filter(qs => qs.qs_type === 'many_sel');
          // 设置总记录数
          this.multipleTotal = filteredData.length;
          // 格式化数据，准备加载到表格中
          this.multipleChoiceData = filteredData.map((qs, index) => ({
            title: qs.title,
            a_option: qs.a_option,
            b_option: qs.b_option,
            c_option: qs.c_option,
            d_option: qs.d_option,
            max_score: qs.max_score,
            right_ans: qs.right_ans,
            index: index + 1, // 添加序号字段
            id: qs.qs_id,
            qs_type: qs.qs_type,
          }));
          // 加载第一页数据
          this.handleMultipleCurrentChange(this.MultiplePage);
          console.log('所有单选题库信息：', this.multipleChoiceData);
        })
        .catch(error => {
          console.error('Error fetching video:', error);
        });
    },

    // 判断题
    fetchJudgmentChoiceData() {
      const params = {
        qs_type: '', // 添加筛选条件 qs_type
        qs_id: 1 // 如果需要，还可以添加其他参数
      };
      axios.get('http://10.60.60.179:8080/QSSelect/getQSSelect', { params })
        .then(response => {
          console.log('题库API 响应：', response.data.data);
          const apiQsData = response.data.data;
          // 过滤符合条件的数据，包括 qs_type 为空或者为 null 的情况
          const filteredData = apiQsData.filter(qs => qs.qs_type === '' || qs.qs_type === null);
          // 设置总记录数
          this.JudgmentTotal = filteredData.length;
          // 格式化数据，准备加载到表格中
          this.JudgmentChoiceData = filteredData.map((qs, index) => ({
            title: qs.title,
            a_option: qs.a_option,
            b_option: qs.b_option,
            c_option: qs.c_option,
            d_option: qs.d_option,
            max_score: qs.max_score,
            right_ans: qs.right_ans,
            index: index + 1, // 添加序号字段
            id: qs.qs_id,
            qs_type: qs.qs_type,
          }));
          // 加载第一页数据
          this.handleJudgmentCurrentChange(this.JudgmentPage);
          console.log('所有判断题库信息：', this.JudgmentChoiceData);
        })
        .catch(error => {
          console.error('Error fetching video:', error);
        });
    },

    //  题库分页
    handleAllCurrentChange(page) {
      this.currentPage = page;
      const startIndex = (page - 1) * this.page_size;
      const endIndex = startIndex + this.page_size;
      this.paginatedQsData = this.AllChoiceData.slice(startIndex, endIndex);
    },

    //  单选题库分页
    handleSingleCurrentChange(page) {
      this.currentPage = page;
      const startIndex = (page - 1) * this.page_size;
      const endIndex = startIndex + this.page_size;
      this.paginatedQsSingleData = this.singleChoiceData.slice(startIndex, endIndex);
    },

    //  多选题库分页
    handleMultipleCurrentChange(page) {
      this.currentPage = page;
      const startIndex = (page - 1) * this.page_size;
      const endIndex = startIndex + this.page_size;
      this.paginatedQsMultipleData = this.multipleChoiceData.slice(startIndex, endIndex);
    },

    //  判断题库分页
    handleJudgmentCurrentChange(page) {
      this.currentPage = page;
      const startIndex = (page - 1) * this.page_size;
      const endIndex = startIndex + this.page_size;
      this.paginatedQsJudgmentData = this.JudgmentChoiceData.slice(startIndex, endIndex);
    },

    //资料库重命名
    editFile(row) {
      // 先获取原始的资源名称
      const originalResourceName = row.resource_name;

      // 弹出输入框，让用户输入新的资源名称
      this.$prompt('请输入新的资源名称', '编辑资料', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S+/,
        inputErrorMessage: '输入不能为空',
        inputValue: originalResourceName  // 设置输入框的默认值为原始资源名称
      }).then(({ value }) => {
        // 用户点击确定，并且输入框中有值
        const editedResourceName = value.trim(); // 获取用户输入的新资源名称并去除首尾空格
        if (editedResourceName === originalResourceName) {
          // 如果用户未修改名称，可以在此处给出提示或直接返回
          this.$message.info('资料名称未修改');
          return;
        }
        const editedData = {
          resource_name: editedResourceName, // 修改后的资源名称
          // 如果有其它需要更新的数据，可以在这里添加
        };
        axios.put('http://10.33.124.200:8080/resources/changeResourceName', editedData, {
          headers: { 'Content-Type': 'multipart/form-data' }, // 设置正确的content-type
          params: { user_id: 1, resource_id: row.resource_id }, // 传递必要的参数
        })
          .then(response => {
            if (response.status === 200) {
              // 更新成功的处理
              this.$message.success('资料名称编辑成功');

            } else {
              // 更新失败的处理
              this.$message.error('资料名称失败，请检查网络连接或联系管理员');
              // window.location.reload(true); // 刷新页面
            }
            this.fetchDataData();
            // window.location.reload(true); // 刷新页面
          })
          .catch(error => {
            // 异常处理

            console.error('资料标题编辑失败', error);
            this.$message.error('编辑资料时发生错误，请检查网络连接或联系管理员');
          });

      }).catch(() => {
        // 用户点击取消，不做任何操作
      });
    },

    // 删除资料
    deleteFile(row) {
      this.$confirm('确定删除该资料吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.delete(`http://10.33.124.200:8080/resources/deleteResource/${row.resource_id}`)//文档接口未定义
          .then(() => {
            this.fetchDataData();
            this.$message.success('资料已删除');
          })
          .catch(error => {
            console.error('删除资料失败', error);
            this.$message.info('删除资料失败');
          });
      }).catch(() => {
        this.$message.info('取消删除');
      });
    },

    // 资料库上传资料
    handleUploadData() {
      const formData = new FormData();
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'data/*';
      fileInput.onchange = () => {
        formData.append('course_id', '1');// 要加入的老师id，需要修改
        formData.append('resource_name', fileInput.files[0].name);
        formData.append('file', fileInput.files[0]);
        this.$axios.post('http://10.33.124.200:8080/resources/addPPt', formData)//请补充服务器地址和course_id
          .then(response => {
            console.log(response.data);
            if (response.data.status === 1) {
              this.$message.success('添加资料成功');
              this.fetchDataData();
            } else {
              this.$message.error('添加资料失败');
            }
          })
          .catch(error => {
            console.error('Error adding file', error);
            this.$message.error('添加资料失败');
          });
      };
      fileInput.click();
    },
    //资料库读取资料
    fetchDataData() {
      this.$axios.get('http://10.33.124.200:8080/resources/showppts', {//请补充服务器地址和course_id
        params: {
          course_id: '1' // 要加入的老师id，需要修改
        }
      })
        .then(response => {
          console.log('返回的数据', response.data);
          if (response.data && response.data.data) {
            this.dataAll = response.data.data;
            this.dataTotal = response.data.data.length;
            this.handleDataCurrentChange(1);
            this.updateTable('all');
          } else {
            console.error('Unexpected response structure:', response.data);
            this.$message.error('获取资料列表失败');
          }
        })
        .catch(error => {
          console.error('资料列表刷新失败', error);
          this.$message.info('资料列表刷新失败');
        });
    },
    //资料库数据分类
    getFileType(fileName) {
      const extension = fileName.split('.').pop().toLowerCase();
      switch (extension) {
        case 'ppt':
        case 'pptx':
          return 'PPT';
        case 'doc':
        case 'docx':
          return 'Word';
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
          return '图片';
        case 'mp4':
        case 'avi':
        case 'mov':
          return '视频';
        default:
          return '其它';
      }
    },
    //资料库分页
    handleDataCurrentChange(page) {
      this.dataPage = page;
      this.currentDataPageNum = page;
      const startIndex = (this.dataPage - 1) * this.page_size;
      const endIndex = startIndex + this.page_size;
      this.dataPage = this.filteredData.slice(startIndex, endIndex);
    },
    //资料库更新分类
    updateTable(fileType) {
      let filteredData = [];
      for (let file of this.dataAll) {
        let currentFileType = this.getFileType(file.resource_name);
        if (fileType === 'all' || fileType === currentFileType) {
          filteredData.push(file);
        }
      }
      this.filteredData = [...filteredData];
      this.dataTotal = this.filteredData.length;
      this.handleDataCurrentChange(1);
      this.activeButton = fileType;
    },
    //资料库搜索结果
    searchData() {
      let filteredData = [];
      for (let file of this.dataAll) {
        if (file.resource_name.includes(this.searchKeyword)) {
          filteredData.push(file);
        }
      }
      this.filteredData = [...filteredData];
      this.dataTotal = this.filteredData.length;
      this.handleDataCurrentChange(1);
      this.activeButton = '搜索';
    },

    //上传视频
    handleUploadVideo() {
      // 创建一个<input type="file">元素
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'png/*'; // 只接受视频文件

      // 监听文件选择事件
      input.addEventListener('change', () => {
        const file = input.files[0]; // 获取选择的文件

        // 创建 FormData 对象，用于构建表单数据
        const formData = new FormData();
        formData.append('file', file); // 将文件添加到 FormData
        formData.append('course_id', '1');
        formData.append('resource_name', file.name.split('.').slice(0, -1).join('.')); // 使用文件名作为 resource_name，去除后缀

        // 发送 POST 请求到后端，上传文件并添加记录
        axios.post('http://10.33.124.200:8080/resources/addvideo', formData)
          .then(response => {
            // 上传成功后的处理逻辑
            console.log('视频上传成功', response.data);
            alert('视频上传提交成功！');
            this.fetchVideoData(); // 重新获取视频列表数据
            console.log('视频上传成功', this.fetchVideoData);
          })
          .catch(error => {
            // 错误处理逻辑
            console.error('上传失败:', error);
            alert('视频上传提交失败！');
          });
      });

      // 触发文件选择对话框
      input.click();
    },

    // 获取视频
    fetchVideoData() {
      const formData = new FormData();
      formData.append('course_id', '1');
      axios({
        method: 'get',
        url: 'http://10.33.124.200:8080/resources/showvideos',
        params: {
          course_id: 1
        }
      }).then(response => {
        console.log('视频API 响应：', response.data.data);
        const apiVideoData = response.data.data;
        this.videoTotal = apiVideoData.length; // 设置总记录数
        this.videoData = apiVideoData.map((video, index) => ({
          title: video.resource_name,
          date: video.update_time,
          index: index + 1, // 添加序号字段
          id: video.resource_id,
        }));
        this.handleCurrentChange(this.videoPage); // 初始化时加载第一页数据
        console.log('所有视频信息：', this.videoData);
      }).catch(error => {
        console.error('Error fetching video:', error);
      });
    },

    // 更新视频页码
    handleCurrentChange(page) {
      this.videoPage = page;
      const startIndex = (page - 1) * this.page_size;
      const endIndex = startIndex + this.page_size;
      this.paginatedVideoData = this.videoData.slice(startIndex, endIndex);
    },

    // 修改视频标题
    editVideo(row) {
      // 先获取原始的资源名称
      const originalResourceName = row.title;

      // 弹出输入框，让用户输入新的资源名称
      this.$prompt('请输入新的资源名称', '编辑视频', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S+/,
        inputErrorMessage: '输入不能为空',
        inputValue: originalResourceName  // 设置输入框的默认值为原始资源名称
      }).then(({ value }) => {
        // 用户点击确定，并且输入框中有值
        const editedResourceName = value.trim(); // 获取用户输入的新资源名称并去除首尾空格
        if (editedResourceName === originalResourceName) {
          // 如果用户未修改名称，可以在此处给出提示或直接返回
          this.$message.info('视频名称未修改');
          return;
        }
        const editedData = {
          resource_name: editedResourceName, // 修改后的资源名称
          // 如果有其他需要更新的数据，可以在这里添加
        };
        axios.put('http://10.33.124.200:8080/resources/changeResourceName', editedData, {
          headers: { 'Content-Type': 'multipart/form-data' }, // 设置正确的content-type
          params: { user_id: 1, resource_id: row.id }, // 传递必要的参数
        })
          .then(response => {
            if (response.status === 200) {
              // 更新成功的处理
              this.$message.success('视频编辑成功');

            } else {
              // 更新失败的处理
              this.$message.error('视频编辑失败，请检查网络连接或联系管理员');
              window.location.reload(true); // 刷新页面
            }
            this.fetchVideoData();
            window.location.reload(true); // 刷新页面
          })
          .catch(error => {
            // 异常处理

            console.error('视频标题编辑失败', error);
            this.$message.error('编辑视频时发生错误，请检查网络连接或联系管理员');
          });

      }).catch(() => {
        // 用户点击取消，不做任何操作
      });
    },

    // 删除视频
    deleteVideo(row) {
      // 弹出确认对话框
      this.$confirm('确定要删除这个视频吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 用户点击了确定按钮
          console.log('选中的视频行id', row.id);

          const apiUrl = `http://10.33.124.200:8080/resources/deleteResource/${row.id}`;
          axios.delete(apiUrl)
            .then(() => {
              // 请求成功后，从列表中移除该条数据并提示用户删除成功
              //this.$refs.CourseIntro.doRemove(row); // 如果table组件支持删除操作，可以使用这个方法
              this.fetchVideoData(); // 更新视频数据列表
              this.$message({
                type: 'success',
                message: '视频删除成功!'
              });

            })
            .catch(error => {
              console.error('Delete video failed:', error);
              //window.location.reload(true); // 刷新页面
              this.$message.error('删除视频时发生错误，请检查网络或联系管理员');
            });

        })
        .catch(() => {
          // 用户点击了取消按钮，不执行任何操作
        });
    },

    //静态数据
    fetchData() {
      for (let i = 0; i < 100; i++) {
        this.tableAll.push({ id: i, name: `name${i}`, date: this.formatDate(`date${i}`) });
      }
      this.total = this.tableAll.length;
      this.AllChoiceData = JSON.parse(JSON.stringify(this.tableAll));
      this.multipleChoiceData = JSON.parse(JSON.stringify(this.tableAll));
      this.singleTotal = this.AllChoiceData.length;
      this.multipleTotal = this.multipleChoiceData.length;
    },
    // 静态日期
    formatDate(dateString) {
      // 假设 dateString 的格式是 'dateX'，例如 'date1', 'date2', ...
      // 在这里根据实际情况处理日期格式化
      // 这里假设你要将 'dateX' 格式化为 '2016-00-00'

      // 示例中简单处理，假设 X 是从 1 开始的数字
      const index = parseInt(dateString.substring(4)); // 解析出 X
      const year = 2016;
      const month = index % 12 + 1; // 假设月份从 1 到 12 循环
      const day = index % 30 + 1; // 假设日期从 1 到 30 循环

      // 使用 padStart 函数来补齐月份和日期为两位数
      const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      return formattedDate;
    },
  },
  mounted() {
    console.log("开始请求");
    //this.fetchData();//静态数据
    this.fetchDataData();//资料数据
    this.fetchVideoData();//视频数据

    this.fetchAllChoiceData();//题库
    this.fetchSingleChoiceData();//单选
    this.fetchMultipleChoiceData();//多选
    this.fetchJudgmentChoiceData();//判断

  },
};
</script>


<style scoped>
.classification {
  display: flex;
  align-items: flex-end;
  margin-left: 0px;
}

.search-data {
  display: flex;
  margin-left: 300px;
  margin-right: auto;
}


.active-button {
  border-bottom: 5px solid #007bff;
  color: #007bff;
}

.classification-button {
  font-size: 10px;
  padding: 10 10px;
  height: 15px;
  vertical-align: bottom;
}

.el-table {
  user-select: none;
  /* 禁用文本选中 */
}

.search-input {
  width: 200px;
}

.tab-bar {
  display: flex;
  background-color: white;
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 20px;
  user-select: none;
  /* 禁用文本选中 */
}

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

.course-intro {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.settings {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.resource-test-settings,
.resource-video-settings,
.resource-data-settings {
  position: relative;
  background-color: #f8f9fa;
  padding: 20px;
  padding-bottom: 50px;
  border-radius: 5px;
}

.block {
  position: absolute;
  bottom: 5px;
  right: 20px;

}

.date-position {
  position: absolute;
  right: 10px;
  transform: translateY(-50%);
}

.tabs-table-container {
  background-color: #ffffff;
  padding-left: 20px;
  padding-right: 20px;
}

.qs {
  display: flex;
  align-items: center;
  height: 50px;

}

.mt15 {
  display: flex;
  align-items: center;
  height: 50px;
  margin-left: 70%;
}

.btn {
  margin-left: 10px;
}

.page-info {
  margin-left: 430px;
  font-size: 15px;
}

.page-info-down {
  margin-right: 0;
}

.custom-tabs .el-tabs__content {
  border: none;
  padding: 0;
}

.custom-tabs .el-tabs__pane {
  padding: 0;
}

.custom-tabs .el-tabs__header {
  margin-bottom: 0;
  /* 确保头部与内容区域的顶部紧密相连 */
}

.header-setting-background {
  background: #ffffff;
  padding: 20px;

}

.header-setting {
  margin-left: 20px;

}

.header-setting-el-button {
  margin-left: 20px;
}
</style>
