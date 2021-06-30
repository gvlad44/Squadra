<template>
  <q-page class="column width q-mt-lg q-mb-lg" v-if="loaded">

    <q-card bordered>
        <q-card-section>
            <p class="text-h4 q-mx-xl q-mt-lg q-mb-lg">Find a match</p>
        </q-card-section>
        
        <q-card-section>
        <div class="row justify-end q-mx-xs">
            
            <q-select outlined v-model="parkModel" :options="parkOptions" class="inputWidth q-mx-sm"/>

            <q-select outlined v-model="dateModel" :options="dateOptions" class="inputWidth q-mx-sm"/>

            <q-input outlined v-model="text" placeholder="Search name..." class="inputWidth q-mx-sm">
                <template v-slot:append>
                    <q-icon v-if="text === '' " name="search"/>
                    <q-icon v-else name="clear" class="cursor-pointer" @click="text = '' " />
                </template>
            </q-input>
        </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
            <div class="row q-mb-lg q-mx-xl justify-around q-mt-lg">
                <MatchCard 
                    v-for="match in filteredMatches" 
                    :id="match.id"
                    :key="match.id"
                    :location="match.place"
                    :date="match.date"
                    :noPart="match.noParticipants"
                    :maxPart="match.maxParticipants"
                    :creator="match.creator"
                    :currentUser="match.currentUser"
                    :ownerId="match.ownerId"
                    @delete-card="filterCards"/>
            </div>
        </q-card-section>

    </q-card>

  </q-page>
</template>

<script>
import axios from "axios";
import MatchCard from '../components/MatchCard';

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

    },

    async mounted(){
        await axios
        .get("http://localhost:8081/api/match/", {withCredentials: true})
        .then(res => {
            var currentDate = new Date();
            res.data.matches.forEach(async el => {
                
              var year = el.date;
              year = el.date.substr(0,4);
              var month = el.date;
              month = el.date.substr(5,2);
              var day = el.date;
              day = el.date.substr(8,2);

              var validation;
              var matchDate = new Date(year, month, day);
              matchDate.setMonth(matchDate.getMonth()-1);
              if(matchDate > currentDate || (matchDate.getDate() == currentDate.getDate() && matchDate.getMonth() == currentDate.getMonth() 
                && matchDate.getFullYear() == currentDate.getFullYear())){
                validation = true;
              } else {
                validation = false;
              }

              if(this.currentUser == el.ownerId){
                validation = false;
              }

                await axios(`http://localhost:8081/api/ums/${el.id}`, {
                    method: 'get',
                    withCredentials: true
                })
                .then(resp => {
                    if(resp.data.valid === false){
                        validation = false;
                    }
                }) .catch(err =>{
                    console.log(err);
                });

                if(el.noParticipants === el.maxParticipants){
                    validation = false;
                }

                await axios
                .get("http://localhost:8081/api/user/" + el.ownerId, {withCredentials: true})
                .then( resp =>{
                    if(validation){
                    this.matches.push({
                        id: el.id,
                        place: el.place,
                        date: el.date,
                        noParticipants: el.noParticipants,
                        maxParticipants: el.maxParticipants,
                        creator: resp.data.user.name,
                        currentUser: this.currentUser,
                        ownerId: el.ownerId,
                    })
                }
                }) 
                .catch(err =>{
                    console.log(err);
                });

            });

        })
        .catch(err =>{
            console.log(err);
        });

    },

    data () {
        return {
            loaded: false,
            text: '',
            parkModel: 'Filter by park',
            parkOptions: [
                'No filter', 'Izvor Park', 'Studentesc Basketball Courts', 'Tineretului Park', 'Nicolae Iorga Park'
            ],
            dateModel: 'Sort by date',
            dateOptions: [
               'No sort' ,'Date (asc.)', 'Date (desc.)'
            ],
            currentUser: null,
            matches: [],
        }
    },

    components: {
        MatchCard
    },

    methods: {

        filterCards(id){
            this.matches = this.matches.filter((match) => match.id !==id);
        }

    },

    computed: {
        filteredMatches() {

            if(this.text === ''){
                if(this.parkModel !== "Filter by park" && this.parkModel !== "No filter"){
                    return this.matches.filter((match) => {
                        return match.place.toLowerCase().includes(this.parkModel.toLowerCase())
                    })
                }
            }

            if(this.dateModel === "Date (asc.)"){
                 function compare(a,b){
                    if(a.date < b.date)
                        return -1;
                    if(a.date > b.date)
                        return 1;
                    return 0;
                }
                 
                 return this.matches.sort(compare);
            }

            if(this.dateModel === "Date (desc.)"){
                 function compare(a,b){
                    if(a.date < b.date)
                        return 1;
                    if(a.date > b.date)
                        return -1;
                    return 0;
                }
                 
                 return this.matches.sort(compare);
            }

            if(this.parkModel === "Filter by park" || this.parkModel === "No filter"){
                    return this.matches.filter((match) => {
                return match.creator.toLowerCase().includes(this.text.toLowerCase())
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

.inputWidth{
    width: 18em;
}

</style>