<script>
import axios from "axios";
import {Line} from "vue-chartjs";

export default {
    extends: Line,
    props: {
        label: String,
        label2: String,
        chartData: Array,
        chartData2: Array,
        options: Object,
        chartColors: Object,
    },

    async mounted(){

       try {
            const res = await axios.get("http://localhost:8081/api/match/", {withCredentials: true})
            res.data.matches.forEach(el => {

            })

       } catch(err){
           console.log(err);
       }

       let months = [];
       let sum = [];

       this.chartData.forEach( el => {
            months.push(el.label)
            sum.push(el.sum)
        });

        let months2 = [];
        let sum2 = [];

        this.chartData2.forEach( el => {
                months2.push(el.label)
                sum2.push(el.sum)
            });

        const {borderColor, pointBorderColor, backgroundColor, pointBackgroundColor} = this.chartColors;

        this.renderChart({
            labels: months,
            datasets: [{
                label: this.label,
                data: sum,
                borderColor: borderColor,
                pointBorderColor: pointBorderColor,
                pointBackgroundColor: pointBackgroundColor,
                backgroundColor: backgroundColor,
            },
            {
                label: this.label2,
                data: sum2,
                borderColor: "#37b960",
                pointBorderColor: "#000000",
                pointBackgroundColor: "#37b960",
                backgroundColor: "#a1e3b6",
            }
            ],
            options: this.options
        })

    }
    
}
</script>