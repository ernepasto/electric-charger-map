<template>
    <div id="PageHome">

        <div class="map-container">
            <Map></Map>
        </div>

    </div>
</template>

<script>
import Map from '../components/Map'

export default {
    name: 'PageHome',
    components: {
        Map,
    }
}
</script>

<style lang="scss" scoped>

.map-container {
    
}

</style>