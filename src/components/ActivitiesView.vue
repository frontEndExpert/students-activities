<template>
  <div class="activities-container">
    <ModalConfirm :modal-id="modalId" @confirm="() => confirm()">
      <ItemDetails :item="currentItem" />
    </ModalConfirm>
    <router-link :to="'/v1/'" class="link" >V1</router-link>&nbsp;
    <router-link :to="'/v1/12'" class="link" >V1 activity 12</router-link><br/>
    <router-link :to="'/v2/'" class="link" >V2</router-link>&nbsp;
    <router-link :to="'/v2/12'" class="link" >V2 activity 12</router-link>

    <h1 class="label-container">Activities view</h1>
    <h2 class="label-container">Timeline</h2>
    <div class="search-container">
      <div class="search">
        <input
          v-model="currentValue"
          class="search-input"
          type="text"
          aria-haspopup="true"
          aria-controls="dropdown-menu"
          @keyup.enter="selectValue()"
          @keyup.space="selectValue()"
          @keyup.esc="closeDropdown"
          @input="openDropdown();valueChanged()"
          @focus="openDropdown();valueChanged()"
          @blur="closeDropdown()"
        />
        <font-awesome-icon icon="magnifying-glass" class="search-icon" />
      </div>

      <div class="dropdown-menu" id="dropdown-menu" role="menu">
        <div class="dropdown-content" v-if="matches != '' && open">
          <a
            v-for="(suggestion, index) in matches"
            @mousedown="suggestionClick(suggestion)"
            :key="index"
            class="dropdown-item"
          >
            {{ suggestion }}
          </a>
        </div>
      </div>
    </div>
    <p class="label-container">Filter by:</p>
    <div class="filterButtons">
      <button
        type="button"
        @click="filterByType('all')"
        :class="filterBy === 'all' ? 'btn active' : 'btn'"
      >
        <font-awesome-icon v-if="filterBy === 'all'" icon="circle-check" class="icon" />All Work
      </button>
      <button
        type="button"
        @click="filterByType('movie')"
        :class="filterBy === 'movie' ? 'btn active' : 'btn'"
      >
        <font-awesome-icon v-if="filterBy === 'movie'" icon="circle-check" class="icon" />Movie
      </button>
      <button
        type="button"
        @click="filterByType('quiz')"
        :class="filterBy === 'quiz' ? 'btn active' : 'btn'"
      >
        <font-awesome-icon v-if="filterBy === 'quiz'" icon="circle-check" class="icon" />Quiz
      </button>
      <button
        type="button"
        @click="filterByType('easy_quiz')"
        :class="filterBy === 'easy_quiz' ? 'btn active' : 'btn'"
      >
        <font-awesome-icon v-if="filterBy === 'easy_quiz'" icon="circle-check" class="icon" />Easy
        Quiz
      </button>
      <button
        type="button"
        @click="filterByType('make_a_map')"
        :class="filterBy === 'make_a_map' ? 'btn active' : 'btn'"
      >
        <font-awesome-icon
          v-if="filterBy === 'make_a_map'"
          icon="circle-check"
          class="icon"
        />Make-a-Map
      </button>
      <button
        type="button"
        @click="filterByType('make_a_movie')"
        :class="filterBy === 'make_a_movie' ? 'btn active' : 'btn'"
      >
        <font-awesome-icon
          v-if="filterBy === 'make_a_movie'"
          icon="circle-check"
          class="icon"
        />Make-a-Movie
      </button>
      <button
        type="button"
        @click="filterByType('word_play')"
        :class="filterBy === 'word_play' ? 'btn active' : 'btn'"
      >
        <font-awesome-icon v-if="filterBy === 'word_play'" icon="circle-check" class="icon" />Word
        Play
      </button>
      <button
        type="button"
        @click="filterByType('related_reading')"
        :class="filterBy === 'related_reading' ? 'btn active' : 'btn'"
      >
        <font-awesome-icon
          v-if="filterBy === 'related_reading'"
          icon="circle-check"
          class="icon"
        />Related Reading
      </button>
      <button
        type="button"
        @click="filterByType('challenge')"
        :class="filterBy === 'challenge' ? 'btn active' : 'btn'"
      >
        <font-awesome-icon
          v-if="filterBy === 'challenge'"
          icon="circle-check"
          class="icon"
        />Challenge
      </button>
      <button
        type="button"
        @click="filterByType('draw_about_it')"
        :class="filterBy === 'draw_about_it' ? 'btn active' : 'btn'"
      >
        <font-awesome-icon
          v-if="filterBy === 'draw_about_it'"
          icon="circle-check"
          class="icon"
        />Draw About It
      </button>
    </div>

    <div class="cards">
      <div v-for="(activity, index) in paginatedActivities" :key="activity.id">
        <p class="month-label" v-if="index === 0"> {{ getFullMonth(activity.d_created) }}</p>
        <p class="month-label" v-if="index > 0 && getFullMonth(paginatedActivities[index-1].d_created) != getFullMonth(activity.d_created)">
          {{ getFullMonth(activity.d_created) }}</p>
        <CardView :item="activity" @cardSelected="idChanged" @activityHidden="hideActivity" />

      </div>
      <p v-if="paginated" @click="loadMore()" class="load-more">Load More</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch} from 'vue'
import { useRouter, useRoute } from 'vue-router'
import CardView from './CardView.vue'
import ModalConfirm from './ModalConfirm.vue'
import ItemDetails from './ItemDetails.vue'
import { useVfm } from 'vue-final-modal'
import { getFullMonth } from '../composable/utils'


const open = ref(false)
const valueSelected = ref(false)
const currentValue = ref('')
const vfm = useVfm()
const modalId = Symbol('modalId')
const activities = ref([])
const currentItem = ref(null)
const filterBy = ref('all')
const route = useRoute()
const router = useRouter()
const id = ref(route.params.id)
const version = ref(route.params.version)
const paginated = ref(false)
const currentPage = ref(1)
const paginatedActivities = ref([])
const hiddenActivities = ref([])

//ordered by created date
const orderedActivities = ref([])

//set orderedActivities
watch([activities, hiddenActivities], (val) => {
  let tempArr = [...activities.value];
  if (hiddenActivities.value?.length > 0) {
    let temp = [...hiddenActivities.value]
    tempArr = tempArr.filter((activity) => !temp.includes(activity.id) )
  }
  orderedActivities.value = tempArr
},{ immediate: true });


const filteredActivities = ref([])
// set filteredActivities
watch([valueSelected, filterBy, orderedActivities],
  (val) => {
    if (valueSelected.value) {
      // filterBySearch
      if (currentValue.value.trim() !== '') {
        filteredActivities.value = orderedActivities.value.filter((activity) =>
          activity.topic_data.name.toLowerCase().includes(currentValue.value.toLowerCase())
        )
      } else {
        filteredActivities.value = orderedActivities.value
      } // filterByResourceType
    } else if (filterBy.value === 'all' || filterBy.value === '') {
      filteredActivities.value = orderedActivities.value
    } else if (filterBy.value !== '') {
      filteredActivities.value = filteredActivities.value?.length > 0
          ? filteredActivities.value.filter((activity) => activity.resource_type === filterBy.value)
          : orderedActivities.value.filter((activity) => activity.resource_type === filterBy.value)
    }
  },
  { immediate: true }
)

// pagination
watch(
  [filteredActivities, currentPage ],
  (val) => {
    let sortByDate = filteredActivities.value.sort((a, b) => {
      return  b.d_created - a.d_created 
    })
    
      

    //sortByDate = JSON.parse(JSON.stringify(sortByDate))
    if (sortByDate.length <= 10) {
      paginated.value = false
      currentPage.value = 1
      paginatedActivities.value = sortByDate.slice(
        (currentPage.value - 1) * 10,
        currentPage.value * 10 
      )
    } else {
      paginatedActivities.value = sortByDate.slice(
        (currentPage.value - 1) * 10,
        currentPage.value * 10 
      )
      paginated.value = sortByDate.slice(currentPage.value * 10, (currentPage.value + 1) * 10)?.length > 0
    }

  },
  { immediate: true }
)

function loadMore() {
  currentPage.value += 1
}

function filterByType(type) {
  filterBy.value = type
  valueSelected.value = false
  currentPage.value = 1
  paginated.value = filteredActivities.value.slice(currentPage.value * 10, (currentPage.value + 1) * 10)?.length > 0

}

function selectValue() {
  valueSelected.value = true
}

function valueChanged() {
  valueSelected.value = false
}

function hideActivity(id) {
  if (!hiddenActivities.value.includes(id)) {
    hiddenActivities.value.push(id)
    localStorage.setItem('hiddenActivities', JSON.stringify(hiddenActivities.value))
  }
  hiddenActivities.value = JSON.parse(localStorage.getItem('hiddenActivities')) || []
}

const matches = computed(() => {
  if (currentValue.value.trim() !== '' && !valueSelected.value) {
    return orderedActivities.value
      .map((activity) => activity.topic_data.name)
      .filter((suggestion) => suggestion.toLowerCase().includes(currentValue.value.toLowerCase()))
  } else {
    return ''
  }
})

function openDropdown() {
  open.value = true
}

function closeDropdown() {
  open.value = false
}

function suggestionClick(suggestion) {
  currentValue.value = suggestion
  valueSelected.value = true
  closeDropdown()
}

function confirm() {
  vfm.close(modalId)
  id.value = ''
  router.push('/'+version.value)
}

function idChanged(val) {
  id.value = val
}

const setItem = (item) => {
  currentItem.value = item
  vfm.open(modalId)
}


watch(id, (val) => {
  if (val) {
    const activity = activities.value.find((activity) => activity.id === val)

    setItem(activity)
  } else {
    vfm.close(modalId)
  }
})

watch(() => route.params.id  , async (val) => {
  if (route.params.id > 0) {
    id.value = route.params.id
    const activity = activities.value.find((activity) => activity.id === route.params.id)
    setItem(activity)
  }
});

watch(() => route.params.version  , async (val) => {
  version.value = route.params.version
  version.value = val

  version.value = route.params.version
  if(version.value == 'v1') {
    const response = await fetch('http://localhost:3000/activities/v1')
    const data = await response.json()
    activities.value = [...data]
  }

  if(version.value == 'v2') {
    const response = await fetch('http://localhost:3000/activities/v2')
    const data = await response.json()
    
    let activtitiesV1 = []
    
      for(let i = 0; i < data.length; i++){
        for(let j = 0; j < data[i].activities.length; j++){
          activtitiesV1.push({
            id: data[i].activities[j].id,
            resource_type: data[i].resource_type,
            score: data[i].activities[j].score,
            possible_score: data[i].activities[j].possible_score,
            product: data[i].activities[j].product,
            d_created: data[i].activities[j].d_created,
            topic_data: data[i].activities[j].topic_data,
            comment: data[i].activities[j].comment
          })
        }
      }
    
    activities.value = [...activtitiesV1]
  }
}, { immediate: true });



onMounted(async () => {
  
  id.value = route.params.id
  hiddenActivities.value = JSON.parse(localStorage.getItem('hiddenActivities')) || []
})

</script>

<style scope>
.activities-container {
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}

.cards {
  display: flex;
  flex-flow: column nowrap;
  gap: 15px;
  width: 100%;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}
.search-container {
  width: 100%;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
}
.search {
  display: flex;
  flex-flow: row nowrap;
  width: 300px;
  justify-content: space-between;
  align-items: center;
  padding: 0px;
  border-radius: 4px;
  border: 1px solid slategray;
}
.search-input {
  width: 100%;
  padding: 7px;
  font-size: 12px;
  border-radius: 4px 0 0 4px;
}
.search-icon {
  font-size: 1em;
  color: white;
  width: 17px;
  height: 17px;
  background-color: black;
  padding: 8px;
  border-radius: 0 4px 4px 0;
}
.label-container {
  text-align: left;
  width: 100%;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}
.filterButtons {
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  gap: 7px;
  margin-bottom: 10px;
}

.filterButtons .btn {
  background-color: white;
  padding: 5px 8px;
  border: 1px solid black;
  border-radius: 3px;
  font-size: 10px;
  font-weight: bold;
  white-space: nowrap;
}

.btn.active {
  background-color: rgb(219, 246, 255);
}

.filterButtons button:hover {
  background-color: aliceblue;
}
button > .icon {
  margin-right: 3px;
}

.dropdown-menu {
  width: 300px;
  padding: 0px;
  border-radius: 4px;
  border: 1px solid black;
  border-top: none;
  box-shadow: 5px 5px 5px black;
}
.dropdown-content {
  display: flex;
  flex-flow: column wrap;
  gap: 0px;
  width: 300px;
  padding: 0px;
}

.dropdown-item {
  cursor: pointer;
  text-align: left;
  font-size: 12px;
}

.dropdown-item:hover {
  font-weight: bold;
}

.load-more {
  width: 100px;
  height: 20px;
  border: 1px solid black;
  border-radius: 10px;
  text-align: center;
  padding: 4px;
  margin: 30px auto 30px auto;
  cursor: pointer;
  box-shadow: 5px 5px 5px black;
}
.load-more:hover {
  background-color: rgb(223, 223, 223);
  box-shadow: 2px 2px 2px black;
  font-weight: bold;
}
.month-label {
  font-size: 10px;
  font-family: sans-serif;
  width: 80px;
  height: 20px;
  margin:0;
  padding: 0;
  padding-top: 6px;
  margin-bottom: 12px;
  border-radius: 12px;
  background-color: rgb(255, 252, 213);
}
</style>
