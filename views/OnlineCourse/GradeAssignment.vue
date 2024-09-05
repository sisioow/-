<template>
  <!-- 右侧部分 -->
  <div class="card" style="margin-bottom: 10px">
    <!-- 头部 -->
    <div style="display: flex; align-items: flex-start">
      <p style="margin: 0; color: black; font-weight: bold; font-size: 20px">
        作业批改
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
  </div>
  <!-- 查询和选择框 -->
  <!-- 查询栏 -->
  <div class="card" style="margin-bottom: 10px">
    <div
      style="display: flex; justify-content: space-between; align-items: center"
    >
      <!-- 选择框 -->
      <el-select
        v-model="value"
        clearable
        placeholder="选择章节"
        style="text-align: center; width: 260px"
        popper-class="select-popper"
        @change="handleChapterChange"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>

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
      <!-- 表格内容 -->
      <!-- 在您的 <el-table> 组件中，prop 属性用于定义每一列应该显示数据对象中的哪个属性。 -->
      <el-table :data="filteredTableData" :fit="true" style="width: 100%">
        <el-table-column
          prop="number"
          label="学生学号"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="homeworkChapter"
          label="作业章节名称"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="uploadedHomework"
          label="上传的文件/作业"
          align="center"
        >
          <template #default="{ row }">
            <el-link
              type="primary"
              :underline="false"
              @click="handleViewFile(row.uploadedHomework)"
            >
              {{ row.uploadedHomework }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column label="得分" align="center">
          <template #default="{ row }">
            <el-input
              v-model="row.Score"
              @change="handleScoreChange(row)"
            ></el-input>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

  <!-- 分页符 使用flex布局 未实现逻辑！！！-->
  <div class="card" style="display: flex; justify-content: flex-end">
    <el-pagination
      background
      layout="prev, pager, next"
      :total="1"
    ></el-pagination>
  </div>
</template>
  
  
  
  <script setup>
import { ref, computed } from "vue";

// 定义需要使用的数据

const value = ref("");
const options = [{ value: "1", label: "章节1" }];

// 表格数据
const tableData = ref([
  {
    number: "2",
    name: "杨兵",
    homeworkChapter: "第一章",
    uploadedHomework: "null",
    Score: 27,
  },
  // 这里可以继续添加更多数据
]);

// 多选框筛选逻辑 使用计算属性
const handleChapterChange = (newValue) => {
  value.value = newValue;
};
// 计算属性，根据选择的章节过滤表格数据
const filteredTableData = computed(() => {
  // 此外，我注意到您的 tableData 中的 homeworkChapter 字段使用的是中文数字和章节名称，
  // 而在 filteredTableData 的过滤条件中使用的是阿拉伯数字和章节名称。这可能是导致过滤不成功的原因。

  // 确保 value.value 是字符串形式的数字  要进行转化 否则过滤失败
  if (value.value) {
    // 将数字转换为中文数字
    const chapterMap = {
      1: "一",
      2: "二",
      3: "三",
      4: "四",
    };
    const chapterInChinese = `第${chapterMap[value.value]}章`;
    return tableData.value.filter(
      (item) => item.homeworkChapter === chapterInChinese
    );
  } else {
    return tableData.value;
  }
});

//查询按钮逻辑
const searchName = ref("");
// 当点击查询按钮时触发过滤操作

const originalTableData = ref([...tableData.value]);
const handleSearch = () => {
  if (searchName.value) {
    // 从原始数据中过滤
    tableData.value = originalTableData.value.filter((item) =>
      item.name.includes(searchName.value)
    );
  } else {
    // 如果没有搜索内容，则重置为原始数据
    tableData.value = originalTableData.value;
  }
};

// 处理得分变化
const handleScoreChange = (row) => {
  // 在这里可以添加一些验证逻辑，确保得分符合要求
  // 这里暂时没有添加验证逻辑，您可以根据需要进行补充

  // 更新表格数据中对应学生的得分
  const student = tableData.value.find((item) => item.number === row.number);
  if (student) {
    student.Score = row.Score;
  }
};
</script>
  
  <style scoped>
.card {
  background-color: #fff;
  border-radius: 5px;
  padding: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>