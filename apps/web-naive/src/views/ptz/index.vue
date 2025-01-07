<script setup lang="ts">
import { ref } from 'vue';

import {
  NButton,
  NButtonGroup,
  NGrid,
  NGridItem,
  NInputNumber,
  NSlider,
} from 'naive-ui';

import { message } from '#/adapter/naive';
import { fetchPtz } from '#/api/core/gb';
import { PTZEnum } from '#/model/index';

const { layout = 'vertical', item } = defineProps<{
  item?: object; // 是否必传
  layout?: string; // 是否必传
}>();

const itemInfo = ref<any>();

itemInfo.value = item;

console.log(itemInfo.value);
const speed = ref(150);
async function ptzControl(ptzArr: any) {
  if (!itemInfo.value) return;

  try {
    if (!itemInfo.value.deviceCode || !itemInfo.value.channelCode) {
      message.error('该设备暂不支持远程控制');
      return;
    }
    await fetchPtz(
      itemInfo.value.deviceCode,
      itemInfo.value.channelCode,
      ptzArr,
      speed.value,
    );
  } catch (error) {
    console.error(error);
  }
}
const formatTooltip = (value: number) => `速度:${value}`;
function receiveItem(item: any) {
  console.log('item', item);
  itemInfo.value = item;
}

defineExpose({
  receiveItem,
});
</script>

<template>
  <div>
    <NGrid :cols="layout === 'vertical' ? 3 : 4">
      <NGridItem :span="layout === 'vertical' ? 2 : 1">
        <div>
          <NButton
            circle
            class="c-btn-class"
            secondary
            strong
            @mousedown="ptzControl([PTZEnum.panLeft, PTZEnum.tiltUp])"
            @mouseup="ptzControl([PTZEnum.stop])"
          >
            <template #icon>
              <span class="icon-[bi--arrow-up-left] btn-hover"></span>
            </template>
          </NButton>
          <NButton
            circle
            class="c-btn-class"
            secondary
            strong
            @mousedown="ptzControl([PTZEnum.tiltUp])"
            @mouseup="ptzControl([PTZEnum.stop])"
          >
            <template #icon>
              <span class="icon-[bi--arrow-up] btn-hover"></span>
            </template>
          </NButton>
          <NButton
            circle
            class="c-btn-class"
            secondary
            strong
            @mousedown="ptzControl([PTZEnum.panRight, PTZEnum.tiltUp])"
            @mouseup="ptzControl([PTZEnum.stop])"
          >
            <template #icon>
              <span class="icon-[bi--arrow-up-right] btn-hover"></span>
            </template>
          </NButton>
        </div>
        <div>
          <NButton
            circle
            class="c-btn-class"
            secondary
            strong
            @mousedown="ptzControl([PTZEnum.panLeft])"
            @mouseup="ptzControl([PTZEnum.stop])"
          >
            <template #icon>
              <span class="icon-[bi--arrow-left] btn-hover"></span>
            </template>
          </NButton>
          <NButton
            circle
            class="c-btn-class"
            secondary
            strong
            @click="ptzControl([PTZEnum.panLeft])"
          >
            <template #icon>
              <span class="icon-[bi--arrow-clockwise] btn-hover"></span>
            </template>
          </NButton>
          <NButton
            circle
            class="c-btn-class"
            secondary
            strong
            @mousedown="ptzControl([PTZEnum.panRight])"
            @mouseup="ptzControl([PTZEnum.stop])"
          >
            <template #icon>
              <span class="icon-[bi--arrow-right] btn-hover"></span>
            </template>
          </NButton>
        </div>
        <div>
          <NButton
            circle
            class="c-btn-class"
            secondary
            strong
            @mousedown="ptzControl([PTZEnum.panLeft, PTZEnum.tiltDown])"
            @mouseup="ptzControl([PTZEnum.stop])"
          >
            <template #icon>
              <span class="icon-[bi--arrow-down-left] btn-hover"></span>
            </template>
          </NButton>
          <NButton
            circle
            class="c-btn-class"
            secondary
            strong
            @mousedown="ptzControl([PTZEnum.tiltDown])"
            @mouseup="ptzControl([PTZEnum.stop])"
          >
            <template #icon>
              <span class="icon-[bi--arrow-down] btn-hover"></span>
            </template>
          </NButton>
          <NButton
            circle
            class="c-btn-class"
            secondary
            strong
            @mousedown="ptzControl([PTZEnum.panRight, PTZEnum.tiltDown])"
            @mouseup="ptzControl([PTZEnum.stop])"
          >
            <template #icon>
              <span class="icon-[bi--arrow-down-right] btn-hover"></span>
            </template>
          </NButton>
        </div>
      </NGridItem>

      <NGridItem>
        <NButtonGroup size="small">
          <NButton
            circle
            secondary
            strong
            @mousedown="ptzControl([PTZEnum.zoomIn])"
            @mouseup="ptzControl([PTZEnum.stop])"
          >
            <template #icon>
              <span class="icon-[bi--zoom-in] btn-hover"></span>
            </template>
          </NButton>
          <NButton
            circle
            secondary
            strong
            @mousedown="ptzControl([PTZEnum.zoomOut])"
            @mouseup="ptzControl([PTZEnum.stop])"
          >
            <template #icon>
              <span class="icon-[bi--zoom-out] btn-hover"></span>
            </template>
          </NButton>
        </NButtonGroup>
      </NGridItem>

      <NGridItem v-show="layout === 'center'" vertical>
        <n-space vertical>
          <NSlider
            v-model:value="speed"
            :format-tooltip="formatTooltip"
            :max="255"
            :step="10"
          />
          <NInputNumber
            v-model:value="speed"
            max="255"
            min="0"
            size="small"
            step="5"
            style="margin-top: 5px"
          />
        </n-space>
      </NGridItem>
    </NGrid>

    <n-space v-show="layout === 'vertical'" vertical>
      <NSlider
        v-model:value="speed"
        :format-tooltip="formatTooltip"
        :max="255"
        :step="10"
      />
      <NInputNumber
        v-model:value="speed"
        max="255"
        min="0"
        size="small"
        step="5"
        style="margin-top: 5px"
      />
    </n-space>
  </div>
</template>

<style scoped>
.c-btn-class {
  margin: 3px;
}

.btn-hover:hover {
  /* 添加过渡效果，让放大缩小过程更平滑，这里设置过渡时间0.3秒，过渡效果为ease（缓动效果），你可以根据喜好调整 */
  transition: transform 0.3s ease;

  /* 使用transform的scale属性来放大，这里放大1.2倍，你可以按需调整倍数 */
  transform: scale(1.2);
}
</style>
