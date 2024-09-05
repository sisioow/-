<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
import axios from '../api/axios';

export default {
  data() {
    return {
      msg: ''
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      axios.get('/test/hello_world')
        .then(response => {
          this.msg = response.data.msg;
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
}
</script>

<style scoped>
h1 {
  color: red;
}
</style>
