<script setup lang="ts">
import { colors } from '@fmhy/colors'
import { useStorage, useStyleTag } from '@vueuse/core'
import {
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport
} from 'reka-ui'
import { watch } from 'vue'

const colorScales = [
  '50',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
  '950'
] as const

type ColorNames = keyof typeof colors
const selectedColor = useStorage<ColorNames>('preferred-color', 'swarm')

const colorOptions = Object.keys(colors).filter(
  (key) => typeof colors[key as keyof typeof colors] === 'object'
)

const { css } = useStyleTag('', { id: 'brand-color' })

const updateThemeColor = (colorName: ColorNames) => {
  const colorSet = colors[colorName]

  const cssVars = colorScales
    .map((scale) => `--vp-c-brand-${scale}: ${colorSet[scale]};`)
    .join('\n    ')

  css.value = `
    :root {
      ${cssVars}
      --vp-c-brand-1: ${colorSet[500]};
      --vp-c-brand-2: ${colorSet[600]};
      --vp-c-brand-3: ${colorSet[800]};
      --vp-c-brand-soft: ${colorSet[400]};
    }

    .dark {
      ${cssVars}
      --vp-c-brand-1: ${colorSet[400]};
      --vp-c-brand-2: ${colorSet[500]};
      --vp-c-brand-3: ${colorSet[700]};
      --vp-c-brand-soft: ${colorSet[300]};
    }
  `
}

// Initialize theme color
updateThemeColor(selectedColor.value)

watch(selectedColor, updateThemeColor)

const normalizeColorName = (colorName: string) =>
  colorName.replaceAll(/-/g, ' ').charAt(0).toUpperCase() +
  colorName.slice(1).replaceAll(/-/g, ' ')

const handleColorChange = (value: string) => {
  selectedColor.value = value as ColorNames
}
</script>

<template>
  <div class="color-picker">
    <SelectRoot :model-value="selectedColor" @update:model-value="handleColorChange">
      <SelectTrigger
        class="inline-flex items-center justify-between px-3 py-2 text-sm bg-bg-alt border border-div rounded-md hover:bg-bg-elv transition-colors min-w-[180px] mx-auto align-left"
        aria-label="Select theme color">
        <div class="flex items-center gap-2">
          <span class="inline-block w-4 h-4 rounded-full border border-div"
            :style="{ backgroundColor: colors[selectedColor][500] }" />
          <SelectValue :placeholder="normalizeColorName(selectedColor)" />
        </div>
        <span class="i-lucide:chevron-down w-4 h-4 text-text-2" />
      </SelectTrigger>

      <SelectPortal>
        <SelectContent class="bg-bg-elv border border-div rounded-md shadow-lg z-50 max-h-60 overflow-hidden z-9999"
          :side-offset="4">
          <SelectViewport class="p-1">
            <SelectItem v-for="color in colorOptions" :key="color" :value="color"
              class="relative flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-bg-alt rounded-sm outline-none data-[highlighted]:bg-bg-alt data-[state=checked]:bg-bg-alt data-[state=checked]:text-text">
              <span class="inline-block w-4 h-4 rounded-full border border-div"
                :style="{ backgroundColor: colors[color][500] }" />
              <SelectItemText>
                {{ normalizeColorName(color) }}
              </SelectItemText>
              <SelectItemIndicator class="absolute right-2">
                <span class="i-lucide:check w-4 h-4 text-text-2" />
              </SelectItemIndicator>
            </SelectItem>
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </SelectRoot>
  </div>
</template>
