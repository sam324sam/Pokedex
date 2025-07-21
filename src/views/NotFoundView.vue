<script setup>

</script>

<template>
    <div class="not-found">
        <img src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExdzUwZ2N3a3lrN3hvOHR1endxMmE3ZjJ6ZDR2ZWE3b21kbDJrYjVsbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/T8Dhl1KPyzRqU/giphy.gif" alt="NotFound" class="img-notfound">
        No se a encontrado ese pokemon <br>
        <router-link :to="{ name: 'PokemonListView' }">Volver a la lista de pokemons</router-link>
    </div>
</template>

<style>
    .not-found {
        display: flex;
        flex-direction: column;
        margin-top: 20px;
        gap: 10px;
        justify-content: center;
        align-items: center;
    }

    .img-notfound{
        width: 400px;
    }
</style>