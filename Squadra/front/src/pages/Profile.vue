<template>
  <q-page class="column width" v-if="loaded">

      <div class="row justify-center q-mt-lg">
      
        <q-card bordered class="my-card ">
          <q-card-section class="center">
            <div class="row justify-center">
              <q-avatar size="100px" font-size="80px" color="white" text-color="black" icon="account_circle" />
            </div>
            <div class="row justify-center">
              <div class="text-h6">{{user.name}}</div>
            </div>
          </q-card-section>

          <q-separator inset color="primary" />

          <q-card-section class="width text-body1 q-my-lg">

          <div class="row justify-between q-mt-lg">
            <label>Email:</label>
            <p>{{ user.email }}</p>
          </div>

          <div class="row justify-between">
            <label >Age:</label>
            <p >{{ user.age }}</p>
          </div>
          
          <div class="row justify-between">
            <label>Phone:</label>
            <p >{{ user.phone }}</p>
          </div>

          <div class="row justify-between">
            <label>Facebook:</label>
            <p >{{ user.facebook }}</p>
          </div>

          <div class="row justify-between">
            <label>Games created:</label>
            <p>{{ user.createdGames }}</p>
          </div>

          <div class="row justify-between">
            <label>Games signed up:</label>
            <p>{{ user.participatedGames }}</p>
          </div>

          </q-card-section>
        </q-card>
        
      </div>

      <div>
        <q-btn round color="dark" icon="edit" class="fixed-bottom-right q-mr-xl important" size="20px" @click="edit = true"/>
      </div>

      <q-dialog v-model="edit" persistent>
        <q-card style="min-width: 400px">
          <q-card-section class="column items-center">
            <span class="q-ml-sm text-h4 q-mt-md">Update user details</span>
          </q-card-section>

           <q-separator inset color="primary" />

           <q-card-section class="column items-center">
            <q-input label-color="primary" v-model="updateAge" label="Age" :dense="dense" class="updateWidth" 
            hint="Age should be between 14 and 100"/>
            <q-input label-color="primary" v-model="updatePhone" label="Phone" :dense="dense" class="updateWidth" 
             hint="Phone number must start with '07' and have exactly 10 digits "/>
            <q-input label-color="primary" v-model="updateFacebook" label="Facebook" :dense="dense" class="updateWidth" 
             hint="Facebook link must include 'facebook.com/'"/>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Confirm" color="primary" v-close-popup="popupValue" @click="handleYes()" />
            <q-btn flat label="Reset data" color="primary" v-close-popup="popupValue" @click="resetData()"/>
            <q-btn flat label="Cancel" color="primary" v-close-popup/>
          </q-card-actions>
        </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
import axios from "axios";

export default {

    async created(){
       await axios
      .get("http://localhost:8081/api/user/", {withCredentials: true})
      .then(res => {
        this.loaded = true;
        this.user.no = res.data.user.id;
        this.user.name = res.data.user.name;
        this.user.email = res.data.user.email;

        this.realAge = res.data.user.age;
        if(res.data.user.age != null){
          this.user.age = res.data.user.age;
          this.updateAge = this.user.age;
        }

        this.user.createdGames = res.data.user.createdGames;
        this.user.participatedGames = res.data.user.participatedGames;
        this.user.checkedInGames = res.data.user.checkedInGames;
        this.user.isAdmin = res.data.user.isAdmin;

        this.realPhone = res.data.user.phone;
        if(res.data.user.phone != null){
          this.user.phone = res.data.user.phone;
          this.updatePhone = this.user.phone;
        }

        this.realFB= res.data.user.facebook;
        if(res.data.user.facebook != null){
          this.user.facebook = res.data.user.facebook;
          this.updateFacebook = this.user.facebook;
        }

        
      })
      .catch(err =>{
        console.log(err);
      });

      if(this.user.no == null){
        this.$router.push({name: 'Start'});
      }

      await axios
      .get("http://localhost:8081/api/no/", {withCredentials: true})
      .then(res => {
        this.createdNo = res.data.number;
        this.user.createdGames = this.createdNo;
      })
      .catch(err =>{
        console.log(err);
      });
      
      await axios
      .get("http://localhost:8081/api/part/", {withCredentials: true})
      .then(res => {
        this.partNo = res.data.number - this.createdNo;
        this.user.participatedGames = this.partNo;
      })
      .catch(err =>{
        console.log(err);
      });

      try {
        await axios(`http://localhost:8081/api/user/${this.user.no}`,{
          method: 'put',
          data: {
            name: this.user.name,
            email: this.user.email,
            age:  this.realAge,
            createdGames:  this.createdNo,
            participatedGames: this.partNo,
            checkedInGames: this.user.checkedInGames,
            phone:  this.realPhone,
            facebook:  this.realFB,
            isAdmin: this.user.isAdmin,
          },
          withCredentials: true
        })
      } catch(err){
        console.log(err);
      }


    },

    data (){
      return {
        loaded: false,
        user: {
          no: null,
          name: "",
          email: "",
          age: "N/A",
          createdGames: 0,
          participatedGames: 0,
          checkedInGames: 0,
          phone: "N/A",
          facebook: "N/A",
          isAdmin: null,
        },
        partNo: 0,
        createdNo: 0,
        realAge: null,
        realPhone: null,
        realFB: null,
        text: '',
        dense: false,
        edit: false,
        updateAge: "",
        updatePhone: "",
        updateFacebook: "",
        popupValue: 1,
        placeholder: "N/A",
      }
    },
    methods: {
      async handleYes(){
        if((parseInt(this.updateAge) > 13 && parseInt(this.updateAge) < 100)) {
            if((String(this.updatePhone).startsWith("07") && String(this.updatePhone).length == 10 )){
                if((String(this.updateFacebook).includes("facebook.com/") && String(this.updateFacebook).length < 60 
                && String(this.updateFacebook).length > 25)) {
                  try{
                    this.popupValue = 1;
                    await axios(`http://localhost:8081/api/user/${this.user.no}`,{
                    method: 'put',
                    data: {
                        name: this.user.name,
                        email: this.user.email,
                        age:  this.updateAge,
                        createdGames:  this.user.createdGames,
                        participatedGames:  this.user.participatedGames,
                        checkedInGames: this.user.checkedInGames,
                        phone:  this.updatePhone,
                        facebook:  this.updateFacebook,
                        isAdmin: this.user.isAdmin,
                    },
                    withCredentials: true
                  }).then(res => {
                      this.user.age = this.updateAge;
                      this.user.phone = this.updatePhone;
                      this.user.facebook = this.updateFacebook;
                      this.$q.notify({
                        type: 'positive',
                        position: 'top',
                        message: `Updated user data with success.`
                      });
                    })
                  } catch(err){
                    console.log(err);
                    this.handleException();
                  }
                  
                } else{
                  this.$q.notify({
                    type: 'negative',
                    position: 'top',
                    message: `Wrong input for facebook profile.`
                  });
                  this.popupValue = 0;
                }
            } else{
                  this.$q.notify({
                    type: 'negative',
                    position: 'top',
                    message: `Wrong input for phone number.`
                  });
                  this.popupValue = 0;
                }
        } else{
                  this.$q.notify({
                    type: 'negative',
                    position: 'top',
                    message: `Wrong input for age.`
                  });
                  this.popupValue = 0;
                }
        
        // if(this.updateAge == "")

      },

      handleNo() {
        this.$q.notify({
        type: 'warning',
        position: 'top',
        message: `The update was canceled. Nothing has changed.`
      })
      },

      handleException(){
        this.$q.notify({
        type: 'negative',
        position: 'top',
        message: `Something went wrong. Please try again. If this bug persists please report it.`
      })
      },

      async resetData(){
        if(String(this.user.age).includes("N/A") || String(this.user.phone).includes("N/A") || String(this.user.facebook).includes("N/A") ){
          this.$q.notify({
            type: 'negative',
            position: 'top',
            message: `Cannot reset user data. No data available.`
          });
          this.popupValue = 0;
        } else{
          try{
          await axios(`http://localhost:8081/api/user/${this.user.no}`,{
            method: 'put',
            data: {
              name: this.user.name,
              email: this.user.email,
              age: null,
              createdGames:  this.user.createdGames,
              participatedGames:  this.user.participatedGames,
              phone: null,
              facebook: null,
              isAdmin: this.user.isAdmin,
            },
            withCredentials: true
            }).then(res => {
              this.user.age = this.placeholder;
              this.user.phone = this.placeholder;
              this.user.facebook = this.placeholder;
              this.updateAge= "";
              this.updatePhone = "";
              this.updateFacebook="";
              this.$q.notify({
                type: 'positive',
                position: 'top',
                message: `User data reset succeded.`
              });
              this.popupValue = 1;
            })
          } catch(err){
            console.log(err);
            this.handleException();
          }
        }

      }

    }
}
</script>

<style>

.auto{
  width: auto;
}

.width{
  width: 80%;
  margin-left: auto;
  margin-right: auto;
}

.center{
  margin-left: auto;
  margin-right: auto;
}

.widthContent{
  width: 50%;
  margin-left: auto;
  margin-right: auto;
}

.my-card{
  width: 100%;
  max-width: 650px;
}

.important{
  z-index: 5;
  margin-bottom: 4rem;
}

.updateWidth{
  width: 350px;
}

</style>