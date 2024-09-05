<template>
  <div class="app-layout" @click="handleClickOutside">
    <vue-particles color="#00f2fe" particleOpacity="0.7" :particlesNumber="80" shapeType="circle" :particleSize="4" linesColor="#00f2fe" linesWidth="1" :lineLinked="true" :lineOpacity="0.4" :linesDistance="150" :moveSpeed="3" :hoverEffect="true" hoverMode="repulse" :clickEffect="true" clickMode="push" />
    <header class="header">
      <div class="logo animated-text">在线学习平台教师端</div>
      <div class="user-menu" @click.stop="toggleDropdown">
        <img class="avatar" :src="avatarUrl" alt="user avatar" @click.stop="showAvatarModal"/>
        <span @click.stop="toggleDropdown">{{ userName || '未登录' }}</span>
        <transition name="fade">
          <ul class="dropdown" v-show="dropdownVisible">
            <li>当前登录账号为： {{ userId || '未登录' }}</li>
            <li v-if="!userId"><router-link to="/login">登录/注册</router-link></li>
            <li><a href="#">我的直播</a></li>
            <li><a href="#">主页</a></li>
            <li><a href="#">设置</a></li>
            <li v-if="userId"><a @click="logout">退出</a></li>
          </ul>
        </transition>
      </div>
    </header>
    <div class="container">
      <aside class="sidebar" >
        <div class="profile-container">
          <div class="profile">
              <ul class="titleMenu " >
                 <li> <div class="image-container">
                      <img :src="this.courseImg" />
                  </div></li>
                  <li><el-text size="large">{{courseName}}</el-text></li>
                  <li><el-text class="mx-1" type="primary" size="medium">桂林电子科技大学-张三</el-text></li>
                  <li><el-text class="mx-1" type="info" size="small">{{courseStartTime}}  开课</el-text></li>
              </ul>
             
          </div>
        </div>
        <ul class="menu">
          <li>
            <div @click="toggleMenu('courseDesign')" class="menu-header animated-button">
              历史课程
              <!-- <button class="toggle-btn">{{ menus.courseDesign ? '-' : '+' }}</button> -->
            </div>
            <transition name="slide">
              <ul v-show="menus.courseDesign">
                <li v-on:click="scrollToIntroduction('hist-intro')"><router-link to="">历史课程简介</router-link></li>
                <li v-on:click="scrollToIntroduction('hist-stu-score')"><router-link to="">历史学生成绩</router-link></li>
                <li v-on:click="scrollToIntroduction('hist-course-content')"><router-link to="">历史课程章节</router-link></li>
                <li v-on:click="scrollToIntroduction('hist-an')"><router-link to="">历史公告</router-link></li>
              </ul>
            </transition>
          </li>
          <li>
            <router-link :to="{ name: 'Home' }" class="menu-header animated-button no-underline">个人中心</router-link>
          </li>
        </ul>
      </aside>
      <main class="main-content">
          <router-view ><HistoricalCourseDetail @hhhh='jieshou'> </HistoricalCourseDetail></router-view>
      </main>
    </div>
    <transition name="fade">
      <div v-if="avatarModalVisible" class="modal-overlay" @click="hideAvatarModal">
        <div class="modal" @click.stop>
          <img :src="avatarUrl" alt="avatar" class="modal-avatar"/>
        </div>
      </div>
    </transition>
  </div>
</template>


<script>
import VueParticles from 'vue-particles';
import HistoricalCourseDetail from '@/views/HistoricalCourseDetail.vue';

export default {

data(){
  return {
    userName: '', // 初始为空表示未登录
    userId: '', // 初始为空表示未登录
    avatarUrl: require('@/assets/avatar.jpg'),
    dropdownVisible: false,
    avatarModalVisible: false,
    menus: {
      courseDesign: true,
      studentManagement: false,
      courseResources: false,
      statistics: false
    },

    courseName:'',
    courseStartTime:'',
    courseImg:'',
  };
},


beforeUnmount() {
  document.removeEventListener('click', this.handleClickOutside);
},
components: {
  VueParticles,
  HistoricalCourseDetail,
},

mounted(){
  document.addEventListener('click', this.handleClickOutside);//导航栏
},

methods:{
  scrollToIntroduction(id) {
    window.scrollTo({
      top: document.getElementById(id).offsetTop,
      behavior: 'smooth'
    });
  },

  jieshou(val1,val2,val3){
    this.courseName=val2,
    this.courseStartTime=val1,
    this.courseImg=val3,
  console.log("子传父value=",val1,val2);
  },

  //#region 导航栏方法
  logout() {
    // 退出逻辑
    this.userName = '';
    this.userId = '';
  },
  toggleMenu(menu) {
    this.menus[menu] = !this.menus[menu];
  },
  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  },
  handleClickOutside(event) {
    if (!this.$el.contains(event.target)) {
      this.dropdownVisible = false;
    }
  },
  showAvatarModal() {
    this.avatarModalVisible = true;
  },
  hideAvatarModal() {
    this.avatarModalVisible = false;
  },
  //#endregion
}
}
</script>

<style scoped>

.titleMenu {
  list-style: none;
  padding: 0;
  margin: 0;
}
.titleMenu li{
  margin-top:10px;
  text-align: center;
}

.image-container {
    width: 200px; /* 设置div的宽度 */
    height: 100px; /* 设置div的高度 */
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

/* 导航栏css */
.app-layout {
display: flex;
flex-direction: column;
height: 100vh;
font-family: 'Arial', sans-serif;
background: #fafafa;
}
.no-underline {
text-decoration: none; /* 禁止链接下划线 */
}
.header {
display: flex;
justify-content: space-between;
align-items: center;
background: linear-gradient(to right, #4facfe, #00f2fe);
color: white;
padding: 0 20px;
height: 60px;
box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.logo {
font-size: 20px;
font-weight: bold;
animation: textAnimation 3s infinite;
}

.user-menu {
position: relative;
display: flex;
align-items: center;
cursor: pointer;
}

.user-menu .avatar {
width: 30px;
height: 30px;
border-radius: 50%;
margin-right: 10px;
transition: transform 0.2s ease-in-out;
}

.user-menu .avatar:hover {
transform: scale(1.1);
}

.user-menu .dropdown {
z-index: 3;
display: block;
position: absolute;
right: 0;
top: 40px;
background-color: white;
box-shadow: 0 2px 10px rgba(0,0,0,0.1);
list-style: none;
margin: 0;
padding: 10px 0;
width: 200px;
border-radius: 5px;
}

.user-menu .dropdown li {
padding: 10px 20px;
color: #333;
}

.user-menu .dropdown li a {
color: #333;
text-decoration: none;
display: block;
}

.user-menu .dropdown li a:hover {
background-color: #f1f1f1;
}

.fade-enter-active, .fade-leave-active {
transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to {
opacity: 0;
}

.container {
display: flex;
flex: 1;
}

.sidebar {
width: 250px;
background: #fff;
padding: 20px;
display: flex;
flex-direction: column;
box-shadow: 2px 0 5px rgba(0,0,0,0.1);
border-radius: 10px;
margin-right: 10px;
animation: slideIn 1s ease-in-out;
}

.profile-container {
border-bottom: 1px solid #e0e0e0;
padding-bottom: 20px;
margin-bottom: 20px;
}

.profile {
display: flex;
align-items: center;
flex-direction: column;
}

.profile-avatar {
width: 50px;
height: 50px;
border-radius: 50%;
margin-right: 10px;
cursor: pointer;
transition: transform 0.2s ease-in-out;
}

.profile-avatar:hover {
transform: scale(1.1);
}

.profile-info {
font-size: 14px;
}

.menu {
list-style: none;
padding: 0;
margin: 0;
}

.menu-header {
cursor: pointer;
font-weight: bold;
padding: 10px 0;
display: flex;
justify-content: space-between;
align-items: center;
background: linear-gradient(to right, #4facfe, #00f2fe);
color: white;
padding: 10px;
border-radius: 4px;
margin-bottom: 5px;
transition: background 0.3s ease-in-out;
}

.menu-header:hover {
background: linear-gradient(to right, #00f2fe, #4facfe);
}

.animated-button {
animation: buttonAnimation 2s infinite;
}

.toggle-btn {
background: none;
border: none;
cursor: pointer;
font-size: 16px;
line-height: 1;
color: white;
}

.menu li ul {
list-style: none;
padding-left: 20px;
}

.menu li ul li {
margin-bottom: 5px;
}

.menu li ul li a {
text-decoration: none;
color: #555;
padding: 5px 0;
display: block;
}

.menu li ul li a:hover {
color: #007bff;
}

.slide-enter-active, .slide-leave-active {
transition: all 0.3s ease;
}

.slide-enter, .slide-leave-to {
transform: translateY(-10px);
opacity: 0;
}

.main-content {
flex-grow: 1;
padding: 20px;
background: #fff;
border-radius: 10px;
box-shadow: 0 2px 5px rgba(0,0,0,0.1);
animation: fadeIn 1s ease-in-out;
}

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

.animated-tab {
animation: tabTextAnimation 2s infinite;
}

.modal-overlay {

position: fixed;
z-index: 3;
top: 0;
left: 0;
right: 0;
bottom: 0;
background: rgba(0, 0, 0, 0.5);
display: flex;
justify-content: center;
align-items: center;
}

.modal {
background: white;
padding: 20px;
border-radius: 10px;
max-width: 90%;
max-height: 90%;
box-shadow: 0 2px 10px rgba(0,0,0,0.2);
transition: transform 0.3s ease-in-out;
animation: modalFadeIn 0.5s ease-in-out;
}

.modal-avatar {
max-width: 100%;
max-height: 100%;
}

.modal-enter-active, .modal-leave-active {
transition: opacity 0.3s, transform 0.3s;
}

.modal-enter, .modal-leave-to {
opacity: 0;
transform: scale(0.9);
}

@keyframes textAnimation {
0%, 100% {
  color: #4facfe;
}
50% {
  color: #00f2fe;
}
}

@keyframes buttonAnimation {
0%, 100% {
  box-shadow: 0 0 10px #4facfe;
}
50% {
  box-shadow: 0 0 20px #00f2fe;
}
}

@keyframes tabAnimation {
0%, 100% {
  color: #007bff;
}
50% {
  color: #00aaff;
}
}

@keyframes tabTextAnimation {
0%, 100% {
  transform: scale(1);
}
50% {
  transform: scale(1.1);
}
}

@keyframes fadeIn {
from {
  opacity: 0;
  transform: translateY(20px);
}
to {
  opacity: 1;
  transform: translateY(0);
}
}

@keyframes modalFadeIn {
from {
  opacity: 0;
  transform: scale(0.9);
}
to {
  opacity: 1;
  transform: scale(1);
}
}

@keyframes slideIn {
from {
  opacity: 0;
  transform: translateX(-20px);
}
to {
  opacity: 1;
  transform: translateX(0);
}
}
/* end导航栏css */
</style>
