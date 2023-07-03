function handleOrientationChange() {
  const content = document.querySelector('#content');
  const rotateMessage = document.querySelector('#rotateMessage');

  if (window.matchMedia('(orientation: landscape)').matches) {
    content.style.display = 'block';
    rotateMessage.style.display = 'none';
  } else {
    content.style.display = 'none';
    rotateMessage.style.display = 'block';
  }
}

handleOrientationChange();

window.addEventListener('orientationchange', handleOrientationChange);
