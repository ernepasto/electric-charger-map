<template>
    <div class="map-wrapper">
        <MglMap 
            @load="onMapLoad" 
            :accessToken="map.token" 
            :mapStyle="map.style" 
            :zoom="map.zoom" 
            :center="[map.center.lng, map.center.lat]"
            class="map">
            
            <MglNavigationControl position="top-right" />
            <MglGeolocateControl trackUserLocation="true" :positionOptions="{ enableHighAccuracy: true }" position="top-right" />
            
            <MglMarker
                @click="moveTo($event, marker.lng, marker.lat)"
                v-for="marker in markers"
                :key="marker.id"
                :coordinates="[marker.lng, marker.lat]">

                <div slot="marker" :class="{ busy: marker.isBusy }" class="map-marker-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 508.928 508.928" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g>
                        <polygon xmlns="http://www.w3.org/2000/svg" style="" points="403.712,201.04 256.288,201.04 329.792,0 105.216,307.888 252.64,307.888 179.136,508.928   " fill="#ffffff" data-original="#ffd83b" class=""/><g xmlns="http://www.w3.org/2000/svg"></g><g xmlns="http://www.w3.org/2000/svg"></g><g xmlns="http://www.w3.org/2000/svg"></g><g xmlns="http://www.w3.org/2000/svg"></g><g xmlns="http://www.w3.org/2000/svg"></g><g xmlns="http://www.w3.org/2000/svg"></g><g xmlns="http://www.w3.org/2000/svg"></g><g xmlns="http://www.w3.org/2000/svg"></g><g xmlns="http://www.w3.org/2000/svg"></g><g xmlns="http://www.w3.org/2000/svg"></g><g xmlns="http://www.w3.org/2000/svg"></g><g xmlns="http://www.w3.org/2000/svg"></g><g xmlns="http://www.w3.org/2000/svg"></g><g xmlns="http://www.w3.org/2000/svg"></g><g xmlns="http://www.w3.org/2000/svg"></g></g>
                    </svg>
                </div>
                
                <MglPopup :closeButton="false">
                    <div class="popup-content">
                        <div :class="{ busy: marker.isBusy }" class="popup-header">
                            <h4 class="popup-title">{{ marker.owner }}</h4>
                            <h5 class="popup-subtitle">{{ marker.location | formatString }}</h5>
                        </div>
                        <div class="popup-body">
                            <ul class="popup-info">
                                <li>Tipo di ricarica: {{ marker.type }}</li>
                                <li>Stato attuale: {{ marker.status }}</li>
                                <li><a :href="'http://maps.google.com/maps?q=' + marker.lat + ',' + marker.lng + '&z=13'" target="_blank">Go to GoogleMaps</a></li>
                            </ul>
                        </div>
                    </div>
                </MglPopup>

            </MglMarker>
        </MglMap>
    </div>
</template>

<script>
import data from '../data/colonnine_ricarica.json'
import { MglMap, MglMarker, MglPopup, MglNavigationControl, MglGeolocateControl } from 'vue-mapbox'

export default {
    components: {
        MglMap,
        MglMarker,
        MglPopup,
        MglNavigationControl,
        MglGeolocateControl,
    },
    data() {
        return {
            map: {
                token: null,
                style: 'mapbox://styles/mapbox/dark-v10',
                zoom: 13,
                center: {
                    lng: 9.188517903191679,
                    lat: 45.464727268027715,
                },
            },
            markers: [],
        }
    },
    filters: {
        formatString(str) {
            return str[0] + str.slice(1).toLowerCase();
        }
    },
    methods: {
        onMapLoad: async function() {
            this.addMarkers();
        },
        moveTo: async function(event, lng, lat) {
            await event.map.flyTo({
                center: [lng, lat],
                zoom: 17,
                speed: 1
            });
        },
        addMarkers: function() {
            data.features.forEach(element => {
                let marker = {
                    id: null,
                    lng: null,
                    lat: null,
                    location: null,
                    municipio: null,
                    type: null,
                    owner: null,
                    status: null,
                    isBusy: false,
                }
                
                marker.id        = element.properties.id;
                marker.lat       = element.properties.lat_y_4326;
                marker.lng       = element.properties.lon_x_4326
                marker.location  = element.properties.localita;
                marker.municipio = element.properties.municipio;
                marker.type      = element.properties.tipo_ricar;
                marker.owner     = element.properties.titolare;
                marker.status    = element.properties.stato_attu;
                (marker.status == 4) ? marker.isBusy = false : marker.isBusy = true;
                
                this.markers.push(marker)
            });
        },
    },
}
</script>

<style lang="scss">
@import '../assets/mapbox-gl.css';

.map-wrapper {
    height: 100vh;
    width: 100%;
    overflow: hidden;
    .map {
        height: 100%;
        width: 100%;
        .map-marker-icon {
            cursor: pointer;
            height: 28px;
            width: 28px;
            padding: 3px;
            border: solid 3px #fff;
            border-radius: 9999px;
            background: #10C2BF;
            display: flex;
            justify-content: center;
            align-items: center;
            &.busy {
                position: absolute;
                background: #FA5A7D;
            }
            svg {
                height: 20px;
                width: 20px;
            }
        }
        .mapboxgl-popup-tip {
            display: none;
        }
        .mapboxgl-popup-content {
            padding: 0;
            border-radius: 6px;
            overflow: hidden;
            text-align: left;
            .popup-content {
                .popup-header {
                    padding: 15px 20px;
                    background: #10C2BF;
                    &.busy {
                        background: #FA5A7D;
                    }
                    .popup-title {
                        margin: 0 0 .1em 0;
                        color: #fff;
                        font-size: 1.5em;
                        font-family: 'Poppins', sans-serif;
                        font-weight: 400;
                    }
                    .popup-subtitle {
                        color: #fff;
                        font-size: 1.1em;
                        font-family: 'Poppins', sans-serif;
                        font-weight: 400;
                    }
                }
                .popup-body {
                    padding: 20px;
                    background: #fff;
                    ul {
                        margin: 0;
                        padding: 0;
                        li {
                            list-style: none;
                            display: block;
                            color: #202020;
                            font-size: 1.1em;
                            font-family: 'Poppins', sans-serif;
                            font-weight: 400;
                            &:last-child {
                                margin: 8px 0 0 0;
                                font-size: 1.05em;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>