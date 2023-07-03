async function main() {
  const buttonStart = document.querySelector('#buttonStart');
  const buttonStop = document.querySelector('#buttonStop');
  const videoLive = document.querySelector('#videoLive');
  const videoRecorded = document.querySelector('#videoRecorded');
  const emailButton = document.createElement('button');

  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });

  videoLive.srcObject = stream;

  if (!MediaRecorder.isTypeSupported('video/webm')) {
    console.warn('video/webm is not supported');
  }

  const mediaRecorder = new MediaRecorder(stream, {
    mimeType: 'video/webm',
  });

  buttonStart.addEventListener('click', () => {
    mediaRecorder.start();
    buttonStart.setAttribute('disabled', '');
    buttonStop.removeAttribute('disabled');
  });

  buttonStop.addEventListener('click', () => {
    mediaRecorder.stop();
    buttonStart.removeAttribute('disabled');
    buttonStop.setAttribute('disabled', '');
  });

  mediaRecorder.addEventListener('dataavailable', event => {
    videoRecorded.src = URL.createObjectURL(event.data);
  });

  emailButton.textContent = 'Send Email';
  emailButton.addEventListener('click', () => {
    const email = 'Ryan.wells@Dstny.com';
    const subject = 'Video submission';
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    window.open(mailtoLink);
  });

  document.body.appendChild(emailButton);
}

main();
