<template>
  <q-page class="column width q-mt-lg q-mb-lg" v-if="loaded">
    <q-card>

      <q-card-section>
          <p class="text-h4 q-mx-xl q-mt-lg q-mb-lg">Your teams</p>
      </q-card-section>

      <q-separator/>

      <q-card-section>
        <div class="row justify-end q-mx-xs">
            
            <q-btn class="height q-mr-md q-mt-sm" color="primary" label="Create a team" icon="add_circle_outline" clickable exact to="/team/create"/>
            <q-input outlined v-model="text" placeholder="Search name..." class="inputWidth q-mx-sm">
                <template v-slot:append>
                    <q-icon v-if="text === '' " name="search"/>
                    <q-icon v-else name="clear" class="cursor-pointer" @click="text = '' " />
                </template>
            </q-input>

        </div>
      </q-card-section>

      <q-card-section class="column">
        <TeamCard
        v-for="team in filteredTeams"
        :id="team.no"
        :key="team.no"
        :name="team.name"
        :nameOne="team.nameOne"
        :emailOne="team.emailOne"
        :nameTwo="team.nameTwo"
        :emailTwo="team.emailTwo"
        :ownerId="team.ownerId"
        :isValid="team.isValid"
        @delete-team="filterTeams"
        />
      </q-card-section>

    </q-card>
  </q-page>
</template>

<script>
import axios from "axios";
import TeamCard from "../components/TeamCard"

export default {

  async created(){
        await axios
        .get("http://localhost:8081/api/user/", {withCredentials: true})
        .then(res => {
            this.currentUser = res.data.user.id;
            this.loaded = true;
        })
        .catch(err =>{
            console.log(err);
        });

        if(this.currentUser == null){
        this.$router.push({name: 'Start'});
      }

      axios.get("http://localhost:8081/api/team/user", {
        withCredentials: true
      }).then(res => {
        res.data.team.forEach(async el => {

            const team = await axios(`http://localhost:8081/api/tourteams/ceva/${el.id}`, {
                        method: 'get',
                        withCredentials: true
                    })
              
            var valid;
            if(team.data.tournamentTeam != null){
              valid = false;
            } else {
              valid = true;
            }

            this.teamsArray.push({
              no: el.id,
              name: el.name,
              nameOne: el.teammateOneName,
              emailOne: el.teammateOneEmail,
              nameTwo: el.teammateTwoName,
              emailTwo: el.teammateTwoEmail,
              ownerId: el.ownerId,
              isValid: valid,
            })
              this.teamsArray.sort(function(a, b){
                return b.no - a.no});
        });
      
      })

    },

     data () {
        return {
            loaded: false,
             text: '',
             currentUser: null,
             teamsArray: [],
        }
     },

      components: {
        TeamCard
    },

    methods: {
      filterTeams(id){
        this.teamsArray = this.teamsArray.filter((team)=> team.no !==id);
      }
    },

    computed: {
        filteredTeams() {
          return this.teamsArray.filter((team) => {
              return team.name.toLowerCase().includes(this.text.toLowerCase())
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