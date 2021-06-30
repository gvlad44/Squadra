<template>
  <q-card class="column q-my-md q-mx-lg">
      <q-card-section class="row">
          <div class="column">
              <p class="text-h6 text-weight-regular q-ml-lg teamname">Team name: <br/> {{team1Name}}<br/> </p> 
              <p class="text-h6 text-weight-regular q-ml-lg teamname">Team captain: <br/> {{team1Captain}}</p>
          </div>
          <p class="text-h5 text-weight-regular q-ml-lg">{{score1}}</p>

      </q-card-section>

      <q-separator color="primary" inset/>

      <q-card-section class="row">
           <div class="column">
              <p class="text-h6 text-weight-regular q-ml-lg teamname">Team 2 name: <br/> {{team2Name}}<br/> </p> 
              <p class="text-h6 text-weight-regular q-ml-lg teamname">Team 2 captain: <br/> {{team2Captain}}</p>
          </div>
          <p class="text-h5 text-weight-regular q-ml-lg">{{score2}}</p>
      </q-card-section>

      <q-card-section v-if="isAdmin" class="row justify-center">
          <q-btn v-if="isNotFinished" class="q-mb-md" color="primary" label="Match results" @click="dialog = true"/>
      </q-card-section>

    <q-dialog v-model="dialog" persistent>
        <q-card class=" q-pl-md q-pr-md">
          <q-card-section class="column items-center">
            <span class="text-h4 text-weight-medium q-my-lg">Set match result</span>
          </q-card-section>

          <q-card-section class="column">
              <span class="text-h6">Team 1</span>
              <q-input v-model="text" label="First team score" class="updateWidth"/>
          </q-card-section>

          <q-card-section>
              <span class="text-h6">Team 2</span>
              <q-input v-model="text2" label="Second team score" class="updateWidth"/>
          </q-card-section>

          <q-card-actions align="right" class="q-mt-md">
            <q-btn flat label="Confirm" color="primary" v-close-popup="popupValue" @click="setMatchScore()"/>
            <q-btn flat label="Cancel" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

  </q-card>

    

</template>

<script>
import axios from "axios";

export default {
    name: "TournamentMatch",

    created(){
      this.score1 = this.team1Score;
      this.score2 = this.team2Score;
      this.text = this.score1;
      this.text2 = this.score2;
    },

    data(){
        return{
            dialog: false,
            text: '',
            text2: '',
            score1: 0,
            score2: 0,
            winnerId: null,
            popupValue: 1,
            teamToSend: {
              teamId: null,
              teamName: null,
              teamCaptain: null,
              teamSeed: null,
              teamScore: null,
              loserScore: null,
              loserId: null,
            }
        }
    },

    props: {
      no: Number,
      team1: Number,
      team1Name: String,
      team1Captain: String,
      team1Seed: Number,
      team1Score: Number,
      team2: Number,
      team2Name: String,
      team2Captain: String,
      team2Seed: Number,
      team2Score: Number,
      tournamentId: String,
      isNotFinished: Boolean,
      isAdmin: Boolean,
      round: Number,
    },

    methods: {
      async setMatchScore(){

        let valid = true;
        if(parseInt(this.text) > parseInt(21) || parseInt(this.text) < parseInt(0)){
           valid = false;
                this.$q.notify({
                    type: 'negative',
                    position: 'top',
                    message: `Score for team 1 should be between 0 and 21`
                    })
                this.popupValue = 0;
        }

        if(isNaN(parseInt(this.text))){
           valid = false;
                this.$q.notify({
                    type: 'negative',
                    position: 'top',
                    message: `Score for team 1 should be a number`
                    })
                this.popupValue = 0;
        }

        if(parseInt(this.text2) > 21 || parseInt(this.text2) < 0){
           valid = false;
                this.$q.notify({
                    type: 'negative',
                    position: 'top',
                    message: `Score for team 2 should be between 0 and 21`
                    })
                this.popupValue = 0;
        }

        if(isNaN(parseInt(this.text2))){
           valid = false;
                this.$q.notify({
                    type: 'negative',
                    position: 'top',
                    message: `Score for team 2 should be a number`
                    })
                this.popupValue = 0;
        }

        if(!(parseInt(this.text) == parseInt(21) || parseInt(this.text2) == parseInt(21))){
           valid = false;
                this.$q.notify({
                    type: 'negative',
                    position: 'top',
                    message: `At least one team should have a score of 21`
                    })
                this.popupValue = 0;
        }

        if((parseInt(this.text) == parseInt(21) && parseInt(this.text2) == parseInt(21))){
          valid = false;
                this.$q.notify({
                    type: 'negative',
                    position: 'top',
                    message: `Only one team can have a score of 21`
                    })
                this.popupValue = 0;
        }

        if(valid){
          if(parseInt(this.text) == parseInt(21)){
            this.winnerId = this.team1
            this.teamToSend.teamId = this.team1
            this.teamToSend.teamName = this.team1Name
            this.teamToSend.teamCaptain = this.team1Captain
            this.teamToSend.teamSeed = this.team1Seed
            this.teamToSend.loserId = this.team2
          }

          if(parseInt(this.text2) == parseInt(21)){
            this.winnerId = this.team2
             this.teamToSend.teamId = this.team2
            this.teamToSend.teamName = this.team2Name
            this.teamToSend.teamCaptain = this.team2Captain
            this.teamToSend.teamSeed = this.team2Seed
            this.teamToSend.loserId = this.team1
          }
          try {
            this.score1 = this.text
            this.score2 = this.text2
            this.popupValue = 1;
            const res = await axios(`http://localhost:8081/api/tourmatch/${this.no}`, {
                        method: 'put',
                        data: {
                          teamOneId: this.team1,
                          teamTwoId: this.team2,
                          scoreTeamOne: this.text,
                          scoreTeamTwo: this.text2,
                          winnerId: this.winnerId,
                          tournamentId: parseInt(this.tournamentId),
                        },
                        withCredentials: true
                    })
              this.$q.notify({
                    type: 'positive',
                    position: 'top',
                    message: `Updated match results with success.`
                    })
                
            if(this.round === 0){
              this.$emit('first-round-match', this.teamToSend.teamId, this.teamToSend.teamName, this.teamToSend.teamCaptain,
               this.teamToSend.teamSeed, this.text, this.text2, this.teamToSend.loserId, this.no);
            }
            if(this.round === 1){
              this.$emit('second-round-match', this.teamToSend.teamId, this.teamToSend.teamName, this.teamToSend.teamCaptain,
               this.teamToSend.teamSeed, this.text, this.text2, this.teamToSend.loserId, this.no);
            }
            if(this.round === 2){
              this.$emit('final-round-match', this.teamToSend.teamId, this.teamToSend.teamName, this.teamToSend.teamCaptain,
               this.teamToSend.teamSeed, this.text, this.text2, this.teamToSend.loserId, this.no);
            }

          } catch (err){
            console.log(err);
             this.$q.notify({
                    type: 'negative',
                    position: 'top',
                    message: `Something went wrong. Please try again. If this bug persists please report it in the share feedback page.`
                    })
                this.popupValue = 0;
          }
        }

      }
    }

}
</script>

<style scoped>

.teamname{
    width: 10em;
}

.updateWidth{
  width: 350px;
}

</style>