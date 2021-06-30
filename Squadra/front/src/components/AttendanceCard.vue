<template>
    <div class="fit row justify-between" >
        <div class="text-h6 text-weight-medium text-center card"> {{ player }}</div>
        <div class="text-h6 text-weight-medium text-center card q-ml-xl"> {{ phone }}</div>
        <div class="text-h6 text-weight-medium text-center fb"> {{ facebook }}</div>
        <q-chip :color="value == 'Present' ? 'green': 'red'"  text-color="white" class="text-weight-medium q-mr-xl">
            {{ this.statusData[0].value }}
        </q-chip>
        <q-btn :disable="proxy" flat color="primary" label="Check in" @click="changeChip()"/>
    </div>
</template>

<script>
import axios from "axios";

export default {

    async created(){
        if(this.status == true){
            this.value = "Present"
        } else {
            this.value = "Absent"
        }

        this.userStatus = this.status

        this.statusData.push({
            id: this.id,
            player: this.player,
            status: this.userStatus,
            phone: this.phone,
            facebook: this.facebook,
            matchId: this.matchId,
            value: this.value
        })

    },

    name: "AttendanceCard",
    props: {
        id: Number,
        player: String,
        phone: String,
        facebook: String,
        status: Boolean,
        matchId: Number,
    },
    data(){
       return{
            value: null,
            userStatus: null,
            proxy: false,
            counter: 0,
            statusData: []
       }
    },

    methods: {
        async changeChip(){
            this.counter += 1;
            if(this.counter < 5){
                if(this.userStatus == false){
                    this.userStatus = true;
                    this.value = "Present";
                } else {
                    this.userStatus = false;
                    this.value = "Absent";
                }
                 try {
                    await axios('http://localhost:8081/api/ums/', {
                            method: 'put',
                            data: {
                                UserId : this.id,
                                MatchId: this.matchId,
                                isPresent: this.userStatus,
                            },
                            withCredentials: true
                        }).then(res =>{
                            this.$q.notify({
                                type: 'positive',
                                position: 'top',
                                message: `Updated attendance.`
                            });
                            this.changeStatusMain(this.id, this.userStatus, this.matchId);
                        })
                    } catch(err){
                        this.$q.notify({
                            type: 'negative',
                            position: 'top',
                            message: `Something went wrong. Please try again. If this bug persists please report it in the share feedback page.`
                        })
                    }

            } else {
                this.proxy = true;
                this.$q.notify({
                    type: 'negative',
                    position: 'top',
                    message: `Too many attempts to change the attendance status of this user! The button has been disabled.`
                })
            }
            this.statusData.find(el => el.id == this.id).value = this.value;
        },

        changeStatusMain(id, status, rowId){
           this.$emit('change-status', id, status, rowId);
        }
    },

}
</script>

<style scoped>
.card{
    width: 7.5em;
}

.fb{
  width: 22.5em;
}

</style>