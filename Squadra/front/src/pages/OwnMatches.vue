<template>
  <q-page class="column width q-mt-lg" v-if="loaded">
    
    <q-card class="q-mb-lg">
      <q-card-section>
        <p class="text-h4 q-mx-xl q-mt-lg q-mb-lg">Personal matches</p>
      </q-card-section>
      <q-separator/>
      <q-card-section>
        <div class="q-pa-md fit row justify-center q-mb-md">

        <q-table
        title="Own matches"
        :data="dataMatches"
        :columns="columns"
        row-key="name"
        :filter="filter"
        no-data-label="You did not create any match"
        class="q-mb-lg"
        >

        <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn dense round flat color="primary" icon="delete" @click="openDialog(props.row)" v-if="props.row.validDate"></q-btn>
              <q-btn dense round flat color="primary" icon="info" @click="openAttendanceDialog(props.row)"></q-btn>
            </q-td>          
          </template>

        <template v-slot:top-right>
            <q-btn color="primary" label="Create a match" icon="add_circle_outline" class="q-mr-md" clickable exact to="/create"/>
            <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
            <template v-slot:append>
                <q-icon name="search" />
            </template>
            </q-input>
        </template>

        </q-table>

    </div>

    <q-dialog v-model="dialog" persistent>
        <q-card class=" q-pl-md q-pr-md">
          <q-card-section class="row items-center">
             <q-avatar icon="priority_high" color="primary" text-color="white" />
            <span class="q-ml-sm text-subtitle1 text-weight-medium">Are you sure you want to delete this match? <br>It will affect other users as well.</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Yes" color="primary" v-close-popup @click="deleteMatch()"/>
            <q-btn flat label="No" color="primary" v-close-popup  />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="attendanceDialog" persistent>
        <q-card class=" q-pl-md q-pr-md">
          <q-card-section class="row justify-center q-mt-md">
            <span class="q-ml-sm text-h5 text-weight-medium">Match details</span>
          </q-card-section>

          <q-separator color="primary"/>

          <q-card-section class="column items-center q-mt-lg">
            <div class="fit row justify-between q-mb-lg ">
              <div class="text-h5 text-weight-medium text-center  card"> User </div>
              <div class="text-h5 text-weight-medium text-center  card"> Phone number </div>
              <div class="text-h5 text-weight-medium text-center  card"> Facebook </div>
              <div class="text-h5 text-weight-medium text-center q-pl-lg card"> Attendance </div>
              <div class="text-h5 text-weight-medium text-center q-pl-lg card"> Actions </div>
            </div>
            <div class="fit row justify-center q-mb-lg" v-if="cevaState">
              <div class="text-h6 text-center q-ml-xl"> No user signed up for this game yet </div>
            </div>
            <AttendanceCard 
            v-for="card in attendanceArray"
            :id="card.currentUser" 
            :key="card.currentUser"
            :player="card.player"
            :phone="card.phone"
            :facebook="card.facebook"
            :status="card.status"
            :matchId="card.matchId"
            @change-status="changeStatus"/>
          </q-card-section>

          <q-card-actions align="right" class="q-mt-md">
            <q-btn flat label="OK" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      </q-card-section>
    </q-card>

  </q-page>
</template>

<script>
import axios from "axios";
import AttendanceCard from '../components/AttendanceCard';

export default {

    async created() {
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

        var userDate = new Date();
        await axios
        .get("http://localhost:8081/api/one/", {withCredentials: true})
        .then(res => {
            res.data.matches.forEach(async (el) => {

                var year = el.date;
                year = el.date.substr(0,4);
                var month = el.date;
                month = el.date.substr(5,2);
                var day = el.date;
                day = el.date.substr(8,2);

                var validation;
                var validationCheckIn;
                var matchDate = new Date(year, month, day);
                matchDate.setMonth(matchDate.getMonth()-1);
                if(matchDate >= userDate ){
                    validation = true;
                } else {
                  validation = false;
                }

                if(matchDate <= userDate ){
                    validationCheckIn = true;
                } else {
                  validationCheckIn = false;
                }
                
                var owner = el.ownerId;
                await axios(`http://localhost:8081/api/usersOne/${el.id}`, {
                    method: "get",
                    withCredentials: true
                }).then(res => {
                    var userPhone;
                    var userFacebook;
                    this.usersArray = [];
                    res.data.users.forEach(user => {
                        if(user.id != owner){
                            if(user.phone != null){
                              userPhone = user.phone
                            } else {
                              userPhone = 'Not available'
                            }

                            if(user.facebook != null){
                              userFacebook = user.facebook
                            } else {
                              userFacebook = 'Not available'
                            }

                            this.usersArray.push({
                              id: user.id,
                              name: user.name,
                              phone: userPhone,
                              facebook: userFacebook,
                              status: user.status
                            })

                        }
                        this.usersArray = this.usersArray.filter((user)=> user.id !== owner);
                    });
                    
                  this.dataMatches.push({
                    no: el.id,
                    place: el.place,
                    date: el.date,
                    noPart: el.noParticipants,
                    maxPart: el.maxParticipants,
                    validDate: validation,
                    validCheckIn: validationCheckIn,
                    users: this.usersArray,
                })

                 this.dataMatches.sort(function(a, b){
                return b.no - a.no});

              })
                

            });
            
        })
        .catch(err =>{
            console.log(err);
        });

    },

    data () {
    return {
      loaded: false,
      filter: '',
      columns: [
        { name: "no", align: 'left', label: "Match no.",  field: "no", sortable: true},
        { name: 'place', align: 'left', label: 'Place', field: row => row.place, sortable: true, required: true },
        { name: 'date', align: 'left', label: 'Date', field: 'date', sortable: true },
        { name: 'noPart', align: 'left',label: 'Number of participants', field: 'noPart' },
        { name: 'maxPart', align: 'left',label: 'Maximum number of participants', field: 'maxPart'},
        { name: 'actions', align: 'left',label: 'Actions', field: '', align: 'center'}
      ],
      dataMatches: [],
      usersArray: [],
      dialog: false,
      currentUser: null,
      rowId: null,
      attendanceDialog: false,
      attendanceArray: [],
      cevaState: false,
    }
  },

    components: {
        AttendanceCard
    },

  methods: {
       openDialog(row){
        this.dialog = true;
        this.rowId = row.no;
      },

      openAttendanceDialog(row){
        this.attendanceArray = [];
        this.attendanceDialog = true;
        this.rowId = row.no;
        row.users.forEach(el => {
          this.attendanceArray.push({
            currentUser: el.id,
            player: el.name,
            phone: el.phone,
            facebook: el.facebook,
            status: el.status,
            matchId: this.rowId,
          })
        });
        if(this.attendanceArray.length < 1){
          this.cevaState = true;
        } else {
            this.cevaState = false;
        }
      },

      changeStatus(id, status, rowId){
        this.dataMatches.find(el => el.no == rowId).users.find(el => el.id == id).status = status;
      },

        async deleteMatch(){
        try{
          await axios(`http://localhost:8081/api/match/${this.rowId}`, {
            method: 'delete',
            withCredentials: true
          })
          this.dataMatches = this.dataMatches.filter(dm => dm.no!=this.rowId);
          this.$q.notify({
            type: 'positive',
            position: 'top',
            message: `Match succesfully deleted.`
          })
        } catch (err) {
        console.log(err);
            this.$q.notify({
                type: 'negative',
                position: 'top',
                message: `Something went wrong. Please try again. If this bug persists please report it in the share feedback page.`
            })
        }
      },

  }

}
</script>

<style scoped>

.width{
  width: 80%;
  margin-left: auto;
  margin-right: auto;
}

@media (min-width: 600px){
  .q-dialog__inner--minimized > div {
      max-width:fit-content;
  }
}

.card{
    width: 5em;
}

</style>