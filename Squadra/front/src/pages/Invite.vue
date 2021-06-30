<template>
  <q-page class="column width q-mt-lg" v-if="loaded">

    <q-card>

        <q-card-section>
            <p class="text-h4 q-mx-xl q-mt-lg q-mb-lg">Invite a friend</p>
        </q-card-section>
        <q-separator/>
        <q-card-section  class="column items-center">
            <q-input label-color="primary" v-model="email" label="Email" class="input q-mt-lg q-mb-lg" color="primary"
            :input-style="{ fontSize: '1.5rem', width:'15em' }"/>
            <q-btn color="primary" label="Send invite" class="q-mb-md" @click="sendInvite()"/>
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
            email: '',
            lastValidMail: null,
        }
    },

    methods: {
        async sendInvite(){

            var valid = true;
            if(parseInt(this.email.length) < parseInt(13)){
                valid = false
                 this.$q.notify({
                    type: 'negative',
                    position: 'top',
                    message: `E-mail should have at least 13 characters.`
                    })
            }

            if(this.email === this.lastValidMail){
                 valid = false
                 this.$q.notify({
                    type: 'negative',
                    position: 'top',
                    message: `Already sent an invite to this person.`
                    })
            }

            if(!(this.email.endsWith('@gmail.com') || this.email.endsWith('@stud.ase.ro') )){
                 valid = false
                 this.$q.notify({
                    type: 'negative',
                    position: 'top',
                    message: `The address must be a Gmail account or a student account.`
                    })
            }

            try {
                const variable = await axios(`http://localhost:8081/api/user/mail/${this.email}`, {
                    method: 'get',
                    withCredentials: true
                })

                if(variable.data.user != null){
                    valid = false;
                    this.$q.notify({
                    type: 'negative',
                    position: 'top',
                    message: `Cannot send an invite. This e-mail address is already asociated to an account.`
                    })
                }

            } catch (err){
                console.log(err);
            }

            if(valid){
                axios("http://localhost:8081/api/user/send", {
                    method: 'post',
                    data: {
                        name: this.username,
                        email: this.email
                        },
                    withCredentials: true
                }).then(res => {
                    this.lastValidMail = this.email;
                    this.email = '';
                    this.$q.notify({
                    type: 'positive',
                    position: 'top',
                    message: `Invite sent succesfully.`
                    })
                }).catch(err => {
                    this.$q.notify({
                    type: 'negative',
                    position: 'top',
                    message: `E-mail wasn't sent. If this keeps persisting, report the issue in the feedback page.`
                    })
                })
            }
        }
    }

}
</script>

<style>
.width{
  width: 80%;
  margin-left: auto;
  margin-right: auto;
}

.ceva{
    width: 30em;
}

</style>