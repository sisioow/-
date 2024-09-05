<template>
  <div>
    <el-dialog title="新增单元" v-model="addModuleDialogVisible">
      <el-input v-model="newModuleName" placeholder="请输入单元名称"></el-input>
      <span class="dialog-footer">
        <el-button @click="addModuleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addModule">确定</el-button>
      </span>
    </el-dialog>

    <el-button type="primary" @click="addModuleDialogVisible = true">新增单元</el-button>
    <div v-for="(module, index) in modules" :key="module.id" class="online-course">
      <div class="biaoti">
        <span>{{ module.name }}</span>
        <!-- <span class="time">{{ formatDateTime(module.createdAt) }}</span> -->
        <button class="btn" @click="editModuleName(module)">修改</button>
        <button class="btn" @click="confirmDelete(module.id)"> 删除 </button>
        <span class="hui" @click="toggleExpand(index)" style="float: right;">{{ module.showDetails ? '收起' : '展开' }}</span>
      </div>




      <div v-if="module.showDetails">
        <div>
          <el-button type="text" :class="{ 'active': module.currentPage === 'a' }" @click="showPage(module,index, 'a')">添加作业</el-button>
          <el-button type="text" :class="{ 'active': module.currentPage === 'b' }" @click="showPage(module,index, 'b')">添加视频</el-button>
          <el-button type="text" :class="{ 'active': module.currentPage === 'c' }" @click="showPage(module,index, 'c')">添加资料</el-button>
        </div>

        <!-- a -->
        <!-- a -->
        <div v-if="module.currentPage === 'a'">
        <!-- <form>
  <ul class="form-list">
    <li>
      <label for="assignment-name">作业名称：</label>
      <input type="text" id="assignment-name" name="assignment-name" required>
    </li>
    <li>
      <label for="assignment-content">作业内容：</label>
      <textarea id="assignment-content" name="assignment-content" rows="4" required></textarea>
    </li>
     <li>
      <label for="start-date">开始时间：</label>
      <input type="datetime-local" id="start-date" name="start-date" required>
    </li>
    <li>
      <label for="end-date">结束时间：</label>
      <input type="datetime-local" id="end-date" name="end-date" required>
    </li>
  </ul>
  <button type="submit">提交</button>
</form> -->
<form @submit.prevent="submitForm(module)">
    <ul class="form-list">
      <li>
        <label for="assignment-name">作业名称：</label>
        <input type="text" id="assignment-name" name="assignment-name" v-model="unitHomework.title" required>
      </li>
      <li>
        <label for="assignment-content">作业内容：</label>
        <textarea id="assignment-content" name="assignment-content" v-model="unitHomework.content" rows="4" required></textarea>
      </li>
      <li>
        <label for="start-date">开始时间：</label>
        <input type="datetime-local" id="start-date" name="start-date" v-model="unitHomework.startTime" required>
      </li>
      <li>
        <label for="end-date">结束时间：</label>
        <input type="datetime-local" id="end-date" name="end-date" v-model="unitHomework.endTime" required>
      </li>
    </ul>
    <button type="submit">提交</button>
  </form>
<el-divider></el-divider>
<h2>已添加的作业</h2>
    <el-table :data="module.assignments" style="width: 100%">
      <el-table-column prop="name" label="作业名称"></el-table-column>
      <el-table-column prop="startTime" label="开始时间"></el-table-column>
      <el-table-column prop="endTime" label="结束时间"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
        <el-button type="text" @click="editAssignmentDialog( row)">编辑</el-button>
        <el-button type="text" @click="deleteAssignment(row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog v-model="dialogVisible">
    <el-form ref="editForm" :model="editForm">
    <el-form-item label="作业名称" prop="name">
      <el-input v-model="editForm.name"></el-input>
    </el-form-item>
    <el-form-item label="开始时间" prop="startTime">
      <el-date-picker v-model="editForm.startTime" type="datetime" @change="handleStartTimeChange" placeholder="选择开始时间"></el-date-picker>
    </el-form-item>
    <el-form-item label="结束时间" prop="endTime">
      <el-date-picker v-model="editForm.endTime" type="datetime" @change="handleEndTimeChange" placeholder="选择结束时间"></el-date-picker>
    </el-form-item>
  </el-form>
    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveAssignment(module)">保存</el-button>
      </div>
    </template>
  </el-dialog>


  <!-- <h2>已添加的作业</h2>
    <el-table :data="module.assignments" style="width: 100%">
      <el-table-column prop="name" label="作业名称"></el-table-column>
      <el-table-column prop="startTime" label="开始时间"></el-table-column>
      <el-table-column prop="endTime" label="结束时间"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button type="text" @click="editAssignmentDialog(row)">编辑</el-button>
          <el-button type="text" @click="deleteAssignment(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table> -->

    <!-- 编辑作业的对话框或表单 -->
    <!-- <el-dialog :visible.sync="editDialogVisible" title="编辑作业"> -->
      <!-- <el-dialog :visible="editDialogVisible" @update:visible="val => editDialogVisible = val" title="编辑作业">
  <el-form ref="editForm" :model="editForm">
    <el-form-item label="作业名称" prop="name">
      <el-input v-model="editForm.name"></el-input>
    </el-form-item>
    <el-form-item label="开始时间" prop="startTime">
      <el-date-picker v-model="editForm.startTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择开始时间"></el-date-picker>
    </el-form-item>
    <el-form-item label="结束时间" prop="endTime">
      <el-date-picker v-model="editForm.endTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束时间"></el-date-picker>
    </el-form-item>
  </el-form>
  <template v-slot:footer>
    <div class="dialog-footer">
      <el-button @click="editDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="saveEditedAssignment">保存</el-button>
    </div>
  </template>
</el-dialog> -->
      </div>

      <!-- b -->
      <div v-else-if="module.currentPage === 'b'">
        <label for="resources">选择视频：</label>
        <form @submit.prevent="addResource(module,selectedResourceId)">
      <select class="xialakuang" v-model="selectedResourceId">
        <option v-for="(resource, index) in resources" :key="index" :value="resource">{{ resource.resource_name }}</option>
      </select>
      <button type="submit">发布视频</button>
    </form>

    <el-divider></el-divider>
<h2>已添加的视频</h2>
<el-table :data="module.videos" style="width: 100%">
          <el-table-column prop="name" label="资料名称"></el-table-column>
          <!-- <el-table-column prop="id" label="资料id"></el-table-column> -->
          <el-table-column label="操作">
            <template v-slot="{ row }">
              <el-button type="text" @click="deleteVideo(module, row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>


      <!-- c -->
      <div v-if="module.currentPage === 'c'">
        <label for="resources">选择资料：</label>
        <form @submit.prevent="addResource(module,selectedResourceId)">
      <select class="xialakuang" v-model="selectedResourceId">
        <option v-for="(resource, index) in resources" :key="index" :value="resource">{{ resource.resource_name }}</option>
      </select>
      <button type="submit">发布资料</button>
    </form>
        
        <el-divider></el-divider>
<h2>已添加的资料</h2>
   <el-table :data="module.information" style="width: 100%">
          <el-table-column prop="name" label="资料名称"></el-table-column>
          <!-- <el-table-column prop="id" label="资料id"></el-table-column> -->
          <el-table-column label="操作">
            <template v-slot="{ row }">
              <el-button type="text" @click="deleteMaterial(module, row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        
      </div>
      </div>
    </div>


  </div>
</template>

<script>
import axios from 'axios';


export default {
  name: 'EditCourseContent',
  data() {
    return {
      editDialogVisible: false,
      editForm: {
        id: null,
        name: '',
        startTime: '',
        endTime: ''
      },
      // 作业数据
      assignments: [
        // { name: '作业1', startTime: '2024-07-12', endTime: '2024-07-15' },
        // { name: '作业2', startTime: '2024-07-13', endTime: '2024-07-16' },
        // { name: '作业3', startTime: '2024-07-14', endTime: '2024-07-17' }
      ],//列表a的数据
      unitHomework: {
        unit_id:'',
        maxscore:100,
        title: '',
        content: '',
        startTime: '',
        endTime: '',
        Url:null,
        status:-1
      },
      // 视频数据
      videos: [],
      // 资料数据
      information: [],
      modules: [],  // 初始化为一个空数组，或者根据实际需求初始化为其他值

      // 单元下的所有初始数据
      module: {},
      addModuleDialogVisible: false,
      newModuleName: '',
      videoName: '',
      videoDescription: '',
      selectedFile: null,
      isHovering: false,  // 添加一个数据来追踪是否悬停
      dialogVisible: false,
      // selectedCourse: 1, // 默认选中的课程ID，这里设置为1，可以从上一页传入
      resources: [],     // 存放选中课程下所有资料的数组
      selectedResource: null,  // 当前选中的资料ID
      
      editIndex: -1  // 用于记录当前编辑的行索引
    };
  },
  computed: {
    formattedStartTime() {
    if (this.editForm.startTime) {
      const date = new Date(this.editForm.startTime);
      return date.toISOString(); // 转换为 ISO 格式，例如：'2023-10-07T00:00:00.000Z'
    }
    return null;
  },
  formattedEndTime() {
    if (this.editForm.endTime) {
      const date = new Date(this.editForm.endTime);
      // 设置结束时间为当天的最后一秒
      date.setHours(23, 59, 59, 999);
      return date.toISOString(); // 转换为 ISO 格式，例如：'2023-10-07T23:59:59.999Z'
    }
    return null;
  }
  },

  //获取所有单元
 
  mounted() {
    this.idFromInterface = localStorage.getItem("semester_id");
    console.log('在线课堂收到的semester_id：',this.idFromInterface);
    // 在组件创建时发送请求获取数据
    this.fetchModules();
  },
  methods: {
    handleEndTimeChange(value) {
    if (value) {
      // Ensure seconds are set to 59
      value.setSeconds(59);
      // Format the date to ISO 8601 format without milliseconds
      const isoFormattedDate = value.toISOString().slice(0, 19) + 'Z';
      // Update editForm.endTime with the formatted date
      this.editForm.endTime = isoFormattedDate;
    } else {
      this.editForm.endTime = null; // Handle if no date is selected
    }
  },
  handleStartTimeChange(value) {
    if (value) {
      // Ensure seconds are set to 00 (if you want to start from the beginning of the selected minute)
      value.setSeconds(0);
      // Format the date to ISO 8601 format without milliseconds
      const isoFormattedDate = value.toISOString().slice(0, 19) + 'Z';
      // Update editForm.startTime with the formatted date
      this.editForm.startTime = isoFormattedDate;
    } else {
      this.editForm.startTime = null; // Handle if no date is selected
    }
  },

    //发布作业
    submitForm(module) {
      //时格式转化
      let start = new Date(this.unitHomework.startTime);
      let startt = start.toISOString().slice(0, 16); // 获取格式化后的日期时间字符串（不带时区信息）
      startt=startt+'Z';
      let end = new Date(this.unitHomework.endTime);
      let endd = end.toISOString().slice(0, 16); // 获取格式化后的日期时间字符串（不带时区信息）
      endd=endd+'Z';
      console.log('开始时间',endd);
      // return startt + 'Z'; // 添加Z时区信息
    // submitForm() {


      console.log('添加作业的单元id',module)
      const data={
        unitId:module.id,
        maxScore:this.unitHomework.maxscore,
        title:this.unitHomework.title,
        content:this.unitHomework.content,
        startTime:startt,
        endTime:endd,
        attachmentUrl:this.unitHomework.Url,
        status:this.unitHomework.status
      }
      console.log('作业内容2',data);
      //  发送数据到后端
       axios.post('http://10.33.94.6:8080/unitHomework/addUnitHomework', data)
      // axios.post('http://10.33.94.6:8080/addUnitHomework',{
      //   data:{
      //     unitId:module.id,
      //   maxScore:this.unitHomework.maxscore,
      //   title:this.unitHomework.title,
      //   content:this.unitHomework.content,
      //   startTime:startt,
      //   endTime:endd,
      //   attachmentUrl:this.unitHomework.Url,
      //   status:this.unitHomework.status
      //   }
      // })
        .then(response => {
          // 处理成功响应
          console.log('作业提交成功', response.data);
          // 可以根据后端返回的响应进行其他逻辑处理
        })
        .catch(error => {
          // 处理错误情况
          console.error('作业提交失败', error);
        });


      // // 只有前端处理
      // this.module.assignments.push({
      //   name: this.unitHomework.title,
      //   startTime: this.unitHomework.startTime,
      //   endTime: this.unitHomework.endTime
      // });

      // // 清空表单数据
      // this.unitHomework.title = '';
      // this.unitHomework.content = '';
      // this.unitHomework.startTime = '';
      // this.unitHomework.endTime = '';
    },
    

    //获取所有单元
    fetchModules() {
  // 使用界面获取的 id 作为 semester_id 参数
  axios.get(`http://10.60.60.179:8080/unit/findUnitBySemesterId?semester_id=${this.idFromInterface}`)
    .then(response => {
      if (response.data.status === 1) {
        // 数据获取成功
        this.modules = response.data.data.map(unit => ({
          id: unit.unit_id, // 使用 unit_id 作为 module 的 id
          name: unit.unit_title, // 使用 unit_title 作为 module 的 name
          courses: [], // courses 为空数组
          showCourses: true,
          addModuleDialogVisible: false,
          newModuleName: '',
          createdAt: new Date(),
          currentPage: null,
          showDetails: false,
          information: [], // 添加一个空数组用于存放资料列表
          videos:[],
          assignments:[]
        }));

        // 获取每个模块的资料列表
        // this.modules.forEach(module => {
        //       this.fetchMaterialList(module.id);
        //     });

      } else {
        console.error('数据获取失败');
      }
    })
    .catch(error => {
      console.error('数据获取失败', error);
    });
},

    // 修改单元名
    editModuleName(module) {
      // 模拟修改操作，可以在实际项目中替换为用户输入或其他交互方式
      const newName = prompt(`请输入新的模块名称`);
      if (!newName) return; // 如果未输入名称，取消修改
      // // 更新前端显示
      module.name = newName;

            // 构建要发送的数据对象，只更新 unit_title，其他字段保持不变
            const dataToUpdate = {
        unit_id: module.id,
        semester_id: this.idFromInterface, // 如果需要semester_id可以获取数
        unit_title: newName, // 你需要在这里替换为实际修改后的名称
        unit_module: module.unit_module,
        resource_cnt: module.resource_cnt
        // 如果还有其他字段需要保持不变，继续添加
      };
      // 发送PUT请求更新数据
      axios.put(`http://10.60.60.179:8080/unit/resetUnit?unit_id=${module.id}`, dataToUpdate)
        .then(response => {
          if (response.data.status === 1) {
            console.log('更新成功:', response.data);
            // 更新本地模块数据，刷新界面等操作
            module.name = dataToUpdate.unit_title; // 更新界面显示的名称
          } else {
            console.error('更新失败:', response.data.message);
          }
        })
        .catch(error => {
          console.error('更新失败:', error);
        });
    },

    // 删除单元
    confirmDelete(moduleId) {
      if (confirm('确认删除该单元吗？')) {
        this.deleteModule(moduleId);
      }
    },
    deleteModule(moduleId) {
      // 向后端发送删除请求
      axios.delete(`http://10.60.60.179:8080/unit/deleteUnitById?unit_id=${moduleId}`)
        .then(response => {
          if (response.data.status === 1) {
            // 删除成功后更新前端数据
            this.modules = this.modules.filter(module => module.id !== moduleId);
            console.log('删除成功');
          } else {
            console.error('删除失败');
          }
        })
        .catch(error => {
          console.error('删除失败', error);
        });
    },

    // 从数据库获得资料信息实现

    // // 获取视频库视频到下拉列表
    fetchResources() {
      const courseId = 1; // 假设当前课程的ID为1，根据实际情况修改
      axios.get(`http://10.33.102.194:8080/resources/showppts?course_id=${courseId}`) 
        .then(response => {
          this.resources = response.data.data; // 假设后端返回的数据是一个包含资料对象的数组
          console.log('获取成功',response.data.data[1]);
        })
        .catch(error => {
          console.error('获取课程资料失败', error);
        });
    },

    // 获取视频库视频到下拉列表
   fetchVideos() {
      const courseId = 1; // 假设当前课程的ID为1，根据实际情况修改
      axios.get(`http://10.33.102.194:8080/resources/showvideos?course_id=${courseId}`) 
        .then(response => {
          this.resources = response.data.data; // 假设后端返回的数据是一个包含资料对象的数组
          console.log('获取成功',response.data.data[1]);
        })
        .catch(error => {
          console.error('获取课程视频失败', error);
        });
    },

    // 发布资料到单元上
    addResource(module, resource) {
      // 获取当前单元选择的资料ID
      console.log('当前单元id', module.id, '当前选择资料id', resource.resource_id);
      if (!resource) {
        console.error('请选择一个资料');
        return;
      }
      // 发送请求将资料ID与当前单元的unit_id关联
      const data = {
        unit_id: module.id,
        resource_id: resource.resource_id
      };
      axios.post('http://10.33.102.194:8080/unit/setUnit/addResource', data)
        .then(response => {
          console.log('资料添加成功', response.data);
          // 发布成功回调，在列表里更新已发布的数据
          this.fetchMaterialList(module.id, 'ppt');
          this.fetchMaterialList(module.id, 'video');
        })
        .catch(error => {
          console.error('资料添加失败', error);
        });
      console.log('选择的资源 ID:', resource.resource_id);
      this.selectedResourceId = null;
    },

    // 从数据库得到当前单元下已发布的资料（视频、资料）
    fetchMaterialList(id,Type) {
      const unitId = id; // 当前单元的 ID
      const resourceType = Type; // 资料类型，可以根据实际需要修改

      axios.get(`http://10.33.102.194:8080/unit/showUnitResouList?unit_id=${unitId}&resource_type=${resourceType}`)
        .then(response => {
          if (response.data.status === 1) {
            if(Type=="ppt"){//显示资料
              // 数据获取成功
            const module = this.modules.find(mod => mod.id === unitId);
            module.information = response.data.data.map(material => ({
              name: material.resource_name, // 假设后端返回的资料名称字段为 resource_name
              id: material.resource_id, // 假设后端返回的资料 ID 字段为 resource_id
            }));
            }
            else{//显示视频
              const module = this.modules.find(mod => mod.id === unitId);
            module.videos = response.data.data.map(material => ({
              name: material.resource_name, // 假设后端返回的资料名称字段为 resource_name
              id: material.resource_id, // 假设后端返回的资料 ID 字段为 resource_id
            }));
            }
          } else {
            console.error('获取资料列表失败');
          }
        })
        .catch(error => {
          console.error('获取资料列表失败', error);
        });
    },

  
    // 删除资料
    deleteMaterial(module, material) {
      this.$confirm('确定删除该资料吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 用户点击确定执行删除操作
        this.removeFromDatabase(module, material); // 调用删除数据库的方法
        const index = this.information.indexOf(material);
        if (index !== -1) {
          module.information.splice(index, 1);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }
      }).catch(() => {
        // 用户点击取消，无需操作
      });
    },
    // 后端
    removeFromDatabase(module, material) {
      // 假设这里有一个后端接口或方法来删除数据库中的资料记录
      // 示例：使用 axios 发起 DELETE 请求
      console.log('模块id',module.id,'资源',material.id);
      axios.delete('http://10.33.102.194:8080/unit/deleteUnitResource', {
  data: {
    unit_id: module.id,
    resource_id: material.id
  }
})
        .then(response => {
          if (response.data.status === 1) {
            const index = module.information.indexOf(material);
            if (index !== -1) {
              module.information.splice(index, 1); // 从列表中移除该资料
              console.log('删除资料成功');
            }
          } else {
            console.error('删除资料失败');
          }
        })
        .catch(error => {
          console.error('删除资料失败1', error);
        });
    },

    // 删除视频
    deleteVideo(module, material) {
      this.$confirm('确定删除该视频吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 用户点击确定执行删除操作
        this.DeleteVideo(module, material); // 调用删除数据库的方法
        const index = this.videos.indexOf(material);
        if (index !== -1) {
          module.videos.splice(index, 1);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }
      }).catch(() => {
        // 用户点击取消，无需操作
      });
    },
    DeleteVideo(module, material) {
      // 假设这里有一个后端接口或方法来删除数据库中的资料记录
      // 示例：使用 axios 发起 DELETE 请求
      console.log('模块id',module.id,'资源',material.id);
      axios.delete('http://10.33.102.194:8080/unit/deleteUnitResource', {
  data: {
    unit_id: module.id,
    resource_id: material.id
  }
})
        .then(response => {
          if (response.data.status === 1) {
            const index = module.videos.indexOf(material);
            if (index !== -1) {
              module.videos.splice(index, 1); // 从列表中移除该资料
              console.log('删除视频成功');
            }
          } else {
            console.error('删除视频失败');
          }
        })
        .catch(error => {
          console.error('删除视频失败1', error);
        });
    },

    // 作业显示
    fetchAssignments(unitId) {
      axios.get(`http://10.33.158.16:8080/unitHomework/getUnitHomeworkByUnitId?unit_id=${unitId}`)
        .then(response => {
          // this.assignments = response.data; // 将接口返回的数据赋值给assignments
          // console.log('作业获取成功', response.data);
          const module=this.modules.find(mod=>mod.id===unitId);
          module.assignments=response.data.map(homework=>({
            id:homework.homeworkId,
            maxscore:homework.maxScore,
            name:homework.title,
            homecontent:homework.content,
            startTime:homework.startTime,
            endTime:homework.endTime,
            Url:homework.attachmentUrl,

          }))
          
        })
        .catch(error => {
          console.error('作业获取失败:', error);
        });
    },

    // 删除作业
    deleteAssignment(row) {
      this.$confirm('确定删除该作业吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 用户点击确定执行删除操作
        this.removeFromhomework(row); // 调用删除数据库的方法
        const index = this.assignments.indexOf(row);
        if (index !== -1) {
          this.assignments.splice(index, 1);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }
      }).catch(() => {
        // 用户点击取消，无需操作
      });
    },
    removeFromhomework(row) {
      // 这里假设有一个后端接口或者方法来处理数据库的删除操作
      // 示例：假设你的后端有一个删除作业的接口，以 axios 为例
      console.log('删除目标作业',row.id);
      axios.delete(`http://10.33.94.6:8080/unitHomework/deleteUnitHomeWork/${row.id}`)
        .then(response => {
          if (response.data.status === 1) {
                      // 处理删除成功的逻辑
          console.log('删除作业成功',row.id);
                      // }
          }
        })
        .catch(error => {
          // 处理删除失败的逻辑
          console.error('删除作业失败:', error);
        });
    },

    // 作业修改
    editAssignmentDialog(row) {
      console.log('点击的作业:',row);
      // // 打开编辑对话框，并将作业信息填充到编辑表单中
      // this.editForm.id = row.id;
      // this.editForm.name = row.name;
      // this.editForm.startTime = row.startTime;
      // this.editForm.endTime = row.endTime;
      // this.editDialogVisible = true;
      this.editForm.id = row.id; // 设置当前编辑的作业的 ID
  this.editForm.name = row.name; // 设置作业名称
 this.editForm.startTime = row.startTime;
      this.editForm.endTime = row.endTime;
  this.dialogVisible = true; // 显示编辑对话框
    },


  //   saveEditedAssignment(module) {
  //     // 发送更新作业请求
  //     const updatedAssignment = {
  //   // homeworkId: id,
  //   maxScore:100,
  //   unitId:module.id,
  //   // title: name,
  //   title: this.editForm.name,
  //   startTime: this.editForm.startTime,
  //       endTime: this.editForm.endTime,
  //   content:"homecontentt",
  //   // attachmentUrl:"Url",
  //   status:-1,
  // };
  //     console.log('作业:',updatedAssignment.unitId);

  //     axios.post(`http://10.33.94.6:8080/unitHomework/updateUnitHomework/${this.editForm.id}`, updatedAssignment)


  //       .then(response => {
  //         console.log('作业更新成功:', response.data);
  //         // 可以选择在这里更新本地的 assignments 列表
  //         this.editDialogVisible = false; // 关闭对话框
  //       })
  //       .catch(error => {
  //         console.error('作业更新失败:', error);
  //       });
  //   },

    saveAssignment(module) {

       // 发送更新作业请求
       const updatedAssignment = {
    homeworkId: this.editForm.id,


    maxScore:100,
    unitId:module.id,
    // title: name,
    title: this.editForm.name,
    startTime: this.editForm.startTime,
        endTime: this.editForm.endTime,
    content:"homecontentt",
    // attachmentUrl:"Url",
    status:-1,
  };
      console.log('作业:',updatedAssignment);
      console.log('作业id:',this.editForm.id);
      
      axios.post(`http://10.33.158.16:8080/unitHomework/updateUnitHomework`, updatedAssignment, {

  timeout: 50000 // 设置超时时间为 10 秒
})
        .then(response => {
          console.log('作业更新成功:', response.data);
          // 可以选择在这里更新本地的 assignments 列表
          this.editDialogVisible = false; // 关闭对话框
        })
        .catch(error => {
          console.error('作业更新失败:', error);
        });





  //     if (this.editIndex !== -1) {
  //       // 验证开始时间不能晚于结束时间
  //       if (new Date(this.editForm.startTime) > new Date(this.editForm.endTime)) {
  //         this.$message.error('开始时间不能晚于结束时间');
  //         return;
  //       }

  //       this.assignments[this.editIndex].name = this.editForm.name;
  //       this.assignments[this.editIndex].startTime = this.editForm.startTime;
        
  //       this.assignments[this.editIndex].endTime = this.editForm.endTime;
  //       this.assignments[this.editIndex].maxscore = this.editForm.maxScore;
  //       // this.assignments[this.editIndex].homecontentt = this.editForm.content;
  //       // this.assignments[this.editIndex].Url= this.editForm.attachmentUrl;
  //     }



  //     console.log('当前单元id',this.editForm);

  //     const { name, startTime, endTime} = this.editForm;
  // const updatedAssignment = {
  //   // homeworkId: id,
  //   maxScore:100,
  //   unitId:module.id,
  //   title: name,
  //   content:"homecontentt",
  //   // attachmentUrl:"Url",
  //   status:-1,

  //   startTime: startTime,
  //   endTime: endTime,
  // };
  // console.log('修改作业内容id',updatedAssignment);
  // // 发送更新请求
  
  // axios.post('http://10.33.158.16:8080/unitHomework/updateUnitHomework/${id}' ,updatedAssignment)
  //   .then(response => {
  //     console.log('作业更新成功:', response.data);

  //     // 更新前端数据
  //     const module = this.modules.find(mod => mod.id === updatedAssignment.unitId);
  //     const assignmentIndex = module.assignments.findIndex(assignment => assignment.id === updatedAssignment.homeworkId);
  //     if (assignmentIndex !== -1) {
  //       // 更新对应作业信息
  //       module.assignments[assignmentIndex].name = updatedAssignment.title;
  //       module.assignments[assignmentIndex].startTime = updatedAssignment.startTime;
  //       module.assignments[assignmentIndex].endTime = updatedAssignment.endTime;
  //     }

  //     // 关闭对话框
      this.dialogVisible = false;
  //   })
  //   .catch(error => {
  //     console.error('作业更新失败:', error);
  //   });
    },
    // 只能判断开始时间和节数时间
    // saveAssignment() {
    //   if (this.editIndex !== -1) {
    //     // 验证开始时间不能晚于结束时间
    //     if (new Date(this.editForm.startTime) > new Date(this.editForm.endTime)) {
    //       this.$message.error('开始时间不能晚于结束时间');
    //       return;
    //     }
        
    //     this.assignments[this.editIndex].name = this.editForm.name;
    //     this.assignments[this.editIndex].startTime = this.editForm.startTime;
    //     this.assignments[this.editIndex].endTime = this.editForm.endTime;
    //   }
    //   this.dialogVisible = false; // 保存后关闭对话框
    // },

    handleUploadClick() {
    // 确保在组件渲染完成后再调用 $refs
    this.$nextTick(() => {
    if (this.$refs.videoUploadInput instanceof HTMLElement) {
      this.$refs.videoUploadInput.click();
    } else {
      console.error('Ref videoUploadInput is not an HTMLElement');
    }
  });
  },
  handleFileChange(event) {
    // 处理文件选择变化事件
    this.selectedFile = event.target.files[0];
  },
    handleSubmit() {
      // 可以在这里实现表单提交逻辑，例如将视频名称、简介和文件一起发送到服务器

      // 以下仅为示例，实际应用中需要根据具体情况处理
      console.log('提交视频信息：', this.videoName, this.videoDescription, this.selectedFile);

      // 清空表单数据
      this.videoName = '';
      this.videoDescription = '';
      this.selectedFile = null;
    },

    // 新增单元
    addModule() {
  if (!this.newModuleName) {
    this.$message.error('名称不能为空');
    return;
  }
  const params = {
    semester_id: 1,  // 根据实际情况确定
    unit_title: this.newModuleName,
    unit_module: -1
  };
  // 发送 POST 请求
  axios.post('http://10.60.60.179:8080/unit/setUnit', params)
    .then(response => {
      // 请求成功处理
      const responseData = response.data;
      if (responseData.status === 1) {
        // 设置成功
        const newModule = {
          id: String(responseData.data.unit_id),
          name: responseData.data.unit_title,
          courses: [],
          showCourses: true,
          addModuleDialogVisible: false,
          newModuleName: '',
          createdAt: new Date(),
          currentPage: 'a',
          showDetails: true
        };
        this.modules.push(newModule);
        this.addModuleDialogVisible = false;
        this.newModuleName = '';
        this.$message.success(responseData.msg);
      } else {
        // 设置失败，显示错误信息
        this.$message.error(responseData.msg);
      }
    })
    .catch(error => {
      // 请求失败处理
      this.$message.error('设置单元失败：' + error.message);
    });
},


    //展开收起按钮
    toggleExpand(index) {
      this.modules.forEach((module, idx) => {
        if (idx === index) {
          module.showDetails = !module.showDetails; // 切换展开收起状态
          // console.log(this.modules);
        } 
        // 
        
      });
    },


    showPage(module,moduleIndex, page) {
      this.modules[moduleIndex].currentPage = page;
      if(page=='a'){
        // 在组件创建时获取作业数据
        this.modules.forEach(module => {
              this.fetchAssignments(module.id);
            });
        // this.fetchAssignments(16);
      }

      if(page=='b') {
        this.fetchVideos();//下拉框显示视频
        // 获得已发布的视频
        this.modules.forEach(module => {
              this.fetchMaterialList(module.id,"video");
            });
      }

      if(page=='c') {
        this.fetchResources();//下拉框显示资料
        // 获得已发布的资料
        this.modules.forEach(module => {
              this.fetchMaterialList(module.id,"ppt");
            });
      }
    
  },
   mounted() {
    const courseId = this.$route.query.courseId;
    console.log('资源 Received courseId:', courseId);
    /* const courseId = this.$route.params.courseId;
    console.log(this.$route.params);
    console.log('Received courseId:', courseId); */
    // 可以在这里进行根据 courseId 获取课程详情等操作
  }
}
};
</script>

<style scoped>
.xialakuang{
  font-size: larger;
    padding: 7px;
    margin: 5px;
    background: #ffffff;
    border: 3px solid #949494;
    color: #474747;
}
.btn{
  margin-left: 10px;
  color: #999999;
  border: none;
  background-color: rgba(255, 255, 255, 0.5); /* 白色背景，透明度为50% */
  font-weight: bold;
  font-size:small;
}
.label-upload:hover {
  cursor: pointer;
  color: blue; /* 或者你喜欢的颜色 */
}
.form-list {
  display: flex;
  flex-wrap: wrap;
  list-style-type: none;
  padding: 0;
}

.form-list li {
  margin-bottom: 15px;
  flex: 0 0 calc(50% - 10px); /* 计算每个列表项的宽度，50% 减去一定的间隔 */
  max-width: calc(50% - 10px); /* 设置每个列表项的最大宽度 */
  box-sizing: border-box;
  padding-right: 10px; /* 右侧间隔 */
}

.form-list label {
  display: block;
  margin: 5px;
  color: #484848;
}

.form-list input[type="text"],
.form-list textarea,
.form-list input[type="datetime-local"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
  color: #6c6c6c;
}

.form-list textarea {
  resize: vertical;
}

button[type="submit"] {
  background-color: #2a99ee;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button[type="submit"]:hover {
  background-color: #216fd4;
}

.biaoti{
  padding: 10px;
  border-bottom: 1px solid #b7b7b7;
  font-weight: bold; /* 将标题加粗 */
  font-size: larger;
}
.time {
  margin-left: 20px;
  color: #cfcfcf;
  font-size: 14px;
}
.active {
  color: rgb(109, 109, 255); /* 按钮a对应页面时字体颜色为蓝色 */
}
.hui{
  color: #afafaf;
  font-size: small;
}
.course-actions {
  position: absolute;
  bottom: 10px;
  right: 10px;
  padding: 8px 16px;
  z-index: 1; /* 确保按钮在内容上方显示 */
}

.tab.active {
border-bottom: 2px solid #007bff;
color: #007bff;
animation: tabAnimation 2s infinite;
}
.tab {
padding: 10px 20px;
cursor: pointer;
transition: background 0.3s ease-in-out;
}
.animated-tab {
animation: tabTextAnimation 2s infinite;
}
.tab-bar {
display: flex;
background-color: white;
padding: 10px;
border-bottom: 1px solid #e0e0e0;
margin-bottom: 20px;
}
.online-course {
  position: relative;
padding: 20px;
background: linear-gradient(to right, #ffffff, #f0f0f0);
border-radius: 12px;
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
animation: fadeIn 0.5s ease-in-out;
/* max-width: 800px; */
width: 90%;
margin: 20px auto;
transition: transform 0.3s ease, box-shadow 0.3s ease;
}



h2 {
color: #409EFF;
text-align: center;
margin-bottom: 20px;
font-size: 24px;
animation: slideIn 0.5s ease;
}

.el-table {
margin-bottom: 20px;
}

.el-button {
margin-top: 20px;
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