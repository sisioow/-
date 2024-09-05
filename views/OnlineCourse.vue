
<template>
  <div>
    <div class="tab-bar">
      <router-link to="/onlinecourse/editcoursecontent" class="tab"
                   :class="{ 'active': $route.path === '/onlinecourse/editcoursecontent' }">编辑课程内容</router-link>
      <router-link to="/onlinecourse/addtest" class="tab"
                   :class="{ 'active': $route.path === '/onlinecourse/addtest' }">添加测试</router-link>
      <!-- <router-link to="/onlinecourse/gradeassignment" class="tab"
                   :class="{ 'active': $route.path === '/onlinecourse/gradeassignment' }">作业批改</router-link>
      <router-link to="/onlinecourse/discussionboard" class="tab"
                   :class="{ 'active': $route.path === '/onlinecourse/discussionboard' }">讨论区互动</router-link> -->
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'OnlineCourse',
  mounted() {
    // 在 mounted 钩子中，可以手动触发一开始就显示编辑课程内容选项，并加载对应的路由组件
    this.$router.push('/onlinecourse/editcoursecontent');
  }
};
</script>

<style scoped>
.tab.active {
  border-bottom: 2px solid #007bff;
  color: #007bff;
  animation: tabAnimation 2s infinite;
}
.tab {
  padding: 10px 20px;
  cursor: pointer;
  color: #444444;
  transition: background 0.3s ease-in-out;
  text-decoration: none;
}
@keyframes tabAnimation {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
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
</style>
