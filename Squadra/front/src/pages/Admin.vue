<template>
  <q-page class="fit column content-center width q-my-lg" v-if="isAdmin">
      <q-card bordered>
          <q-card-section>
              <p class="text-h4 q-mt-md q-mb-md text-weight-medium q-mx-xl">Admin page</p>
          </q-card-section>

          <q-separator />

          <q-card-section>
             
            <template>
                <div class="q-pa-md">
                    <q-table
                    title="Users table"
                    :data="userData"
                    :columns="userColumns"
                    color="primary"
                    row-key="id"
                    :filter="userFilter"
                    no-data-label="No users available"
                    >

                    <template v-slot:body-cell-actions="props">
                        <q-td :props="props">
                            <q-checkbox disable v-model="props.row.admin" />
                            <q-btn dense round flat color="primary" icon="delete"  @click="openUserDialog(props.row)"></q-btn>
                        </q-td>          
                    </template>

                    <template v-slot:top-right>
                        <q-btn
                        color="primary"
                        icon-right="archive"
                        label="Export to csv"
                        no-caps
                        @click="usersTableToCSV"
                        />
                        <q-input class="q-ml-xl" borderless v-model="userFilter" placeholder="Search">
                            <template v-slot:append>
                                <q-icon name="search" />
                            </template>
                        </q-input>
                    </template>
                    </q-table>
                </div>
            </template>

          </q-card-section>

            <q-dialog v-model="userDialog" persistent>
                <q-card class=" q-pl-md q-pr-md">
                <q-card-section class="row items-center">
                    <q-avatar icon="priority_high" color="primary" text-color="white" />
                    <span class="q-ml-sm text-subtitle1 text-weight-medium">Are you sure you want to delete this user?</span>
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat label="Yes" color="primary" v-close-popup @click="deleteUser()"/>
                    <q-btn flat label="No" color="primary" v-close-popup />
                </q-card-actions>
                </q-card>
            </q-dialog>

          <q-card-section>
             
            <template>
                <div class="q-pa-md">
                    <q-table
                    title="Matches table"
                    :data="matchData"
                    :columns="matchColumns"
                    color="primary"
                    row-key="id"
                    :filter="matchFilter"
                    no-data-label="No matches available"
                    >

                    <template v-slot:body-cell-actions="props">
                        <q-td :props="props">
                            <q-btn dense round flat color="primary" icon="delete" @click="openMatchDialog(props.row)"></q-btn>
                        </q-td>          
                    </template>

                    <template v-slot:top-right>
                        <q-btn
                        color="primary"
                        icon-right="archive"
                        label="Export to csv"
                        no-caps
                        @click="matchesTableToCSV"
                        />
                        <q-input class="q-ml-xl" borderless v-model="matchFilter" placeholder="Search">
                            <template v-slot:append>
                                <q-icon name="search" />
                            </template>
                        </q-input>
                    </template>
                    </q-table>
                </div>
            </template>

          </q-card-section>

          <q-dialog v-model="matchDialog" persistent>
                <q-card class=" q-pl-md q-pr-md">
                <q-card-section class="row items-center">
                    <q-avatar icon="priority_high" color="primary" text-color="white" />
                    <span class="q-ml-sm text-subtitle1 text-weight-medium">Are you sure you want to delete this match?</span>
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat label="Yes" color="primary" v-close-popup @click="deleteMatch()"/>
                    <q-btn flat label="No" color="primary" v-close-popup />
                </q-card-actions>
                </q-card>
            </q-dialog>

          <q-card-section>
             
            <template>
                <div class="q-pa-md">
                    <q-table
                    title="Messages table"
                    :data="msgData"
                    :columns="msgColumns"
                    color="primary"
                    row-key="id"
                    :filter="msgFilter"
                    no-data-label="No matches available"
                    >

                    <template v-slot:body-cell-actions="props">
                        <q-td :props="props">
                            <q-btn dense round flat color="primary" icon="done" @click="openMsgUpdateDialog(props.row)"></q-btn>
                            <q-btn dense round flat color="primary" icon="delete" @click="openMsgDialog(props.row)"></q-btn>
                        </q-td>          
                    </template>

                    <template v-slot:top-right>
                        <q-btn
                        color="primary"
                        icon-right="archive"
                        label="Export to csv"
                        no-caps
                        @click="msgTableToCSV"
                        />
                        <q-input class="q-ml-xl" borderless v-model="msgFilter" placeholder="Search">
                            <template v-slot:append>
                                <q-icon name="search" />
                            </template>
                        </q-input>
                    </template>
                    </q-table>
                </div>
            </template>

          </q-card-section>

            <q-dialog v-model="msgDialog" persistent>
                <q-card class=" q-pl-md q-pr-md">
                <q-card-section class="row items-center">
                    <q-avatar icon="priority_high" color="primary" text-color="white" />
                    <span class="q-ml-sm text-subtitle1 text-weight-medium">Are you sure you want to delete this message?</span>
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat label="Yes" color="primary" v-close-popup @click="deleteMsg()"/>
                    <q-btn flat label="No" color="primary" v-close-popup />
                </q-card-actions>
                </q-card>
            </q-dialog>

            <q-dialog v-model="msgUpdateDialog" persistent>
                <q-card class=" q-pl-md q-pr-md" v-if="msgRowStatus">
                    <q-card-section class="row items-center">
                        <q-avatar icon="priority_high" color="primary" text-color="white" />
                        <span class="q-ml-sm text-subtitle1 text-weight-medium">Change message status to <b>solved</b>?</span>
                    </q-card-section>

                    <q-card-actions align="right">
                        <q-btn flat label="Yes" color="primary" v-close-popup @click="updateMsg()"/>
                        <q-btn flat label="No" color="primary" v-close-popup/>
                    </q-card-actions>
                </q-card>

                <q-card class=" q-pl-md q-pr-md" v-else>
                    <q-card-section class="row items-center">
                        <q-avatar icon="priority_high" color="primary" text-color="white" />
                        <span class="q-ml-sm text-subtitle1 text-weight-medium">Change message status to <b>unsolved</b>?</span>
                    </q-card-section>

                    <q-card-actions align="right">
                        <q-btn flat label="Yes" color="primary" v-close-popup @click="updateMsg()"/>
                        <q-btn flat label="No" color="primary" v-close-popup />
                    </q-card-actions>
                </q-card>
            </q-dialog>

      </q-card>
  </q-page>
</template>

<script>
import axios from "axios";
import { exportFile } from 'quasar'

    function wrapCsvValue (val, formatFn) {
    let formatted = formatFn !== void 0
        ? formatFn(val)
        : val

    formatted = formatted === void 0 || formatted === null
        ? ''
        : String(formatted)

    formatted = formatted.split('"').join('""')
    return `"${formatted}"`
    }

export default {

    async created() {
        await axios
        .get("http://localhost:8081/api/user/", {withCredentials: true})
        .then(res => {
            this.currentUserId = res.data.user.id;
            this.isAdmin = res.data.user.isAdmin;
        })
        .catch(err =>{
            console.log(err);
        });

        if(this.isAdmin === false ){
             this.$router.push({name: 'Home'});
        }
        if(this.isAdmin == null){
            this.$router.push('/');
        }

        await axios
        .get("http://localhost:8081/api/all/", {withCredentials: true})
        .then(res => {
            res.data.users.forEach(el => {

            this.userData.push({
              id: el.id,
              name: el.name,
              email: el.email,
              age: el.age,
              createdGames: el.createdGames,
              participatedGames: el.participatedGames,
              checkedInGames: el.checkedInGames,
              phone: el.phone,
              facebook: el.facebook,
              admin: el.isAdmin,
            }) 
                
            });
        })
        .catch(err =>{
            console.log(err);
        });

        await axios
        .get("http://localhost:8081/api/match/", {withCredentials: true})
        .then(res => {
            res.data.matches.forEach(el => {

            this.matchData.push({
              id: el.id,
              place: el.place,
              date: el.date,
              noPart: el.noParticipants,
              maxPart: el.maxParticipants,
              ownerId: el.ownerId,
            }) 
                
            });
        })
        .catch(err =>{
            console.log(err);
        });

        await axios
        .get("http://localhost:8081/api/msg/", {withCredentials: true})
        .then(res => {
            res.data.messages.forEach(el => {

            this.msgData.push({
              id: el.id,
              title: el.title,
              type: el.type,
              content: el.content,
              date: el.date,
              ownerId: el.ownerId,
              solved: el.isSolved,
            }) 
                
            });
        })
        .catch(err =>{
            console.log(err);
        });


    },

    data () {
        return {
            currentUserId: null,
            isAdmin: null,
            userDialog: false,
            userRowId: null,
            userFilter: '',
            userColumns: [
            { name: 'id', align: 'left', label: 'Id', field: row => row.id, required: true, sortable: true },
            { name: 'name', align: 'left', label: 'Name', field: 'name' },
            { name: 'email', align: 'left', label: 'Email', field: 'email' },
            { name: 'age', align: 'left', label: 'Age', field: 'age' },
            { name: 'createdGames', align: 'left', label: 'Created Games', field: 'createdGames' },
            { name: 'participatedGames', align: 'left', label: 'Participated games', field: 'participatedGames' },
            { name: 'checkedInGames', align: 'left', label: 'Checked in games', field: 'checkedInGames' },
            { name: 'phone', align: 'left', label: 'Phone', field: 'phone' },
            { name: 'facebook', align: 'left', label: 'Facebook', field: 'facebook' },
            { name: 'actions', align: 'left',label: 'Actions', field: '', align: 'center'}
            ],
            userData: [],

            matchFilter: '',
            matchDialog: false,
            matchRowId: null,
            matchColumns: [
            { name: 'id', align: 'left', label: 'Id', field: row => row.id, required: true, sortable: true },
            { name: 'place', align: 'left', label: 'Place', field: 'place' },
            { name: 'date', align: 'left', label: 'Date', field: 'date' },
            { name: 'noPart', align: 'left', label: 'No participants', field: 'noPart' },
            { name: 'maxPart', align: 'left', label: 'Max participants', field: 'maxPart' },
            { name: 'ownerId', align: 'left', label: 'Owner Id', field: 'ownerId' },
            { name: 'actions', align: 'left',label: 'Actions', field: '', align: 'center'}
            ],
            matchData: [],

            msgFilter: '',
            msgDialog: false,
            msgRowId: null,
            msgUpdateDialog: false,
            msgRowStatus: null,
            msgCurrentRow: null,
            msgColumns: [
            { name: 'id', align: 'left', label: 'Id', field: row => row.id, required: true, sortable: true },
            { name: 'title', align: 'left', label: 'Title', field: 'title' },
            { name: 'type', align: 'left', label: 'Type', field: 'type' },
            { name: 'content', align: 'left', label: 'Content', field: 'content' },
            { name: 'date', align: 'left', label: 'Date', field: 'date' },
            { name: 'ownerId', align: 'left', label: 'Owner Id', field: 'ownerId' },
            { name: 'solved', align: 'left', label: 'Message solved?', field: 'solved' },
            { name: 'actions', align: 'left',label: 'Actions', field: '', align: 'center'}
            ],
            msgData: [],

        }
        
    },

    methods: {
        usersTableToCSV () {
            const content = [ this.userColumns.map(col => wrapCsvValue(col.label)) ].concat(
                this.userData.map(row => this.userColumns.map(col => wrapCsvValue(
                typeof col.field === 'function'
                    ? col.field(row)
                    : row[col.field === void 0 ? col.name : col.field],
                col.format
                )).join(','))
            ).join('\r\n')

            const status = exportFile(
                'user-table-export.csv',
                content,
                'text/csv'
            )

            if (status !== true) {
                this.$q.notify({
                message: 'Browser denied file download...',
                color: 'negative',
                icon: 'warning'
                })
            }
        },

        matchesTableToCSV () {
            const content = [ this.matchColumns.map(col => wrapCsvValue(col.label)) ].concat(
                this.matchData.map(row => this.matchColumns.map(col => wrapCsvValue(
                typeof col.field === 'function'
                    ? col.field(row)
                    : row[col.field === void 0 ? col.name : col.field],
                col.format
                )).join(','))
            ).join('\r\n')

            const status = exportFile(
                'match-table-export.csv',
                content,
                'text/csv'
            )

            if (status !== true) {
                this.$q.notify({
                message: 'Browser denied file download...',
                color: 'negative',
                icon: 'warning'
                })
            }
        },

        msgTableToCSV () {
            const content = [ this.msgColumns.map(col => wrapCsvValue(col.label)) ].concat(
                this.msgData.map(row => this.msgColumns.map(col => wrapCsvValue(
                typeof col.field === 'function'
                    ? col.field(row)
                    : row[col.field === void 0 ? col.name : col.field],
                col.format
                )).join(','))
            ).join('\r\n')

            const status = exportFile(
                'msg-table-export.csv',
                content,
                'text/csv'
            )

            if (status !== true) {
                this.$q.notify({
                message: 'Browser denied file download...',
                color: 'negative',
                icon: 'warning'
                })
            }
        },

        openUserDialog(row){
            this.userDialog = true;
            this.userRowId = row.id;
        },

        async deleteUser(){
            try{
            await axios(`http://localhost:8081/api/user/${this.userRowId}`, {
                method: 'delete',
                withCredentials: true
            })
            this.userData = this.userData.filter(ud => ud.id !=this.userRowId);
            this.$q.notify({
                type: 'positive',
                position: 'top',
                message: `Deleted user with success.`
            })    
            } catch (err) {
            console.log(err);
            this.$q.notify({
                type: 'negative',
                position: 'top',
                message: `Something went wrong. Try again.`
            })
            }
        },

        openMatchDialog(row){
            this.matchDialog = true;
            this.matchRowId = row.id;
        },

        async deleteMatch(){
            try{
            await axios(`http://localhost:8081/api/match/${this.matchRowId}`, {
                method: 'delete',
                withCredentials: true
            })
            this.matchData = this.matchData.filter(md => md.id !=this.matchRowId);
            this.$q.notify({
                type: 'positive',
                position: 'top',
                message: `Deleted match with success.`
            })    
            } catch (err) {
            console.log(err);
            this.$q.notify({
                type: 'negative',
                position: 'top',
                message: `Something went wrong. Try again.`
            })
            }
        },

        openMsgDialog(row){
            this.msgDialog = true;
            this.msgRowId = row.id;
        },

        async deleteMsg(){
            try{
            await axios(`http://localhost:8081/api/msg/${this.msgRowId}`, {
                method: 'delete',
                withCredentials: true
            })
            this.msgData = this.msgData.filter(msg => msg.id !=this.msgRowId);
            this.$q.notify({
                type: 'positive',
                position: 'top',
                message: `Deleted message with success.`
            })    
            } catch (err) {
            console.log(err);
            this.$q.notify({
                type: 'negative',
                position: 'top',
                message: `Something went wrong. Try again.`
            })
            }
        },

        openMsgUpdateDialog(row){
            this.msgUpdateDialog = true;
            this.msgRowId = row.id;
            this.msgRowStatus = row.solved;
            this.msgRowStatus = !this.msgRowStatus;
            this.msgCurrentRow = {
                title: row.title,
                type: row.type,
                content: row.content,
                date: row.date,
                ownerId: row.ownerId
            }
        },

        updateMsg(){
            axios(`http://localhost:8081/api/msg/${this.msgRowId}`, {
                method: 'put',
                data: {
                    title: this.msgCurrentRow.title,
                    type: this.msgCurrentRow.type,
                    content: this.msgCurrentRow.content,
                    date: this.msgCurrentRow.date,
                    isSolved: this.msgRowStatus,
                    ownerId: this.msgCurrentRow.ownerId,
                },
                withCredentials: true
            }).then(res => {
                this.$q.notify({
                type: 'positive',
                position: 'top',
                message: `Message updated with succes.`
                })
                this.msgData.find(m => m.id == this.msgRowId).solved =  this.msgRowStatus;
            })
            .catch(err => {
                this.$q.notify({
                type: 'negative',
                position: 'top',
                message: `Something went wrong. Try again.`
                })
            })
        }

    },

}
</script>

<style>

.width{
  width: 80%;
  margin-left: auto;
  margin-right: auto;
}

</style>