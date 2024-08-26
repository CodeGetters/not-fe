<script setup lang="ts">
import { nextTick } from "vue";

interface IVirtualList {
  dataSource: any[];
  // [k: string]: number | any[]
  itemHeight: number;
  viewHeight: number;
  maxCount: number;
}
class VirtualList {
  state: IVirtualList;
  scrollStyle: any;
  startIndex: number;
  endIndex: number;
  renderList: any[];
  container: HTMLElement | null;
  list: HTMLElement | null;
  constructor(containerSel: string, listSel: string) {
    this.state = {
      dataSource: [], // 模拟数据源
      itemHeight: 100, // 固定 item 高度
      viewHeight: 0, // container 高度
      maxCount: 0, // 视图最大容纳量
    };
    this.scrollStyle = {}; // list 动态样式（高度，偏移）
    this.startIndex = 0; // 当前视图列表在数据源中的起始索引
    this.endIndex = 0; // 当前视图列表在数据源中的末尾索引
    this.renderList = []; // 渲染在视图上的列表项

    // 根据用户传入的选择器获取 DOM 并保存
    this.container = document.querySelector(containerSel);
    this.list = document.querySelector(listSel);
  }
  init() {
    if (this.container) {
      this.state.viewHeight = this.container!.offsetHeight;
      this.state.maxCount =
        Math.ceil(this.state.viewHeight / this.state.itemHeight) + 1;
      console.log(this.state.maxCount);
    }
  }
  computedEndIndex() {
    const end = this.startIndex + this.state.maxCount;
    this.endIndex = this.state.dataSource[end]
      ? end
      : this.state.dataSource.length;
  }
  computedRenderList() {
    this.renderList = this.state.dataSource.slice(
      this.startIndex,
      this.endIndex,
    );
  }
}
nextTick(() => {
  const vir = new VirtualList(".virtual-list-box", ".virtual-list-list");
  vir.init();
});
</script>

<template>
  <div class="container">
    <div class="virtual-list-box">
      <div class="virtual-list-list">
        <div class="virtual-list-item"></div>
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
