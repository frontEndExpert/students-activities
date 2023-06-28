<template>
  <div class="item-details">
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
    <h1 class="header">{{ item_name }} {{ resource_type }}</h1>
    <p class="created-date">{{ created_date }}</p>
    <p class="comment">{{ item.comment }}</p>
    <div :style="{ visibility: item.score.length > 0 ? 'visible' : 'hidden' }" class="card-score">
      Score <b>{{ item.score }}/{{ item.possible_score }}</b>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { formatDate, capitalizeFirstLetter } from '../composable/utils'

const props = defineProps(['item'])
const item_name = computed(() => capitalizeFirstLetter(props.item.topic_data.name, ' '))
const resource_type = computed(() => capitalizeFirstLetter(props.item.resource_type, '_'))
const created_date = computed(() => formatDate(props.item.d_created))
const didLoad = ref(true)

const icon_path = computed(() => `/src${props.item.topic_data.icon_path}`)

function setDidLoad(value) {
  didLoad.value = value
}
</script>

<style scope>
.item-detailes {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: beige;
  border-radius: 10px;
}

.created-date {
  font-size: 16px;
  font-family: sans-serif;
  color: #4a4a4a;
  text-align: center;
}
.header {
  font-size: 32px;
  font-family: sans-serif;
  text-align: center;
}

.bpjr-circle {
  background-color: #fecb64;
  color: black;
  border-radius: 50%;
  position: relative;
  right: 255px;
  bottom: 12px;
  width: 18px;
  height: 18px;
  font-size: 12px;
  text-align: center;
  z-index: 5;
  float: right;
}

.image-icon {
  background-color: green;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  position: relative;
  right: 0px;
  bottom: 0px;
  margin: auto;
}
.card-img-top {
  width: 40px;
  height: 40px;
  object-fit: cover;
  margin-top: 5px;
}

.bpjr-yellow {
  background-color: #f8b80b;
}

.comment {
  font-size: 24px;
  font-family: sans-serif;
}

.card-score {
  font-family: sans-serif;
  font-size: 18px;
  margin: 60px 0 0px 0;
}
</style>
