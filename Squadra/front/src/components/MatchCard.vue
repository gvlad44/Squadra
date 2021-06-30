<template>

  <q-card class="my-card q-mx-xs q-mb-xl">

    <q-card-section>
      <div class="text-h5 text-weight-medium text-center">{{ location }}</div>
    </q-card-section>

    <q-separator color="primary" />

    <q-card-section>
      <div class="text-body1 q-mb-xs">Date: <b>{{ date }}</b></div>
      <div class="text-body1 q-mb-xs">Number of participants: <b>{{ noPart }}</b></div>
      <div class="text-body1 q-mb-xs">Max. number of participants: <b>{{ maxPart }}</b></div>
      <div class="text-body1 q-mb-xs">Match owner: <b>{{ creator }}</b></div>
      <div class="column">
        <q-btn color="primary" label="Sign up" class="q-my-sm" @click="dialog = true"/>
      </div>
    </q-card-section>

    <q-dialog v-model="dialog" persistent>
        <q-card class=" q-pl-md q-pr-md">
          <q-card-section class="row items-center">
             <q-avatar icon="lightbulb" color="primary" text-color="white" />
            <span class="q-ml-sm text-subtitle1 text-weight-medium">Are you sure you want to sign up for this match?</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Yes" color="primary" v-close-popup @click="signUp()"/>
            <q-btn flat label="No" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

  </q-card>    

</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
        dialog: false,
        noParticipants: null,
        };
    },
    name: 'MatchCard',
    props: {
        id: Number,
        location: String,
        date: String,
        noPart: Number,
        maxPart: Number,
        creator: String,
        currentUser: Number,
        ownerId: Number,
    },
    methods: {

        signUp(){
         axios("http://localhost:8081/api/ums/", {
                        method: 'post',
                        data: {
                            UserId: this.currentUser,
                            MatchId: this.id
                            },
                        withCredentials: true
                    }).then(async res => {
                        this.$q.notify({
                        type: 'positive',
                        position: 'top',
                        message: `Signed up with success.`
                        })
                        
                        await axios
                        .get(`http://localhost:8081/api/nm/${this.id}`, {withCredentials: true})
                        .then(res => {
                          this.noParticipants = res.data.number;
                        })
                        .catch(err =>{
                          console.log(err);
                        });

                        try {
                          await axios(`http://localhost:8081/api/match/${this.id}`,{
                            method: 'put',
                            data: {
                              place: this.location,
                              date: this.date,
                              noParticipants:  this.noParticipants,
                              maxParticipants:  this.maxPart,
                              ownerId: this.ownerId,
                            },
                            withCredentials: true
                          })
                        } catch(err){
                          console.log(err);
                        }

                        this.$emit('delete-card', this.id);
                    })
                    .catch(err => {
                        this.$q.notify({
                        type: 'negative',
                        position: 'top',
                        message: `Something went wrong. Please try again. If this bug persists please report it in the share feedback page.`
                        })
                    })
        }

    }
}
</script>

<style scoped>

.my-card{
  width: 100%;
  max-width: 300px;
}


</style>