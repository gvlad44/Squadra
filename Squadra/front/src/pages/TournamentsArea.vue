<template>
  <q-page class="column width q-mt-lg q-mb-lg" v-if="loaded">

      <q-card>
            <q-card-section>
                <p class="text-h4 q-mx-xl q-mt-lg q-mb-lg">Find a tournament</p>
            </q-card-section>

            <q-card-section>
                 <div class="row justify-end q-mx-xs">
            
                    <q-btn v-if="isAdmin" clickable exact to="/tournament/create" class="height q-mr-md q-mt-sm" color="primary" label="Create a tournament" icon="add_circle_outline"/>
                    <q-input outlined v-model="text" placeholder="Search name..." class="inputWidth q-mx-sm">
                        <template v-slot:append>
                            <q-icon v-if="text === '' " name="search"/>
                            <q-icon v-else name="clear" class="cursor-pointer" @click="text = '' " />
                        </template>
                    </q-input>

                </div>
            </q-card-section>

            <q-separator/>

            <q-card-section class="column">
                <TournamentCard
                v-for="tour in filteredTournaments"
                :no="tour.id"
                :key="tour.id"
                :name="tour.name"
                :noTeams="tour.noTeams"
                :maxTeams="tour.maxTeams"
                :place="tour.place"
                :date="tour.date"
                :ownerId="tour.ownerId"
                :validSetup="tour.validSetup"
                :canSignUp ="tour.canSignUp"
                :canWithdraw="tour.canWithdraw"
                :isSignedUp="tour.isSignedUp"
                :teamId="tour.teamId"
                :isAdmin="tour.isAdmin"
                @signUp-tournament="signUpTournament"
                @delete-participation="signUpTournament"
                @delete-tournament="filterTournaments"
                />
            </q-card-section>
      </q-card>

  </q-page>
</template>

<script>
import axios from "axios";
import TournamentCard from "../components/TournamentCard"

export default {

    async created(){

        await axios
        .get("http://localhost:8081/api/user/", {withCredentials: true})
        .then(res => {
            this.currentUser = res.data.user.id;
            this.isAdmin = res.data.user.isAdmin;
            this.loaded = true;
        })
        .catch(err =>{
            console.log(err);
        });

        if(this.currentUser == null){
        this.$router.push({name: 'Start'});
      }

      try {
          const tourneys = await axios("http://localhost:8081/api/tournament/", {
                        method: 'get',
                        withCredentials: true
                    })


            var currentDate = new Date();
            tourneys.data.tournament.forEach(async el => {

              var year = el.date;
              year = el.date.substr(0,4);
              var month = el.date;
              month = el.date.substr(5,2);
              var day = el.date;
              day = el.date.substr(8,2);

              var validation;
              var matchDate = new Date(year, month, day);
              matchDate.setMonth(matchDate.getMonth()-1);

              if(matchDate >= currentDate ){
                validation = true;
              } else {
                validation = false;
              }

                   try {

                        const res = await axios(`http://localhost:8081/api/tourhelper/${el.id}`, {
                        method: 'get',
                        withCredentials: true
                        })

                    let canWithdraw;
                    if(res.data.val == true && validation == true){
                        canWithdraw = true;
                    } else {
                        canWithdraw = false;
                    }

                    if(el.noTeamsParticipating == el.maxNoTeams){
                        validation = false;
                    }

                    let canSignUp;
                    if(res.data.val == false && validation == true && canWithdraw == false ){
                        canSignUp = true;
                    } else {
                        canSignUp = false;
                    }

                    this.tournaments.push({
                        id: el.id,
                        name: el.name,
                        noTeams: parseInt(el.noTeamsParticipating),
                        maxTeams: parseInt(el.maxNoTeams), 
                        place: el.place,
                        date: el.date,
                        validSetup: validation,
                        canSignUp: canSignUp,
                        canWithdraw: canWithdraw,
                        isSignedUp: res.data.val,
                        teamId: res.data.teamId,
                        isAdmin: this.isAdmin
                    })
                    }catch(err){
                       console.log(err)
                   }


                    this.tournaments.sort(function(a, b){
                return b.id - a.id});

            })            

      } catch (err){
          console.log(err);
      }



    },

    data () {
        return {
            loaded: false,
            currentUser: null,
            text: '',
            isAdmin: false,
            tournaments: [],
        }
     },

      components: {
        TournamentCard
    },

    methods: {
        signUpTournament(id, validSetup ,canSignUp, canWithdraw, isSignedUp, teamId, number){
            this.filteredTournaments.find(el => el.id == id).validSetup = validSetup;
            this.filteredTournaments.find(el => el.id == id).canSignUp = canSignUp;
            this.filteredTournaments.find(el => el.id == id).canWithdraw = canWithdraw;
            this.filteredTournaments.find(el => el.id == id).isSignedUp = isSignedUp;
            this.filteredTournaments.find(el => el.id == id).teamId = teamId;
            this.filteredTournaments.find(el => el.id == id).noTeams = number;

        },

        filterTournaments(id){
            this.tournaments = this.tournaments.filter((tourney)=> tourney.id !==id);
        }

    },

    computed: {
        filteredTournaments() {
          return this.tournaments.filter((t) => {
              return t.name.toLowerCase().includes(this.text.toLowerCase())
          })
        }
    }

}
</script>

<style scoped>
.width{
  width: 80%;
  margin-left: auto;
  margin-right: auto;
}

.inputWidth{
    width: 18em;
}

.height{
  height: 3em;
}


</style>