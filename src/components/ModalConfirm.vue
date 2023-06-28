<script setup>
import { VueFinalModal } from 'vue-final-modal'
const emit = defineEmits(['confirm'])
</script>

<template>
  <VueFinalModal class="final-modal" content-class="content-final-modal" @click="emit('confirm')">
    <a class="close-modal" @click="emit('confirm')">
      <font-awesome-icon icon="circle-xmark" class="circle-icon" />
    </a>
    <slot />
  </VueFinalModal>
</template>

<style>
.close-modal {
  border: 1px;
  border-radius: 0.5rem;
  padding: 0.5rem;
  margin-left: auto;
  margin-top: 0.25rem;
  margin-right: 1rem;
  font-size: 24px;
  line-height: 1;
  float: right;
  cursor: pointer;
}

.circle-icon {
  width: 40px;
  height: 40px;
  color: #b5b5b5;
}
.circle-icon:hover {
  color: #2c2c2c;
}

.content-final-modal {
  display: flex;
  flex-direction: column;
  width: 560px;
  margin-left: 1rem; /* 16px */
  margin-right: 1rem; /* 16px */
  padding: 1rem;
  background-color: #ffffff;
  border-radius: 15px;
  border: 6px solid #ccc;
}
.space-y-2 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(0.5rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.5rem * var(--tw-space-y-reverse));
}

.dark .dark\:bg-gray-900 {
  --tw-bg-opacity: 1;
  background-color: rgba(17, 24, 39, var(--tw-bg-opacity));
}
.dark .dark\:border-gray-700 {
  --tw-border-opacity: 1;
  border-color: rgba(55, 65, 81, var(--tw-border-opacity));
}
.final-modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0);
}
</style>
