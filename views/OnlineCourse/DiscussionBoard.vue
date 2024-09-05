<template>
  <div class="discussion">
    <h2>讨论区互动</h2>
    <el-input v-model="searchQuery" placeholder="搜索讨论..." style="margin-bottom: 20px;"></el-input>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="发表的主题" name="topics">
        <el-list>
          <el-list-item v-for="(topic, index) in filteredTopics" :key="index">
            <el-divider v-if="index !== 0" class="topic-divider"></el-divider>
            <div @click="selectTopic(topic)" class="topic-title">{{ topic.topic_title }}</div>
            <p class="topic-info">
              <span class="author">{{ topic.publisher_id }}</span> 发表于 {{ topic.update_time }} | 来自 "<span class="category">{{ topic.post_type }}</span>"
            </p>
          </el-list-item>
        </el-list>
        <!-- 发布讨论 -->
        <el-button type="primary" @click="postDialogVisible = true" style="margin-top: 20px;">发布讨论</el-button>
        <el-dialog title="发布讨论" v-model="postDialogVisible" width="60%">
          <el-form ref="postForm" :model="newTopic" label-width="80px">
            <!-- 标题 -->
            <el-form-item label="标题" required>
              <el-input type="input" v-model="newTopic.topic_title" placeholder="请输入标题"></el-input>
            </el-form-item>
            <!-- 富文本编辑器 -->
            <el-form-item label="讨论详情" required>
              <TextEditor ref="textEditor" v-model="newTopic.content" />
            </el-form-item>
            <!-- 讨论发布时间 -->
            <el-form-item label="发表于">
              <el-input v-model="newTopic.update_time" readonly></el-input>
            </el-form-item>
          </el-form>
          <template v-slot:footer>
            <span class="dialog-footer">
              <el-button @click="postDialogVisible = false">取消</el-button>
              <el-button type="primary" @click="submitTopic">发布</el-button>
            </span>
          </template>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="发表的回复" name="replies">
        <el-card v-for="(reply, index) in replies" :key="index" class="reply-card">
          <p v-html="reply.content"></p>
          <p>{{ reply.publisher_id }} 回复于 {{ reply.date }} | 来自 "{{ reply.topic }}"</p>
          <div class="actions">
            <el-button type="text" @click="editReply(reply)">编辑</el-button>
            <el-button type="text" @click="deleteReply(reply.id)">删除</el-button>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <!-- 讨论详情 -->
    <el-dialog title="讨论详情" v-model="detailDialogVisible" width="60%">
      <div v-if="selectedTopic">
        <div v-html="selectedTopic.content"></div>
      </div>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import TextEditor from '@/views/OnlineCourse/TextEditor.vue';

export default {
  components: {
    TextEditor
  },
  name: 'DiscussionBoard',
  data() {
    return {
      activeTab: 'topics',
      searchQuery: '',
      topics: [
        {
          topic_title: '讨论1标题',
          content: '如何平衡和调整不同属性和数值之间的关系？',
          publisher_id: '张三',
          update_time: '2024年4月1日',
          post_type: '游戏开发'
        },
        {
          topic_title: '讨论2标题',
          content: '如何平衡和调整不同属性和数值之间的关系？',
          publisher_id: '张三',
          update_time: '2024年4月1日',
          post_type: '游戏开发'
        },
        // 添加更多的 Mock 数据
      ],
      replies: [],
      postDialogVisible: false,
      detailDialogVisible: false,
      selectedTopic: null,
      newTopic: {
        publisher_id: 1,
        topic_title: '',
        content: '',
        post_type: 'discussion',
        semester_id: 1,
        course_id: 1,
        update_time: new Date().toLocaleString()
      }
    };
  },
  computed: {
    filteredTopics() {
      return this.topics.filter(topic =>
        topic.topic_title.includes(this.searchQuery) ||
        topic.content.includes(this.searchQuery)
      );
    }
  },
  methods: {
    selectTopic(topic) {
      this.selectedTopic = topic;
      this.detailDialogVisible = true;
    },
    submitTopic() {
      const editorContent = this.$refs.textEditor.getContent();
      if (editorContent) {
        this.newTopic.content = editorContent;
      }
      if (this.newTopic.content && this.newTopic.topic_title) {
        this.topics.push({ ...this.newTopic, id: this.topics.length + 1 });
        this.postDialogVisible = false;
        this.$refs.postForm.resetFields();
        this.resetNewTopic();
        this.$message.success('发布成功');
      } else {
        this.$message.error('请输入内容');
      }
    },
    resetNewTopic() {
      this.newTopic = {
        publisher_id: 1,
        topic_title: '',
        content: '',
        post_type: 'discussion',
        semester_id: 1,
        course_id: 1,
        update_time: new Date().toLocaleString()
      };
    },
    editTopic() {
      // 编辑主题逻辑
    },
    deleteReply() {
      // 删除回复逻辑
    },
    editReply() {
      // 编辑回复逻辑
    }
  },
  mounted() {
    // 注释掉 fetchDiscussions
    // this.fetchDiscussions();
    this.resetNewTopic();
  }
};
</script>

<style scoped>
.discussion {
  margin-left: 50px;
  margin-top: 20px;
  width: calc(100% - 350px);
  height: 100%;
  background: rgba(245, 245, 245, 1);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 20px;
}

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
  border-color: #dcdcdc;
}

.topic-divider {
  border-color: #dcdcdc;
}

.topic-title {
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  color: #282c30;
}

.topic-title:hover {
  text-decoration: underline;
  background-color: rgba(64, 158, 255, 0.1);
}

.topic-info {
  font-size: 14px;
  color: rgba(96, 102, 102, 0.8);
}

.author, .category {
  color: #409EFF;
}

.el-button {
  margin-top: 10px;
}

.reply-card {
  background-color: white;
  margin-bottom: 10px;
  padding: 20px;
  border-radius: 5px;
}

.dialog-footer {
  text-align: right;
}
</style>
