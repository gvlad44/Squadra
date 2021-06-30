<template>
  <q-page class="column width q-mt-lg q-mb-lg" v-if="loaded">
    <q-card class="width">

       <q-card-section class="column items-center">
          <p class="text-h4 q-mx-xl q-mt-lg q-mb-lg">Create your team</p>
        </q-card-section>

      <q-separator/>

      <q-card-section class="column items-center">

        <div class="column q-mb-lg">
            <p class="text-h6 q-mt-xl text-weight-medium ">Team name</p>
            <q-input v-model="textName" label="Name" class="input"/>
        </div>

        <div class="column q-mb-lg">
            <p class="text-h6 q-mt-xl text-weight-medium ">First teammate details</p>
            <div class="fit row justify-between" >
              <q-input v-model="textName1" label="Full name" class="input q-mr-lg"/>
              <q-input v-model="textEmail1" label="Email" class="input q-ml-lg"/>
            </div>
        </div>

        <div class="column q-mb-lg">
            <p class="text-h6 q-mt-xl text-weight-medium ">Second teammate details</p>
            <div class="fit row justify-between" >
              <q-input v-model="textName2" label="Full name" class="input q-mr-lg"/>
              <q-input v-model="textEmail2" label="Email" class="input q-ml-lg"/>
            </div>
        </div>

        <q-checkbox v-model="checkbox" label="I want to invite my teammates to this application by email" class="q-mb-lg q-mt-xl text-h6 text-weight-medium"/>
        
        <div class="column items-center q-mt-lg q-mb-md">
          <q-btn color="primary" label="Submit" @click="createTeam()"/>
        </div>
       
      </q-card-section>

    </q-card>
  </q-page>
</template>

<script>
import axios from "axios";

export default {

  async created(){
        await axios
        .get("http://localhost:8081/api/user/", {withCredentials: true})
        .then(res => {
            this.currentUser = res.data.user.id;
            this.username = res.data.user.name;
            this.loaded = true;
        })
        .catch(err =>{
            console.log(err);
        });

        if(this.currentUser == null){
        this.$router.push({name: 'Start'});
      }

    },

    data () {
        return {
            loaded: false,
            currentUser: null,
            username: null,
            textName: '',
            textName1: '',
            textName2: '',
            textEmail1: '',
            textEmail2: '',
            checkbox: false
        }
     },

    methods: {
      async createTeam(){
        
        let valid = true;
        let emailsValid = false;
            if(parseInt(this.textName.length) < parseInt(4)){
                valid = false
                 this.$q.notify({
                    type: 'negative',
                    position: 'top',
                    message: `Team name should have at least 4 characters.`
                    })
            }
        if(parseInt(this.textName1.length) < parseInt(5)){
                valid = false
                 this.$q.notify({
                    type: 'negative',
                    position: 'top',
                    message: `Your teammate's name should have at least 5 characters.`
                    })
            }

        if(parseInt(this.textName2.length) < parseInt(5)){
                valid = false
                 this.$q.notify({
                    type: 'negative',
                    position: 'top',
                    message: `Your teammate's name should have at least 5 characters.`
                    })
            }
        if(parseInt(this.textEmail1.length) < parseInt(13)){
                valid = false
                 this.$q.notify({
                    type: 'negative',
                    position: 'top',
                    message: `Your teammate's email should have at least 13 characters.`
                    })
            }

        if(parseInt(this.textEmail2.length) < parseInt(13)){
                valid = false
                 this.$q.notify({
                    type: 'negative',
                    position: 'top',
                    message: `Your teammate's email should have at least 13 characters.`
                    })
            }

        if(this.textEmail1 == this.textEmail2){
          valid = false
          this.$q.notify({
                    type: 'negative',
                    position: 'top',
                    message: `Your teammates can't have the same e-mail address`
                    })
        }

        if(valid){
          try {

            const variable = await axios(`http://localhost:8081/api/team/name/${this.textName}`, {
                      method: 'get',
                      data: {
                        name: this.textName
                      },
                      withCredentials: true
                  })


            if(variable.data.val == true){
              valid = false;
                      this.$q.notify({
                      type: 'negative',
                      position: 'top',
                      message: `This team name already exists. Please change it.`
                      })
            }

            if(this.checkbox == true){
              if(!(this.textEmail1.endsWith('@gmail.com') || this.textEmail1.endsWith('@stud.ase.ro') )){
                  valid = false
                  this.$q.notify({
                      type: 'negative',
                      position: 'top',
                      message: `The address must be a Gmail account or a student account. If your teammates don't have a Gmail account uncheck the checkbox to proceed.`
                      })
              }

            if(!(this.textEmail2.endsWith('@gmail.com')  || this.textEmail2.endsWith('@stud.ase.ro'))){
                  valid = false
                  this.$q.notify({
                      type: 'negative',
                      position: 'top',
                      message: `The address must be a Gmail account or a student account. If your teammates don't have a Gmail account uncheck the checkbox to proceed.`
                      })
              }

              const variable2 = await axios(`http://localhost:8081/api/user/mail/${this.textEmail1}`, {
                      method: 'get',
                      withCredentials: true
                  })

                  if(variable2.data.user != null){
                      this.$q.notify({
                      type: 'warning',
                      position: 'top',
                      message: `Cannot send an invite. This e-mail address is already asociated to an account.`
                      })

                  if(variable2.data.user == null){
                    emailsValid = true;
                  }

                  }

              const variable3 = await axios(`http://localhost:8081/api/user/mail/${this.textEmail2}`, {
                      method: 'get',
                      withCredentials: true
                  })

                  if(variable3.data.user != null){
                      valid = false;
                      this.$q.notify({
                      type: 'warning',
                      position: 'top',
                      message: `Cannot send an invite. This e-mail address is already asociated to an account.`
                      })

                  if(variable3.data.user == null){
                    emailsValid = true;
                  }


                }
            }


          } catch (err){
            console.log(err)
          }
        }

        if(valid){

          let val = false
          if(emailsValid){
            axios("http://localhost:8081/api/user/send", {
                    method: 'post',
                    data: {
                        name: this.username,
                        email: this.textEmail1
                        },
                    withCredentials: true
                }).then(res => {
                    val = true
                }).catch(err => {
                    this.$q.notify({
                    type: 'negative',
                    position: 'top',
                    message: `E-mail wasn't sent. If this keeps persisting, report the issue in the feedback page.`
                    })
                })

              axios("http://localhost:8081/api/user/send", {
                    method: 'post',
                    data: {
                        name: this.username,
                        email: this.textEmail2
                        },
                    withCredentials: true
                }).then(res => {
                    val = true
                }).catch(err => {
                    this.$q.notify({
                    type: 'negative',
                    position: 'top',
                    message: `E-mail wasn't sent. If this keeps persisting, report the issue in the feedback page.`
                    })
                })
          }

          if(val){
            this.$q.notify({
                      type: 'positive',
                      position: 'top',
                      message: `Emails sent with success`
                      })

          }
          
          axios("http://localhost:8081/api/team", {
            method: 'post',
                    data: {
                        name: this.textName,
                        teammateOneName: this.textName1,
                        teammateOneEmail: this.textEmail1,
                        teammateTwoName: this.textName2,
                        teammateTwoEmail: this.textEmail2,
                        ownerId: this.currentUser,
                        },
                    withCredentials: true
          }).then(res => {
               this.$q.notify({
                    type: 'positive',
                    position: 'top',
                    message: `Team created succesfully`
                    })
                this.$router.push('/teams');
          }).catch(err => {
            console.log(err);
          })
        }

      },

    },

}
</script>

<style scoped>
.width{
  width: 80%;
  margin-left: auto;
  margin-right: auto;
}

.input{
    width: 20rem;
    height: 5rem;
}

</style>