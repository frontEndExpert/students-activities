<template>
  <div class="card">
    <div class="image-icons">
      <div class="image-icon" :class="{ 'bpjr-yellow': item.product === 'bpjr' }">
        <img
          v-if="didLoad"
          class="card-img-top"
          :src="icon_path"
          @error="setDidLoad(false)"
          alt="Card image cap"
        />
        <img
          v-else
          class="card-img-top"
          src="../assets/topics/camouflage.png"
          alt="Card image cap"
        />
      </div>
      <div v-if="item.product === 'bpjr'" class="bpjr-circle">jr.</div>
    </div>
    <div class="card-body">
      <h5 class="card-name">{{ item_name }} {{ resource_type }}</h5>
      <p class="card-date">{{ created_date }}</p>
    </div>
    <div class="card-space">&nbsp;</div>
    <div v-if="activityConfig[item.resource_type].score" :style="{ visibility: item.score.length > 0 ? 'visible' : 'hidden' }" class="card-score">
      Score <b>{{ item.score }}/{{ item.possible_score }}</b>
    </div>
    <div v-else class="card-score">&nbsp;</div>
    <router-link :to="'/v1/'  + item.id" class="link" @click="cardSelected(item.id)"
     v-if="activityConfig[item.resource_type].zoom" ><font-awesome-icon icon="eye" class="icon" />View work</router-link
    >
    <div v-else class="card-score">&nbsp;</div>
    <a class="btn-hide" @click="hideActivity(item.id)" title="Hide" alt="Hide"
      ><font-awesome-icon icon="circle-h" class="hide-icon"
    /></a>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { formatDate, capitalizeFirstLetter } from '../composable/utils'
import { activityConfig } from '../assets/config'

const props = defineProps(['item'])
const item_name = computed(() => capitalizeFirstLetter(props.item.topic_data.name, ' '))
const resource_type = computed(() => capitalizeFirstLetter(props.item.resource_type, '_'))
const icon_path = computed(() => `/src${props.item.topic_data.icon_path}`)
const didLoad = ref(true)

const created_date = computed(() => formatDate(props.item.d_created))
const emit = defineEmits(['cardSelected', 'activityHidden'])

function setDidLoad(value) {
  didLoad.value = value
}

function cardSelected(id) {
  emit('cardSelected', id)
}

function hideActivity(id) {
  emit('activityHidden', id)
}
</script>

<style scoped>
.card {
  display: flex;
  flex-flow: row nowrap;
  max-width: 800px;
  width: 100%;
  height: 60px;
  justify-items: center;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
}

.card-body {
  width: 200px;
  min-width: 160px;
}

.card-name {
  font-size: 12px;
  text-align: left;
  margin: 0px;
  padding: 0px;
}

.card-date {
  font-size: 10px;
  text-align: left;
  margin: 0px;
  padding: 0px;
}

.card-space {
  flex-shrink: 5;
  width: 100px;
}
.link {
  width: 100px;
  text-align: left;
  color: black;
  text-decoration: none;
  font-size: 12px;
  font-weight: bold;
}

.card-score {
  width: 70px;
  min-width: 50px;
  font-size: 12px;
  text-align: right;
  margin: 20px 10px 20px 0;
  padding: 0px;
}
.icon {
  margin-right: 5px;
}

.image-icons {
  padding: 10px;
}
.bpjr-circle {
  background-color: #fecb64;
  color: black;
  border-radius: 50%;
  position: relative;
  right: -2px;
  bottom: 12px;
  width: 14px;
  height: 14px;
  font-size: 10px;
  z-index: 5;
  float: right;
}

.image-icon {
  background-color: green;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  position: relative;
  right: 0px;
  bottom: 0px;
}
.card-img-top {
  width: 20px;
  height: 20px;
  object-fit: cover;
  margin-top: 5px;
}

.bpjr-yellow {
  background-color: #f8b80b;
}

.btn-hide {
  margin-right: 20px;
}
.hide-icon:hover {
  fill: #333333 !important;
}
</style>
