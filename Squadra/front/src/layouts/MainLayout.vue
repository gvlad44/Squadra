<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="justify-between">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

      </q-toolbar>
    </q-header>

    <div class="row justify-center " v-if="this.notification">
        <div class="column bg-primary text-white notif text-body1 q-pa-md text-center" >
            You have not completed your user profile.<br/> Would you like to update your info?
          <div class="row justify-center q-mt-md">
              <q-btn flat color="white" label="Take me there" clickable exact to="/user" @click="closeNotification()"/>
              <q-btn flat color="white" label="Dismiss" @click="closeNotification()"/>
          </div>
        </div>
      </div>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      elevated
    >
      <q-list>
          <q-toolbar-title header class="q-ml-md q-mt-md text-h5 text-weight-medium q-mb-md" >Greetings, <br> {{username}}</q-toolbar-title>
        <q-list>

         <q-item clickable exact to="/home" @click="leftDrawerOpen = !leftDrawerOpen">
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Home</q-item-label>
            </q-item-section>
          </q-item>

        <q-item clickable exact to="/public" @click="leftDrawerOpen = !leftDrawerOpen">
            <q-item-section avatar>
              <q-icon name="public" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Public matches</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable exact to="/create" @click="leftDrawerOpen = !leftDrawerOpen">
            <q-item-section avatar>
              <q-icon name="add_circle_outline" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Create a match</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable exact to="/own" @click="leftDrawerOpen = !leftDrawerOpen">
            <q-item-section avatar>
              <q-icon name="sports_basketball" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Personal matches</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable exact to="/teams" @click="leftDrawerOpen = !leftDrawerOpen">
            <q-item-section avatar>
              <q-icon name="groups" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Teams</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable exact to="/tournaments" @click="leftDrawerOpen = !leftDrawerOpen">
            <q-item-section avatar>
              <q-icon name="emoji_events" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Tournaments</q-item-label>
            </q-item-section>
          </q-item>

          <q-item-label header class="color"> Miscellaneous </q-item-label>

          <q-item clickable exact to="/invite" @click="leftDrawerOpen = !leftDrawerOpen">
            <q-item-section avatar>
              <q-icon name="email" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Invite a friend</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable exact to="/msg" @click="leftDrawerOpen = !leftDrawerOpen">
              <q-item-section avatar>
                <q-icon name="feedback" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Share your feedback</q-item-label>
              </q-item-section>
            </q-item>

          <q-item clickable exact to="/o2cZUrR8U2mSMv4YKwM7" v-if="isAdmin" @click="leftDrawerOpen = !leftDrawerOpen">
            <q-item-section avatar>
              <q-icon name="leaderboard" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Statistics</q-item-label>
            </q-item-section>
          </q-item>

           <q-item-label header class="color"> Account </q-item-label>

          <q-item clickable exact to="/user" @click="leftDrawerOpen = !leftDrawerOpen">
            <q-item-section avatar>
              <q-icon name="person" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Profile</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable exact to="/p7wPTjIuEP23GAcWF1TD" v-if="isAdmin" @click="leftDrawerOpen = !leftDrawerOpen">
            <q-item-section avatar>
              <q-icon name="admin_panel_settings" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Admin</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable exact to="/" @click="logOut()">
            <q-item-section avatar>
              <q-icon name="logout" />
            </q-item-section>
            <q-item-section>
              <q-item-label >Logout</q-item-label>
            </q-item-section>
          </q-item>
          
        </q-list>

      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

        <q-toolbar class="orange">
          <div class="fit column content-center">
            <p class="white q-mt-sm fit row justify-center q-mb-none">
              E-mail: gontvlad18@stud.ase.ro
            </p>
            <p class="white fit row justify-center q-mb-xs">
              © 2021 Gont Vlad Andrei
            </p>
          </div>
        </q-toolbar>

  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue';
import axios from 'axios';

export default {
  async created(){
    await axios
      .get("http://localhost:8081/api/user/", {withCredentials: true})
      .then(res => {
        if(res.data.user.age != null && res.data.user.phone != null && res.data.user.facebook !=null){
          this.notification = false;
        }
        this.username = res.data.user.name;
        this.isAdmin = res.data.user.isAdmin;
        this.$q.notify({
        type: 'positive',
        position: 'top',
        message: `You are logged in`
      })
      })
      .catch(err =>{
        console.log(err);
      });

  },

  name: 'MainLayout',
  components: { EssentialLink },
  data () {
    return {
      leftDrawerOpen: false,
      username: "",
      notification: true,
      isAdmin: null,
    }
  },
  methods: {
    async logOut(){
      this.$q.cookies.remove('cookie.sig');
      this.$q.cookies.remove('cookie');
    },

     closeNotification(){
        this.notification = false;
      }
  }
}
</script>

<style>
.color{
  color: #1d1d1d;
  font-weight: bold;
}

.white{
  color: white;
}

.orange{
  background: #e37e02;
}

.notif{
  width: 400px;
  margin-top: 4rem;
}

</style>
