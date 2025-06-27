<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

const KNOWN_EXTENSIONS = new Set()

function treatAsHtml(filename: string): boolean {
  if (KNOWN_EXTENSIONS.size === 0) {
    const extraExts =
      (typeof process === 'object' && process.env?.VITE_EXTRA_EXTENSIONS) ||
      (import.meta as any).env?.VITE_EXTRA_EXTENSIONS ||
      ''

      // md, html? are intentionally omitted
      ; (
        '3g2,3gp,aac,ai,apng,au,avif,bin,bmp,cer,class,conf,crl,css,csv,dll,' +
        'doc,eps,epub,exe,gif,gz,ics,ief,jar,jpe,jpeg,jpg,js,json,jsonld,m4a,' +
        'man,mid,midi,mjs,mov,mp2,mp3,mp4,mpe,mpeg,mpg,mpp,oga,ogg,ogv,ogx,' +
        'opus,otf,p10,p7c,p7m,p7s,pdf,png,ps,qt,roff,rtf,rtx,ser,svg,t,tif,' +
        'tiff,tr,ts,tsv,ttf,txt,vtt,wav,weba,webm,webp,woff,woff2,xhtml,xml,' +
        'yaml,yml,zip' +
        (extraExts && typeof extraExts === 'string' ? ',' + extraExts : '')
      )
        .split(',')
        .forEach((ext) => KNOWN_EXTENSIONS.add(ext))
  }

  const ext = filename.split('.').pop()

  return ext == null || !KNOWN_EXTENSIONS.has(ext.toLowerCase())
}

const EXTERNAL_URL_RE = /^(?:[a-z]+:|\/\/)/i

function normalizeLink(url: string): string {
  const { pathname, search, hash, protocol } = new URL(url, 'http://a.com')
  function isExternal(path: string): boolean {
    return EXTERNAL_URL_RE.test(path)
  }

  if (
    isExternal(url) ||
    url.startsWith('#') ||
    !protocol.startsWith('http') ||
    !treatAsHtml(pathname)
  )
    return url

  const { site } = useData()

  const normalizedPath =
    pathname.endsWith('/') || pathname.endsWith('.html')
      ? url
      : url.replace(
        /(?:(^\.+)\/)?.*$/,
        `$1${pathname.replace(
          /(\.md)?$/,
          site.value.cleanUrls ? '' : '.html'
        )}${search}${hash}`
      )

  return withBase(normalizedPath)
}

interface Props {
  tag?: string
  size?: 'medium' | 'big'
  theme?: 'brand' | 'alt' | 'sponsor'
  text?: string
  href?: string
  target?: string
  rel?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  theme: 'brand'
})

const isExternal = computed(
  () => props.href && EXTERNAL_URL_RE.test(props.href)
)

const component = computed(() => {
  return props.tag || (props.href ? 'a' : 'button')
})

// Dropdown functionality
const isDropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement>()

const toggleDropdown = (e: Event) => {
  e.preventDefault()
  e.stopPropagation()
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const handleClickOutside = (event: Event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const processedItems = computed(() => {
  return FMHY_HOMEPAGE_ITEMS.map((item: any) => {
    if ('items' in item && item.items) {
      return {
        ...item,
        items: item.items.map((subItem: any) => ({
          ...subItem,
          displayText: subItem.text || ''
        }))
      }
    }
    return {
      ...item,
      displayText: item.text || ''
    }
  })
})
</script>

<template>
  <div v-if="theme === 'brand'" class="VPButtonDropdown" ref="dropdownRef">
    <div class="VPButtonWrapper">
      <component :is="component" class="VPButton VPButtonMain" :class="[size, theme]"
        :href="href ? normalizeLink(href) : undefined" :target="props.target ?? (isExternal ? '_blank' : undefined)"
        :rel="props.rel ?? (isExternal ? 'noreferrer' : undefined)">
        <slot>{{ text }}</slot>
      </component>
      <button
        class="bg-$vp-c-default-soft text-text border-$vp-c-default-soft hover:border-primary ml-3 inline-flex h-8 items-center justify-center whitespace-nowrap rounded-md border-2 border-solid px-2.5 py-4.5 text-md font-medium transition-all duration-300 sm:h-7 VPButtonTrigger"
        @click="toggleDropdown" :aria-expanded="isDropdownOpen" aria-label="Toggle dropdown menu">
        <span class="i-lucide:menu"></span>
      </button>
    </div>

    <div v-if="isDropdownOpen" class="VPButtonDropdownMenu">
      <div class="VPButtonDropdownContent">
        <template v-for="item in processedItems" :key="item.text">
          <div v-if="'items' in item" class="VPButtonDropdownSection">
            <div class="VPButtonDropdownSectionTitle" v-html="item.text"></div>
            <a v-for="subItem in item.items" :key="subItem.text" :href="subItem.link" class="VPButtonDropdownItem"
              @click="closeDropdown">
              <span v-html="subItem.displayText"></span>
            </a>
          </div>
          <a v-else :href="item.link" class="VPButtonDropdownItem" @click="closeDropdown">
            <span v-html="item.displayText"></span>
          </a>
        </template>
      </div>
    </div>
  </div>

  <component v-else :is="component" class="VPButton" :class="[size, theme]"
    :href="href ? normalizeLink(href) : undefined" :target="props.target ?? (isExternal ? '_blank' : undefined)"
    :rel="props.rel ?? (isExternal ? 'noreferrer' : undefined)">
    <slot>{{ text }}</slot>
  </component>
</template>

<style scoped>
.VPButton {
  display: inline-block;
  border: 1px solid transparent;
  text-align: center;
  font-weight: 600;
  white-space: nowrap;
  transition: color 0.25s, border-color 0.25s, background-color 0.25s;
}

.VPButton:active {
  transition: color 0.1s, border-color 0.1s, background-color 0.1s;
}

.VPButton.medium {
  border-radius: 20px;
  padding: 0 20px;
  line-height: 38px;
  font-size: 14px;
}

.VPButton.big {
  border-radius: 24px;
  padding: 0 24px;
  line-height: 46px;
  font-size: 16px;
}

.VPButton.brand {
  border-color: var(--vp-button-brand-border);
  color: var(--vp-button-brand-text);
  background-color: var(--vp-button-brand-bg);
}

.VPButton.brand:hover {
  border-color: var(--vp-button-brand-hover-border);
  color: var(--vp-button-brand-hover-text);
  background-color: var(--vp-button-brand-hover-bg);
}

.VPButton.brand:active {
  border-color: var(--vp-button-brand-active-border);
  color: var(--vp-button-brand-active-text);
  background-color: var(--vp-button-brand-active-bg);
}

.VPButton.alt {
  border-color: var(--vp-button-alt-border);
  color: var(--vp-button-alt-text);
  background-color: var(--vp-button-alt-bg);
}

.VPButton.alt:hover {
  border-color: var(--vp-button-alt-hover-border);
  color: var(--vp-button-alt-hover-text);
  background-color: var(--vp-button-alt-hover-bg);
}

.VPButton.alt:active {
  border-color: var(--vp-button-alt-active-border);
  color: var(--vp-button-alt-active-text);
  background-color: var(--vp-button-alt-active-bg);
}

.VPButton.sponsor {
  border-color: var(--vp-button-sponsor-border);
  color: var(--vp-button-sponsor-text);
  background-color: var(--vp-button-sponsor-bg);
}

.VPButton.sponsor:hover {
  border-color: var(--vp-button-sponsor-hover-border);
  color: var(--vp-button-sponsor-hover-text);
  background-color: var(--vp-button-sponsor-hover-bg);
}

.VPButton.sponsor:active {
  border-color: var(--vp-button-sponsor-active-border);
  color: var(--vp-button-sponsor-active-text);
  background-color: var(--vp-button-sponsor-active-bg);
}

/* Dropdown styles */
.VPButtonDropdown {
  position: relative;
  display: inline-block;
}

.VPButtonWrapper {
  display: flex;
  align-items: stretch;
}

.VPButtonMain {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-right: none;
}

.VPButtonDropdownMenu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 50;
  margin-top: 4px;
  background-color: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1), 0 2px 6px rgba(0, 0, 0, 0.08);
  min-width: 280px;
  max-height: 400px;
  overflow-y: auto;
}

.VPButtonDropdownContent {
  padding: 8px;
}

.VPButtonDropdownSection {
  margin-bottom: 8px;
}

.VPButtonDropdownSection:last-child {
  margin-bottom: 0;
}

.VPButtonDropdownSectionTitle {
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  padding: 8px 12px 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.VPButtonDropdownItem {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  color: var(--vp-c-text-1);
  text-decoration: none;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.VPButtonDropdownItem:hover {
  background-color: var(--vp-c-bg-alt);
  color: var(--vp-c-brand-1);
}

.VPButtonDropdownIcon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.VPButtonDropdownItem span :deep([class*="i-"]) {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  margin-right: 8px;
}

.VPButtonDropdownSectionTitle :deep([class*="i-"]) {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  margin-right: 6px;
}
</style>
