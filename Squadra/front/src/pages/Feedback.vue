<template>
    <q-page class="column width" v-if="loaded">

        <div class="q-pa-md q-gutter-sm q-mt-lg">
            
            <q-card class="cardMsg">
                <q-card-section class="column items-center">
                
                    <p class="text-h4 q-mt-md q-mb-xl">Send us a message</p>

                    <q-input label-color="primary" v-model="msg.title" label="Title" class="input q-mt-lg q-mb-lg" color="primary"
                    :input-style="{ fontSize: '1.5rem' }"/>

                    <q-select v-model="msg.type" :options="options" label="Type of message" class="input q-mb-lg" label-color="primary" color="primary"/>

                </q-card-section>
                  <q-separator />
                <q-card-section class="column items-center">

                <q-editor
                    placeholder="Type here..."
                    v-model="msg.content"
                    min-height="15rem" 
                    class="editor q-mt-lg q-mb-lg"
                    :dense="$q.screen.lt.md"
                    :toolbar="[
                        [
                        {
                            label: $q.lang.editor.align,
                            icon: $q.iconSet.editor.align,
                            fixedLabel: true,
                            options: ['left', 'center', 'right', 'justify']
                        }
                        ],
                        ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
                        ['token', 'hr', 'link'],
                        [
                        {
                            label: $q.lang.editor.formatting,
                            icon: $q.iconSet.editor.formatting,
                            list: 'no-icons',
                            options: [
                            'p',
                            'h1',
                            'h2',
                            'h3',
                            'h4',
                            'h5',
                            'h6',
                            'code'
                            ]
                        },
                        {
                            label: $q.lang.editor.fontSize,
                            icon: $q.iconSet.editor.fontSize,
                            fixedLabel: true,
                            fixedIcon: true,
                            list: 'no-icons',
                            options: [
                            'size-1',
                            'size-2',
                            'size-3',
                            'size-4',
                            'size-5',
                            'size-6',
                            'size-7'
                            ]
                        },
                        {
                            label: $q.lang.editor.defaultFont,
                            icon: $q.iconSet.editor.font,
                            fixedIcon: true,
                            list: 'no-icons',
                            options: [
                            'default_font',
                            'arial',
                            'arial_black',
                            'comic_sans',
                            'courier_new',
                            'impact',
                            'lucida_grande',
                            'times_new_roman',
                            'verdana'
                            ]
                        },
                        'removeFormat'
                        ],
                        ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

                        ['undo', 'redo'],
                    ]"
                    :fonts="{
                        arial: 'Arial',
                        arial_black: 'Arial Black',
                        comic_sans: 'Comic Sans MS',
                        courier_new: 'Courier New',
                        impact: 'Impact',
                        lucida_grande: 'Lucida Grande',
                        times_new_roman: 'Times New Roman',
                        verdana: 'Verdana'
                    }"
                    />      

                 <q-btn color="primary" label="Submit" class="q-mt-xl" @click="confirm = true"/>
                </q-card-section>
            </q-card>

            <q-dialog v-model="confirm" persistent>
                <q-card>
                    <q-card-section class="row items-center">
                    <q-avatar icon="email" color="primary" text-color="white" />
                    <span class="q-ml-sm">Are you sure you want to submit this message?</span>
                    </q-card-section>

                    <q-card-actions align="right">
                    <q-btn flat label="Submit" color="primary" v-close-popup @click="submitMsg()"/>
                    <q-btn flat label="Cancel" color="primary" v-close-popup />
                    </q-card-actions>
                </q-card>
            </q-dialog>

        </div>

    </q-page>
</template>

<script>
import axios from "axios";

export default {

    async created(){
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
      
    },

    data () {
        return {
            loaded: false,
            currentUser: null,
            confirm: false,
            msg: {
                title: '',
                type: null,
                content: '',
                date: null,
                isSolved: false,
            },
            options: [
                'Bug', 'Feedback', 'Other',
            ],
        }
    },

    methods: {
        
        async submitMsg(){

            var date = new Date();
            var month;
            if(date.getMonth() < 10){
                month = "0" + date.getMonth();
            } else {
                month =  date.getMonth();
            }
            var msgDate = date.getDate() + "/" + month + "/" + date.getFullYear();
            this.msg.date = msgDate;

            var valid = true;
            if(this.msg.title.length < 3 && valid === true){
                valid = false;
                this.$q.notify({
                type: 'negative',
                position: 'top',
                message: `Title too short. Title should be between 3 and 60 characters long.`
                })
            }

            if(this.msg.title.length > 60 && valid === true){
                valid = false;
                this.$q.notify({
                type: 'negative',
                position: 'top',
                message: `Title too long. Title should be between 3 and 60 characters long.`
                })
            }

            if(this.msg.type == null && valid === true){
                valid = false;
                this.$q.notify({
                type: 'negative',
                position: 'top',
                message: `Select the type of message.`
                })
            }

            if(this.msg.content.length < 10 && valid === true){
                valid = false;
                this.$q.notify({
                type: 'negative',
                position: 'top',
                message: `Content too short. Content should be at least 10 characters long.`
                })
            }

            if(this.msg.content.length > 250 && valid === true){
                valid = false;
                this.$q.notify({
                type: 'negative',
                position: 'top',
                message: `Content too long.`
                })
            }

            if(valid === true){
                await axios("http://localhost:8081/api/msg/", {
                    method: 'post',
                    data: {
                        title: this.msg.title,
                        type: this.msg.type,
                        content: this.msg.content,
                        date: msgDate,
                        ownerId: this.currentUser,
                        isSolved: this.msg.isSolved,
                        },
                    withCredentials: true
                }).then(res => {
                    this.$q.notify({
                    type: 'positive',
                    position: 'top',
                    message: `Message submitted succesfully.`
                    })
                    this.$router.push({name: 'Home'});
                }).catch(err => {
                    this.$q.notify({
                    type: 'negative',
                    position: 'top',
                    message: `Something went wrong. Please try again.`
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

.cardMsg{
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    color: black;
}

.input{
    width: 25rem;
    height: 5rem;
}

.editor{
    width: 80%;
    margin-left: auto;
    margin-right: auto;
}

</style>