<template>
  <div class="historical-course-detail">
            <!-- 历史课程简介 （接口：主页点击进入课程介绍） @click="emit"-->
            <div>
                <h2 id="hist-intro">历史课程简介</h2>
                <!-- <el-button type="primary " class="ml-2" >查询</el-button> -->
                <el-divider />
                <div class="flex flex-wrap item-center mr-2">
                    <div class="detail">
                        <div class="demo-image__placeholder">
                            <div class="image-container">
                                <img :src="this.courseImg" />
                            </div>
                        </div> 
                        <p>课程名称：{{courseName}}</p>
                        <p>所属大学：桂林电子科技大学</p>
                        <p>所属时间：{{ histClassIntro.start_time }}—{{ histClassIntro.end_time }}</p>
                        <p>课程简介：{{ histClassIntro.semester_intro }}</p>
                    </div>
                </div>
            </div> 
            <!-- 历史学生成绩  (接口：学生成绩管理)-->
            <div style="margin-top: 50px;">  
              <h2 id="hist-stu-score">历史学生成绩</h2>
              <el-divider />
              <!-- 搜索框 -->
              <div class="flex flex-wrap items-center">
                <div id="stuSearch" style="margin-left: auto;">
                  <el-input v-model="input" style="width: 240px" placeholder="输入学生姓名/学号进行搜索" />
                  <el-button type="primary " class="ml-2" @click="handleSearch">查询</el-button>
                </div>
              </div>
              <!-- 列表 （接口：学生成绩管理）-->
              <div class="example-pagination-block" style="width: auto;height: 490px">
                <div class="example-demonstration">
                  <el-table :data="filteredTableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"  class="histStu" style="width: 100%;margin-top: 15px;">
                    <!-- {{ testArray.data }}   :data="stuAsgnmt"-->
                    <el-table-column prop="studentId" label="学生学号"></el-table-column>
                    <el-table-column prop="name" label="学生姓名" ></el-table-column>
                    <el-table-column prop="homeworkScore" label="测试成绩"></el-table-column>
                    <el-table-column prop="testScore" label="作业成绩" ></el-table-column>
                    <el-table-column prop="totalScore" label="总成绩"></el-table-column>
                  </el-table>
                </div>
              </div>
              <el-pagination layout="prev, pager, next"  :total="tableData.length"  :page-size="10"  @current-change="handleCurrentChange"   style="justify-content: center;"></el-pagination>
            </div>
            <!-- 课程章节内容 （接口：读取单元课程资源）-->
            <div style="margin-top: 50px;">
                <h2 id="hist-course-content">课程章节内容</h2>
                <el-divider />
                <div class="demo-collapse" >
                  <el-collapse v-model="activeNames" @change="handleChange">
                    <el-collapse-item 
                      v-for="(item, index) in unitResource" 
                      :key="item.unit_id" 
                      :title="'第'+item.unit_id+'章    '+item.unit_title" 
                      :name="String(index + 1)"
                      style="margin-left: 20px;"
                    >
                      <div 
                        v-for="resource in item.resourceDTOS" 
                        :key="resource.resource_name" 
                        style="margin-left: 10px; font-size: 14px; width: 100%"
                      >
                        <el-form :model="form" label-width="auto" style="max-width: 600px">
                          <el-form-item class="colitem">
                            <el-button type="primary" plain size="small" style="margin-right: 10px;">{{ resource.resource_type }}</el-button>
                            <p class="mx-1">{{ resource.resource_name }}</p>
                          </el-form-item>
                        </el-form>
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                </div>
            </div>
            <!-- 历史公告 （接口：读取发布的公告列表）-->
            <div style="margin-top: 50px;">
                <h2 id="hist-an">历史公告</h2>
                <el-divider />
                <div>
                  <ul class="ann">
                    <li>
                      <!-- 游戏开发课程公告{{ histClassIntro.notice_content }} {{ histClassIntro.notice_title}}-->
                      <el-text size="large">{{ histClassIntro.notice_title }}</el-text></li>
                    <li>
                      <el-text class="mx-1" type="info">{{ histClassIntro.notice_content}}</el-text>
                    </li>
                    <li>
                      <!-- <el-text type="info" size="small" style="  float:right;margin-right: 25px ;margin-top: 10px;">2024/04/01 11:57</el-text> -->
                    </li>
                  </ul>
                  <!-- <el-divider style="margin-top: 10px;" /> -->
                </div>
            </div>
          </div>
          <el-backtop :right="100" :bottom="100" />
  </template>
  
  <script>
    import axios from 'axios';
  
  
    // const courseId=1;
  
  export default {
    name:'HistoricalCourseDetail',
    data(){
      return {
        //#region 分页数据
        tableData: [], // 原始成绩数据
        filteredTableData: [], // 过滤后的成绩数据
        currentPage: 1,
        pageSize: 10,
        //#endregion
  
        courseId:'',
        courseName:'',
        courseImg:'',
        testArray:[],
        histClassIntro:[],
        histClsCh:[],
        unitResource:[],
        
        input:'',
        stuAsgnmt: [
          {stuId: '2021001',stuName: '张三',examGrade: '85',hwGrade: '95',totalGrade: '90'},
        ],
        activeNames: ['1'],
        items: [
          {
            title: '课程单元标题1',
            content: ['小节标题1'],
            vidioTitle:'视频标题1'
          },
          {
            title: '作业标题1',
          },
          {
            title: '课程单元资料1',
          },
          
        ],
  
      };
    },
  
  
    mounted(){
      this.courseId = this.$route.query.courseId;
      this.courseName=this.$route.query.courseName;
      this.courseImg=this.$route.query.courseImg;
      console.log('资源 Received courseId:', this.courseId);
      console.log('资源 Received courseName:', this.courseName);
      console.log('资源 Received courseImg:', this.courseImg);
      console.log("开始请求");
      this.fetchHistClsIntro();
      this.fetchStuHWInfo();
      this.fetchHistClsCh();
    },
  
    methods:{//TODO:传参给后端
      //传参给导航栏
      emit(){
        //第一个参数：自定义事件名称  第二个参数：传的值
        this.$emit('hhhh',this.histClassIntro.start_time,this.courseName,this.courseImg);
      },
  
    //#region 前端查询
    handleSearch() {
    // 非空进行查询，空显示全部
    if (!this.input) {
      this.filteredTableData = [...this.tableData]; // 如果输入为空，则显示所有数据
    } else {
      this.filteredTableData = this.tableData.filter(item => {
        //忽略大小写
        return item.name.toLowerCase().includes(this.input.toLowerCase()) ||
               item.studentId.toLowerCase().includes(this.input.toLowerCase());
      });
    }
    // 重置当前页到第一页
    this.currentPage = 1;
    
    // 打印过滤后的数据，以便调试
    console.log('Filtered data:', this.filteredTableData);
  },
      //#endregion
  
      //#region 分页逻辑
      handleCurrentChange(newPage) {
        this.currentPage = newPage;
        // this.updateTableData();
      },
      updateTableData() {
        this.tableData = this.tableData.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize);
      },
      //#endregion
  
      //#region 接口：主页点击进入课程介绍 
      fetchHistClsIntro(){
        axios({
          method:'get',
          url:'http://10.33.102.194:8080/semesters/showbase?semester_id='+this.courseId,
        }).then(response=>{
          const responseData = response.data;
          console.log("请求完毕,课程简介信息：", responseData);
          this.histClassIntro=responseData.data;
          this.histClassIntro.start_time=this.histClassIntro.start_time.split(' ')[0];
          this.histClassIntro.end_time=this.histClassIntro.end_time.split(' ')[0];
          this.emit();
        }).catch(error => {
            if (error.response) {
              console.log(this.courseId),
              console.error('网页请求失败', error.response.data);
              console.error('状态码：', error.response.status);
              console.error('头部信息：', error.response.headers);
            } else if (error.request) {
              console.error('请求已发出，但没有收到响应', error.request);
            } else {
              console.error('Error', error.message);
            }
          });
      },
      //#endregion
  
      //#region 接口：学生成绩管理 
      fetchStuHWInfo(){
          axios({
            method:'get',    
            url:'http://10.33.102.194:8080/semesters/showStudentsScore?semester_id=1',//请求地址
          }).then(response=>{
            const responseData = response.data;
            this.tableData=responseData.data;
            this.filteredTableData=this.tableData;
            console.log('tableData:',this.tableData);
            console.log("学生成绩请求完毕", responseData.data);
            this.testArray=response.data;
          }) .catch(error => {
            if (error.response) {
              console.error('网页请求失败', error.response.data);
              console.error('状态码：', error.response.status);
              console.error('头部信息：', error.response.headers);
            } else if (error.request) {
              console.error('请求已发出，但没有收到响应', error.request);
            } else {
              console.error('Error', error.message);
            }
          });
        },
        //#endregion 
  
      //#region 接口：读取单元课程资源 
      fetchHistClsCh(){
        axios({
        method:'get',
        url:'http://10.33.102.194:8080/resources/showUnitsandRes?semester_id=1'
      }).then(response=>{
        const responseData = response.data;
        this.unitResource=responseData.data;
        console.log("单元课程资源请求完毕:", this.unitResource);
        this.histClsCh=response.data;
      }).catch(error => {
          if (error.response) {
            console.error('网页请求失败', error.response.data);
            console.error('状态码：', error.response.status);
            console.error('头部信息：', error.response.headers);
          } else if (error.request) {
            console.error('请求已发出，但没有收到响应', error.request);
          } else {
            console.error('Error', error.message);
          }
        });
      },
      //#endregion
  
    }
  }
  </script>
  
  <style scoped>
    .ann{
      list-style: none;
        padding: 0;
        margin: 0;
        margin: 25px;
        /* margin-top: 25px */
    }
    .ann li{
      margin-top:10px;
    }
  
  .example-pagination-block + .example-pagination-block {
    margin-top: 10px;
  }
  .example-pagination-block .example-demonstration {
    margin-bottom: 16px;
  }
  
    .image-container {
        width: 300px; /* 设置div的宽度 */
        height: 200px; /* 设置div的高度 */
        overflow: hidden; /* 如果图片大小超过div的大小，将会隐藏多余的部分 */
        position: relative; /* 为了使用绝对定位的子元素 */
    }
  
    .image-container img {
        display: block; /* 确保图片显示为块级元素，占据完整宽度和高度 */
        max-width: 100%; /* 限制图片的最大宽度 */
        max-height: 100%; /* 限制图片的最大高度 */
        width: auto; /* 保持图片的宽高比 */
        height: auto; /* 保持图片的宽高比 */
        position: absolute; /* 绝对定位，使图片居中 */
        top: 50%; /* 垂直居中 */
        left: 50%; /* 水平居中 */
        transform: translate(-50%, -50%); /* 偏移自身宽高的一半，实现精确居中 */
    }
  
    .colitem :hover{
      color: #409EFF;
    }
    .p{
    color: #606266;
    }
    .flex-wrap {
      display: flex;
      align-items: center;
    }
    .mr-2 {
      margin-left: 50px; 
    }
    .ml-2 {
      margin-left: 15px; /* 或者你想要的空间 */
    }
    .historical-course-detail {
      padding: 20px;
      background: linear-gradient(to right, #ffffff, #f0f0f0);
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      animation: fadeIn 0.5s ease-in-out;
      max-width: 1200px;
      margin: 40px auto;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .historical-course-detail:hover {
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
    .el-table {
      margin-bottom: 20px;
    }
    
    .el-button {
      /* margin-top: 20px; */
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
    .demo-image__placeholder .block {
    padding: 30px 0;
    text-align: center;
    border-right: solid 1px var(--el-border-color);
    display: inline-block;
    width: 49%;
    box-sizing: border-box;
    vertical-align: top;
    }
    .demo-image__placeholder .demonstration {
      display: block;
      color: var(--el-text-color-secondary);
      font-size: 14px;
      margin-bottom: 20px;
    }
    .demo-image__placeholder .el-image {
      padding: 0 5px;
      max-width: 300px;
      max-height: 200px;
    }
  
    .demo-image__placeholder.image-slot {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      background: var(--el-fill-color-light);
      color: var(--el-text-color-secondary);
      font-size: 14px;
    }
    .demo-image__placeholder .dot {
      animation: dot 2s infinite steps(3, start);
      overflow: hidden;
    }
  
  
    /* 讨论区部分 */
    /* .discussion {
    padding: 20px;
    background: linear-gradient(to right, #ffffff, #f0f0f0);
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    animation: fadeIn 0.5s ease-in-out;
    width: 90%;
    margin: 40px auto;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  } */
  
  /* .discussion:hover {
    transform: translateY(-10px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  } */
  
  h2 {
    color: #409EFF;
    font-size: 24px;
    margin-bottom: 20px;
  }
  
  .el-tabs {
    width: 100%;
  }
  
  .el-list-item {
    margin-bottom: 10px;
    font-size: 16px;
  }
  
  .el-divider {
    margin: 10px 0;
  }
  
  .topic-title {
    font-size: 18px;
    font-weight: bold;
  }
  
  .topic-info {
    font-size: 14px;
    color: rgba(96, 102, 102, 0.8);
  }
  
  .author, .category {
    color: #409EFF;
  }
  
  </style>
  