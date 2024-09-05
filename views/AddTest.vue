<template>
  <div class="add-test">
    <h2>添加测试</h2>
    <el-dropdown split-button type="primary" @click="fetchTests" class="mr-2">
      选择单元    
      <template #dropdown>
        <el-scrollbar style="max-height: 250px;">
          <el-dropdown-menu>
            <el-dropdown-item v-for="unit in units" :key="unit.unit_id" @click="selectUnityId(unit)">
              {{ unit.unit_title }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-scrollbar>
      </template>
    </el-dropdown>
    <el-dropdown split-button type="primary" @click="fetchPapers" class="mr-2">
      选择试卷    
      <template #dropdown>
        <el-scrollbar style="max-height: 250px;">
          <el-dropdown-menu>
            <el-dropdown-item v-for="paper in papers" :key="paper.paper_id" @click="selectPaper(paper)">
              {{ paper.paper_title }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-scrollbar>
      </template>
    </el-dropdown>

    <el-form :model="form" label-width="120px">
      <el-form-item label="测试单元">
        <el-input v-model="form.unit_title"></el-input>
      </el-form-item>
      <el-form-item label="测试试卷">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="持续时间">
        <el-date-picker
            v-model="duration"
            type="datetimerange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="YYYY-MM-DD HH:mm:ss"
            date-format="YYYY/MM/DD ddd"
            value-format="YYYY-MM-DD HH:mm:ss"
            time-format="A hh:mm:ss"
          />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
    <el-divider></el-divider>
    <h2>已添加的测试</h2>
    <el-table :data="tests" style="width: 100%">
      <el-table-column prop="title" label="测试试卷"></el-table-column>
      <el-table-column prop="start_time" label="开始时间"></el-table-column>
      <el-table-column prop="end_time" label="结束时间"></el-table-column>
      <el-table-column label="操作" >
       <template #default="scope"> 
         <el-button @click="deleteTest(scope.row)" type="primary" size="small">删除测试</el-button>
       </template>
     </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from 'axios'
//import moment from 'moment'

export default {

  name: 'AddTest',
  data() {
    return {
      form: {
        unit_title:'',
        unityid:'',
        name: '',
        startTime: '',
        endTime: ''
      },

      duration: [], // duration will be an array with [start, end]
      startTime: '',
      endTime: '',
      
      idFromInterface: null,//用于存储当前的课程id
      selectedUnity: null, // 用于存储选择的章节
      units: [],//存储从后端获取的units数据
      papers: [], // 存储从后端获取的Paper数据
      tests: [] // 用于存储已添加的测试数据
    };
  },
  created() {
    this.fetchUnits();
    this.fetchTests(); 
  },
  methods: {

    fetchUnits() {
      this.idFromInterface = localStorage.getItem("semester_id");
      axios.get(`http://10.60.60.179:8080/unit/findUnitBySemesterId?semester_id=${this.idFromInterface}`)
        .then(response => {
          this.units = response.data.data; // 将从后端获取的单元数据赋给单元数组
          this.$message.success('成功获取单元列表');
        })
        .catch(error => {
          console.error('获取单元列表时出错:', error);
          this.$message.error('获取单元列表时出错');
        });
    },
    onSubmit() {
      // 格式化日期
      //const formattedStartDate = moment(this.duration[0]).format('YYYY-MM-DD HH:mm:ss');
      //const formattedEndDate = moment(this.duration[1]).format('YYYY-MM-DD HH:mm:ss');
      if (this.form.unityid && this.form.name && this.duration) {
        const data = {
        unit_id: this.form.unityid,
        title: this.form.name,
        start: this.duration[0] ,
        end: this.duration[1]
      };
        // 发送POST请求保存数据到数据库
        axios.post('http://10.60.60.179:8080/unitTest/setUnitTest',data)
          .then(response => {
            // 成功保存后将数据添加到tests数组中
            this.fetchTests();
            this.form.unityid = '';
            this.form.name = '';
            this.form.startTime = '';
            this.form.endTime = '';
            this.$message.success('测试已保存');
            console.log('Data sent to server successfully:', response.data);
          })
          .catch(error => {
            console.error('保存测试时出错:', error);
            this.$message.error('保存测试时出错');
          });
      } else {
        this.$message.error('所有字段均不能为空');
      }        
    },
    onCancel() {
      this.$router.push('/');
    },
    fetchPapers() {
      axios.get('http://10.60.60.179:8080/paperStore/getPaperStore')
        .then(response => {
          this.papers = response.data.data; // 将从后端获取的Paper数据赋给papers数组
          this.$message.success('成功获取单元列表');
        })
        .catch(error => {
          console.error('获取单元列表时出错:', error);
          this.$message.error('获取单元列表时出错');
        });
    },
    selectPaper(paper) {
      this.form.name = paper['paper_title'];
      this.$message.success(`已选择Paper: ${paper['paper_title']}`);
    },
    selectUnityId(unit) {
      this.form.unit_title = unit['unit_title'];
      this.selectedUnity = unit.unit_id;
      this.form.unityid = unit.unit_id; // 设置选中章节对应的unityid
      // 在选择章节后调用 fetchTests() 方法
      this.fetchTests();
    },
    fetchTests() {
      if (!this.selectedUnity) {
        console.error('未选择章节，无法获取测试数据');
        return;
      }

    axios.get(`http://10.60.60.179:8080/unitTest/getUnitTestById?unit_id=${this.selectedUnity}`)
      .then(response => {
        this.tests = response.data.data; // 将从后端获取的测试数据赋给tests数组
        this.$message.success('成功获取已添加测试列表');
      })
      .catch(error => {
        console.error('获取已添加的测试时出错:', error);
        this.$message.error('获取已添加的测试时出错');
      });
    },
    fetchQuestions() {
      // 此处继续实现获取题目的逻辑，根据需求修改
      this.$message.warning('此功能尚未实现');
    },

    deleteTest(test) {
      const index = this.tests.indexOf(test);
      if (index !== -1) {
        // 发送删除请求到后端（如果需要）
        axios.delete(`http://10.60.60.179:8080/unitTest/deleteUnitTest?unit_test_id=${test.unit_test_id}`)
          .then(() => {
            this.tests.splice(index, 1);
            this.$message.success('测试已删除');
          })
          .catch(error => {
            console.error('删除测试时出错:', error);
            this.$message.error('删除测试时出错');
          });
      }
    }
  }
};
</script>

<style scoped>
.add-test {
  padding: 20px;
  background: linear-gradient(to right, #ffffff, #f0f0f0);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.5s ease-in-out;
  width: 90%;
  margin: 40px auto;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.add-test:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

h2 {
  color: #409EFF;
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  animation: slideIn 0.5s ease;
}

.mr-2 {
margin-left: 120px; 
margin-bottom: 20px;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-button {
  margin-right: 10px;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.el-button:hover {
  background-color: #66b1ff;
  transform: scale(1.05);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
