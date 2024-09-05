<template>
  <!-- 右侧部分 -->
  <div class="add-admin">
    <!-- 头部 -->
    <div class="card" style="margin-bottom: 10px">
      <span style="font-size: 18px; font-weight: bold">添加管理员</span>
      <span style="font-size: 14px; margin-left: 16px"
        >请设置课程的相关简介</span
      >
    </div>
    <!-- 查询栏 -->
    <div class="card" style="margin-bottom: 10px">
      <div style="display: flex">
        <!-- <el-select v-model="value" clearable placeholder="全部分组" style="width: 200px;;text-align: left; padding: 0; margin-left: 40px;">
    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
  </el-select>  -->
        <div style="margin-left: 550px">
          <el-input
            placeholder="输入学生姓名/昵称进行搜索"
            v-model="searchName"
            style="width: 300px; margin-right: 5px"
            clearable
          ></el-input>
          <el-button type="primary" round @click="handleSearch">查询</el-button>
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
          style="width: 100%; border-radius: 4px; margin-top: 30px; padding: 0"
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
            width="200"
            lign="center"
          ></el-table-column>
          <el-table-column
            prop="stu_number"
            label="学生学号"
            width="200"
            lign="center"
          ></el-table-column>

          <el-table-column
            prop="address"
            label="操作"
            lign="center"
            show-overflow-tooltip
          >
            <template v-slot:default="scope">
              <el-button
                size="mini"
                @click="handleAdminConfirmation(scope.$index)"
                >设为管理员</el-button
              >
              <el-button
                size="mini"
                type="danger"
                @click="handleRemoveAdminConfirmation(scope.$index)"
                >移除管理员</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
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
</template>

<script setup>
import axios from "axios";

import { ref, reactive, onMounted, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

/* // 定义选项数据
const options = [
{ value: '选项1', label: '黄金糕' },
{ value: '选项2', label: '双皮奶' },
{ value: '选项3', label: '蚵仔煎' },
{ value: '选项4', label: '龙须面' },
{ value: '选项5', label: '北京烤鸭' }
]; */

const multipleSelection = ref([]);
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
  ], // 确保tableData是一个空数组
  currentPage: 1,
  pageSize: 9,
  multipleSelection: [],
});

//方法
const currentPageData = computed(() => {
  const start = (data.currentPage - 1) * data.pageSize;
  const end = start + data.pageSize;
  return data.tableData.slice(start, end);
});
const handleCurrentChange = (currentPage) => {
  data.currentPage = currentPage;
};
// Fetch data from backend
const fetchDataCombined = async () => {
  const apiUrl =
    "http://10.60.60.179:8080/unitHomework/getUnitHomeworkScoreByUnitId?userId=5&unitId=16";
  // http://10.71.6.132:8080/stuSemester/findStuSemesterBySemesterId?semester_id=1
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
/* 
    // Handle selection change in the table
    const handleSelectionChange = (val) => {
      multipleSelection.value = val;
    };

    // Handle search logic
    const originalTableData = ref([]);
    const handleSearch = () => {
      const name = searchName.value.trim().toLowerCase();
      if (name !== '') {
        tableData.value = originalTableData.value.filter(item =>
          item.nickname.toLowerCase().includes(name) ||
          item.name.toLowerCase().includes(name)
        );
      } else {
        tableData.value = originalTableData.value;
      }
    };

    // Set admin function
    const handleSetAdmin = (index) => {
      if (index >= 0 && index < tableData.value.length) {
        tableData.value[index].isAdmin = true;
        ElMessage({
          type: 'success',
          message: '设置成功！'
        });
      } else {
        ElMessage({
          type: 'error',
          message: '设置失败：无效的索引！'
        });
      }
    };

    // Confirm set admin operation
    const handleAdminConfirmation = (index) => {
      ElMessageBox.confirm(
        '确定要将此用户设置为管理员吗？',
        '确认设置',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        handleSetAdmin(index);
      }).catch(() => {
        ElMessage({
          type: 'info',
          message: '已取消设置管理员操作'
        });
      });
    };

    // Remove admin function
    const handleRemoveAdmin = (index) => {
      if (index >= 0 && index < tableData.value.length) {
        tableData.value[index].isAdmin = false;
        ElMessage({
          type: 'success',
          message: '移除管理员权限成功！'
        });
      } else {
        ElMessage({
          type: 'error',
          message: '移除管理员权限失败：无效的索引！'
        });
      }
    };

    // Confirm remove admin operation
    const handleRemoveAdminConfirmation = (index) => {
      ElMessageBox.confirm(
        '确定要移除此用户的管理员权限吗？',
        '确认移除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        handleRemoveAdmin(index);
      }).catch(() => {
        ElMessage({
          type: 'info',
          message: '已取消移除管理员权限操作'
        });
      });
    };

    // On component mount, fetch data from backend
    fetchDataFromBackend(); */
//让是否为管理员权限在表格中展示为是/否
/* const tableDataForDisplay = computed(() => {
  return data.tableData.map(item => ({
    ...item,
    isAdminDisplay: item.isAdmin ? '是' : '否' // 数据类型为true/false展示为是/否
  }));
}); */

// 处理选中项变化方法
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
// 设置为管理员函数
const handleSetAdmin = (index) => {
  if (index >= 0 && index < data.tableData.length) {
    data.tableData[index].isAdmin = true;
    ElMessage({
      type: "success",
      message: "设置成功！",
    });
  } else {
    ElMessage({
      type: "error",
      message: "设置失败：无效的索引！",
    });
  }
};

// 确认设置管理员操作
const handleAdminConfirmation = (index) => {
  ElMessageBox.confirm("确定要将此用户设置为管理员吗？", "确认设置", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      handleSetAdmin(index);
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消设置管理员操作",
      });
    });
};

// 移除管理员权限函数
const handleRemoveAdmin = (index) => {
  if (index >= 0 && index < data.tableData.length) {
    data.tableData[index].isAdmin = false;
    ElMessage({
      type: "success",
      message: "移除管理员权限成功！",
    });
  } else {
    ElMessage({
      type: "error",
      message: "移除管理员权限失败：无效的索引！",
    });
  }
};

// 确认移除管理员权限操作
const handleRemoveAdminConfirmation = (index) => {
  ElMessageBox.confirm("确定要移除此用户的管理员权限吗？", "确认移除", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      handleRemoveAdmin(index);
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消移除管理员权限操作",
      });
    });
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

