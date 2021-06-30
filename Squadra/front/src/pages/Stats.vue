<template>
   <q-page class="fit column content-center width q-my-lg" v-if="isAdmin">
        <q-card bordered class="width">
          <q-card-section>
              <p class="text-h4 q-mt-md q-mb-md text-weight-medium q-mx-xl">Statistics page</p>
          </q-card-section>

          <q-separator />

          <q-card-section v-if="isAdmin">
              <div class="column items-center text-center">
                  <h4>Preference of parks for matches</h4>
                  <PieChart :chartData = "chartData" :options="chartOptions" label = "Matches" :chartColors = "pieChartColors"/>
              </div>
          </q-card-section>

          <q-separator />

          <q-card-section v-if="isAdmin">
              <div class="column items-center text-center">
                  <h4>Revenue in RON for the year 2021</h4>
                  <LineChart :chartData = "projectedRevenue" :chartData2 = "actualRevenue"
                    :options="chartOptions" label = "Projected revenue" label2 = "Actual revenue"
                    :chartColors = "lineChartColors"/>
              </div>
          </q-card-section>

          <q-separator />

            <q-card-section v-if="isAdmin">
              <div class="column items-center text-center">
                  <h4>Total number of participants</h4>
                  <DoughnutChart :options="chartOptions"/>
              </div>
            </q-card-section>

          <q-separator />

            <q-card-section v-if="isAdmin">
              <div class="column items-center text-center">
                  <h4>Ocupation percentage</h4>
                  <BarChart :options="chartOptions"/>
              </div>
            </q-card-section>

        </q-card>
    </q-page>
</template>

<script>
import axios from "axios";
import PieChart from "../components/PieChart";
import LineChart from "../components/LineChart";
import DoughnutChart from "../components/DoughnutChart";
import BarChart from "../components/BarChart";

export default {

    async created() {
        try {
            const res = await axios.get("http://localhost:8081/api/user/", {withCredentials: true})
            this.currentUserId = res.data.user.id;
            this.isAdmin = res.data.user.isAdmin;
        } catch(err){
            console.log(err);
        };

        if(this.isAdmin === false ){
             this.$router.push({name: 'Home'});
        }
        if(this.isAdmin == null){
            this.$router.push('/');
        }

        for(let i=0;i<12;i++){
            this.projectedRevenue.push({
                id: i,
                label: this.monthsArray[i],
                sum: this.sumsArray[i],
            })
        }

        for(let i=0;i<12;i++){
            this.actualRevenue.push({
                id: i,
                label: this.monthsArray[i],
                sum: 0,
            })
        }

        try {
            const res = await axios.get("http://localhost:8081/api/tournament/", {withCredentials: true})

            res.data.tournament.forEach(el => {
                var month = el.date;
                month = el.date.substr(5,2);
                parseInt(month);
                if(this.actualRevenue.find(el => el.id == month-1)){
                    let sum = parseInt(el.noTeamsParticipating) * 2 * 3
                    this.actualRevenue.find(el => el.id == month-1).sum += sum;
                }
                
            });

        } catch (err){
            console.log(err)
        }
        
    },

    async mounted(){
        
        try {
            const res = await axios.get("http://localhost:8081/api/match/", {withCredentials: true})
        res.data.matches.forEach(el => {
            
            if(el.place == this.parks[0]){
                this.noMatches.izvor ++;
            }

            if(el.place ==  this.parks[1]){
                this.noMatches.studentesc ++;
            }

            if(el.place ==  this.parks[2]){
                this.noMatches.tineretului ++;
            }

            if(el.place ==  this.parks[3]){
                this.noMatches.nIorga ++;
            }
                
        });

            var it = 0;
            var park = this.parks[it]
            this.chartData.push({
                park,
                total: this.noMatches.izvor
            })
            it++;
            park = this.parks[it]

            this.chartData.push({
                park,
                total: this.noMatches.studentesc
            })
            it++;
            park = this.parks[it]

            this.chartData.push({
                park,
                total: this.noMatches.tineretului
            })
            it++;
            park = this.parks[it]

            this.chartData.push({
                park,
                total: this.noMatches.nIorga
            })

        } catch(err){
            console.log(err);
        };

    },

    components: {
        PieChart,
        LineChart,
        DoughnutChart,
        BarChart
    },

     data () {
        return {
            currentUserId: null,
            isAdmin: null,
            parks: [ 'Izvor Park, Bucharest', 'Studentesc Basketball Courts, Bucharest', 'Tineretului Park, Bucharest', 'Nicolae Iorga Park, Bucharest' ],
            noMatches: {
                izvor: 0,
                studentesc: 0,
                tineretului: 0,
                nIorga: 0,
            },
            chartData: [],
            chartOptions: {
                responsive: true,
                maintainAspectRatio: false
            },
            pieChartColors: [ "#e37e02" , "#f5af25", "#21ba45", "#31ccec"],
            projectedRevenue: [],
            monthsArray: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            sumsArray: [0, 0, 0, 48, 48, 144, 192, 288, 192, 96, 0, 0],
            lineChartColors: {
                borderColor: "#e37e02",
                pointBorderColor: "#000000",
                pointBackgroundColor: "#f5af25",
                backgroundColor: "#FFDAB9",
            },
            actualRevenue: [],

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

</style>