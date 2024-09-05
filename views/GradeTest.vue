<template>
  <!-- 右侧部分 -->
  <div>
    <!-- 头部 -->
    <div class="card" style="display: flex; align-items: flex-start">
      <p style="margin: 0; color: black; font-weight: bold; font-size: 20px">
        学生成绩
      </p>
      <p
        style="
          margin: 0;
          color: grey;
          font-size: 14px;
          margin-left: 10px;
          margin-top: 4px;
        "
      >
        请设置课程的相关简介
      </p>
    </div>
    <!-- 选择框 -->
    <div class="card">
      <h3>权重设置</h3>
      <div class="input-container">
        <el-input
          placeholder="测试："
          v-model="testWeight"
          class="input-field"
        ></el-input>
        <el-input
          placeholder="作业："
          v-model="homeworkWeight"
          class="input-field"
        ></el-input>
        <el-button type="primary" @click="saveWeights">确定</el-button>
      </div>
    </div>
    <!-- 查询栏 -->
    <div class="card" style="margin-bottom: 10px">
      <div
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
        "
      >
        <!-- 查询 -->
        <div style="display: flex; align-items: center">
          <el-input
            style="width: 100%; margin-right: 10px"
            placeholder="输入学生姓名进行查找"
            prefix-icon="el-icon-search"
            v-model="searchName"
          ></el-input>
          <el-button type="primary" round @click="handleSearch">查询</el-button>
        </div>
      </div>
    </div>
    <!-- 表格 -->
    <div class="card" style="margin-bottom: 10px">
      <div>
        <!-- 选择框 -->
        <!-- <el-select v-model="value" clearable placeholder="全部分组" style="text-align: left;margin-left: 20px;">
       <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select> -->
        <!-- 表格内容 -->
        <el-table :data="currentPageData" :fit="true" style="width: 100%">
          <el-table-column
            prop="stunumber"
            label="学生学号"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="name"
            label="姓名"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="testScore"
            label="测试成绩"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="homeworkScore"
            label="作业成绩"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="totalScore"
            label="总成绩"
            align="center"
          ></el-table-column>
          <el-table-column prop="operation" label="操作" align="center">
            <template #default="scope">
              <div style="display: flex; justify-content: space-between">
                <el-button
                  style="padding: 5px 10px; font-size: 12px"
                  type="primary"
                  @click="viewDetails(scope.row)"
                  >查看</el-button
                >
                <el-button
                  style="padding: 5px 10px; font-size: 12px"
                  type="danger"
                  @click="editScore(scope.row)"
                  >修改分数</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 分页符 使用flex布局 未实现逻辑！！！-->
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="data.tableData.length"
        :page-size="pageSize"
        :current-page="currentPage"
        @update:current-page="handleCurrentChange"
      ></el-pagination>
    </div>

    <!-- 查看成绩对话弹窗 -->
    <el-dialog width="35%" title="成绩信息" v-model="formVisible2">
      <el-form :model="form2" label-width="100px">
        <el-form-item label="学生学号">
          <el-input
            v-model="form.stunumber"
            autocomplete="off"
            readonly
          ></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="form" label-width="100px">
        <el-form-item label="学生姓名">
          <el-input v-model="form.name" autocomplete="off" readonly></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="form" label-width="100px">
        <el-form-item label="测试成绩">
          <el-input
            v-model="form.testScore"
            autocomplete="off"
            type="number"
            readonly
          ></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="form" label-width="100px">
        <el-form-item label="作业成绩">
          <el-input
            v-model="form.homeworkScore"
            autocomplete="off"
            type="number"
            readonly
          ></el-input>
        </el-form-item>
      </el-form>

      <el-form :model="form" label-width="100px">
        <el-form-item label="总成绩">
          <el-input
            v-model="form.totalScore"
            autocomplete="off"
            type="number"
            readonly
          ></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 修改成绩对话弹窗 -->
    <el-dialog width="35%" title="成绩信息" v-model="formVisible">
      <el-form :model="form" label-width="100px">
        <el-form-item label="学生学号">
          <el-input
            v-model="form.stunumber"
            autocomplete="off"
            readonly
          ></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="form" label-width="100px">
        <el-form-item label="学生姓名">
          <el-input v-model="form.name" autocomplete="off" readonly></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="form" label-width="100px">
        <el-form-item label="测试成绩">
          <el-input
            v-model="form.testScore"
            autocomplete="off"
            type="number"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="form" label-width="100px">
        <el-form-item label="作业成绩">
          <el-input
            v-model="form.homeworkScore"
            autocomplete="off"
            type="number"
          ></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="handleComplete">完成</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
  
  
  <script setup>
import { reactive, ref, computed } from "vue";
import { ElMessage } from "element-plus";

const data = reactive({
  name: "",
  tableData: [
    {
      stunumber: "2100420101",
      name: "杨兵",
      testScore: 6,
      homeworkScore: 12,
      totalScore: 12,
    },
    {
      stunumber: "2100420102",
      name: "杨兵",
      testScore: 13.59999,
      homeworkScore: 37.3333,
      totalScore: 12,
    },
    {
      stunumber: "2100420103",
      name: "杨兵",
      testScore: 17,
      homeworkScore: 12,
      totalScore: 67,
    },
    {
      stunumber: "2100420104",
      name: "杨兵",
      testScore: 26.9,
      homeworkScore: 45,
      totalScore: 67,
    },
    {
      stunumber: "2100420105",
      name: "杨兵",
      testScore: 26.9,
      homeworkScore: 45,
      totalScore: 67,
    },
    {
      stunumber: "2100420106",
      name: "ljj",
      testScore: 20.3,
      homeworkScore: 45,
      totalScore: 34,
    },
    {
      stunumber: "2100420108",
      name: "ljj",
      testScore: 20.3,
      homeworkScore: 45,
      totalScore: 34,
    },
    {
      stunumber: "2100420109",
      name: "ljj",
      testScore: 20.3,
      homeworkScore: 45,
      totalScore: 34,
    },
    {
      stunumber: "2100420110",
      name: "ljj",
      testScore: 20.3,
      homeworkScore: 45,
      totalScore: 34,
    },
    {
      stunumber: "2100420111",
      name: "ljj",
      testScore: 30.2,
      homeworkScore: 78,
      totalScore: 34,
    },
    {
      stunumber: "2100420112",
      name: "ljj",
      testScore: 30.2,
      homeworkScore: 78,
      totalScore: 34,
    },
    {
      stunumber: "2100420113",
      name: "ljj",
      testScore: 30.2,
      homeworkScore: 78,
      totalScore: 34,
    },
    {
      stunumber: "2100420114",
      name: "ljj",
      testScore: 39,
      homeworkScore: 78,
      totalScore: 78,
    },
    {
      stunumber: "2100420115",
      name: "ljj",
      testScore: 39,
      homeworkScore: 78,
      totalScore: 78,
    },
    {
      stunumber: "2100420116",
      name: "是谁",
      testScore: 39,
      homeworkScore: 78,
      totalScore: 78,
    },
    {
      stunumber: "2100420117",
      name: "john",
      testScore: 39,
      homeworkScore: 78,
      totalScore: 78,
    },
    {
      stunumber: "2100420118",
      name: "lkkk",
      testScore: 39,
      homeworkScore: 78,
      totalScore: 78,
    },
  ], // 可能还有更多学生的数据...
  currentPage: 1,
  pageSize: 9,
});

const searchName = ref("");
const formVisible = ref(false);
const form = ref({ name: "", testScore: 0, homeworkScore: 0 });
const formVisible2 = ref(false);
const form2 = ref({ name: "", testScore: 0, homeworkScore: 0 });

const originalTableData = ref([...data.tableData]);

const currentPageData = computed(() => {
  const start = (data.currentPage - 1) * data.pageSize;
  const end = start + data.pageSize;
  return data.tableData.slice(start, end);
});

const viewDetails = (row) => {
  form.value.stunumber = row.stunumber;
  form.value.name = row.name;
  form.value.testScore = row.testScore;
  form.value.homeworkScore = row.homeworkScore;
  form.value.totalScore = row.totalScore;
  formVisible2.value = true;
};

const editScore = (row) => {
  form.value.stunumber = row.stunumber;
  form.value.name = row.name;
  form.value.testScore = row.testScore;
  form.value.homeworkScore = row.homeworkScore;
  formVisible.value = true;
};

const handleSearch = () => {
  if (searchName.value.trim() !== "") {
    const filteredData = data.tableData.filter((item) =>
      item.name.toLowerCase().includes(searchName.value.toLowerCase())
    );
    data.tableData = [...filteredData];
  } else {
    data.tableData = [...originalTableData.value];
  }
};

const handleComplete = () => {
  if (
    form.value.testScore < 0 ||
    form.value.testScore > 100 ||
    form.value.homeworkScore < 0 ||
    form.value.homeworkScore > 100
  ) {
    ElMessage.error("成绩必须在0到100之间！");
    return;
  }

  form.value.totalScore =
    Number(form.value.testScore) + Number(form.value.homeworkScore);

  const updatedStudent = data.tableData.find(
    (student) => student.name === form.value.name
  );
  if (updatedStudent) {
    updatedStudent.testScore = form.value.testScore;
    updatedStudent.homeworkScore = form.value.homeworkScore;
    updatedStudent.totalScore = form.value.totalScore;
  }

  ElMessage.success("修改成功！");
  formVisible.value = false;
};

const handleCurrentChange = (currentPage) => {
  data.currentPage = currentPage;
};
</script>
  <style scoped>
.card {
  background-color: #fff;
  border-radius: 5px;
  padding: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.input-container {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
</style>