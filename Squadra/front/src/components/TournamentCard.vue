<template>
  
     <q-card class="column q-mb-md">

        <q-card-section>
             <div class="text-h5 text-weight-bold q-ml-lg">{{ name }}</div>
        </q-card-section>

        <q-card-section class="fit row justify-between">
            <div class="column q-ml-xl">
                 <div class="text-h6  text-center text-weight-medium q-mb-xs">Tournament details</div>
                 <div class="text-h6  text-center text-weight-regular">Location: {{ place }}</div>
                 <div class="text-h6  text-center text-weight-regular">Date and time:  {{ date }}</div>
            </div>
            <div class="column">
                <div class="text-h6  text-center text-weight-medium q-mb-xs">Ocupation status </div>
                 <div class="text-h6 text-center text-weight-regular">Number of teams signed up: {{ noTeams }}</div>
                 <div class="text-h6 text-center text-weight-regular">Maximum number of teams: {{ maxTeams }}</div>
            </div>
            <div class="column q-mt-sm q-mr-xl">
                <q-btn v-if="canSignUp" class="q-mb-md" color="primary" label="Sign up" @click="openDialog()" />
                <q-btn v-if="canWithdraw" class="q-mb-md" color="primary" label="Withdraw" @click="openWithdrawDialog()"/>
                <q-btn v-if="isSignedUp" color="primary" label="View" @click="openTournamentView()" />
            </div>
            <div v-if="isAdmin" class="column items-center q-mt-xs q-mr-lg">
                <q-btn class="q-mb-sm" round color="primary" icon="visibility" @click="openTournamentView()" />
                <q-btn round color="primary" icon="delete" @click="deleteDialog = true"/>
            </div>
        </q-card-section>

        <q-dialog v-model="dialog" persistent>
        <q-card class=" q-pl-md q-pr-md">
          <q-card-section class="row items-center">
            <span class="q-ml-sm text-h4 q-mt-md">Sign up to tournament</span>
          </q-card-section>

          <q-separator inset color="primary" />

          <q-card-section>
                <div class="column items-center q-my-lg">
                    <p class="text-h6 text-weight-medium">Select yout team</p>
                    <q-select v-model="team" :options="optionsTeam" label="Team" class="input " outlined />
                    <q-checkbox v-model="checkbox" label="I agree to pay the 2 RON/person tax in person when the tournament starts. If this tax is not payed, my team will not participate in the tournament." class="q-mt-lg"/>
                </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Sign Up" color="primary" v-close-popup="popupValue" @click="signUpToTournament()"/>
            <q-btn flat label="Cancel" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="withdrawDialog" persistent>
        <q-card class=" q-pl-md q-pr-md">
          <q-card-section class="row items-center">
            <span class="q-ml-sm text-subtitle1 text-weight-medium q-mt-md">Are you sure you want to withdraw from this tournament?</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Yes" color="primary" v-close-popup @click="withdraw()"/>
            <q-btn flat label="No" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="deleteDialog" persistent>
        <q-card class=" q-pl-md q-pr-md">
          <q-card-section class="row items-center">
             <q-avatar icon="warning" color="primary" text-color="white" />
            <span class="q-ml-sm text-subtitle1 text-weight-medium">Are you sure you want to delete this tournament?</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Yes" color="primary" v-close-popup @click="deleteTournament()"/>
            <q-btn flat label="No" color="primary" v-close-popup  />
          </q-card-actions>
        </q-card>
      </q-dialog>


    </q-card>

</template>

<script>
import axios from "axios";

export default {
    name: 'TournamentCard',

    async created(){
        const res = await axios.get("http://localhost:8081/api/team/user", {
        withCredentials: true
      })

        if(res.data.team.length > 0){
            res.data.team.forEach(el => {
                this.teamsIds.push(el.id);
                this.optionsTeam.push(el.name);
            });

            this.realcanSignUp = this.canSignUp;
            this.realcanWithdraw = this.canWithdraw;
            this.realisSignedUp = this.isSignedUp;
            this.realValidSetup = this.validSetup;
            this.realTeamId = this.teamId;

        }

        const res2 = await axios.get(`http://localhost:8081/api/tournament/${this.no}`, {
        withCredentials: true
      })

      this.tourney.id = this.no;
      this.tourney.name = res2.data.tournament.name;
      this.tourney.noTeamsParticipating = res2.data.tournament.noTeamsParticipating;
      this.tourney.maxNoTeams = res2.data.tournament.maxNoTeams;
      this.tourney.place = res2.data.tournament.place;
      this.tourney.date = res2.data.tournament.date;
      this.tourney.ownerId = res2.data.tournament.ownerId;
      this.path = "/tournament/view/"+this.no;

    },
    
    data() {
         return{
             dialog: false,
             withdrawDialog: false,
             deleteDialog: false,
             checkbox: false,
             path: "",
             team: null,
             optionsTeam: [],
             teamsIds: [],
             popupValue: 1,
             realcanSignUp: null,
             realcanWithdraw: null,
             realisSignedUp: null,
             realValidSetup: null,
             realTeamId: null,
             tourney: {
                id: null,
                name: null,
                noTeamsParticipating: null,
                maxNoTeams: null,
                place: null,
                date: null,
                ownerId: null,
             }

         };
     },
    
    props: {
         no: Number,
         name: String,
         noTeams: Number,
         maxTeams: Number,
         place: String,
         date: String,
         ownerId: Number,
         canSignUp: Boolean,
         canWithdraw: Boolean,
         validSetup: Boolean,
         isSignedUp: Boolean,
         teamId: Number,
         isAdmin: Boolean,
     },

     methods: {
         openDialog(){
              this.dialog = true;
         },

         openWithdrawDialog(){
             this.withdrawDialog = true;
         },

         openTournamentView(){
             this.$router.push(this.path);
         },

        async signUpToTournament(){

            let valid = true;
            if(this.team == null){
                valid = false;
                this.$q.notify({
                    type: 'negative',
                    position: 'top',
                    message: `Select a team. If you do not have one, you can go and create one in the team page.`
                    })
                this.popupValue = 0;
            }

            if(this.checkbox != true){
                 valid = false;
                this.$q.notify({
                    type: 'negative',
                    position: 'top',
                    message: `You must agree to pay the tax. Otherwise, you cannot sign up to this tournament`
                    })
                this.popupValue = 0;
            }

            if(valid){
                try {
                    let id = this.teamsIds[this.optionsTeam.indexOf(this.team)];
                    this.realTeamId = id;

                    this.popupValue = 1;
                    const res = await axios("http://localhost:8081/api/tourteams/", {
                        method: 'post',
                        data: {
                            TournamentId: this.no,
                            TeamId: id,
                            },
                        withCredentials: true
                    })

                    if(res.status == 201){
                        this.$q.notify({
                        type: 'positive',
                        position: 'top',
                        message: 'Signed up with success to this tournament.'
                        })

                        this.tourney.noTeamsParticipating ++;

                        if(this.tourney.noTeamsParticipating == this.tourney.maxNoTeams){
                            this.realValidSetup = false;
                        }

                        const res2 = await axios(`http://localhost:8081/api/tournament/${this.no}`, {
                        method: 'put',
                        data: {
                            name: this.tourney.name,
                            noTeamsParticipating: this.tourney.noTeamsParticipating,
                            maxNoTeams: this.tourney.maxNoTeams,
                            place: this.tourney.place,
                            date: this.tourney.date,
                            ownerId: this.tourney.ownerId,
                            },
                        withCredentials: true
                    })

                        this.realcanSignUp = false;
                        this.realcanWithdraw = true;
                        this.realisSignedUp = true;
                        this.$emit('signUp-tournament', this.no, this.realValidSetup  ,this.realcanSignUp, this.realcanWithdraw, this.realisSignedUp, this.realTeamId, this.tourney.noTeamsParticipating);
                    } else {
                        this.$q.notify({
                        type: 'negative',
                        position: 'top',
                        message: `Something went wrong. Please try again. If this bug persists please report it in the share feedback page.`
                        })
                        this.popupValue = 0;
                    }

                } catch (err){
                    console.log(err)
                }

            }

        },

        async withdraw(){
            try{
                const res = await axios(`http://localhost:8081/api/tourteams/${this.realTeamId}`, {
                    method: 'delete',
                    data: {
                        TournamentId: this.no
                    },
                    withCredentials: true
                })

                this.realTeamId = null
                this.$q.notify({
                    type: 'positive',
                    position: 'top',
                    message: `Team succesfully withdrawn from the tournament.`
                })

                

                this.tourney.noTeamsParticipating --;

                if(this.tourney.noTeamsParticipating != this.maxNoTeams){
                    this.realValidSetup = true
                }

                        const res2 = await axios(`http://localhost:8081/api/tournament/${this.no}`, {
                        method: 'put',
                        data: {
                            name: this.tourney.name,
                            noTeamsParticipating: this.tourney.noTeamsParticipating,
                            maxNoTeams: this.tourney.maxNoTeams,
                            place: this.tourney.place,
                            date: this.tourney.date,
                            ownerId: this.tourney.ownerId,
                            },
                        withCredentials: true
                    })


                    this.realcanSignUp = true;
                    this.realcanWithdraw = false;
                    this.realisSignedUp = false;
                this.$emit('delete-participation', this.no,   this.realValidSetup  ,this.realcanSignUp, this.realcanWithdraw, this.realisSignedUp , this.realTeamId, this.tourney.noTeamsParticipating);
                } catch (err) {
                console.log(err);
                    this.$q.notify({
                        type: 'negative',
                        position: 'top',
                        message: `Something went wrong. Please try again. If this bug persists please report it in the share feedback page.`
                    })
                }
        },

        async deleteTournament(){
            try{
                await axios(`http://localhost:8081/api/tournament/${this.tourney.id}`, {
                    method: 'delete',
                    withCredentials: true
                })
                this.$q.notify({
                    type: 'positive',
                    position: 'top',
                    message: `Tournament succesfully deleted.`
                })
                this.$emit('delete-tournament', this.tourney.id);
                } catch (err) {
                console.log(err);
                    this.$q.notify({
                        type: 'negative',
                        position: 'top',
                        message: `Something went wrong. Please try again. If this bug persists please report it in the share feedback page.`
                    })
                }
        }

     }
}
</script>

<style scoped>
.input{
    width: 20rem;
    height: 5rem;
}

</style>