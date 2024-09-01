<template>
  <div class="status-container">
    <div class="status-dot"></div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.status-container {
  position: relative;
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 7px;
}

.status-dot {
  position: absolute;
  top: 5px;
  left: 5px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 255, 0, 1) 0%, rgba(0, 255, 0, 0.5) 80%, rgba(0, 255, 0, 0) 100%);
  animation: ripple 2s infinite;
}

@keyframes ripple {
  0% {
    transform: scale(1);
    opacity: 1;
  }

  50% {
    transform: scale(1.25);
    opacity: 0.6;
  }

  100% {
    transform: scale(2);
    opacity: 0;
  }
}


.status-container::before {
  content: "";
  position: absolute;
  top: 5px;
  left: 5px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 255, 0, 1) 0%, rgba(0, 255, 0, 0.5) 80%, rgba(0, 255, 0, 0) 100%);
}
</style>