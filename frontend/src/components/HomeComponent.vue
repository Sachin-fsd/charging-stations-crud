<template>
    <v-app>
        <div class="home-layout">
            <NavbarComponent />
            <div class="main-content">
                <v-btn v-if="!leftSidebarVisible" class="sidebar-open-btn size-3 ml-6" icon size="large"
                    @click="leftSidebarVisible = true">
                    <v-icon color="primary">mdi-chevron-right</v-icon>
                </v-btn>
                <!-- Left Sidebar with transition -->
                <transition name="slide-x">
                    <div v-if="leftSidebarVisible" class="left-sidebar" app width="300" elevation="2" color="#f4f6fa"
                        style="border-right: 1px solid #e0e0e0;">
                        <v-btn icon size='large' class="sidebar-close-btn" @click="leftSidebarVisible = false"
                            variant="text">
                            <v-icon color="grey">mdi-chevron-left</v-icon>
                        </v-btn>
                        <v-card flat class="pa-0">
                            <v-card-title class="pb-0 pl-4">
                                <span class="text-h6 font-weight-bold">Search Stations</span>
                            </v-card-title>

                            <v-overlay :model-value="isLoading" contained class="d-flex align-center justify-center">
                                <LottieLoader />
                            </v-overlay>
                            <v-card-text>
                                <v-text-field v-model="name" label="Name" dense variant="outlined" class="mb-2" />
                                <v-text-field v-model="state" label="State" dense variant="outlined" class="mb-2" />
                                <v-text-field v-model="city" label="City" dense variant="outlined" class="mb-2" />
                                <v-text-field v-model="powerOutput" label="Power Output" dense variant="outlined"
                                    class="mb-2" />
                                <v-select v-model="connectorType" :items="[
                                    { title: '— Select —', value: '' },
                                    { title: 'Type 1', value: 'Type 1' },
                                    { title: 'Type 2', value: 'Type 2' },
                                    { title: 'CCS', value: 'CCS' },
                                    { title: 'CHAdeMO', value: 'CHAdeMO' }
                                ]" label="Connector Type" item-title="title" item-value="value" dense
                                    variant="outlined" class="mb-2" />

                                <v-select v-model="status" :items="[
                                    { title: '— Select —', value: '' },
                                    { title: 'Active', value: 'Active' },
                                    { title: 'Inactive', value: 'Inactive' },
                                    { title: 'Maintenance', value: 'Maintenance' },
                                ]" label="Status" dense variant="outlined" class="mb-2" />

                                <v-btn @click="searchStations"  type="submit" color="primary" block size="large" class="mb-3"
                                    :loading="isLoading" :disabled="isLoading">
                                    <template #default>
                                        <!-- <v-icon v-if="!isLoading" left>mdi-check-circle</v-icon> -->
                                        <span v-if="isLoading">Searching</span>
                                        <span v-else>Search</span>
                                    </template>
                                </v-btn>

                                <v-btn color="secondary" block @click="clearSelection" class="mb-2">Reset</v-btn>
                                <v-alert v-if="createError" type="error" dense>{{ createError }}</v-alert>
                            </v-card-text>
                        </v-card>
                        <v-divider class="my-2"></v-divider>
                        <div class="create-section" v-if="userRole === 'admin'">
                            <v-btn color="success" block @click="openCreateSidebar">Create Charging Hub</v-btn>
                        </div>
                    </div>
                </transition>
                <!-- Sidebar open button -->
                <!-- <v-btn v-if="!leftSidebarVisible" class="sidebar-open-btn" icon size="large"
                    @click="leftSidebarVisible = true">
                    <v-icon color="primary">mdi-chevron-right</v-icon>
                </v-btn> -->

                <!-- Main Content Area -->
                <div class="content-area">
                    <div id="map" class="map"></div>
                </div>

                <!-- Right Sidebar with transition -->
                <transition name="slide-x-reverse">
                    <div v-if="rightSidebarVisible" class="right-sidebar">
                        <v-btn icon class="close-btn" @click="rightSidebarVisible = false" variant="text">
                            <v-icon color="grey" size='small' icon='mdi-close'>mdi-close</v-icon>
                        </v-btn>
                        <div v-if="selectedStation">
                            <v-card flat>
                                <v-card-title class="text-h6 font-weight-bold">{{ selectedStation.name }}</v-card-title>
                                <v-card-text>
                                    <div class="station-detail"><strong>Location:</strong> {{ selectedStation.city }},
                                        {{ selectedStation.state }}</div>
                                    <div class="station-detail"><strong>Status:</strong> {{ selectedStation.status }}
                                    </div>
                                    <div class="station-detail"><strong>Power:</strong> {{ selectedStation.powerOutput
                                    }} kW</div>
                                    <div class="station-detail"><strong>Connector:</strong> {{
                                        selectedStation.connectorType }}</div>
                                    <div class="station-detail"><strong>Lat/Lng:</strong> {{ selectedStation.latitude
                                    }}, {{ selectedStation.longitude }}</div>
                                    <v-row dense align="center" class="mb-2" v-if="userRole === 'admin'">
                                        <v-col cols="auto">
                                            <v-btn icon color="warning"
                                                @click.stop="openUpdateSidebar(selectedStation)">
                                                <v-icon>mdi-pencil</v-icon>
                                            </v-btn>
                                        </v-col>
                                        <v-col cols="auto">
                                            <v-btn icon color="error" @click.stop="deleteStation(selectedStation._id)">
                                                <v-icon>mdi-delete</v-icon>
                                            </v-btn>
                                        </v-col>
                                    </v-row>

                                    <v-btn color="secondary" class="mt-2" @click="backToList">
                                        Back to List
                                    </v-btn>

                                </v-card-text>
                            </v-card>
                        </div>
                        <div v-else-if="showCreateSidebar">
                            <v-card flat>
                                <v-card-title class="text-h6 font-weight-bold">Create Charging Hub</v-card-title>
                                <v-card-text>
                                    <v-form @submit.prevent="createStation">
                                        <v-text-field v-model="newStation.name" label="Name" dense variant="outlined"
                                            class="mb-2" required />
                                        <v-text-field v-model="newStation.state" label="State" dense variant="outlined"
                                            class="mb-2" required />
                                        <v-text-field v-model="newStation.city" label="City" dense variant="outlined"
                                            class="mb-2" required />
                                        <v-text-field v-model="newStation.latitude" label="Latitude" dense
                                            variant="outlined" class="mb-2" required />
                                        <v-text-field v-model="newStation.longitude" label="Longitude" dense
                                            variant="outlined" class="mb-2" required />
                                        <v-select v-model="newStation.status" :items="['Active', 'Inactive']"
                                            label="Status" dense variant="outlined" class="mb-2" required />
                                        <v-select v-model="newStation.connectorType"
                                            :items="['Type 1', 'Type 2', 'CCS', 'CHAdeMO']" label="Connector Type" dense
                                            variant="outlined" class="mb-2" required />
                                        <v-text-field v-model="newStation.powerOutput" label="Power Capacity (kW)" dense
                                            variant="outlined" class="mb-2" required />
                                        <v-btn color="primary" type="submit" class="mr-2">Save</v-btn>
                                        <v-btn color="error" @click="closeCreateSidebar">Cancel</v-btn>
                                    </v-form>
                                    <v-alert v-if="createError" type="error" dense class="mt-2">{{ createError
                                    }}</v-alert>
                                </v-card-text>
                            </v-card>
                        </div>
                        <div v-else-if="showUpdateSidebar">
                            <v-card flat>
                                <v-card-title class="text-h6 font-weight-bold">Update Charging Hub</v-card-title>
                                <v-card-text>
                                    <v-form @submit.prevent="updateStation">
                                        <v-text-field v-model="editStation.name" label="Name" dense variant="outlined"
                                            class="mb-2" required />
                                        <v-text-field v-model="editStation.state" label="State" dense variant="outlined"
                                            class="mb-2" required />
                                        <v-text-field v-model="editStation.city" label="City" dense variant="outlined"
                                            class="mb-2" required />
                                        <v-text-field v-model="editStation.latitude" label="Latitude" dense
                                            variant="outlined" class="mb-2" required />
                                        <v-text-field v-model="editStation.longitude" label="Longitude" dense
                                            variant="outlined" class="mb-2" required />
                                        <v-select v-model="editStation.status" :items="['Active', 'Inactive']"
                                            label="Status" dense variant="outlined" class="mb-2" required />
                                        <v-select v-model="editStation.connectorType"
                                            :items="['Type 1', 'Type 2', 'CCS', 'CHAdeMO']" label="Connector Type" dense
                                            variant="outlined" class="mb-2" required />
                                        <v-text-field v-model="editStation.powerOutput" label="Power Capacity (kW)"
                                            dense variant="outlined" class="mb-2" required />
                                        <v-btn color="primary" type="submit" class="mr-2">Update</v-btn>
                                        <v-btn color="error" @click="closeUpdateSidebar">Cancel</v-btn>
                                    </v-form>
                                    <v-alert v-if="createError" type="error" dense class="mt-2">{{ createError
                                    }}</v-alert>
                                </v-card-text>
                            </v-card>
                        </div>
                        <div v-else>
                            <v-card flat>
                                <v-card-title class="text-h6 font-weight-bold">All Charging Stations</v-card-title>
                                <v-list dense>
                                    <v-list-item v-for="station in allStations" :key="station._id" class="station-card"
                                        @click="showStationDetails(station)">
                                        <v-list-item-content>
                                            <v-list-item-title>{{ station.name }}</v-list-item-title>
                                            <v-list-item-subtitle>{{ station.city }}, {{ station.state
                                            }}</v-list-item-subtitle>
                                            <div class="station-detail"><strong>Status:</strong> {{ station.status }}
                                            </div>
                                            <div class="station-detail"><strong>Power:</strong> {{ station.powerOutput
                                            }} kW</div>
                                            <div class="station-detail"><strong>Connector:</strong> {{
                                                station.connectorType }}</div>
                                            <div class="station-detail"><strong>Lat/Lng:</strong> {{ station.latitude
                                            }}, {{ station.longitude }}</div>
                                        </v-list-item-content>
                                        <template v-if="userRole === 'admin'">
                                            <v-btn icon color="warning" @click.stop="openUpdateSidebar(station)">
                                                <v-icon>mdi-pencil</v-icon>
                                            </v-btn>
                                            <v-btn icon color="error" @click.stop="deleteStation(station._id)">
                                                <v-icon>mdi-delete</v-icon>
                                            </v-btn>
                                        </template>
                                    </v-list-item>
                                    <v-list-item v-if="allStations.length === 0">
                                        <v-list-item-content>
                                            <v-list-item-title class="text-center">No Charging Stations
                                                Found</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-divider class="my-2"></v-divider>

                                </v-list>
                            </v-card>
                        </div>
                    </div>
                </transition>
                <!-- See Stations Button -->
                <v-btn v-if="!rightSidebarVisible" class="see-stations-btn" color="primary" elevation="2"
                    @click="rightSidebarVisible = true">
                    <v-icon left>mdi-eye</v-icon>
                    See Stations
                </v-btn>
            </div>
        </div>
    </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import NavbarComponent from './NavbarComponent.vue'

import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import Style from 'ol/style/Style'
import Icon from 'ol/style/Icon'
import { fromLonLat } from 'ol/proj'
import LottieLoader from './LottieLoader.vue'

const stations = ref([])
const isLoading = ref(false)
const allStations = ref([])
const selectedStation = ref(null)
const userRole = ref('')
const showCreateSidebar = ref(false)
const showUpdateSidebar = ref(false)
const rightSidebarVisible = ref(true)
const leftSidebarVisible = ref(true)
const createError = ref('')
const name = ref('')
const state = ref('')
const city = ref('')
const powerOutput = ref('')
const connectorType = ref('')
const status = ref('')
const newStation = ref({
    name: '',
    state: '',
    city: '',
    latitude: '',
    longitude: '',
    status: '',
    powerOutput: '',
    connectorType: ''
})
const editStation = ref({
    _id: '',
    name: '',
    state: '',
    city: '',
    latitude: '',
    longitude: '',
    status: '',
    powerOutput: '',
    connectorType: ''
})

let map, vectorSource, vectorLayer

function showStationDetails(station) {
    selectedStation.value = station
    if (map && station.latitude && station.longitude) {
        const coords = fromLonLat([Number(station.longitude), Number(station.latitude)])
        map.getView().animate({
            center: coords,
            zoom: 15, // or your preferred zoom level
            duration: 600
        })
    }
}

async function fetchAllStations() {
    isLoading.value = true
    try {
        const response = await fetch('https://charging-stations-crud.vercel.app/api/charging-stations', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        const data = await response.json()
        allStations.value = Array.isArray(data) ? data : (data.stations || [])
        updateMarkers()
    } catch (e) {
        createError.value = 'Failed to fetch stations'
    } finally {
        isLoading.value = false
    }
}

async function searchStations() {
    isLoading.value = true
    stations.value = []
    try {
        const response = await fetch(`https://charging-stations-crud.vercel.app/api/charging-stations?name=${encodeURIComponent(name.value)}&state=${encodeURIComponent(state.value)}&city=${encodeURIComponent(city.value)}&powerOutput=${encodeURIComponent(powerOutput.value)}&connectorType=${encodeURIComponent(connectorType.value)}&status=${encodeURIComponent(status.value)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        const data = await response.json()
        if (!Array.isArray(data) || data.length === 0) {
            createError.value = 'No Result'
        }
        if (response.ok) {
            allStations.value = Array.isArray(data) ? data : (data.stations || [])
            rightSidebarVisible.value = true
            updateMarkers();
            showCreateSidebar.value = false;
            showUpdateSidebar.value = false;
            selectedStation.value = null;
        }
    } catch (e) {
        createError.value = 'Failed to search stations'
    } finally {
        isLoading.value = false
    }
}

function openCreateSidebar() {
    rightSidebarVisible.value = true
    showCreateSidebar.value = true
    showUpdateSidebar.value = false
}

function clearSelection() {
    name.value = ''
    state.value = ''
    city.value = ''
    powerOutput.value = ''
    connectorType.value = ''
    status.value = ''
    createError.value = ''
    selectedStation.value = null
    showCreateSidebar.value = false
    showUpdateSidebar.value = false
    fetchAllStations()
}

function closeCreateSidebar() {
    showCreateSidebar.value = false
    createError.value = ''
    newStation.value = {
        name: '',
        state: '',
        city: '',
        latitude: '',
        longitude: '',
        status: '',
        powerOutput: '',
        connectorType: ''
    }
}

function backToList() {
    selectedStation.value = null
    showCreateSidebar.value = false
    showUpdateSidebar.value = false
    fetchAllStations();
    const coords = fromLonLat([77.1025, 28.7041])
    map.getView().animate({
        center: coords,
        zoom: 6, // or your preferred zoom level
        duration: 600
    })
}

function openUpdateSidebar(station) {
    selectedStation.value = null;
    showUpdateSidebar.value = true
    showCreateSidebar.value = false
    editStation.value = { ...station }
}

function closeUpdateSidebar() {
    showUpdateSidebar.value = false
    createError.value = ''
    editStation.value = {
        _id: '',
        name: '',
        state: '',
        city: '',
        latitude: '',
        longitude: '',
        status: '',
        powerOutput: '',
        connectorType: ''
    }
}

async function createStation() {
    createError.value = ''
    try {
        const token = localStorage.getItem('token')
        if (!newStation.value.name || !newStation.value.state || !newStation.value.city || !newStation.value.latitude || !newStation.value.longitude || !newStation.value.status || !newStation.value.powerOutput || !newStation.value.connectorType) {
            createError.value = 'All fields are required'
            return
        }
        const response = await fetch('https://charging-stations-crud.vercel.app/api/charging-stations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newStation.value)
        })
        const data = await response.json()
        if (response.ok) {
            closeCreateSidebar()
            fetchAllStations()
            searchStations()
        } else {
            createError.value = data.message || 'Failed to create station'
        }
    } catch (e) {
        createError.value = 'Network error'
    }
}

async function updateStation() {
    createError.value = ''
    try {
        const token = localStorage.getItem('token')
        if (!editStation.value._id) {
            createError.value = 'Invalid station selected'
            return
        }
        const response = await fetch(`https://charging-stations-crud.vercel.app/api/charging-stations/${editStation.value._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(editStation.value)
        })
        const data = await response.json()
        if (response.ok) {
            closeUpdateSidebar()
            fetchAllStations()
            searchStations()
        } else {
            createError.value = data.message || 'Failed to update station'
        }
    } catch (e) {
        createError.value = 'Network error'
    }
}

async function deleteStation(id) {
    if (!confirm('Are you sure you want to delete this charging station?')) return
    try {
        const token = localStorage.getItem('token')
        const response = await fetch(`https://charging-stations-crud.vercel.app/api/charging-stations/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        const data = await response.json()
        if (response.ok) {
            fetchAllStations()
            searchStations()
        } else {
            createError.value = data.message || 'Failed to delete station'
        }
    } catch (e) {
        createError.value = 'Network error'
    }
}

function updateMarkers() {
    if (!vectorSource) return
    vectorSource.clear()
    allStations.value.forEach(station => {
        if (station.latitude && station.longitude) {
            const marker = new Feature({
                geometry: new Point(fromLonLat([Number(station.longitude), Number(station.latitude)])),
                stationData: station
            })
            marker.setStyle(new Style({
                image: new Icon({
                    src: 'https://img.icons8.com/?size=25&id=97JKXBSG7m69&format=png&color=000000', // Attractive EV icon
                    anchor: [0.5, 1], // bottom center
                    scale: 1.2 // make it a bit larger
                })
            }))
            vectorSource.addFeature(marker)
        }
    })

    if (map) {
        map.on('singleclick', function (evt) {
            let feature = map.forEachFeatureAtPixel(evt.pixel, function (feat) {
                return feat
            })
            if (feature && feature.get('stationData')) {
                selectedStation.value = feature.get('stationData')
                rightSidebarVisible.value = true;
                if (selectedStation.value.latitude && selectedStation.value.longitude) {
                    const coords = fromLonLat([Number(selectedStation.value.longitude), Number(selectedStation.value.latitude)])
                    map.getView().animate({
                        center: coords,
                        zoom: 15, // or your preferred zoom level
                        duration: 600
                    })
                }
            }
        })
    }
}

onMounted(() => {
    // Get user role from cookies
    const userCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('user='))
    if (userCookie) {
        try {
            const user = JSON.parse(decodeURIComponent(userCookie.split('=')[1]))
            userRole.value = user.role
        } catch (e) {
            userRole.value = ''
        }
    }

    map = new Map({
        target: 'map',
        layers: [
            new TileLayer({
                source: new OSM()
            })
        ],
        view: new View({
            center: fromLonLat([77.1025, 28.7041]),
            zoom: 6
        })
    })

    vectorSource = new VectorSource()
    vectorLayer = new VectorLayer({
        source: vectorSource
    })
    map.addLayer(vectorLayer)

    fetchAllStations()
})
</script>

<style scoped>
@import 'vuetify/styles';

.my-2 {
    margin-top: 10px;
}

.home-layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

.main-content {
    display: flex;
    flex: 1;
    min-height: 0;
    background: #f5f7fa;
    position: relative;
}

.left-sidebar {
    min-width: 300px;
    max-width: 340px;
    background: #f4f6fa;
    border-right: 1px solid #e0e0e0;
    height: calc(100vh - 64px);
    /* 64px is typical navbar height */
    z-index: 10;
    position: relative;
    top: 0;
    overflow-y: scroll;
}

.sidebar-close-btn {
    /* position: absolute;
    top: 10px;
    left: 10px; */
    z-index: 20;
}

.sidebar-open-btn {
    position: fixed;
    left: 10px;
    top: 90px;
    z-index: 2001;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(44, 62, 80, 0.12);
}





.content-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    position: relative;
}

.map {
    flex: 1;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    box-shadow: 0 2px 12px rgba(44, 62, 80, 0.10);
}

.right-sidebar {
    top: 50px;
    position: fixed;
    bottom: 20px;
    right: 0;
    width: 370px;
    height: 85vh;
    background: #fff;
    box-shadow: -2px 0 12px rgba(44, 62, 80, 0.08);
    padding: 32px 24px 24px 24px;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    z-index: 100;
    border-radius: 12px 0 0 12px;
    transition: all 0.3s cubic-bezier(.4, 0, .2, 1);
}

.close-btn {
    position: absolute;
    top: 10px;
    right: 16px;
    background: transparent;
    border: none;
    font-size: 2rem;
    color: #888;
    cursor: pointer;
    z-index: 10;
    transition: color 0.2s;
}

.close-btn:hover {
    color: #e74c3c;
}

.see-stations-btn {
    position: fixed;
    right: 20px;
    top: 80px;
    z-index: 100;
    background: #2980b9;
    color: #fff;
    border-radius: 24px;
    padding: 12px 28px;
    font-size: 1.1rem;
    font-weight: bold;
    box-shadow: 0 2px 8px rgba(44, 62, 80, 0.12);
    cursor: pointer;
    transition: background 0.2s;
}

.see-stations-btn:hover {
    background: #1c5d8c;
}

.slide-x-enter-active,
.slide-x-leave-active {
    transition: transform 0.3s cubic-bezier(.4, 0, .2, 1), opacity 0.3s;
}

.slide-x-enter-from,
.slide-x-leave-to {
    transform: translateX(-100%);
    opacity: 0;
}

.slide-x-reverse-enter-active,
.slide-x-reverse-leave-active {
    transition: transform 0.3s cubic-bezier(.4, 0, .2, 1), opacity 0.3s;
}

.slide-x-reverse-enter-from,
.slide-x-reverse-leave-to {
    transform: translateX(100%);
    opacity: 0;
}

.station-list-item.selected-station {
    background: #e3f2fd !important;
}

.station-card {
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 8px;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: background 0.2s, transform 0.2s;
}

@media (max-width: 900px) {
    .main-content {
        flex-direction: column;
    }

    .left-sidebar {
        position: relative;
        height: auto;
        max-height: none;
        width: 100%;
        max-width: 100%;
        z-index: 10;
        border-right: none;
        border-bottom: 1px solid #e0e0e0;
    }

    .right-sidebar {
        bottom: 10px;
        width: 340px;
        height: 86vh;
    }

    /* .sidebar-open-btn {
    display: none; 
  } */
}
</style>
