import { createRouter, createWebHistory } from 'vue-router';

import Login from '@/views/TeacherLogin.vue';
import Register from '@/views/TeacherRegister.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import HomeComponent from '@/views/Home.vue';
import CourseIntro from '@/views/CourseIntro.vue';
import CourseAnnouncement from '@/views/CourseAnnouncement.vue';
import CourseIntroduce from '@/views/CourseIntroduce.vue';
import CourseChapters from '@/views/CourseChapters.vue';
import QuestionBank from '@/views/QuestionBank.vue';
import VideoResources from '@/views/VideoResources.vue';
import ExamPapers from '@/views/ExamPapers.vue';
import AddStudent from '@/views/AddStudent.vue';
import ManageStudent from '@/views/ManageStudent.vue';
import GradeAssignment from '@/views/OnlineCourse/GradeAssignment.vue';
import AddAdmin from '@/views/AddAdmin.vue';
import OnlineCourse from '@/views/OnlineCourse.vue';
import EditCourse from '@/views/EditCourse.vue';
import AddTest from '@/views/OnlineCourse/AddTest.vue';
import GradeTest from '@/views/GradeTest.vue';
import DiscussionBoard from '@/views/OnlineCourse/DiscussionBoard.vue';
import CourseData from '@/views/OnlineCourse/ViewCourseData.vue';
import Statistics from '@/views/CourseStatistics.vue';
import Resource from '@/views/Resource.vue';
import HistoricalCourse from '@/views/HistoricalCourse.vue';  // 确保已导入 HistoricalCourse 组件
import EditCourseContent from '@/views/OnlineCourse/EditCourseContent.vue';
import DiscussionDetails from '@/views/OnlineCourse/DiscussionDetails.vue';
import CourseSetting from '@/views/CourseSetting.vue';
import ViewCourseData from '@/views/ViewCourseData.vue';
import CourseStatistics from '@/views/CourseStatistics.vue';
import EditPaper from '@/views/EditPaper.vue';
import HistLayout from '@/layouts/HistLayout.vue';
import HistoricalCourseDetail from '@/views/HistoricalCourseDetail.vue';
import OnlineCourseHome from '@/views/OnlineCourse/OnlineCourseHome.vue';

// Vue.use(Router);

// Vue.use(Router);
import CourseTeam from '@/views/CourseTeam.vue'
const routes = [
  {
    path: '',
    name: 'Home',
    component: HomeComponent,
    children: [{
      path: 'introduce',
      name: 'CourseIntroduce',
      component: CourseIntroduce,
    },
    {
      path: 'courseSetting',
      name: 'CourseSetting',
      component: CourseSetting,
    },]
  },
  {
    path: '/',
    name: 'HistLayout',
    component: HistLayout,
    children: [
      {
        path: 'historicalCourseDetail',
        name: 'HistoricalCourseDetail',
        component: HistoricalCourseDetail,
      },
    ]
  },
  {
    path: '/',
    component: AppLayout,
    children: [
       {
         path: '',
         name: 'Home',
         component: HomeComponent,
       }, 
      {
        path: 'discussiondetails',
        name: 'DiscussionDetails',
        component: DiscussionDetails,
      },
      {
        path: 'course/intro',
        name: 'CourseIntro',
        component: CourseIntro,
      },
      {
        path: 'course/announcement',
        name: 'CourseAnnouncement',
        component: CourseAnnouncement,
      },
      {
        path: 'course/team',
        name: 'CourseTeam',
        component: CourseTeam,
      },
      {
        path: 'course/chapters',
        name: 'CourseChapters',
        component: CourseChapters,
      },
      {
        path: 'questionbank',
        name: 'QuestionBank',
        component: QuestionBank,
      },
      {
        path: 'questionbank',
        name: 'VideoResources',
        component: VideoResources,
      },
      {
        path: 'exampapers',
        name: 'ExamPapers',
        component: ExamPapers,
      },
      {
        path: 'addstudent',
        name: 'AddStudent',
        component: AddStudent,
      },
      {
        path: 'managestudent',
        name: 'ManageStudent',
        component: ManageStudent,
      },
      {
        path: 'addadmin',
        name: 'AddAdmin',
        component: AddAdmin,
      },
      {
        path: 'onlinecourse',
        // name: 'OnlineCourse',
        component: OnlineCourse,
        children: [
          {
            path: 'editcoursecontent',
            // path: 'editcoursecontent/:sectionId/:subsectId',//传id的路径
            name: 'EditCourseContent',
            component: EditCourseContent
          },
          {
            path: 'addtest',
            name: 'AddTest',
            component: AddTest,
          },
          // {
          //   path: 'discussionboard',
          //   name: 'DiscussionBoard',
          //   component: DiscussionBoard,
          // },
          {
            path: 'gradeassignment',
            name: 'GradeAssignment',
            component: GradeAssignment,
          },
          {
            path: 'coursedata',
            name: 'CourseData',
            component: CourseData,
          }

        ]
      },
      //onlinecourse
      {
        path: '/edit-paper',
        name: 'EditPaper',
        component: EditPaper
      },
      {
        path: 'discussionboard',
        name: 'DiscussionBoard',
        component: DiscussionBoard,
      },
      //在线课程
      {
        path: '/OnlineCourseHome',
        name: 'OnlineCourseHome',
        component: OnlineCourseHome
      },
      {
        path: 'editcourse',
        name: 'EditCourse',
        component: EditCourse,
      },
      {
        path: 'statistics/learning',
        name: 'ViewCourseData',
        component: ViewCourseData,
      },

      {
        path: 'statistics/course',
        name: 'CourseStatistics',
        component: CourseStatistics,
      },
      {
        path: 'gradetest',
        name: 'GradeTest',
        component: GradeTest,
      },
      {
        path: 'statistics',
        name: 'Statistics',
        component: Statistics,
      },
      {
        path: 'resource',
        name: 'Resource',
        component: Resource,
      },
      {
        path: 'historicalcourse',
        name: 'HistoricalCourse',
        component: HistoricalCourse,
      },
    ]
  },
  {
    path: '/login',
    name: 'TeacherLogin',
    component: Login
  },
  {
    path: '/register',
    name: 'TeacherRegister',
    component: Register
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
