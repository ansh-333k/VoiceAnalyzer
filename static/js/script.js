const host = 'https://voiceanalyzer.azurewebsites.net'

const Home = { 
  data() {
    return {
      email:null,
      password:null,
      error:null,
    }
  },
  methods: {
    validate() {
      pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
      if(!this.email.match(pattern)) {
        this.error="Invalid E-Mail ID"
      }
      else {
        fetch(host + '/', {
          method: "POST",
          headers: { "Content-Type":"application/json", },
          body: JSON.stringify({email:this.email,password:this.password}),
        })
        .then((res) => {
          if(res.status == 404) {
            this.error="User Not Registered"
          }
          else if(res.status == 400) {
            this.error="Incorrect Password"
          }
          else if(res.status == 200) {
            this.$router.push({
              path: `/${this.email}`
            })
          }
        })
        .catch(error => { console.log(error) })
      }
    }
  },
  template: `
    <form @submit.prevent="validate">
      <center>
        <br>
        <h2> LogIn to Continue </h2>
        <br>
        <div>
          <label> E-Mail ID: &nbsp;</label>
          <input type="email" placeholder="E-Mail ID" v-model="email" autocomplete="on" autofocus required>
        </div>
        <br>
        <div>
          <label> Password: &nbsp;</label>
          <input type="password" placeholder="Password" v-model="password" autocomplete="on" autofocus required>
        </div>
        <br>
        <button type="submit" class="btn btn-outline-primary"> LogIn </button>
        <br>
      </center>
    </form>
    <center><h3> Not Registered? <router-link to="/register"> Register </router-link></h3></center>
    <center v-if="error" class="alert alert-warning" role="alert">
      <p>{{error}}</p>
    </center>
  ` 
}

const Register = { 
  data() {
    return {
      email:null,
      password:null,
      cnf_pass:null,
      role:null,
      error:null,
    }
  },
  methods: {
    validate() {
      pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
      if(!this.email.match(pattern)) {
        this.error="Invalid E-Mail ID"
      }
      else if(this.password!=this.cnf_pass) { 
          this.error="Password Mismatch"
      }
      else {
        fetch(host + '/', {
          method: "POST",
          headers: { "Content-Type":"application/json", },
          body: JSON.stringify({email:this.email,password:this.password,role:"register"}),
        })
        .then((res) => {
          if(res.status == 400) {
            this.error="User Already Registered"
          }
          else if(res.status == 200) {
            this.$router.push({
              path: `/${this.email}`
            })
          }
        })
        .catch(error => { console.log(error) })
      }
    }
  },
  template: `
    <form @submit.prevent="validate">
      <center>
        <br>
        <h2> Register Yourself </h2>
        <br>
        <div>
          <label> E-Mail ID: &nbsp;</label>
          <input type="email" placeholder="E-Mail ID" v-model="email" autocomplete="on" autofocus required>
        </div>
        <br>
        <div>
          <label> Password: &nbsp;</label>
          <input type="password" placeholder="Password" v-model="password" autocomplete="on" autofocus required>
        </div>
        <br>
        <div>
          <label> Re-Enter Password: &nbsp;</label>
          <input type="password" placeholder="Retype Password" v-model="cnf_pass" autocomplete="on" autofocus required>
        </div>
        <br>
        <button type="submit" class="btn btn-outline-primary"> Register </button>
        <br>
      </center>
    </form>
    <center><h3> Already Registered? <router-link to="/"> LogIn </router-link></h3></center>
    <center v-if="error" class="alert alert-warning" role="alert">
      <p>{{error}}</p>
    </center>
  ` 
}


const Dashboard = {
  data() {
    return {
      error:null,
      flag:false,
    }
  },
  methods: {
    hist() {
      this.$router.push({
        path: '/history'
      })
    },
    stat() {
      this.$router.push({
        path: '/statistics'
      })
    },
    upload() {
      const file = document.getElementById('file');
      const formData = new FormData();
      formData.append('file', file.files[0]);
      fetch(host + '/transcript', {
        method: "POST",
        body: formData,
      })
      .then((res) => {
        if(res.status == 200) {
          res.json().then((data) => {
            this.$router.push({
              path: `/transcript/${data.id}`
            })
          })
        }
      })
      .catch(error => { console.log(error) })
    },
  },
  template: `
  <center v-if="error">
    <br>
    <h4> {{ this.error }} </h4>
    <button type="button" onclick="location='/logout'" autofocus> Return to HomePage </button>
  </center>
  <div>
    <center>
      <br>
      <h4> Hi <u> {{ this.$route.params.email }} </u> , <br> Welcome to the Voice Analyzer Dashboard <h4>
      <br><br>
      <button class="btn btn-outline-dark btn-primary" @click="this.flag = !this.flag"> GENERATE TRANSCRIPT </button>
      <br><br>
      <div v-if="this.flag">
        <form @submit.prevent="upload">
          <input type="file" id="file" name="file" accept="audio/*" autofocus required/>
          <button type="submit" class="btn btn-secondary"> Upload </button>
        </form>
      </div>
      <div v-else>
        <button class="btn btn-outline-dark btn-primary" @click="hist()"> HISTORY </button>
        <br><br>
        <button class="btn btn-outline-dark btn-primary" @click="stat()"> STATISTICS </button>
      </div>
      <br><br>
      <button type="button" class="position-fixed top-0 end-0" onclick="location='/logout'" autofocus> Log Out </button>
    </center>
  </div>
  `
}


const Transcript = {
  data() {
    return {
      data : null,
    }
  },
  methods: {
    dash(email) {
      this.$router.push({
        path: `/${email}`
      })
    },
  },
  beforeCreate() {
    fetch(host + `/transcript/${this.$route.params.id}`, {
      method: "GET",
      headers: { "Content-Type":"application/json", },
    })
    .then((res) => {
      if(res.status == 200) {
        res.json().then((data) => {
          this.data=data
        })
      }
    })
    .catch(error => { console.log(error) })
  },
  template:`
    <center v-if="error">
    <br>
    <h4> {{ this.error }} </h4>
    <button type="button" onclick="location='/logout'" autofocus> Return to HomePage </button>
    </center>
    <div v-else>
      <center class="position-fixed top-0 end-0">
        <tr><button class="btn-danger" onclick="location='/logout'" autofocus>&nbsp; Log Out &nbsp;</button></tr>
        <tr><button class="btn-info" @click="dash(data.user_email)"> Dashboard </button></tr>
      </center>
      <br><br>
      <center>
        <h4> Transcript </h4>
        <br><br>
        <b> {{ this.data.text }} </b>
      </center>
    </div>
  `
}


const History = {
  data() {
    return {
      data : null,
      email : null,
    }
  },
  methods: {
    t(id) {
      this.$router.push({
        path: `/transcript/${id}`
      })
    },
  },
  beforeCreate() {
    fetch(host + `/current`, {
      method: "GET",
      headers: { "Content-Type":"application/json", },
    })
    .then((res) => {
      if(res.status == 200) {
        res.json().then((data) => {
          this.email=data.email
        })
      }
    })
    .catch(error => { console.log(error) })
    fetch(host + `/transcript`, {
      method: "GET",
      headers: { "Content-Type":"application/json", },
    })
    .then((res) => {
      if(res.status == 200) {
        res.json().then((data) => {
          this.data=data
        })
      }
    })
    .catch(error => { console.log(error) })
  },
  template:`
    <center v-if="error">
    <br>
    <h4> {{ this.error }} </h4>
    <button type="button" onclick="location='/logout'" autofocus> Return to HomePage </button>
    </center>
    <div v-else>
      <center class="position-fixed top-0 end-0">
        <tr><button class="btn-danger" onclick="location='/logout'" autofocus>&nbsp; Log Out &nbsp;</button></tr>
        <tr><button class="btn-info" onclick="history.back()"> Dashboard </button></tr>
      </center>
      <br><br>
      <center>
        <h4> History </h4>
        <br><br>
        <table class="table table-hover table-dark">
          <thead>
            <tr>
              <th> Transcript </th>
              <th> Timestamp </th>
            </tr>
          </thead>
          <tbody v-for="i in data">       
            <tr v-if="i.user_email == email">
              <td style="height:20px; max-width:500px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"> <p @click="t(i.id)" style="color:cyan;"> <b> {{ i.text }} </b> </p> </td>
              <td> {{ i.timestamp }} </td>
            </tr>
          </tbody>
        </table>
      </center>
    </div>
  `
}


const Statistics = {
  data() {
    return {
      data : null,
    }
  },
  beforeMount() {
    fetch(host + '/analysis', {
      method: "GET",
      headers: { "Content-Type":"application/json", },
    })
    .then((res) => {
      if(res.status == 200) {
        res.json().then((data) => {
          this.data=data
        })
      }
    })
    .catch(error => { console.log(error) })
  },
  template:`
    <center v-if="error">
    <br>
    <h4> {{ this.error }} </h4>
    <button type="button" onclick="location='/logout'" autofocus> Return to HomePage </button>
    </center>
    <div v-else>
      <center class="position-fixed top-0 end-0">
        <tr><button class="btn-danger" onclick="location='/logout'" autofocus>&nbsp; Log Out &nbsp;</button></tr>
        <tr><button class="btn-info" onclick="history.back()"> Dashboard </button></tr>
      </center>
      <br><br>
      <center>
      <h2> Statstics </h2>
      </center>
      <br><br>
      <center style="display : flex-column">
      <center style="display : flex justify:between">
        <center style="display : flex-column">
        <h5>Current User</h5>
        <table class="table table-hover table-dark " style="width:400px">
          <thead>
            <tr>
              <th> Word </th>
              <th> Frequency </th>
            </tr>
          </thead>
          <tbody v-for="i in data['freq_user']">       
            <tr>
              <td> {{ i[0] }} </td>
              <td> {{ i[1] }} </td>
            </tr>
          </tbody>
        </table>
        </center>
        <center style="display : flex-column" style="width:400px">
        <h5>Other User</h5>
        <table class="table table-hover table-dark">
          <thead>
            <tr>
              <th> Word </th>
              <th> Frequency </th>
            </tr>
          </thead>
          <tbody v-for="i in data['freq_other']">       
            <tr>
              <td> {{ i[0] }} </td>
              <td> {{ i[1] }} </td>
            </tr>
          </tbody>
        </table>
        </center>
      </center>
      <center style="display : flex justify:between">
        <center style="display : flex-column" style="width:400px">
        <h5>Common Phrases</h5>
        <table class="table table-hover table-dark " style="width:400px">
          <thead>
            <tr>
            <center> <th> Phrases </th> </center>
            </tr>
          </thead>
          <tbody v-for="i in data['phrases']">       
            <tr>
            <center> <td> {{ i }} </td> </center>
            </tr>
          </tbody>
        </table>
        </center>
        <center style="display : flex-column" style="width:400px">
        <h5>Similarity</h5>
        <table class="table table-hover table-dark">
          <thead>
            <tr>
              <th> User Email </th>
              <th> Similarity ( in % ) </th>
            </tr>
          </thead>
          <tbody v-for="i in data['similarity']">       
            <tr>
              <td> {{ i[0] }} </td>
              <td> {{ i[1] }} </td>
            </tr>
          </tbody>
        </table>
        </center>
      </center>
    </center>
    </div>
  `
}


const routes = [
    { path: '/', component: Home },
    { path: '/register', component: Register },
    { path: '/:email', component: Dashboard },
    { path: '/transcript/:id', component: Transcript },
    { path: '/history', component: History },
    { path: '/statistics', component: Statistics },
  ]
  
  const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes,
  })
  const app = Vue.createApp({})
  app.use(router)
  app.mount('#app')
