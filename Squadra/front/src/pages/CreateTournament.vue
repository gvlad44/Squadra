<template>
  <q-page class="column width q-mt-lg q-mb-lg" v-if="isAdmin">
    <q-card class="width">

       <q-card-section class="column items-center">
          <p class="text-h4 q-mx-xl q-mt-lg q-mb-lg">Create an 8 team tournament</p>
        </q-card-section>

      <q-separator/>

      <q-card-section class="column items-center">

        <div class="column q-mb-lg">
            <p class="text-h6 q-mt-xl text-weight-medium ">Tournament name</p>
            <q-input v-model="textName" label="Name" class="input"/>
        </div>

                <div class="column q-mb-lg">
                    <p class="text-h6 text-weight-medium ">City</p>
                    <q-select v-model="city" :options="optionsOne" class="input " readonly outlined />
                </div>
                <div class="column q-mb-lg">
                    <p class="text-h6 text-weight-medium ">Location</p>
                    <q-select v-model="place" :options="optionsPlace" label="Location" class="input " outlined />
                </div>

                <div class="column items-center q-mb-lg">
                    <p class="text-h6 text-weight-medium float-left adjWidth">Date & time</p>
                    <div class="row justify-center">
                        <q-btn icon="event" round color="primary" class="btnWidth q-mr-md">
                            <q-popup-proxy @before-show="updateProxy" transition-show="scale" transition-hide="scale">
                                <q-date v-model="proxyDate" >
                                <div class="row items-center justify-end q-gutter-sm">
                                    <q-btn label="OK" color="primary" flat @click="save" v-close-popup />
                                    <q-btn label="Cancel" color="primary" flat v-close-popup />
                                </div>
                                </q-date>
                            </q-popup-proxy>
                        </q-btn>
                        <q-btn icon="access_time" round color="primary">
                            <q-popup-proxy @before-show="updateProxyTime" transition-show="scale" transition-hide="scale">
                                <q-time v-model="proxyTime">
                                <div class="row items-center justify-end q-gutter-sm">
                                    <q-btn label="OK" color="primary" flat @click="saveTime" v-close-popup />
                                    <q-btn label="Cancel" color="primary" flat v-close-popup /> 
                                </div>
                                </q-time>
                            </q-popup-proxy>
                        </q-btn>
                    </div>
                    <p class="text-body1 text-weight-medium q-mt-md">Selected date: {{this.date}} <br>Selected time: {{this.time}}</p>
                </div>
        
        <div class="column items-center q-mt-lg q-mb-md">
          <q-btn color="primary" label="Submit" @click="createTournament()"/>
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
            this.isAdmin = res.data.user.isAdmin;
        })
        .catch(err =>{
            console.log(err);
        });

        if(this.isAdmin === false ){
             this.$router.push({name: 'Home'});
        }

        if(this.isAdmin == null){
            this.$router.push('/');
        }
    },

     data () {
        return {
            currentUser: null,
            isAdmin: null,
            textName: '',
            city: 'Bucharest',
            optionsOne: [
                'Bucharest'
            ],
            optionsPlace: [
                'Izvor Park', 'Studentesc Basketball Courts', 'Tineretului Park', 'Nicolae Iorga Park'
            ],
            place: null,
            time: null,
            proxyTime: null,
            proxyDate: null,
            date: null,
            createdTournamentId: null,
        };
    },

     methods: {
        updateProxy () {
        this.proxyDate = this.date
        },

        save () {
        this.date = this.proxyDate
        },

        updateProxyTime () {
        this.proxyTime = this.time
        },

        saveTime () {
        this.time = this.proxyTime
        },

        async createTournament(){
            var location;
            var valid = true;

            if(parseInt(this.textName.length) < parseInt(10)){
                valid = false
                 this.$q.notify({
                    type: 'negative',
                    position: 'top',
                    message: `Tournament name should have at least 10 characters.`
                    })
            }

            if(this.place == null){
                valid = false;
                this.$q.notify({
                type: 'negative',
                position: 'top',
                message: 'Please choose a location.'
                })
            } else{
                location = this.place + ", " + this.city;
            }

            if(this.date == null){
                valid = false;
                this.$q.notify({
                type: 'negative',
                position: 'top',
                message: 'Please choose a date.'
                })
            }

            if(this.time == null){
                valid = false;
                this.$q.notify({
                type: 'negative',
                position: 'top',
                message: 'Please choose the time.'
                })
            }

            if(this.date != null){
                var year = this.date;
                year = this.date.substr(0,4);
                var month = this.date;
                month = this.date.substr(5,2);
                var day = this.date;
                day = this.date.substr(8,2);

                var inputDate = new Date(year, month, day);
                var currentDate = new Date();
                inputDate.setMonth(inputDate.getMonth()-1);


                if(inputDate.getFullYear() > 2022){
                    valid = false;
                    this.$q.notify({
                    type: 'negative',
                    position: 'top',
                    message: 'Please choose a date until 31/12/2022.'
                    })
                }

                if(inputDate <= currentDate){
                    valid = false;
                    this.$q.notify({
                    type: 'negative',
                    position: 'top',
                    message: 'Please choose a date starting with tomorrow.'
                    })
                }
            }

            var dateToSend = this.date + " at " + this.time;



            if(valid){
                try{

                   const res = await axios("http://localhost:8081/api/tournament/", {
                        method: 'post',
                        data: {
                            name: this.textName,
                            noTeamsParticipating: 0,
                            maxNoTeams: 8,
                            place: location,
                            date: dateToSend,
                            ownerId: this.currentUser,
                            },
                        withCredentials: true
                    })

                    this.createdTournamentId = res.data.createdTournament.id;

                    for(let i=0;i<7;i++){
                        await axios("http://localhost:8081/api/tourmatch/", {
                            method: 'post',
                            data: {
                                teamOneId: null,
                                teamTwoId: null,
                                scoreTeamOne: 0,
                                scoreTeamTwo: 0,
                                winnerId: null,
                                tournamentId: this.createdTournamentId,
                                },
                            withCredentials: true
                        })
                    }

                    if(res.status == 201){
                        this.$q.notify({
                        type: 'positive',
                        position: 'top',
                        message: 'Tournament added with success.'
                        })
                        this.$router.push('/tournaments');
                    } else {
                        this.$q.notify({
                        type: 'negative',
                        position: 'top',
                        message: `Something went wrong. Please try again. If this bug persists please report it in the share feedback page.`
                        })
                    }

                } catch (err){
                    console.log(err);
                }
            }
            
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

.input{
    width: 20rem;
    height: 5rem;
}

</style>