import { ref, onMounted, onUnmounted } from 'vue';

export function useFullscreen() {
  const isFullscreen = ref(false);

  function enterFullscreen(element) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) { // Firefox
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) { // Chrome, Safari and Opera
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { // IE/Edge
      element.msRequestFullscreen();
    }
  }

  function exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { // Firefox
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { // IE/Edge
      document.msExitFullscreen();
    }
  }

  function toggleFullscreen() {
    if (!isFullscreen.value) {
      enterFullscreen(document.documentElement); // Use the entire document for fullscreen
    } else {
      exitFullscreen();
    }
  }

  function onFullscreenChange() {
    isFullscreen.value = !!(document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement);
  }

  onMounted(() => {
    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('mozfullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
    document.addEventListener('msfullscreenchange', onFullscreenChange);
  });

  onUnmounted(() => {
    document.removeEventListener('fullscreenchange', onFullscreenChange);
    document.removeEventListener('mozfullscreenchange', onFullscreenChange);
    document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
    document.removeEventListener('msfullscreenchange', onFullscreenChange);
  });

  return {
    isFullscreen,
    toggleFullscreen,
  };
}
