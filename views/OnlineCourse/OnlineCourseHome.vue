<template>
  <!--大标题：教学内容展示-->
  <div style="margin: 10px;">
      <span style="font-size: 25px;font-weight: 600;">教学单元内容</span>
      <div style="margin-top: 10px;margin-bottom: 10px;">
          <span style="color: red;font-size: 10px;">注意：学生的课程学习页的章节顺序和此处的章节顺序保持一致，请在此调整好章节顺序！</span>
      </div>
  </div>
  <!--章节展示-->
  <el-collapse v-model="activeNames" @change="handleChange">
    <el-collapse-item v-for="section in sections" :key="section.sectionId" :name="section.title">
      <template #title>
        <div class="item-header">
          <el-input v-if="section.editing" v-model="section.title" @blur="stopEditing(section)" @keyup.enter="stopEditing(section)" size="small" placeholder="输入标题"></el-input>
          <span v-else @dblclick="startEditing(section)" style="font-size: 20px;">{{ section.title }}</span>
          <el-button class="el-button-icon" @click="startEditing(section)"><el-icon><Edit/></el-icon></el-button>
          <el-button class="el-button-icon" @click="confirmDeleteSection(section.sectionId)"><el-icon><Delete/></el-icon></el-button>
        </div>
      </template>
      <!--小节展示-->
      <el-card class="box-card" shadow="never" v-for="subsect in section.subsections" :key="subsect.subsectId">
          <template #header>
              <div class="clearfix">
              <el-input v-if="subsect.editing" v-model="subsect.subtitle" @blur="stopEditingSubsection(subsect)" @keyup.enter="stopEditingSubsection(subsect)" size="small" placeholder="输入小节标题"></el-input>
              <span v-else @dblclick="startEditingSubsection(subsect)" style="font-size: 17px;font-weight: 600;">{{ subsect.subtitle }}</span>
              <el-button class="el-button-icon" @click="startEditingSubsection(subsect)"><el-icon><Edit/></el-icon></el-button>
              <el-button class="el-button-icon" @click="confirmDeleteSubsection(section.sectionId,subsect.subsectId)"><el-icon><Delete/></el-icon></el-button>
              <!--点击编辑课程内容获取对应章节id和小节id跳转到编辑页面的vue-->
              <el-button style="float: right; padding: 3px 0" type="text">
                <router-link to="/onlinecourse/editcoursecontent">编辑课程内容</router-link>
              <!-- 传id的点击事件 -->
                <!-- <router-link :to="`editcoursecontent/${section.sectionId}/${subsect.subsectId}`">编辑课程内容</router-link> -->
             
              </el-button>
              </div>
          </template>
          <div v-for="(content, index) in subsect.contents" :key="index" class="text item" style="font-size: 15px;font-weight: 500;">
            <span class="radius" >
               <!--小节内容的展示：视频？文档？作业？测试？-->
                <template v-if="content.type === '1'">视频</template>
                <template v-else-if="content.type === '2'">文档</template>
                <template v-else-if="content.type === '3'">测试</template>
                <template v-else-if="content.type === '4'">作业</template>
            </span>
              {{ content.content_title }}
          </div>
      </el-card>
      <!--添加小节-->
      <el-row style="margin-top: 20px;" padding="20px">
          <!-- 添加小节对话框 -->
          <el-dialog title="添加小节" v-model="addSubsectionDialogVisible" width="30%">
            <el-form ref="postForm" :model="newSubsection" label-width="80px">
              <!--小节标题-->
              <el-form-item label="标题" required>
                <el-input type="input" v-model="newSubsection.subtitle" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-form>
            <template v-slot:footer>
              <span class="dialog-footer">
                <el-button @click="addSubsectionDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addSubsection">添 加</el-button>
              </span>
            </template>
          </el-dialog>
          <el-button @click="openAddSubsectionDialog(section.sectionId)">添加小节</el-button>
          <el-button >添加测试</el-button>
          <el-button >添加作业</el-button>
      </el-row>
    </el-collapse-item>
  </el-collapse>
  <!-- 添加章节对话框 -->
  <el-row style="margin-top: 20px;" padding="20px"><el-button type="primary" @click="addSectionDialogVisible = true">添加章节</el-button></el-row>
  <el-dialog title="添加章节" v-model="addSectionDialogVisible" width="30%">
    <el-form ref="postForm" :model="newSection" label-width="80px">
      <!--章节标题-->
      <el-form-item label="标题" required>
        <el-input type="input" v-model="newSection.title" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <span class="dialog-footer">
        <el-button @click="addSectionDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSection">添 加</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { ElButton, ElInput, ElCollapse, ElCollapseItem, ElDialog, ElForm, ElFormItem, ElMessageBox, ElIcon } from 'element-plus';

export default {
components: {
  ElButton,
  ElInput,
  ElCollapse,
  ElCollapseItem,
  ElDialog,
  ElForm,
  ElFormItem,
  ElIcon
},
data() {
  return {
    activeNames: ['1'],
    addSectionDialogVisible: false, // 控制添加章节对话框的显示
    addSubsectionDialogVisible: false, // 控制添加小节对话框的显示
    sections: [
      {
        sectionId: '1',
        title: '章节1',
        editing: false,
        subsections: [ // 每个章节的子小节
        {
          subsectId: '1',
          subtitle: '小节1',
          contents: [
            {
              type:'1',
              content_title:'视频1',
            },
            {
            type: '2',
            content_title: '文档1',
          }
          ],
          editing: false,
        },
        {
            subsectId: '2',
            subtitle: '小节2',
            contents: [
            {
              type:'1',
              content_title:'视频3',
            },
            {
            type: '2',
            content_title: '文档4',
          }
            ],
          editing: false,
        }
      ]
      }
    ],
    newSection: {
      title: ''
    },
    newSubsection: {
      subtitle: ''
    },
    currentSectionId: null // 当前正在添加小节的章节 ID
  };
},
methods: {
  handleChange(val) {
    console.log(val);
  },
  startEditing(section) {
    section.editing = true;
  },
  stopEditing(section) {
    section.editing = false;
  },
  startEditingSubsection(subsect) {
    subsect.editing = true;
  },
  stopEditingSubsection(subsect) {
    subsect.editing = false;
  },
  //删除章节
  confirmDeleteSection(sectionId) {
    ElMessageBox.confirm(
      '确定删除此章节吗？',
      '删除确认',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(() => {
      this.deleteSection(sectionId);
    }).catch(() => {
      console.log('删除操作已取消');
    });
  },
  deleteSection(sectionId) {
    this.sections = this.sections.filter(section => section.sectionId !== sectionId);
  },
  //删除小节
  confirmDeleteSubsection(sectionId, subsectId) {
    ElMessageBox.confirm(
      '确定删除此小节吗？',
      '删除确认',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(() => {
      this.deleteSubsection(sectionId, subsectId);
    }).catch(() => {
      console.log('删除操作已取消');
    });
  },
  deleteSubsection(sectionId, subsectId) {
    const section = this.sections.find(sec => sec.sectionId === sectionId);
    if (section) {
      section.subsections = section.subsections.filter(subsect => subsect.subsectId !== subsectId);
    }
  },
  //添加章节
  addSection() {
    if (!this.newSection.title) {
      this.$message.error('章节标题不能为空');
      return;
    }

    const newSection = {
      sectionId: (this.sections.length + 1).toString(), // 生成新的章节 ID
      title: this.newSection.title,
      editing: false,
      subsections: []
    };

    this.sections.push(newSection);
    this.addSectionDialogVisible = false;
    this.resetNewSection();
  },
  resetNewSection() {
    this.newSection = {
      title: ''
    };
  },
  //打开添加小节对话框
  openAddSubsectionDialog(sectionId) {
    this.currentSectionId = sectionId;
    this.addSubsectionDialogVisible = true;
  },
  //添加小节
  addSubsection() {
    if (!this.newSubsection.subtitle) {
      this.$message.error('小节标题不能为空');
      return;
    }
    const section = this.sections.find(sec => sec.sectionId === this.currentSectionId);
    if (section) {
      const newSubsection = {
        subsectId: (section.subsections.length + 1).toString(), // 生成新的小节 ID
        subtitle: this.newSubsection.subtitle,
        contents: [],
        editing: false
      };
      section.subsections.push(newSubsection);
    }
    this.addSubsectionDialogVisible = false;
    this.resetNewSubsection();
  },
  resetNewSubsection() {
    this.newSubsection = {
      subtitle: ''
    };
  }
}
}
</script>

<style scoped>
.item-header {
display: flex;
align-items: center;
justify-content: space-between;
}
.item-header span {
font-weight: bold;
cursor: pointer;
}
.el-input {
width: auto;
margin-right: 8px;
}
.el-button {
margin-left: 4px;
}
.box-card {
border-left: none;  
border-right: none; 
}
::v-deep .box-card .el-card__header {
border-bottom: none; /* 去除卡片头部的底部边框 */
height: 10px;
}
.el-button-icon {
border: none;
margin-left: 10px;
padding: 0;
}
.dialog-footer {
display: flex;
justify-content: flex-end;
}
.radius{
  font-size: 10px;color: gray;
  border: 1px solid var(--el-border-color);
  border-radius: 15%;
  padding: 2px;
  margin-top: 20px;
} 
</style>
