<script setup lang="ts">
import Field from './CardField.vue'
import ColorPicker from './ColorPicker.vue'
import InputField from './InputField.vue'
import ToggleStarred from './ToggleStarred.vue'
</script>

<template>
  <div
    class="bg-$vp-c-bg border-$vp-c-default-soft hover:border-primary transition-border relative z-0 rounded-lg border-2 border-solid p-5 duration-500">
    <div class="align-center mb-4 flex justify-between">
      <div class="text-$vp-c-text-1 lh-relaxed text-sm font-bold">
        Emoji Legend
      </div>
    </div>
    <Field icon="i-twemoji-globe-with-meridians">Indexes</Field>
    <Field icon="i-twemoji-repeat-button">Storage Links</Field>
    <Field icon="i-twemoji-star">Recommendations</Field>
    <div class="align-center mb-4 mt-4 flex justify-between">
      <div class="text-$vp-c-text-1 lh-relaxed text-sm font-bold">Options</div>
    </div>
    <InputField id="toggle-starred" label="Toggle Starred">
      <template #display>
        <ToggleStarred />
      </template>
    </InputField>
    <InputField
      id="icon-color"
      label="Color"
    >
      <template #display>
        <ColorPicker class="ml-auto"/>
      </template>
    </InputField>

  </div>
</template>
