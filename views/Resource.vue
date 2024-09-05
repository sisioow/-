<!-- <template>
  <div class="resource">
    <h2>课程资源管理</h2>
    <el-upload
      class="upload-demo"
      action="https://jsonplaceholder.typicode.com/posts/"
      :on-success="handleUploadSuccess"
      :on-error="handleUploadError"
      :file-list="fileList"
    >
      <el-button slot="trigger" size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传pdf, doc, docx, ppt, pptx, jpg, jpeg, png, mp4文件，且不超过10MB</div>
    </el-upload>
    <el-table :data="resources" style="width: 100%; margin-top: 20px;">
      <el-table-column prop="id" label="资源ID" width="180"></el-table-column>
      <el-table-column prop="title" label="资源标题"></el-table-column>
      <el-table-column prop="type" label="资源类型"></el-table-column>
      <el-table-column label="操作" width="300">
        <template #default="scope">
          <el-button @click="viewResource(scope.row)" type="primary" size="small">在线查看</el-button>
          <el-button @click="downloadResource(scope.row)" type="success" size="small">下载</el-button>
          <el-button @click="editResource(scope.row)" type="warning" size="small">编辑资源</el-button>
          <el-button @click="deleteResource(scope.row)" type="danger" size="small">删除资源</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template> -->
<template>
  <div class="resource">
    <h2>课程资源管理</h2>
    <el-upload
      class="upload-demo"
      action="https://jsonplaceholder.typicode.com/posts/"
      :on-success="handleUploadSuccess"
      :on-error="handleUploadError"
      :file-list="fileList"
    >
      <template v-slot:trigger>
        <el-button size="small" type="primary">点击上传</el-button>
      </template>
      <template v-slot:tip>
        <div class="el-upload__tip">只能上传pdf, doc, docx, ppt, pptx, jpg, jpeg, png, mp4文件，且不超过10MB</div>
      </template>
    </el-upload>
    <el-table :data="resources" style="width: 100%; margin-top: 20px;">
      <el-table-column prop="id" label="资源ID" width="180"></el-table-column>
      <el-table-column prop="title" label="资源标题"></el-table-column>
      <el-table-column prop="type" label="资源类型"></el-table-column>
      <el-table-column label="操作" width="400">
        <template v-slot:default="scope">
          <div class="button-group">
            <el-button @click="viewResource(scope.row)" type="primary" size="small">在线查看</el-button>
            <el-button @click="downloadResource(scope.row)" type="success" size="small">下载</el-button>
            <el-button @click="editResource(scope.row)" type="warning" size="small">编辑资源</el-button>
            <el-button @click="deleteResource(scope.row)" type="danger" size="small">删除资源</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'ResourceComponent',
  data() {
    return {
      resources: [
        { id: 'R001', title: '视频教程', type: '视频', url: 'path/to/video.mp4' },
        { id: 'R002', title: 'PDF文档', type: '文档', url: 'path/to/document.pdf' }
      ],
      fileList: []
    };
  },
  methods: {
    handleUploadSuccess(response, file, fileList) {
      this.fileList = fileList;
      this.resources.push({
        id: 'R' + (this.resources.length + 1).toString().padStart(3, '0'),
        title: file.name,
        type: file.name.split('.').pop(),
        url: URL.createObjectURL(file.raw)
      });
      this.$message.success('文件上传成功');
    },
   /*  handleUploadError(err, file, fileList) {
      this.$message.error('文件上传失败');
    }, */
    viewResource(row) {
      window.open(row.url, '_blank');
    },
    downloadResource(row) {
      const link = document.createElement('a');
      link.href = row.url;
      link.download = row.title;
      link.click();
    },
    editResource(row) {
      this.$prompt('修改资源', '编辑资源', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: row.title
      }).then(({ value }) => {
        row.title = value;
        this.$message.success('资源已修改');
      }).catch(() => {
        this.$message.info('取消修改');
      });
    },
    deleteResource(row) {
      this.$confirm('此操作将永久删除该资源, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.resources = this.resources.filter(resource => resource.id !== row.id);
        this.$message.success('资源已删除');
      }).catch(() => {
        this.$message.info('取消删除');
      });
    }
  }
};
</script>

<style scoped>
.resource {
  padding: 20px;
  background: linear-gradient(to right, #ffffff, #f0f0f0);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.5s ease-in-out;
  max-width: 800px;
  margin: 40px auto;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.resource:hover {
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
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.el-button:hover {
  background-color: #66b1ff;
  transform: scale(1.05);
}

.upload-demo .el-upload__tip {
  font-size: 12px;
  color: #999;
  margin-top: 7px;
}

.button-group {
  display: flex;
  gap: 5px; /* 调整按钮之间的间距 */
  justify-content: space-between; /* 确保按钮在同一行 */
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

