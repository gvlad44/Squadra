<template>
    <q-page class="column width q-mt-lg q-mb-lg" v-if="loaded">
        <q-card>

            <q-card-section>
                <p class="text-h4 text-weight-medium q-mx-xl q-mt-lg q-mb-lg"> {{  this.tournament.name }} </p>
            </q-card-section>

            <q-separator/>

            <q-card-section v-if="winnerTeam.isFinished">
                <p class="text-h5 text-weight-medium q-mx-xl"> Tournament Winner </p>
                <div class="fit row justify-between">
                    <div class="column items-center">
                        <p class="text-h6 text-weight-regular q-mx-xl ">Team name: {{ this.winnerTeam.teamName }}</p>
                        <p class="text-h6 text-weight-regular q-mx-xl ">Team captain: {{ this.winnerTeam.teamCaptain }}</p>
                    </div>
                </div>
            </q-card-section>

            <q-separator/>

            <q-card-section>
                <p class="text-h5 text-weight-medium q-mx-xl"> Details </p>
                <div class="fit row justify-between">
                    <div class="column items-center">
                        <p class="text-h6 text-weight-regular q-mx-xl ">Location: {{ this.tournament.place }}</p>
                        <p class="text-h6 text-weight-regular q-mx-xl ">Date & time: {{ this.tournament.date }}</p>
                    </div>
                    <div class="column items-center">
                        <p class="text-h6 text-weight-regular q-mx-xl ">Organizer name: {{ this.owner.name }}</p>
                        <p class="text-h6 text-weight-regular q-mx-xl ">Organizer email: {{ this.owner.email  }}</p>
                    </div>
                </div>
            </q-card-section>

             <q-separator/>

            <q-card-section>
                <p class="text-h5 text-weight-medium q-mx-xl"> Matches </p>
                <div class="column">
                    <div class="column">
                        <p class="text-h6 text-weight-medium q-mx-xl"> First round</p>
                        <div class="fit row justify-around">
                            <TournamentMatch 
                            v-for="match in firstRoundArray"
                            :key="match.no"
                            :no="match.no"
                            :team1="match.team1"
                            :team1Name="match.team1Name"
                            :team1Captain="match.team1Captain"
                            :team1Seed="match.team1Seed"
                            :team1Score="match.team1Score"
                            :team2="match.team2"
                            :team2Name="match.team2Name"
                            :team2Captain="match.team2Captain"
                            :team2Seed="match.team2Seed"
                            :team2Score="match.team2Score"
                            :tournamentId="match.tournamentId"
                            :isAdmin="isAdmin"
                            :isNotFinished="match.isNotFinished"
                            :round="match.round"
                            @first-round-match="firstRoundUpdate"/>
                        </div>
                    </div>
                    <div class="fit row">
                        <p class="text-h6 text-weight-medium q-mx-xl"> Second round</p>
                        <div class="fit row justify-around">
                            <TournamentMatch 
                            v-for="match in secondRoundArray"
                            :key="match.no"
                            :no="match.no"
                            :team1="match.team1"
                            :team1Name="match.team1Name"
                            :team1Captain="match.team1Captain"
                            :team1Seed="match.team1Seed"
                            :team1Score="match.team1Score"
                            :team2="match.team2"
                            :team2Name="match.team2Name"
                            :team2Captain="match.team2Captain"
                            :team2Seed="match.team2Seed"
                            :team2Score="match.team2Score"
                            :tournamentId="match.tournamentId"
                            :isAdmin="isAdmin"
                            :isNotFinished="match.isNotFinished"
                            :round="match.round"
                            @second-round-match="secondRoundUpdate"/>
                        </div>
                    </div>
                    <div class="fit row">
                        <p class="text-h6 text-weight-medium q-mx-xl"> Finals</p>
                        <div class="fit row justify-around">
                             <TournamentMatch 
                            v-for="match in finalsArray"
                            :key="match.no"
                            :no="match.no"
                            :team1="match.team1"
                            :team1Name="match.team1Name"
                            :team1Captain="match.team1Captain"
                            :team1Seed="match.team1Seed"
                            :team1Score="match.team1Score"
                            :team2="match.team2"
                            :team2Name="match.team2Name"
                            :team2Captain="match.team2Captain"
                            :team2Seed="match.team2Seed"
                            :team2Score="match.team2Score"
                            :tournamentId="match.tournamentId"
                            :isAdmin="isAdmin"
                            :isNotFinished="match.isNotFinished"
                            :round="match.round"
                            @final-round-match="finalRoundUpdate"/>
                        </div>
                    </div>
                </div>
            </q-card-section>

            <q-separator/>

            <q-card-section v-if="winnerTeam.isFinished">
                <p class="text-h5 text-weight-medium q-mx-xl"> Statistics </p>
                <div class="row justify-around">
                    <div class="column items-center">
                        <p class="text-h6 text-weight-regular q-mx-xl ">First team win percentage: {{ this.percentage1 }}%</p>
                        <p class="text-h6 text-weight-regular q-mx-xl ">Second team win percentage: {{ this.percentage2 }}%</p>
                    </div>
                    <div class="column items-center">
                        <p class="text-h6 text-weight-regular q-mx-xl ">Biggest win: {{ this.differenceBig }} point(s)</p>
                        <p class="text-h6 text-weight-regular q-mx-xl ">Closest match: {{ this.differenceSmall }} point(s)</p>
                    </div>
                     <div class="q-pa-md column items-center">
                        <q-table
                        title="Final standings"
                        :data="data"
                        :columns="columns"
                        row-key="data.id"
                        />
                    </div>
                </div>
            </q-card-section>


        </q-card>
    </q-page>
</template>

<script>
import axios from "axios";
import TournamentMatch from "../components/TournamentMatch";

export default {

    async created(){
        await axios
        .get("http://localhost:8081/api/user/", {withCredentials: true})
        .then(res => {
            this.currentUser = res.data.user.id;
            this.isAdmin = res.data.user.isAdmin;
            this.loaded = true;
        })
        .catch(err =>{
            console.log(err);
        });

        if(this.currentUser == null){
        this.$router.push({name: 'Start'});
      }

      try {
          const res = await axios.get(`http://localhost:8081/api/tournament/${this.tournamentId}`, {withCredentials: true})
      this.tournament.name = res.data.tournament.name;
      this.tournament.noTeams = res.data.tournament.noTeamsParticipating;
      this.tournament.maxTeams = res.data.tournament.maxNoTeams;
      this.tournament.place = res.data.tournament.place;
      this.tournament.date = res.data.tournament.date;
      this.tournament.ownerId = res.data.tournament.ownerId;

      const userRes = await axios.get(`http://localhost:8081/api/user/${this.tournament.ownerId}`, {withCredentials: true})
      this.owner.name = userRes.data.user.name;
      this.owner.email = userRes.data.user.email;
      } catch(err){
          console.log(err);
      }

      try {

        const teamRes = await axios.get(`http://localhost:8081/api/tourteams/${this.tournamentId}`, {withCredentials: true})
      this.noTeamsDB = teamRes.data.tournamentTeams.length;
      teamRes.data.tournamentTeams.forEach(async el => {
        
        let teamDetails = await axios.get(`http://localhost:8081/api/team/${el.TeamId}`, {withCredentials: true})

        let teamCaptain = await axios.get(`http://localhost:8081/api/user/${teamDetails.data.team.ownerId}`, {withCredentials: true})

        this.iterator++;

        this.teamsArray.push({
            id: teamDetails.data.team.id,
            seed: this.iterator,
            teamName: teamDetails.data.team.name,
            teamCaptain: teamCaptain.data.user.name,
        })

        this.teamsArray.sort(function(a, b){
                return parseInt(a.id) - parseInt(b.id)});
        
        //DUMMY VALUES UNTIL WE HAVE 8 REAL TEAMS
        if(this.iterator >= this.noTeamsDB && this.iterator <=8){
            for(let j=this.iterator+1; j<=8; j++){
                this.iterator = j;
                this.teamsArray.push({
                id: this.iterator,
                seed: this.iterator,
                teamName: this.dummyTeam.teamName,
                teamCaptain: this.dummyTeam.teamCaptain,
                })
            }
        }

        if(this.iterator == 8){
            let tourneyMatches = await axios.get(`http://localhost:8081/api/tourmatch/${this.tournamentId}`, {withCredentials: true})
            for(let i = 0; i<8; i+=2){
                this.firstRoundArray.push({
                    no: tourneyMatches.data.tournament[this.matchesIterator].id,
                    team1: this.teamsArray[i].id,
                    team1Name: this.teamsArray[i].teamName,
                    team1Captain: this.teamsArray[i].teamCaptain,
                    team1Seed: this.teamsArray[i].seed,
                    team1Score: tourneyMatches.data.tournament[this.matchesIterator].scoreTeamOne ,
                    team2: this.teamsArray[i+1].id,
                    team2Name: this.teamsArray[i+1].teamName,
                    team2Captain: this.teamsArray[i+1].teamCaptain,
                    team2Seed: this.teamsArray[i+1].seed,
                    team2Score: tourneyMatches.data.tournament[this.matchesIterator].scoreTeamTwo,
                    tournamentId: this.tournamentId,
                    isNotFinished: true,
                    round: 0,
                })
                this.matchesIterator++;
            }

            for(let j=this.matchesIterator;j<tourneyMatches.data.tournament.length-1;j++){
                this.secondRoundMatches.push({
                    matchId: tourneyMatches.data.tournament[j].id,
                    team1Score: tourneyMatches.data.tournament[j].scoreTeamOne,
                    team2Score: tourneyMatches.data.tournament[j].scoreTeamTwo
                })
                this.matchesIterator++;
            }

            for(let m = 0; m < 4; m++){
                if(tourneyMatches.data.tournament[m].winnerId){
                    let helper = this.teamsArray.find(el => el.id == tourneyMatches.data.tournament[m].winnerId);
                    this.teams2ndArray.push({
                        id: helper.id,
                        seed: helper.seed,
                        teamName: helper.teamName,
                        teamCaptain: helper.teamCaptain,
                    })

                    if(this.teams2ndArray.length == 4){

                        this.teams2ndArray.sort(function(a, b){
                        return parseInt(a.seed) - parseInt(b.seed)});

                        for(let i = 0; i<4; i+=2){
                            if(this.secondRoundArray.length <=2){
                                this.secondRoundArray.push({
                                    no: this.secondRoundMatches[this.secondMatchIterator].matchId,
                                    team1: this.teams2ndArray[i].id,
                                    team1Name: this.teams2ndArray[i].teamName,
                                    team1Captain: this.teams2ndArray[i].teamCaptain,
                                    team1Seed: this.teams2ndArray[i].seed,
                                    team1Score: this.secondRoundMatches[this.secondMatchIterator].team1Score ,
                                    team2: this.teams2ndArray[i+1].id,
                                    team2Name: this.teams2ndArray[i+1].teamName,
                                    team2Captain: this.teams2ndArray[i+1].teamCaptain,
                                    team2Seed: this.teams2ndArray[i+1].seed,
                                    team2Score: this.secondRoundMatches[this.secondMatchIterator].team2Score,
                                    tournamentId: this.tournamentId,
                                    isNotFinished: true,
                                    round: 1,
                                })
                            }
                        this.secondMatchIterator++;
                        }
                    }
                }
            }

            this.finalGame = {
                matchId: tourneyMatches.data.tournament[this.matchesIterator].id,
                team1Score: tourneyMatches.data.tournament[this.matchesIterator].scoreTeamOne,
                team2Score: tourneyMatches.data.tournament[this.matchesIterator].scoreTeamTwo
            };

             for(let m = 4; m < 6; m++){
                 if(tourneyMatches.data.tournament[m].winnerId){
                    let helper = this.teams2ndArray.find(el => el.id == tourneyMatches.data.tournament[m].winnerId);
                    this.teamsFinalArray.push({
                        id: helper.id,
                        seed: helper.seed,
                        teamName: helper.teamName,
                        teamCaptain: helper.teamCaptain,
                    })

                    if(this.teamsFinalArray.length == 2){

                        this.teamsFinalArray.sort(function(a, b){
                        return parseInt(a.seed) - parseInt(b.seed)});

                        for(let i = 0; i<2; i+=2){
                            if(this.finalsArray.length <=1){
                                this.finalsArray.push({
                                    no: this.finalGame.matchId,
                                    team1: this.teamsFinalArray[i].id,
                                    team1Name: this.teamsFinalArray[i].teamName,
                                    team1Captain: this.teamsFinalArray[i].teamCaptain,
                                    team1Seed: this.teamsFinalArray[i].seed,
                                    team1Score: this.finalGame.team1Score ,
                                    team2: this.teamsFinalArray[i+1].id,
                                    team2Name: this.teamsFinalArray[i+1].teamName,
                                    team2Captain: this.teamsFinalArray[i+1].teamCaptain,
                                    team2Seed: this.teamsFinalArray[i+1].seed,
                                    team2Score: this.finalGame.team2Score,
                                    tournamentId: this.tournamentId,
                                    isNotFinished: true,
                                    round: 2,
                                })
                            }

                        }
                    }
                }
             }

            if(tourneyMatches.data.tournament[6].winnerId){
                    let helper = this.teams2ndArray.find(el => el.id == tourneyMatches.data.tournament[6].winnerId);
                    this.winnerTeam.id = helper.id;
                    this.winnerTeam.teamName = helper.teamName;
                    this.winnerTeam.teamCaptain = helper.teamCaptain;
                    this.winnerTeam.isFinished = true;
            }

            tourneyMatches.data.tournament.forEach(el => {
                if(el.winnerId){
                    if(el.scoreTeamOne > el.scoreTeamTwo){
                        this.percentage1++;
                    } else{
                        this.percentage2++;
                    }

                    if(el.scoreTeamOne > el.scoreTeamTwo){
                       if(el.scoreTeamOne - el.scoreTeamTwo > this.differenceBig){
                           this.differenceBig = el.scoreTeamOne - el.scoreTeamTwo;
                       }
                       if(el.scoreTeamOne - el.scoreTeamTwo < this.differenceSmall){
                           this.differenceSmall = el.scoreTeamOne - el.scoreTeamTwo;
                       }
                    } else{
                        if(el.scoreTeamTwo - el.scoreTeamOne > this.differenceBig){
                           this.differenceBig = el.scoreTeamTwo - el.scoreTeamOne;
                       }
                       if(el.scoreTeamTwo - el.scoreTeamOne < this.differenceSmall){
                           this.differenceSmall = el.scoreTeamTwo - el.scoreTeamOne;
                       }
                    }

                }
            });

            if(this.winnerTeam.id){
                this.percentage1 = ((this.percentage1*100)/7).toFixed(2);
                this.percentage2 = ((this.percentage2*100)/7).toFixed(2);
                const res = await axios(`http://localhost:8081/api/stats/${this.tournamentId}/${this.winnerTeam.id}`, {
                        method: 'get',
                        withCredentials: true
                    })
                let sum = 0;
                let pd = 0;
                let match = 0;
                res.data.tournament.forEach(el => {
                    match++
                    if(el.teamOneId == this.winnerTeam.id){
                        sum = sum + el.scoreTeamOne
                        pd = pd + (el.scoreTeamOne - el.scoreTeamTwo)
                    }
                    if(el.teamTwoId == this.winnerTeam.id){
                        sum = sum + el.scoreTeamTwo
                        pd = pd + (el.scoreTeamTwo - el.scoreTeamOne)
                    }
                });
                this.data.push({
                    id: this.winnerTeam.id,
                    name: this.winnerTeam.teamName,
                    place: '1',
                    match: match,
                    total: sum,
                    points: pd,
                })
            }

            if(this.teamsFinalArray.length == 2){
                this.firstRoundArray.forEach(el => {
                    el.isNotFinished = false;
                });

                this.secondRoundArray.forEach(el => {
                    el.isNotFinished = false;
                });

                let team = this.teamsFinalArray.find(el => el.id != this.winnerTeam.id);
                const res = await axios(`http://localhost:8081/api/stats/${this.tournamentId}/${team.id}`, {
                        method: 'get',
                        withCredentials: true
                    })

                let sum = 0;
                let pd = 0;
                let match= 0;
                res.data.tournament.forEach(el => {
                    match++;
                    if(el.teamOneId == team.id){
                        sum = sum + el.scoreTeamOne
                        pd = pd + (el.scoreTeamOne - el.scoreTeamTwo)
                    }
                    if(el.teamTwoId == team.id){
                        sum = sum + el.scoreTeamTwo
                        pd = pd + (el.scoreTeamTwo - el.scoreTeamOne)
                    }
                });
                this.data.push({
                    id: team.id,
                    name: team.teamName,
                    place: '2',
                    match: match,
                    total: sum,
                    points: pd,
                })
                
            }

            if(this.teams2ndArray.length == 4){
                this.firstRoundArray.forEach(el => {
                    el.isNotFinished = false;
                });

                let copy = this.teams2ndArray;
                console.log(copy);
                copy = copy.filter(el => el.id != this.teamsFinalArray[0].id)
                copy = copy.filter(el => el.id != this.teamsFinalArray[1].id)
                copy.forEach(async team => {
                    const res = await axios(`http://localhost:8081/api/stats/${this.tournamentId}/${team.id}`, {
                            method: 'get',
                            withCredentials: true
                        })

                    let sum = 0;
                    let pd = 0;
                    let match = 0;
                    res.data.tournament.forEach(el => {
                        match++
                        if(el.teamOneId == team.id){
                            sum = sum + el.scoreTeamOne
                            pd = pd + (el.scoreTeamOne - el.scoreTeamTwo)
                        }
                        if(el.teamTwoId == team.id){
                            sum = sum + el.scoreTeamTwo
                            pd = pd + (el.scoreTeamTwo - el.scoreTeamOne)
                        }
                    });
                    this.data.push({
                        id: team.id,
                        name: team.teamName,
                        place: '3-4',
                        match: match,
                        total: sum,
                        points: pd,
                    })
                });
            }

            if(this.teamsArray.length == 8 && this.winnerTeam.isFinished == true){
                 let copy = this.teamsArray;
                copy = copy.filter(el => el.id != this.teams2ndArray[0].id)
                copy = copy.filter(el => el.id != this.teams2ndArray[1].id)
                copy = copy.filter(el => el.id != this.teams2ndArray[2].id)
                copy = copy.filter(el => el.id != this.teams2ndArray[3].id)
                copy.forEach(async team => {
                    const res = await axios(`http://localhost:8081/api/stats/${this.tournamentId}/${team.id}`, {
                            method: 'get',
                            withCredentials: true
                        })

                    let sum = 0;
                    let pd = 0;
                    let match = 0;
                    res.data.tournament.forEach(el => {
                        match++;
                        if(el.teamOneId == team.id){
                            sum = sum + el.scoreTeamOne
                            pd = pd + (el.scoreTeamOne - el.scoreTeamTwo)
                        }
                        if(el.teamTwoId == team.id){
                            sum = sum + el.scoreTeamTwo
                            pd = pd + (el.scoreTeamTwo - el.scoreTeamOne)
                        }
                    });
                    this.data.push({
                        id: team.id,
                        name: team.teamName,
                        place: '5-8',
                        match: match,
                        total: sum,
                        points: pd,
                    })

                    if(this.data.length == 8){
                         this.data.sort(function(a, b){
                    return parseInt(b.total) - parseInt(a.total)});
                    }

                });
            }

            if(this.winnerTeam.isFinished){
                this.firstRoundArray.forEach(el => {
                    el.isNotFinished = false;
                });

                this.secondRoundArray.forEach(el => {
                    el.isNotFinished = false;
                });

                this.finalsArray.forEach(el => {
                    el.isNotFinished = false;
                });
            }

            this.matchesIterator++;

        }

      });

      } catch(err){
          console.log(err)
      }

    },

    data () {
        return {
            loaded: false,
            currentUser: null,
            isAdmin: null,
            tournamentId: this.$route.params.id,
            tournament: {
                name: null,
                noTeams: null,
                maxTeams: null,
                place: null,
                date: null,
                ownerId: null,
            },
            owner: {
                name: null,
                email: null,
            },
            dummyTeam: {
                teamName: "Some team name",
                teamCaptain: "Nume Prenume",
            },
            noTeamsDB: 0,
            iterator: 0,
            matchesIterator: 0,
            teamsArray: [],
            firstRoundArray: [],
            teams2ndArray: [],
            secondMatchIterator: 0,
            secondRoundArray: [],
            secondRoundMatches: [],
            teamsFinalArray: [],
            finalsArray: [],
            finalGame: null,
            winnerTeam: {
                id: null,
                teamName: null,
                teamCaptain: null,
                isFinished: false,
            },
            percentage1: 0,
            percentage2: 0,
            differenceBig: 0,
            differenceSmall: 21,
            columns: [
                { name: "id", align: 'left', label: "Team no.",  field: "id"},
                { name: 'name', label: 'Team name', align: 'left', field: 'name'},
                { name: 'place', align: 'left', label: 'Place', field: 'place' },
                { name: 'match', align: 'left', label: 'Matches played', field: 'match' },
                { name: 'total', align: 'left', label: 'Total points', field: 'total', sortable: true },
                { name: 'points', align: 'left', label: 'Points differential', field: 'points', sortable: true  },
            ],
            data: []

        }
     },

     components: {
        TournamentMatch
    },

    methods: {
        firstRoundUpdate(winnerId, teamName, teamCaptain, teamSeed, team1Score, team2Score, loserId, matchId){

            this.teams2ndArray = this.teams2ndArray.filter((team)=> team.id !==loserId);
            this.teams2ndArray = this.teams2ndArray.filter((team)=> team.id !==winnerId);
            this.firstRoundArray.find(el => el.no == matchId).team1Score = parseInt(team1Score);
            this.firstRoundArray.find(el => el.no == matchId).team2Score = parseInt(team2Score);
            this.firstRoundArray.filter(el => el.no == el.no);
            
            this.teams2ndArray.push({
                    id: winnerId,
                    seed: teamSeed,
                    teamName: teamName,
                    teamCaptain: teamCaptain,
                })

            if(this.teams2ndArray.length == 4){

                this.firstRoundArray.forEach(el => {
                    el.isNotFinished = false;
                });

                this.teams2ndArray.sort(function(a, b){
                return parseInt(a.seed) - parseInt(b.seed)});

                for(let i = 0; i<4; i+=2){
                    if(this.secondRoundArray.length <=2){
                        this.secondRoundArray.push({
                            no: this.secondRoundMatches[this.secondMatchIterator].matchId,
                            team1: this.teams2ndArray[i].id,
                            team1Name: this.teams2ndArray[i].teamName,
                            team1Captain: this.teams2ndArray[i].teamCaptain,
                            team1Seed: this.teams2ndArray[i].seed,
                            team1Score: this.secondRoundMatches[this.secondMatchIterator].scoreTeamOne ,
                            team2: this.teams2ndArray[i+1].id,
                            team2Name: this.teams2ndArray[i+1].teamName,
                            team2Captain: this.teams2ndArray[i+1].teamCaptain,
                            team2Seed: this.teams2ndArray[i+1].seed,
                            team2Score: this.secondRoundMatches[this.secondMatchIterator].scoreTeamTwo,
                            tournamentId: this.tournamentId,
                            isNotFinished: true,
                            round: 1,
                        })
                    }
                this.secondMatchIterator++;
                }

                this.secondRoundArray.filter(el => el.team1 != loserId);
            }

        },

        secondRoundUpdate(winnerId, teamName, teamCaptain, teamSeed, team1Score, team2Score, loserId, matchId){

            this.teamsFinalArray = this.teamsFinalArray.filter((team)=> team.id !==loserId);
            this.teamsFinalArray = this.teamsFinalArray.filter((team)=> team.id !==winnerId);
            this.secondRoundArray.find(el => el.no == matchId).team1Score = parseInt(team1Score);
            this.secondRoundArray.find(el => el.no == matchId).team2Score = parseInt(team2Score);
            this.secondRoundArray.filter(el => el.no == el.no);
            
            this.teamsFinalArray.push({
                    id: winnerId,
                    seed: teamSeed,
                    teamName: teamName,
                    teamCaptain: teamCaptain,
                })

            if(this.teamsFinalArray.length == 2){

                this.firstRoundArray.forEach(el => {
                    el.isNotFinished = false;
                });

                this.secondRoundArray.forEach(el => {
                    el.isNotFinished = false;
                });

                this.teamsFinalArray.sort(function(a, b){
                return parseInt(a.seed) - parseInt(b.seed)});

                for(let i = 0; i<2; i+=2){
                    if(this.finalsArray.length <=1){
                        this.finalsArray.push({
                            no: this.finalGame.matchId,
                            team1: this.teamsFinalArray[i].id,
                            team1Name: this.teamsFinalArray[i].teamName,
                            team1Captain: this.teamsFinalArray[i].teamCaptain,
                            team1Seed: this.teamsFinalArray[i].seed,
                            team1Score: this.finalGame.scoreTeamOne ,
                            team2: this.teamsFinalArray[i+1].id,
                            team2Name: this.teamsFinalArray[i+1].teamName,
                            team2Captain: this.teamsFinalArray[i+1].teamCaptain,
                            team2Seed: this.teamsFinalArray[i+1].seed,
                            team2Score: this.finalGame.scoreTeamTwo,
                            tournamentId: this.tournamentId,
                            isNotFinished: true,
                            round: 2,
                        })
                    }

                }

                this.finalsArray.filter(el => el.team1 != loserId);
            }

        },

        async finalRoundUpdate(winnerId, teamName, teamCaptain, teamSeed, team1Score, team2Score, loserId, matchId){

            this.finalsArray.find(el => el.no == matchId).team1Score = parseInt(team1Score);
            this.finalsArray.find(el => el.no == matchId).team2Score = parseInt(team2Score);
            this.finalsArray.filter(el => el.no == el.no);

            this.winnerTeam.id = winnerId;
            this.winnerTeam.teamName = teamName;
            this.winnerTeam.teamCaptain = teamCaptain;
            this.winnerTeam.isFinished = true;

            this.percentage1 = 0;
            this.percentage2 = 0;

           try {

             let tourneyMatches = await axios.get(`http://localhost:8081/api/tourmatch/${this.tournamentId}`, {withCredentials: true})

            tourneyMatches.data.tournament.forEach(el => {
                if(el.winnerId){
                    if(el.scoreTeamOne > el.scoreTeamTwo){
                        this.percentage1++;
                    } else{
                        this.percentage2++;
                    }

                    if(el.scoreTeamOne > el.scoreTeamTwo){
                       if(el.scoreTeamOne - el.scoreTeamTwo > this.differenceBig){
                           this.differenceBig = el.scoreTeamOne - el.scoreTeamTwo;
                       }
                       if(el.scoreTeamOne - el.scoreTeamTwo < this.differenceSmall){
                           this.differenceSmall = el.scoreTeamOne - el.scoreTeamTwo;
                       }
                    } else{
                        if(el.scoreTeamTwo - el.scoreTeamOne > this.differenceBig){
                           this.differenceBig = el.scoreTeamTwo - el.scoreTeamOne;
                       }
                       if(el.scoreTeamTwo - el.scoreTeamOne < this.differenceSmall){
                           this.differenceSmall = el.scoreTeamTwo - el.scoreTeamOne;
                       }
                    }
                }
            });


            if(this.winnerTeam.id){
                this.percentage1 = ((this.percentage1*100)/7).toFixed(2);
                this.percentage2 = ((this.percentage2*100)/7).toFixed(2);
                const res = await axios(`http://localhost:8081/api/stats/${this.tournamentId}/${this.winnerTeam.id}`, {
                        method: 'get',
                        withCredentials: true
                    })
                let sum = 0;
                let pd = 0;
                let match = 0;
                res.data.tournament.forEach(el => {
                    match++
                    if(el.teamOneId == this.winnerTeam.id){
                        sum = sum + el.scoreTeamOne
                        pd = pd + (el.scoreTeamOne - el.scoreTeamTwo)
                    }
                    if(el.teamTwoId == this.winnerTeam.id){
                        sum = sum + el.scoreTeamTwo
                        pd = pd + (el.scoreTeamTwo - el.scoreTeamOne)
                    }
                });
                this.data.push({
                    id: this.winnerTeam.id,
                    name: this.winnerTeam.teamName,
                    place: '1',
                    match: match,
                    total: sum,
                    points: pd,
                })
            }

            if(this.teamsFinalArray.length == 2){
                 this.firstRoundArray.forEach(el => {
                    el.isNotFinished = false;
                });

                this.secondRoundArray.forEach(el => {
                    el.isNotFinished = false;
                });
                let team = this.teamsFinalArray.find(el => el.id != this.winnerTeam.id);
                const res = await axios(`http://localhost:8081/api/stats/${this.tournamentId}/${team.id}`, {
                        method: 'get',
                        withCredentials: true
                    })

                let sum = 0;
                let pd = 0;
                let match= 0;
                res.data.tournament.forEach(el => {
                    match++;
                    if(el.teamOneId == team.id){
                        sum = sum + el.scoreTeamOne
                        pd = pd + (el.scoreTeamOne - el.scoreTeamTwo)
                    }
                    if(el.teamTwoId == team.id){
                        sum = sum + el.scoreTeamTwo
                        pd = pd + (el.scoreTeamTwo - el.scoreTeamOne)
                    }
                });
                this.data.push({
                    id: team.id,
                    name: team.teamName,
                    place: '2',
                    match: match,
                    total: sum,
                    points: pd,
                })
                
            }

            if(this.teams2ndArray.length == 4){
                this.firstRoundArray.forEach(el => {
                    el.isNotFinished = false;
                });
                let copy = this.teams2ndArray;
                copy = copy.filter(el => el.id != this.teamsFinalArray[0].id)
                copy = copy.filter(el => el.id != this.teamsFinalArray[1].id)
                copy.forEach(async team => {
                    const res = await axios(`http://localhost:8081/api/stats/${this.tournamentId}/${team.id}`, {
                            method: 'get',
                            withCredentials: true
                        })

                    let sum = 0;
                    let pd = 0;
                    let match = 0;
                    res.data.tournament.forEach(el => {
                        match++
                        if(el.teamOneId == team.id){
                            sum = sum + el.scoreTeamOne
                            pd = pd + (el.scoreTeamOne - el.scoreTeamTwo)
                        }
                        if(el.teamTwoId == team.id){
                            sum = sum + el.scoreTeamTwo
                            pd = pd + (el.scoreTeamTwo - el.scoreTeamOne)
                        }
                    });
                    this.data.push({
                        id: team.id,
                        name: team.teamName,
                        place: '3-4',
                        match: match,
                        total: sum,
                        points: pd,
                    })
                });
            }

            if(this.teamsArray.length == 8 && this.winnerTeam.isFinished == true){
                 let copy = this.teamsArray;
                copy = copy.filter(el => el.id != this.teams2ndArray[0].id)
                copy = copy.filter(el => el.id != this.teams2ndArray[1].id)
                copy = copy.filter(el => el.id != this.teams2ndArray[2].id)
                copy = copy.filter(el => el.id != this.teams2ndArray[3].id)
                copy.forEach(async team => {
                    const res = await axios(`http://localhost:8081/api/stats/${this.tournamentId}/${team.id}`, {
                            method: 'get',
                            withCredentials: true
                        })

                    let sum = 0;
                    let pd = 0;
                    let match = 0;
                    res.data.tournament.forEach(el => {
                        match++;
                        if(el.teamOneId == team.id){
                            sum = sum + el.scoreTeamOne
                            pd = pd + (el.scoreTeamOne - el.scoreTeamTwo)
                        }
                        if(el.teamTwoId == team.id){
                            sum = sum + el.scoreTeamTwo
                            pd = pd + (el.scoreTeamTwo - el.scoreTeamOne)
                        }
                    });
                    this.data.push({
                        id: team.id,
                        name: team.teamName,
                        place: '5-8',
                        match: match,
                        total: sum,
                        points: pd,
                    })

                    if(this.data.length == 8){
                         this.data.sort(function(a, b){
                    return parseInt(b.total) - parseInt(a.total)});
                    }

                });
            }

            if(this.winnerTeam.isFinished){
                this.firstRoundArray.forEach(el => {
                    el.isNotFinished = false;
                });

                this.secondRoundArray.forEach(el => {
                    el.isNotFinished = false;
                });

                this.finalsArray.forEach(el => {
                    el.isNotFinished = false;
                });
                this.data.sort(function(a, b){
                    return parseInt(b.total) - parseInt(a.total)});
            }

           } catch(err){
               console.log(err)
           }

        }
    }
}
</script>

<style scoped>

.width{
  width: 80%;
  margin-left: auto;
  margin-right: auto;
}

</style>