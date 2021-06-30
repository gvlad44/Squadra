<script>
import axios from "axios";
import {Bar} from "vue-chartjs";

export default {
    extends: Bar,
    props: {
        options: Object,
    },

    async mounted(){

       try {

            let compName = [];
            compName.push("Matches");
            compName.push("Tournaments");
            let numbers = [];
            let numbers2 = [];
            var percentage = 0;
            var nrActual = 0;
            var nrTotal = 0;

            const res2 = await axios.get("http://localhost:8081/api/match/", {withCredentials: true})
            res2.data.matches.forEach(el => {
               nrActual += el.noParticipants;
               nrTotal += el.maxParticipants;
            });
            percentage = ((nrActual/nrTotal)*100).toFixed(2);
            numbers.push(percentage)
            nrActual = 0;
            nrTotal = 0;

            const res = await axios.get("http://localhost:8081/api/tournament/", {withCredentials: true})
            res.data.tournament.forEach(el => {
                nrActual += parseInt(el.noTeamsParticipating)*3;
                nrTotal += parseInt(el.maxNoTeams)*3
            })
            percentage = ((nrActual/nrTotal)*100).toFixed(2);
            numbers2.push(percentage)

            var perc = []
            perc.push("Percentage")
            var min = 0;
            var max = 100;

        this.renderChart({
            labels: perc,
            datasets: [{
                label: "Matches",
                data: numbers,
                backgroundColor: ["#f5af25"]
            }, {
                label: "Tournaments",
                data: numbers2,
                backgroundColor: [ "#e37e02"]
            }],
            options: this.options
        })

         } catch(err){
           console.log(err);
       }

    }

}
</script>

<style>

</style>