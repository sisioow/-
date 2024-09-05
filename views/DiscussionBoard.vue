<template>
  <div class="discussion">
    <h2>讨论区互动</h2>
    <el-input
      v-model="newTitle"
      placeholder="请输入标题"
      :rows="1"
    ></el-input>
    <el-input
      v-model="newPost"
      type="textarea"
      placeholder="发布新讨论"
      :rows="3"
    ></el-input>
    <el-button type="primary" @click="addPost">发布</el-button>
    <el-divider></el-divider>
    <el-list>
      <el-list-item v-for="post in posts" :key="post.id">
        <el-card>
          <h3 class="post-title" @click="viewPost(post.id)" v-html="post.title"></h3>
          <div v-if="post.isOpen">
            <p>{{ post.content }}</p>
          </div>
        </el-card>
      </el-list-item> 
    </el-list>
  </div>
</template>

<script>
export default {
  name: 'DiscussionBoard',
  data() {
    return {
      newTitle: '', // 新增标题字段
      newPost: '',
      posts: [
        { id: 1, title: '讨论一', author: '张三', content: '666', isOpen: false },
        { id: 2, title: '讨论二', author: '李四', content: '123', isOpen: false }
      ]
    };
  },
  methods: {
    addPost() {
      if (this.newTitle.trim() && this.newPost.trim()) {
        this.posts.push({
          id: this.posts.length + 1,
          title: this.newTitle, // 添加标题
          author: '当前用户', // 替换为当前登录用户
          content: this.newPost,
          isOpen: false // 控制内容显示的字段
        });
        this.newTitle = ''; // 清空标题输入框
        this.newPost = ''; // 清空内容输入框
        this.$message.success('讨论已发布');
      } else {
        this.$message.error('标题和内容不能为空');
      }
    },
    viewPost(id) {
      // 切换帖子内容的显示和隐藏
      const post = this.posts.find(post => post.id === id);
      if (post) {
        post.isOpen = !post.isOpen;
      }
    }
  }
};
</script>

<style scoped>
.discussion {
  padding: 20px;
  background: linear-gradient(to right, #ffffff, #f0f0f0);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.5s ease-in-out;
  max-width: 800px;
  margin: 40px auto;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.discussion:hover {
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

.el-input {
  margin-bottom: 20px;
}

.el-button {
  margin-bottom: 20px;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.el-button:hover {
  background-color: #66b1ff;
  transform: scale(1.05);
}

.el-card {
  margin-bottom: 20px;
}

.post-title {
  cursor: pointer;
  color: #409EFF;
  transition: color 0.3s ease;
  user-select: text; /* 允许鼠标选中标题 */
}

.post-title:hover {
  color: #66b1ff;
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
