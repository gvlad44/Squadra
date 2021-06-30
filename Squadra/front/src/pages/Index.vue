<template>
  <q-page class="column width q-mt-lg" v-if="loaded">
    <q-card class=" q-mb-lg">
      <q-card-section>
        <p class="text-h4 q-mx-xl q-mt-lg q-mb-lg">Home</p>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="q-pa-md fit row justify-center q-my-md">
          <q-table
            color="primary"
            title="Match registry"
            :data="dataMatches"
            :columns="columnsMatches"
            row-key="no"
            :filter="filterMatches"
            no-data-label="You have not signed up for any games"
          >
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn
                  dense
                  round
                  flat
                  color="primary"
                  icon="info"
                  @click="onRowClick(props.row)"
                ></q-btn>
                <q-btn
                  dense
                  round
                  flat
                  color="primary"
                  icon="cancel"
                  @click="openDialog(props.row)"
                  v-if="props.row.validDate"
                ></q-btn>
              </q-td>
            </template>

            <template v-slot:top-right>
              <q-btn
                color="primary"
                label="Join a match"
                icon="sports_basketball"
                class="q-mr-md"
                clickable
                exact
                to="/public"
              />
              <q-btn
                color="primary"
                label="Create a match"
                icon="add_circle_outline"
                class="q-mr-md"
                clickable
                exact
                to="/create"
              />
              <q-input
                borderless
                dense
                debounce="300"
                v-model="filterMatches"
                placeholder="Search"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>
          </q-table>
        </div>

        <q-dialog v-model="dialog" persistent>
          <q-card class=" q-pl-md q-pr-md">
            <q-card-section class="row items-center">
              <q-avatar
                icon="priority_high"
                color="primary"
                text-color="white"
              />
              <span class="q-ml-sm text-subtitle1 text-weight-medium"
                >Are you sure you want to withdraw from this match?</span
              >
            </q-card-section>

            <q-card-actions align="right">
              <q-btn
                flat
                label="Yes"
                color="primary"
                v-close-popup
                @click="removeUserFromGame()"
              />
              <q-btn flat label="No" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-dialog v-model="ownerDetailsDialog" persistent>
          <q-card class=" q-pl-md q-pr-md q-pt-md">
            <q-card-section class="column items-center">
              <div class="text-h5 text-weight-medium text-center">
                Match owner: {{ owner.name }}
              </div>
            </q-card-section>

            <q-separator color="primary" />

            <q-card-section class="column items-center">
              <div class="text-body1 q-mb-xs">
                Phone: <b>{{ owner.phone }}</b>
              </div>
              <div class="text-body1 q-mb-xs">
                Facebook: <b>{{ owner.facebook }}</b>
              </div>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="OK" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-card-section>
      <q-separator />
      <q-card-section class="column items-center">
        <p class="text-h6 q-mt-md q-mb-none">
          Click on the picture to get the location's address
        </p>

        <template>
          <div class="q-pa-md row justify-center items-center q-mb-md">
            <q-carousel
              swipeable
              animated
              v-model="slide"
              :autoplay="autoplay"
              ref="carousel"
              infinite
              class="carousel"
            >
              <q-carousel-slide
                :name="1"
                img-src="../assets/izvor.jpg"
                @click="firstParkMaps()"
                class="pointer"
              >
                <div class="absolute-bottom custom-caption">
                  <div class="text-h4 ">Izvor park</div>
                </div>
              </q-carousel-slide>
              <q-carousel-slide
                :name="2"
                img-src="../assets/studentesc1.jpg"
                @click="secondParkMaps()"
                class="pointer"
              >
                <div class="absolute-bottom custom-caption">
                  <div class="text-h4 ">Studentesc basketball courts</div>
                </div>
              </q-carousel-slide>
              <q-carousel-slide
                :name="3"
                img-src="../assets/tineretului.jpg"
                @click="thirdParkMaps()"
                class="pointer"
              >
                <div class="absolute-bottom custom-caption">
                  <div class="text-h4 ">Tineretului park</div>
                </div>
              </q-carousel-slide>
              <q-carousel-slide
                :name="4"
                img-src="../assets/niorga.jpg"
                @click="fourthParkMaps()"
                class="pointer"
              >
                <div class="absolute-bottom custom-caption">
                  <div class="text-h4 ">Nicolae Iorga park</div>
                </div>
              </q-carousel-slide>

              <template v-slot:control>
                <q-carousel-control
                  position="top-right"
                  :offset="[18, 18]"
                  class="text-white rounded-borders"
                  style="background: rgba(0, 0, 0, .3); padding: 4px 8px;"
                >
                  <q-toggle
                    dense
                    dark
                    color="primary"
                    v-model="autoplay"
                    label="Auto Play"
                  />
                </q-carousel-control>

                <q-carousel-control
                  position="bottom-right"
                  :offset="[18, 18]"
                  class="q-gutter-xs"
                >
                  <q-btn
                    push
                    round
                    dense
                    color="primary"
                    text-color="white"
                    icon="arrow_left"
                    @click="$refs.carousel.previous()"
                  />
                  <q-btn
                    push
                    round
                    dense
                    color="primary"
                    text-color="white"
                    icon="arrow_right"
                    @click="$refs.carousel.next()"
                  />
                </q-carousel-control>
              </template>
            </q-carousel>
          </div>
        </template>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import axios from "axios";

export default {
  async created() {
    await axios
      .get("http://localhost:8081/api/user/", { withCredentials: true })
      .then(res => {
        this.currentUserId = res.data.user.id;
        this.loaded = true;
        this.user.no = res.data.user.id;
        this.user.name = res.data.user.name;
        this.user.email = res.data.user.email;
        this.user.age = res.data.user.age;
        this.user.createdGames = res.data.user.createdGames;
        this.user.participatedGames = res.data.user.participatedGames;
        this.user.checkedInGames = res.data.user.checkedInGames;
        this.user.isAdmin = res.data.user.isAdmin;
        this.user.phone = res.data.user.phone;
        this.user.facebook = res.data.user.facebook;
      })
      .catch(err => {
        console.log(err);
      });

    if (this.currentUserId == null) {
      this.$router.push({ name: "Start" });
    }

    await axios
      .get("http://localhost:8081/api/ums/", { withCredentials: true })
      .then(async res => {
        var userDate = new Date();
        res.data.matches.forEach(async el => {
          await axios
            .get("http://localhost:8081/api/user/" + el.ownerId, {
              withCredentials: true
            })
            .then(resp => {
              var year = el.date;
              year = el.date.substr(0, 4);
              var month = el.date;
              month = el.date.substr(5, 2);
              var day = el.date;
              day = el.date.substr(8, 2);

              var validation;
              var matchDate = new Date(year, month, day);
              matchDate.setMonth(matchDate.getMonth() - 1);
              if ( matchDate >= userDate ) {
                validation = true;
              } else {
                validation = false;
              }

              if (this.currentUserId === resp.data.user.id) {
                validation = false;
              }

              this.dataMatches.push({
                no: el.id,
                place: el.place,
                date: el.date,
                noPart: el.noParticipants,
                maxPart: el.maxParticipants,
                creator: resp.data.user.name,
                validDate: validation,
                ownerId: el.ownerId
              });

              this.dataMatches.sort(function(a, b) {
                return b.no - a.no;
              });
            });
        });
      })
      .catch(err => {
        console.log(err);
      });

    await axios
      .get("http://localhost:8081/api/no/", { withCredentials: true })
      .then(res => {
        this.createdNo = res.data.number;
        this.user.createdGames = this.createdNo;
      })
      .catch(err => {
        console.log(err);
      });

    await axios
      .get("http://localhost:8081/api/part/", { withCredentials: true })
      .then(res => {
        this.partNo = res.data.number - this.createdNo;
        this.user.participatedGames = this.partNo;
      })
      .catch(err => {
        console.log(err);
      });

    try {
      await axios(`http://localhost:8081/api/user/${this.user.no}`, {
        method: "put",
        data: {
          name: this.user.name,
          email: this.user.email,
          age: this.user.age,
          createdGames: this.createdNo,
          participatedGames: this.partNo,
          checkedInGames: this.user.checkedInGames,
          phone: this.user.phone,
          facebook: this.user.facebook,
          isAdmin: this.user.isAdmin
        },
        withCredentials: true
      });
    } catch (err) {
      console.log(err);
    }
  },
  data() {
    return {
      loaded: false,
      filterMatches: "",
      columnsMatches: [
        {
          name: "no",
          align: "left",
          label: "Match no.",
          field: "no",
          sortable: true
        },
        {
          name: "place",
          align: "left",
          label: "Place",
          field: row => row.place,
          sortable: true,
          required: true
        },
        {
          name: "date",
          align: "left",
          label: "Date",
          field: "date",
          sortable: true
        },
        {
          name: "noPart",
          align: "left",
          label: "Number of participants",
          field: "noPart"
        },
        {
          name: "maxPart",
          align: "left",
          label: "Maximum number of participants",
          field: "maxPart"
        },
        {
          name: "creator",
          align: "left",
          label: "Match creator",
          field: "creator"
        },
        {
          name: "actions",
          align: "left",
          label: "Actions",
          field: "",
          align: "center"
        }
      ],
      dataMatches: [],
      slide: 1,
      autoplay: false,
      dialog: false,
      idSelected: 0,
      rowId: null,
      row: {
        place: null,
        date: null,
        noPart: null,
        maxPart: null,
        ownerId: null
      },
      currentUserId: null,
      owner: {
        name: null,
        phone: "The user did not provide a phone number",
        facebook: "The user did not provide a facebook profile"
      },
      ownerDetailsDialog: false,
      user: {
        no: null,
        name: null,
        email: null,
        age: null,
        createdGames: null,
        participatedGames: null,
        checkedInGames: null,
        phone: null,
        facebook: null,
        isAdmin: null
      },
      partNo: 0,
      createdNo: 0
    };
  },
  methods: {
    firstParkMaps() {
      window.open(
        "https://www.google.com/maps/dir//44.43246,26.090866/@44.4324034,26.0885764,17z"
      );
    },

    secondParkMaps() {
      window.open(
        "https://www.google.ro/maps/dir//44.4689396,26.1168473/@44.4686808,26.1143289,17z"
      );
    },

    thirdParkMaps() {
      window.open(
        "https://www.google.com/maps/dir//44.410157,26.1027002/@44.4101416,26.1004998,17z"
      );
    },

    fourthParkMaps() {
      window.open(
        "https://www.google.ro/maps/dir//44.4469974,26.0912881/@44.4467957,26.0886315,17z"
      );
    },

    async removeUserFromGame() {
      try {
        await axios(`http://localhost:8081/api/ums/${this.rowId}`, {
          method: "delete",
          withCredentials: true
        });

        await axios
          .get(`http://localhost:8081/api/nm/${this.rowId}`, {
            withCredentials: true
          })
          .then(res => {
            this.row.noPart = res.data.number;
          })
          .catch(err => {
            console.log(err);
          });

        try {
          await axios(`http://localhost:8081/api/match/${this.rowId}`, {
            method: "put",
            data: {
              place: this.row.place,
              date: this.row.date,
              noParticipants: this.row.noPart,
              maxParticipants: this.row.maxPart,
              ownerId: this.row.ownerId
            },
            withCredentials: true
          });
        } catch (err) {
          console.log(err);
        }

        this.dataMatches = this.dataMatches.filter(dm => dm.no != this.rowId);
        this.handleYes();
      } catch (err) {
        console.log(err);
        this.handleException();
      }
    },

    handleYes() {
      this.$q.notify({
        type: "positive",
        position: "top",
        message: `Withdrawal succeded.`
      });
    },

    handleNo() {
      this.$q.notify({
        type: "warning",
        position: "top",
        message: `Withdrawal was canceled. Nothing has changed.`
      });
    },

    handleException() {
      this.$q.notify({
        type: "negative",
        position: "top",
        message: `Something went wrong. Please try again. If this bug persists please report it in the share feedback page.`
      });
    },

    openDialog(row) {
      this.dialog = true;
      this.rowId = row.no;
      this.row.place = row.place;
      this.row.date = row.date;
      this.row.noPart = row.noPart;
      this.row.maxPart = row.maxPart;
      this.row.ownerId = row.ownerId;
    },

    async onRowClick(row) {
      await axios
        .get(`http://localhost:8081/api/user/${row.ownerId}`, {
          withCredentials: true
        })
        .then(res => {
          this.ownerDetailsDialog = true;
          this.owner.name = res.data.user.name;
          if (res.data.user.phone != null) {
            this.owner.phone = res.data.user.phone;
          } else {
            this.owner.phone = "Not available";
          }
          if (res.data.user.facebook != null) {
            this.owner.facebook = res.data.user.facebook;
          } else {
            this.owner.facebook = "Not available";
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style>
.custom-caption {
  text-align: center;
  padding: 12px;
  color: white;
}

.pointer {
  cursor: pointer;
}

.carousel {
  min-width: 60em;
}

.width {
  width: 80%;
  margin-left: auto;
  margin-right: auto;
}
</style>
