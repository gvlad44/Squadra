<template>
  
    <q-card class="column q-mb-md">

        <q-card-section>
             <div class="text-h5 text-weight-bold q-ml-lg">{{ name }}</div>
        </q-card-section>

        <q-card-section class="fit row justify-between">
            <div class="column q-ml-xl">
                 <div class="text-h6  text-center text-weight-medium q-mb-xs">Team member 1</div>
                 <div class="text-h6  text-center text-weight-regular">{{ nameOne }}</div>
                 <div class="text-h6  text-center text-weight-regular">{{ emailOne }}</div>
            </div>
            <div class="column">
                <div class="text-h6  text-center text-weight-medium q-mb-xs">Team member 2 </div>
                 <div class="text-h6 text-center text-weight-regular">{{ nameTwo }}</div>
                 <div class="text-h6 text-center text-weight-regular">{{ emailTwo }}</div>
            </div>
            <div class="column q-mt-lg q-mr-xl">
                <q-btn v-if="isValid" round color="primary" icon="delete" @click="openDialog()"/>
            </div>
        </q-card-section>

        <q-dialog v-model="dialog" persistent>
        <q-card class=" q-pl-md q-pr-md">
          <q-card-section class="row items-center">
             <q-avatar icon="warning" color="primary" text-color="white" />
            <span class="q-ml-sm text-subtitle1 text-weight-medium">Are you sure you want to delete this team?</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Yes" color="primary" v-close-popup @click="deleteTeam()"/>
            <q-btn flat label="No" color="primary" v-close-popup  />
          </q-card-actions>
        </q-card>
      </q-dialog>

    </q-card>

</template>

<script>
import axios from "axios";

export default {
     name: 'TeamCard',
     data() {
         return{
             dialog: false,
         };
     },
     props: {
         id: Number,
         name: String,
         nameOne: String,
         emailOne: String,
         nameTwo: String,
         emailTwo: String,
         ownerId: Number,
         isValid: Boolean,
     },
     methods: {
         openDialog(){
              this.dialog = true;
         },

         async deleteTeam(){
             try{
                await axios(`http://localhost:8081/api/team/${this.id}`, {
                    method: 'delete',
                    withCredentials: true
                })
                this.$q.notify({
                    type: 'positive',
                    position: 'top',
                    message: `Team succesfully deleted.`
                })
                this.$emit('delete-team', this.id);
                } catch (err) {
                console.log(err);
                    this.$q.notify({
                        type: 'negative',
                        position: 'top',
                        message: `Something went wrong. Please try again. If this bug persists please report it in the share feedback page.`
                    })
                }
         }
     }
}
</script>

<style>

</style>