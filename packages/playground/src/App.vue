<script setup lang="ts">
import { stat } from "fs";
import { computed, nextTick, onMounted, reactive, ref } from "vue";

const dataSource: number[] = [];

const listItem = ref(null);
const listContainer = ref<HTMLElement | null>(null);

const state = reactive({
  startIndex: 0,
  itemHeight: 100,
  viewHeight: 0,
  maxCount: 0,
});
const endIndex = computed(() => {
  const end = state.startIndex + state.maxCount;
  return dataSource[end] ? dataSource[end] : dataSource.length;
});
const scrollStyle = computed(() => {
  return {
    height: `${dataSource.length * state.itemHeight - state.startIndex * state.itemHeight}px`,
    transform: `translate3d(0, ${state.startIndex * state.itemHeight}px, 0)`,
  };
});
const renderList = computed(() => {
  return dataSource.slice(state.startIndex, endIndex.value);
});

const bindEvent = () => {
  listContainer.value?.addEventListener("scroll", () => {
    console.log("----------scroll----------");
  });
};
const addData = () => {
  for (let i = 0; i < 10; i++) {
    dataSource.push(dataSource.length + 1);
  }
};

const render = () => {
  if (endIndex.value > dataSource.length) {
    addData();
  }
  renderList;
};

const init = () => {
  if (listContainer.value) {
    state.viewHeight = listContainer.value.offsetHeight;
    state.maxCount = Math.ceil(state.viewHeight / state.itemHeight) + 1;
    bindEvent();
    render();
  }
};

onMounted(() => {
  nextTick(() => {
    init();
  });
});
</script>

<template>
  <div class="container">
    <div class="virtual-list-box">
      <div class="virtual-list-list" ref="listContainer">
        <div class="virtual-list-item" ref="listItem"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 600px;
  height: 600px;
  margin: 100px auto;
  border: 1px solid red;
}

.virtual-list-box {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.virtual-list-list {
  width: 100%;
}

.virtual-list-item {
  width: 100%;
  height: 100px;
  box-sizing: border-box;
  border: 1px solid #000;
  text-align: center;
  font-size: 20px;
  line-height: 100px;
}
</style>
