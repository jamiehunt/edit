---
title: Welcome
layout: home
description: The largest collection of free stuff on the internet!

hero:
  name: freemediaheckyeah
  tagline: The largest collection of free stuff on the internet!
  announcement:
    title: June 2025 Updates 🌈
    link: /posts/june-2025
  image:
    src: /test.png
    alt: FMHY Icon
  actions:
    - theme: brand
      text: See Beginners Guide
      link: /beginners-guide
    - theme: alt
      text: Posts
      link: /posts
    - theme: alt
      text: Contribute
      link: /other/contributing
    - theme: alt
      text: Discord
      link: https://rentry.co/fmhy-invite
---

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  var preferredKawaii
  try {
    preferredKawaii = localStorage.getItem('uwu')
  } catch (err) {}
  const urlParams = new URLSearchParams(window.location.search)
  const kawaii = urlParams.get('uwu')
  const setKawaii = () => {
    const images = document.querySelectorAll('.VPImage.image-src')
    images.forEach((img) => {
      img.src = '/logo-uwu.svg'
    })
  }
  const resetKawaii = () => {
    const images = document.querySelectorAll('.VPImage.image-src')
    images.forEach((img) => {
      img.src = '/test.png'
    })
  }
  if (kawaii === 'true') {
    try {
      localStorage.setItem('uwu', true)
    } catch (err) {}
    console.log('uwu mode enabled. Disable with "?uwu=false".');
    setKawaii()
  } else if (kawaii === 'false') {
    try {
      localStorage.removeItem('uwu', false)
    } catch (err) {}
    resetKawaii()
  } else if (preferredKawaii) {
    setKawaii()
  }

  let clickCount = 0;
  const heroImage = document.querySelector('.VPImage.image-src');
  
  const handleClick = () => {
    clickCount += 1;
    if (clickCount === 5) {
      const isKawaii = localStorage.getItem('uwu') === 'true';
      if (isKawaii) {
        localStorage.removeItem('uwu');
        resetKawaii();
        console.log('uwu mode disabled.');
      } else {
        localStorage.setItem('uwu', true);
        setKawaii();
        console.log('uwu mode enabled after 5 clicks.');
      }
      clickCount = 0;
    }
  };

  if (heroImage) {
    heroImage.addEventListener('click', handleClick);
  }
})
</script>
