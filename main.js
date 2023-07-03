async function main() {
  const buttonStart = document.querySelector('#buttonStart');
  const buttonStop = document.querySelector('#buttonStop');
  const videoLive = document.querySelector('#videoLive');
  const videoRecorded = document.querySelector('#videoRecorded');

  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });

  videoLive.srcObject = stream;

  if (!MediaRecorder.isTypeSupported('video/webm')) {
    console.warn('video/webm is not supported');
  }

  const chunks = []; // Added variable to store recorded video chunks

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
    chunks.push(event.data); // Store each recorded chunk in the array
    videoRecorded.src = URL.createObjectURL(event.data);
  });

  mediaRecorder.addEventListener('stop', () => {
    const recordedBlob = new Blob(chunks, { type: 'video/webm' });
    const videoURL = URL.createObjectURL(recordedBlob);

    // Create a download link
    const downloadLink = document.createElement('a');
    downloadLink.href = videoURL;
    downloadLink.download = 'recorded_video.webm';
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();

    // Clean up resources
    URL.revokeObjectURL(videoURL);
    document.body.removeChild(downloadLink);
  });
}

main();
