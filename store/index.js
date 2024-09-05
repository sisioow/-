import { createStore } from 'vuex';

export default createStore({
  state: {
    courses: [],
    students: [],
    resources: [],
    statistics: {},
    isLoggedIn: false // 添加登录状态
  },
  mutations: {
    // 你的mutation
    login(state) {
      state.isLoggedIn = true;
    },
    logout(state) {
      state.isLoggedIn = false;
    }
  },
  actions: {
    // 你的action
    login({ commit }) {
      commit('login');
    },
    logout({ commit }) {
      commit('logout');
    }
  },
  getters: {
    // 你的getter
    isLoggedIn: state => state.isLoggedIn
  }
});
