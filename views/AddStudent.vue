<template>
  <div class="tab-bar">
    <span
      class="tab"
      :class="{ active: currentTab === 'all' }"
      @click="changeTab('all')"
      data-target="all"
      >全部</span
    >
    <span
      class="tab"
      :class="{ active: currentTab === 'select' }"
      @click="changeTab('select')"
      data-target="select"
      >已选学生</span
    >
    <span
      class="tab"
      :class="{ active: currentTab === 'add' }"
      @click="changeTab('add')"
      data-target="add"
      >添加学生</span
    >
  </div>
  <div v-if="currentTab === 'all' || currentTab === 'select'">
    <!-- 右侧部分 -->
    <div class="add-student">
      <!-- 头部 -->
      <div class="card" style="margin-bottom: 10px">
        <span style="font-size: 18px; font-weight: bold">已选学生</span>
        <span style="font-size: 14px; margin-left: 16px"
          >请设置课程的相关简介</span
        >
      </div>
      <!-- 查询栏 -->
      <div class="card" style="margin-bottom: 10px">
        <div style="display: flex">
          <!-- <el-select v-model="value" clearable placeholder="全部分组" style="width: 200px;;text-align: left; padding: 0; margin-left: 40px; ">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select> -->
          <div style="margin-left: 550px">
            <el-input
              placeholder="输入学生姓名/昵称进行搜索"
              v-model="searchName"
              style="width: 300px; margin-right: 5px"
              clearable
            ></el-input>
            <el-button type="primary" round @click="handleSearch"
              >查询</el-button
            >
            <!-- 图标已经导入了但显示不出来？ -->
            <el-link
              style="font-size: 14px; margin-left: 30px"
              @click="handleBatchDelete"
              >批量删除</el-link
            >
          </div>
        </div>
      </div>
      <!-- 表格 -->
      <div class="card" style="margin-bottom: 10px">
        <div>
          <!-- 表格内容 -->
          <el-table
            :data="currentPageData"
            tooltip-effect="dark"
            :fit="true"
            style="
              width: 100%;
              border-radius: 4px;
              margin-top: 30px;
              padding: 0;
            "
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              label="全选"
              width="100"
            ></el-table-column>
            <el-table-column
              prop="nickname"
              label="学生昵称"
              width="250"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="username"
              label="学生姓名"
              width="250"
              lign="center"
            ></el-table-column>
            <el-table-column
              prop="stu_number"
              label="学生学号"
              width="250"
              lign="center"
            ></el-table-column>
            <!-- <el-table-column prop="group" label="分组" width="150" lign="center"></el-table-column> -->
            <el-table-column
              prop="address"
              label="操作"
              lign="center"
              show-overflow-tooltip
            >
              <template v-slot:default="scope">
                <!-- <el-button size="mini" @click="handleEdit(scope.row)">修改分组</el-button> -->
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDeleteConfirmation(scope.$index)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <!--分页符 使用flex布局-->
      <div class="card" style="display: flex; justify-content: flex-end">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="data.tableData.length"
          :page-size="pageSize"
          :current-page="currentPage"
          @update:current-page="handleCurrentChange"
          style="text-align: right; margin-right: 40px; margin-top: 0"
        ></el-pagination>
      </div>
      <!--    修改成绩对话弹窗
 <el-dialog  width="35%" title="分组信息" v-model="formVisible">
  <el-form :model="form" label-width="100px">
    <el-form-item label="学生学号">
      <el-input v-model="form.id" autocomplete="off" readonly></el-input>
    </el-form-item>
  </el-form>
  <el-form :model="form" label-width="100px">
    <el-form-item label="学生姓名">
      <el-input v-model="form.name" autocomplete="off" readonly></el-input>
    </el-form-item>
  </el-form>
  <el-form :model="form" label-width="100px">
    <el-form-item label="分组">
      <el-input v-model="form.group" autocomplete="off" type="number"></el-input>
 
    </el-form-item>
  </el-form>
 
   <template v-slot:footer>
    <span class="dialog-footer">
      <el-button @click="handleComplete">完成</el-button>
    </span>
  </template>
</el-dialog> -->
    </div>
  </div>
  <div v-if="currentTab === 'all' || currentTab === 'add'">
    <!-- 第二部分 添加学生页面-->
    <div class="card" style="margin-bottom: 10px">
      <span style="font-size: 18px; font-weight: bold">添加学生</span>
      <span style="font-size: 14px; margin-left: 20px"
        >请设置课程的相关简介</span
      >
    </div>

    <div class="card" style="margin-bottom: 10px">
      <span style="font-size: 14px; margin-left: 30px"
        >对于已完成认证的本校学生，可以直接输入其学号加入对应课程</span
      >
      <div style="margin-top: 10px">
        <el-input
          placeholder="请输入学号"
          v-model="studentIdInput"
          style="width: 300px; margin-right: 40px; margin-left: 30px"
          clearable
        ></el-input>
        <el-button type="primary">直接添加</el-button>
        <!-- 文件输入框 -->
        <input
          type="file"
          ref="fileInput"
          style="display: none"
          @change="handleFileChange"
        />
        <el-button
          type="primary"
          style="margin-left: 10px"
          @click="triggerFileInput"
          >批量添加</el-button
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";

import { ref, reactive, onMounted, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
const studentIdInput = ref("");

const multipleSelection = ref([]);
// const value = ref(null);
// // 定义选项数据
// const options = [
//   { value: '选项1', label: '黄金糕' },
//   { value: '选项2', label: '双皮奶' },
//   { value: '选项3', label: '蚵仔煎' },
//   { value: '选项4', label: '龙须面' },
//   { value: '选项5', label: '北京烤鸭' }
// ];

const data = reactive({
  value: "",
  selectedRows: [],
  tableData: [
    { nickname: "叫什么不重要", username: "杨兵", stu_number: "2100420101" },
    { nickname: "叫什么不重要", username: "杨兵", stu_number: "2100420102" },
    { nickname: "叫什么不重要", username: "杨兵", stu_number: "2100420103" },
    { nickname: "叫什么不重要", username: "杨兵", stu_number: "2100420104" },
    { nickname: "叫什么不重要", username: "杨兵", stu_number: "2100420105" },
    { nickname: "叫什么不重要", username: "ljj", stu_number: "2100420106" },
    { nickname: "叫什么不重要", username: "ljj", stu_number: "2100420108" },
    { nickname: "叫什么不重要", username: "ljj", stu_number: "2100420109" },
    { nickname: "叫什么不重要", username: "ljj", stu_number: "2100420110" },
    { nickname: "叫什么不重要", username: "ljj", stu_number: "2100420111" },
    { nickname: "叫什么不重要", username: "ljj", stu_number: "2100420112" },
    { nickname: "叫什么不重要", username: "ljj", stu_number: "2100420113" },
    { nickname: "叫什么不重要", username: "ljj", stu_number: "2100420114" },
    { nickname: "叫什么不重要", username: "ljj", stu_number: "2100420115" },
    { nickname: "叫什么不重要", username: "是谁", stu_number: "2100420116" },
    { nickname: "混入其中", username: "john", stu_number: "2100420117" },
    { nickname: "叫什么不重要", username: "lkkk", stu_number: "2100420118" },
  ],
  currentPage: 1,
  pageSize: 9,
  // 可能还有更多学生的数据...
  multipleSelection: [],
});

//方法
//切换小页面逻辑
const currentTab = ref("all");
function changeTab(tab) {
  currentTab.value = tab;
}
//查询按钮逻辑
const searchName = ref("");
// 当点击查询按钮时触发过滤操作

const originalTableData = ref([...data.tableData]);

const handleSearch = () => {
  const name = searchName.value.trim().toLowerCase();
  if (name !== "") {
    data.tableData = originalTableData.value.filter(
      (item) =>
        item.nickname.toLowerCase().includes(name) ||
        item.username.toLowerCase().includes(name)
    );
  } else {
    data.tableData = originalTableData.value;
  }
};
// //修改分组弹窗
// const formVisible = ref(false);
// const form = ref({
//   name: '',
//   group: 0,
// });
// // 修改分组的方法
// const handleEdit = (row) => {
//   form.value.id = row.id;
//   form.value.name = row.name;
//   form.value.group = row.group;
//   formVisible.value = true;
// }
// 完成按钮的方法
//  const handleComplete = () => {
//   // 验证分数是否在0到100之间
//   if (form.value.group < 0 || form.value.group > 1000 ) {
//     ElMessage.error('分组必须在0到1000之间！');
//     return;
//   }
// 更新表格中对应学生的数据
//   const updatedStudent = data.tableData.find(student => student.name === form.value.name);
//   if (updatedStudent) {
//     updatedStudent.group = form.value.group;
//   }
//   // 使用Element Plus的Message组件提示修改成功
//   ElMessage({
//     type: 'success',
//     message: '修改成功！'
//   });

//   formVisible.value = false; // 关闭弹窗
// };

// 处理选中项变化方法
const handleSelectionChange = (selection) => {
  multipleSelection.value = selection;
  data.selectedRows = selection;
};

//删除逻辑
const handleDelete = (index) => {
  data.tableData.splice(index, 1);
};
const handleDeleteConfirmation = (index) => {
  ElMessageBox.confirm("确定要删除这条记录吗？", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      handleDelete(index);
      ElMessage({
        type: "success",
        message: "删除成功！",
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消删除操作",
      });
    });
};

// 批量删除函数
const handleBatchDelete = () => {
  ElMessageBox.confirm("确定要批量删除选中的记录吗？", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      data.selectedRows.forEach((row) => {
        const index = data.tableData.indexOf(row);
        if (index !== -1) {
          data.tableData.splice(index, 1);
        }
      });
      ElMessage({
        type: "success",
        message: "批量删除成功！",
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消批量删除操作",
      });
    });
};
const currentPageData = computed(() => {
  const start = (data.currentPage - 1) * data.pageSize;
  const end = start + data.pageSize;
  return data.tableData.slice(start, end);
});
const handleCurrentChange = (currentPage) => {
  data.currentPage = currentPage;
};
//后端链接
const fetchDataCombined = async () => {
  const apiUrl =
    "http://10.60.60.179:8080/stuSemester/findStuSemesterBySemesterId?semester_id=1";
  // http://10.71.6.132:8080/stuSemester/findStuSemesterBySemesterId?semester_id=1
  //http://10.33.102.194:8080/semesters/addstusem?semester_id=1
  try {
    const response = await axios.get(apiUrl);
    if (response.status === 200) {
      // Map data and update tableData.value

      //data.tableData = Array.isArray(response.data) ? response.data : [];
      // data.tableData = Object.values(response.data);
      console.log("获取数据成功:", response.data); // Log success message to console
    } else {
      console.error(
        "Error fetching data:",
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.error("连接失败！！！:", error.message); // Log connection failure error
    ElMessage.error("获取数据失败"); // Show error message using Element UI's ElMessage
  }
};
onMounted(() => {
  fetchDataCombined(); // 在组件挂载后调用 fetchDataCombined 函数
});

/* const handleFileChange = (event) => {
      const file = event.target.files[0];
      const fileType = file.type;

      if (fileType.includes('sheet') || fileType.includes('excel')) {
        batchAddFromExcelFile(file);
      } else if (fileType.includes('text')) {
        batchAddFromTxtFile(file);
      } else {
        alert('请上传 Excel 或 TXT 文件');
      }
    };

    const batchAddFromExcelFile = (file) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // 假设只处理第一个工作表
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // 将工作表转换为 JSON 数据
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // 批量添加到 tableData 中
        data.tableData.push(...jsonData);
      };

      reader.readAsArrayBuffer(file);
    };

    const batchAddFromTxtFile = (file) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const fileContent = event.target.result;

        // 按行分割内容
        const lines = fileContent.split('\n');
        const parsedData = lines.map(line => {
          const [nickname, name, id, group] = line.split('\t'); // 假设用制表符分隔
          return { nickname, name, id, group };
        }).filter(item => item.nickname); // 过滤掉空行

        // 批量添加到 tableData 中
        data.tableData.push(...parsedData);
      };

      reader.readAsText(file);
    }; */
const triggerFileInput = () => {
  // 触发文件选择的逻辑
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.style.display = "none";
  fileInput.onchange = handleFileChange;
  document.body.appendChild(fileInput);
  fileInput.click();
  document.body.removeChild(fileInput);
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    readFile(file);
  }
};

const readFile = (file) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    const content = event.target.result;
    parseFileContent(content);
  };
  reader.readAsText(file);
};

const parseFileContent = async (content) => {
  const lines = content.trim().split("\n");
  const newData = lines.map((line) => {
    const fields = line.split(",");
    return {
      nickname: fields[0].replace(/(^")|("$)/g, "").trim(),
      username: fields[1].replace(/(^")|("$)/g, "").trim(),
      stu_number: fields[2].replace(/(^")|("$)/g, "").trim(),
    };
  });

  // 更新响应式数据中的 tableData.value
  data.tableData = newData;

  // 示例：输出解析后的数据
  console.log("Parsed data:", newData);
  // 这里可以做进一步的数据处理或更新UI等操作

  // 将有效数据发送到后端 API
  try {
    const response = await axios.post(
      "http://10.33.102.194:8080/semesters/addstusem?semester_id=1",
      newData
    );
    console.log("数据发送成功:", response.data);
  } catch (error) {
    console.error("数据发送失败:", error);
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
.card {
  background-color: #fff;
  border-radius: 5px;
  padding: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
