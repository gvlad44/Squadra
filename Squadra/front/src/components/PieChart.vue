<script>
import axios from "axios";
import {Pie} from "vue-chartjs";

export default {
    extends: Pie,
    props: {
        label: String,
        chartData: Array,
        options: Object,
        chartColors: Array,
    },

    async mounted(){

       try {
            const res = await axios.get("http://localhost:8081/api/match/", {withCredentials: true})
            res.data.matches.forEach(el => {

            })

       } catch(err){
           console.log(err);
       }

        let parks = [];
        let numbers = [];

        this.chartData.forEach(async el => {
            parks.push(el.park)
            numbers.push(el.total)
        });

        let backgroundColor = [];
        backgroundColor = this.chartColors;

        this.renderChart({
            labels: parks,
            datasets: [{
                label: this.label,
                data: numbers,
                backgroundColor: backgroundColor
            }],
            options: this.options
        })

    }

}
</script>

<style>

</style>