<template>
  <div class="video-resources">
    <h2>视频资源</h2>
    <el-upload
      class="upload-demo"
      drag
      action="https://jsonplaceholder.typicode.com/posts/"
      :on-success="handleUploadSuccess"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将视频拖到此处，或<em>点击上传</em></div>
      <template #tip>
        <div class="el-upload__tip">支持 mp4, avi 格式</div>
      </template>
    </el-upload>
    <el-table :data="videos" style="width: 100%; margin-top: 20px;">
      <el-table-column prop="name" label="视频名称"></el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button @click="playVideo(scope.row)" type="primary" size="small">播放</el-button>
          <el-button @click="deleteVideo(scope.row)" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'VideoResources',
  data() {
    return {
      videos: [
        { name: '示例视频1' },
        { name: '示例视频2' }
      ]
    };
  },
  methods: {
    handleUploadSuccess(response, file) {
      this.videos.push({ name: file.name });
      this.$message.success('视频上传成功');
    },
    playVideo(row) {
      this.$message.success('播放视频: ' + row.name);
      // 添加播放视频逻辑
    },
    deleteVideo(row) {
      this.$confirm('确定删除该视频吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = this.videos.indexOf(row);
        if (index !== -1) {
          this.videos.splice(index, 1);
          this.$message.success('视频已删除');
        }
      }).catch(() => {
        this.$message.info('取消删除');
      });
    }
  }
};
</script>

<style scoped>
.video-resources {
  padding: 20px;
  background: linear-gradient(to right, #ffffff, #f0f0f0);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.5s ease-in-out;
  max-width: 800px;
  margin: 40px auto;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.video-resources:hover {
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

.el-upload {
  margin-bottom: 20px;
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
