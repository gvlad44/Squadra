<template>
  <q-page class="column items-center image">
        <div class=" q-mt-xl column items-center">
            <h1 class="text-h1 white text-weight-medium"> Squadra </h1>
            <a href="http://localhost:8081/auth/google">
            <q-btn color="dark" label="Log in" size = "lg" padding= "md" class="fixed-center q-pl-xl q-pr-xl " rounded />
            </a>
        </div>
  </q-page>
</template>

<script>
export default {

}
</script>

<style>
.image {
    background: url("../assets/background.jpg");
    background-repeat: no-repeat;
    background-size: cover;
}

.white{
    color: white;
}
</style>