<template>
    <q-page class="column width q-mt-lg q-mb-lg" v-if="loaded">
        <q-card class="cardCreate">
            <q-card-section class="column items-center">
                <p class="text-h4 q-mx-xl q-mt-lg q-mb-lg">Create a match</p>
            </q-card-section>
             <q-separator />
            <q-card-section class="column items-center">
                <div class="column q-mb-lg">
                    <p class="text-h6 q-mt-xl text-weight-medium ">City</p>
                    <q-select v-model="city" :options="optionsOne" class="input " readonly outlined />
                </div>
                <div class="column q-mb-lg">
                    <p class="text-h6 text-weight-medium ">Location</p>
                    <q-select v-model="match.place" :options="optionsPlace" label="Location" class="input " outlined />
                </div>
                <div class="column q-mb-lg">
                    <p class="text-h6 text-weight-medium ">Maximum number of participants</p>
                    <q-badge color="primary" class=" badge q-py-xs">
                        Values between 2 and 20
                    </q-badge>
                    <q-slider
                    v-model="value"
                    :min="2"
                    :max="20"
                    :step="1"
                    label-always
                    label
                    color="primary"
                    class="input  q-mt-md"
                    />
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
                    <p class="text-body1 text-weight-medium q-mt-md">Selected date: {{this.match.date}} <br>Selected time: {{this.time}}</p>
                </div>
                <div class="column items-center q-mt-lg q-mb-md">
                    <q-btn color="primary" label="Submit" @click="createMatch()"/>
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
        this.match.ownerId = res.data.user.id;
        this.loaded = true;
      })
      .catch(err =>{
        console.log(err);
      });

      if(this.match.ownerId == null){
        this.$router.push({name: 'Start'});
      }
      
    },

    data () {
    return {
      loaded: false,
      city: 'Bucharest',
      optionsOne: [
        'Bucharest'
      ],
      optionsPlace: [
        'Izvor Park', 'Studentesc Basketball Courts', 'Tineretului Park', 'Nicolae Iorga Park'
      ],
      value: 10,
      proxyDate: null,
      match: {
          no: null,
          place: null,
          date: null,
          noParticipants: 1,
          ownerId: null,
      },
      time: null,
      proxyTime: null

    }
  },

  methods: {
        updateProxy () {
        this.proxyDate = this.match.date
        },

        save () {
        this.match.date = this.proxyDate
        },

        updateProxyTime () {
        this.proxyTime = this.time
        },

        saveTime () {
        this.time = this.proxyTime
        },

        async createMatch(){
            
            var location;
            var valid = true;
            if(this.match.place == null){
                valid = false;
                this.$q.notify({
                type: 'negative',
                position: 'top',
                message: 'Please choose a location.'
                })
            } else{
                location = this.match.place + ", " + this.city;
            }

            if(this.match.date == null){
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

            if(this.match.date != null){
                var year = this.match.date;
                year = this.match.date.substr(0,4);
                var month = this.match.date;
                month = this.match.date.substr(5,2);
                var day = this.match.date;
                day = this.match.date.substr(8,2);

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

                if(inputDate < currentDate){
                    valid = false;
                    this.$q.notify({
                    type: 'negative',
                    position: 'top',
                    message: 'Please choose a date starting with tomorow.'
                    })
                }
            }

            var dateToSend = this.match.date + " at " + this.time;
            
            if(valid){
                axios("http://localhost:8081/api/match/", {
                    method: 'post',
                    data: {
                        place: location,
                        date: dateToSend,
                        noParticipants: 1,
                        maxParticipants: this.value,
                        ownerId: this.match.ownerId,
                        },
                    withCredentials: true
                }).then(async res => {
                    this.$q.notify({
                    type: 'positive',
                    position: 'top',
                    message: `Match created succesfully.`
                    })

                    this.match.no = res.data.data.id;
                    axios("http://localhost:8081/api/ums/", {
                        method: 'post',
                        data: {
                            UserId: this.match.ownerId,
                            MatchId: this.match.no,
                            isPresent: true,
                            },
                        withCredentials: true
                    }).then(res => {
                        this.$router.push({name: 'Home'});
                    })
                    .catch(err => {
                        this.$q.notify({
                        type: 'negative',
                        position: 'top',
                        message: `Something went wrong. Please try again. If this bug persists please report it in the share feedback page.`
                        })
                    })

                }).catch(err => {
                    this.$q.notify({
                    type: 'negative',
                    position: 'top',
                    message: `Something went wrong. Please try again. If this bug persists please report it in the share feedback page.`
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

.cardCreate{
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    color: black;
}

.input{
    width: 20rem;
    height: 5rem;
}

.adjWidth{
    width: 20rem;
}

.badge{
    width: 12em;
}

.btnWidth{
    width: fit-content;
}

</style>