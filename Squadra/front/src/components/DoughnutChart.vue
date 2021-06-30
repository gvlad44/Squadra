<script>
import axios from "axios";
import {Doughnut} from "vue-chartjs";

export default {
    extends: Doughnut,
    props: {
        options: Object,
    },

    async mounted(){

       try {

            let compName = [];
            compName.push("Matches");
            compName.push("Tournaments");
            let numbers = [];
            var nr = 0;

            const res2 = await axios.get("http://localhost:8081/api/match/", {withCredentials: true})
            res2.data.matches.forEach(el => {
               nr += el.noParticipants;
            });
            numbers.push(nr)
            nr = 0;

            const res = await axios.get("http://localhost:8081/api/tournament/", {withCredentials: true})
            res.data.tournament.forEach(el => {
                nr += parseInt(el.noTeamsParticipating)*3;
            })
            numbers.push(nr)

        this.renderChart({
            labels: compName,
            datasets: [{
                data: numbers,
                backgroundColor: ["#21ba45" , "#f5af25"]
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