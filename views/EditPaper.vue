<template>
  <div class="edit-paper">
    <div class="top-buttons">
      <el-button type="primary" @click="openAddPaperDialog">+ 新增试卷</el-button>
      <el-button type="primary" @click="openImportFromBankDialog">+ 从课程题库中导入</el-button>
    </div>
    <el-select v-model="selectedViewPaper" placeholder="请选择试卷" @change="handleCurrentChange" class="full-width">
      <el-option label="所有试卷" value="all"></el-option>
      <el-option v-for="(paper, index) in papers" :key="paper.paper_id" :label="paper.paper_title" :value="index"></el-option>
    </el-select>
    <el-table :data="filteredTableData" style="width: 100%" class="paper-table">
      <el-table-column prop="paper_title" label="试卷名称" width="180"></el-table-column>
      <el-table-column prop="max_score" label="满分" width="100"></el-table-column>
      <el-table-column label="题目描述">
        <template #default="{ row }">
          <el-collapse>
            <el-collapse-item v-for="(question, qIndex) in row.questions" :key="qIndex">
              <template #title>
                <div class="question-header">
                  <span>{{ question.title }}</span>
                  <span class="question-type">[{{ question.qs_type }}]</span>
                </div>
              </template>
              <div class="question-options">
                <div>A: {{ question.a_option }}</div>
                <div>B: {{ question.b_option }}</div>
                <div>C: {{ question.c_option }}</div>
                <div>D: {{ question.d_option }}</div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </template>
      </el-table-column>
      <el-table-column label="正确答案" width="200">
        <template #default="{ row }">
          <div v-for="(question, qIndex) in row.questions" :key="qIndex">
            {{ question.right_ans }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{  $index }">
          <el-button type="danger" size="mini" @click="deletePaper($index)">删除试卷</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="totalPapers">
      </el-pagination>
    </div>
    <el-dialog title="新增试卷" v-model="newPaperDialogVisible">
      <el-form :model="newPaper">
        <el-form-item label="试卷名称" :rules="{ required: true, message: '请输入试卷名称', trigger: 'blur' }">
          <el-input v-model="newPaper.paper_title"></el-input>
        </el-form-item>
        <el-form-item label="满分" :rules="{ required: true, message: '请输入满分', trigger: 'blur' }">
          <el-input v-model="newPaper.max_score" type="number"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="newPaperDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addNewPaper">确定</el-button>
      </template>
    </el-dialog>
    <el-dialog title="从课程题库中导入" v-model="importDialogVisible" width="70%">
      <el-select v-model="selectedImportPaper" placeholder="请选择试卷" class="import-paper-select full-width">
        <el-option v-for="(paper, index) in papers" :key="index" :label="paper.paper_title" :value="index"></el-option>
      </el-select>
      <div class="import-top">
        <el-input
          v-model="searchQuery"
          placeholder="搜索题目"
          class="import-search"
          prefix-icon="el-icon-search"
          @input="filterQuestionBank"
        ></el-input>
      </div>
      <el-table :data="filteredQuestionBank" style="width: 100%">
        <el-table-column prop="title" label="题目描述" width="300"></el-table-column>
        <el-table-column prop="qs_type" label="题目类型" width="150"></el-table-column>
        <el-table-column prop="a_option" label="选项A" width="100"></el-table-column>
        <el-table-column prop="b_option" label="选项B" width="100"></el-table-column>
        <el-table-column prop="c_option" label="选项C" width="100"></el-table-column>
        <el-table-column prop="d_option" label="选项D" width="100"></el-table-column>
        <el-table-column prop="right_ans" label="正确答案" width="150"></el-table-column>
        <el-table-column prop="max_score" label="分值" width="100"></el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-checkbox v-model="row.selected">选中</el-checkbox>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="importDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="importQuestions" :disabled="!selectedQuestions.length">添加选中的题目</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';

export default {
  setup() {
    const papers = ref([]);
    const currentPage = ref(1);
    const pageSize = ref(5);
    const newPaperDialogVisible = ref(false);
    const importDialogVisible = ref(false);
    const selectedViewPaper = ref('all');
    const selectedImportPaper = ref(null);
    const newPaper = ref({
      paper_title: '',
      max_score: 100
    });
    const searchQuery = ref('');
    const questionBank = ref([]);
    const filteredQuestionBank = ref([]);
    const selectedQuestions = computed(() => {
      return filteredQuestionBank.value.filter(question => question.selected);
    });

    const totalPapers = computed(() => {
      return selectedViewPaper.value === 'all' ? papers.value.length : 1;
    });

    const filteredTableData = computed(() => {
      if (selectedViewPaper.value === 'all') {
        return papers.value.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value);
      } else {
        return [papers.value[selectedViewPaper.value]];
      }
    });

    onMounted(() => {
      fetchPapers();
      fetchQuestionBank();
    });

    async function fetchPapers() {
      try {
        const response = await axios.get('http://10.60.60.179:8080/paperStore/getPaperStore');
        if (response.data.status === 1) {
          papers.value = response.data.data.map(paper => ({
            ...paper,
            questions: []
          }));
        } else {
          ElMessage.error('获取试卷失败');
        }
      } catch (error) {
        console.error('Failed to fetch papers:', error);
        ElMessage.error('获取试卷失败');
      }
    }

    async function addNewPaper() {
      if (newPaper.value.paper_title.trim()) {
        try {
          const response = await axios.post('http://10.60.60.179:8080/paperStore/getPaperStore', null, {
            params: {
              paper_title: newPaper.value.paper_title,
              max_score: newPaper.value.max_score
            }
          });
          if (response.data.status === 1) {
            papers.value.push({
              paper_id: response.data.paper_id,
              paper_title: newPaper.value.paper_title,
              max_score: newPaper.value.max_score,
              questions: []
            });
            newPaperDialogVisible.value = false;
            newPaper.value = { paper_title: '', max_score: 100 };
            handleCurrentChange(currentPage.value);
            ElMessage.success('试卷添加成功');
          } else {
            ElMessage.error('添加试卷失败');
          }
        } catch (error) {
          console.error('Failed to add new paper:', error);
          ElMessage.error('添加试卷失败');
        }
      } else {
        ElMessage.error('请填写试卷名称');
      }
    }

    async function deletePaper(index) {
      const paper = papers.value[index];
      try {
        const response = await axios.delete('http://10.60.60.179:8080/paperStore/getPaperStore', {
          params: {
            paper_id: paper.paper_id
          }
        });
        if (response.data.status === 1) {
          papers.value.splice(index, 1);
          handleCurrentChange(currentPage.value);
          ElMessage.success('试卷删除成功');
        } else {
          ElMessage.error('删除试卷失败');
        }
      } catch (error) {
        console.error('Failed to delete paper:', error);
        ElMessage.error('删除试卷失败');
      }
    }

    function handleCurrentChange(page) {
      currentPage.value = page;
    }

    function openAddPaperDialog() {
      newPaperDialogVisible.value = true;
    }

    function openImportFromBankDialog() {
      importDialogVisible.value = true;
    }

    async function fetchQuestionBank() {
      try {
        const response = await axios.get('http://10.60.60.179:8080/QSSelect/getQSSelect');
        if (response.data.status === 1) {
          questionBank.value = response.data.data.map(question => ({
            qs_id: question.qs_id,
            title: question.title,
            right_ans: question.right_ans,
            qs_type: question.qs_type,
            max_score: question.max_score,
            d_option: question.d_option,
            c_option: question.c_option,
            b_option: question.b_option,
            a_option: question.a_option,
            selected: false
          }));
          filteredQuestionBank.value = [...questionBank.value];
        } else {
          ElMessage.error('获取题库失败');
        }
      } catch (error) {
        console.error('Failed to fetch question bank:', error);
        ElMessage.error('获取题库失败');
      }
    }

    function filterQuestionBank() {
      const query = searchQuery.value.trim().toLowerCase();
      if (query) {
        filteredQuestionBank.value = questionBank.value.filter(question =>
          question.title && question.title.toLowerCase().includes(query)
        );
      } else {
        filteredQuestionBank.value = [...questionBank.value];
      }
    }

    async function importQuestions() {
      const selectedPaper = papers.value[selectedImportPaper.value];
      const selectedQuestions = filteredQuestionBank.value.filter(question => question.selected);

      if (selectedQuestions.length === 0) {
        ElMessage.warning('请选择要导入的题目');
        return;
      }

      // 将选中的题目添加到选择的试卷中
      selectedPaper.questions.push(...selectedQuestions);
      // 重新计算试卷的max_score
      selectedPaper.max_score = selectedPaper.questions.reduce((sum, question) => sum + question.max_score, 0);
      importDialogVisible.value = false;
      ElMessage.success('题目导入成功');
    }

    return {
      papers,
      currentPage,
      pageSize,
      newPaperDialogVisible,
      importDialogVisible,
      selectedViewPaper,
      selectedImportPaper,
      newPaper,
      searchQuery,
      filteredQuestionBank,
      selectedQuestions,
      totalPapers,
      filteredTableData,
      fetchPapers,
      addNewPaper,
      deletePaper,
      handleCurrentChange,
      openAddPaperDialog,
      openImportFromBankDialog,
      fetchQuestionBank,
      filterQuestionBank,
      importQuestions
    };
  }
};
</script>

<style scoped>
.edit-paper {
  padding: 20px;
}

.top-buttons {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
}

.full-width {
  width: 100%;
}

.paper-table .question-item {
  display: flex;
  justify-content: space-between;
}

.paper-table .question-header {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.paper-table .question-type {
  margin-left: 20px;
  font-weight: bold;
}

.paper-table .question-options {
  padding-left: 20px;
  margin-bottom: 10px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.el-dialog {
  max-width: 600px;
}

.import-top {
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
}

.import-paper-select {
  margin-bottom: 20px;
}

.import-search {
  width: 300px;
}
</style>

