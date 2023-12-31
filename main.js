async function main() {
  const buttonStart = document.querySelector('#buttonStart');
  const buttonStop = document.querySelector('#buttonStop');
  const videoLive = document.querySelector('#videoLive');
  const videoRecorded = document.querySelector('#videoRecorded');
  const emailButton = document.querySelector('#emailButton');
  const shareButton = document.createElement('button');

  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });

  videoLive.srcObject = stream;

  if (!MediaRecorder.isTypeSupported('video/webm')) {
    console.warn('video/webm is not supported');
  }

  const chunks = [];
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
    chunks.push(event.data);
    videoRecorded.src = URL.createObjectURL(event.data);
  });

  mediaRecorder.addEventListener('stop', async () => {
    const recordedBlob = new Blob(chunks, { type: 'video/webm' });

    try {
      // Upload video to Google Drive
      const response = await uploadToDrive(recordedBlob, 'recorded_video.webm');

      // Get the public link to the uploaded video
      const videoURL = `https://drive.google.com/uc?export=download&id=${response.id}`;
      console.log('Video URL:', videoURL);

      // Create a share link
      if (navigator.share) {
        navigator.share({
          title: 'Shared Video',
          text: 'Check out this video',
          url: videoURL,
        })
          .then(() => {
            console.log('Video shared successfully');
          })
          .catch(error => {
            console.error('Error sharing video:', error);
          });
      } else {
        console.warn('Web Share API not supported');
      }
    } catch (error) {
      console.error('Error uploading video:', error);
    }
  });

  shareButton.textContent = 'Share Video';
  document.body.appendChild(shareButton);

  async function uploadToDrive(file, fileName) {
    const apiKey = '';
    const folderId = '';

    const metadata = {
      name: fileName,
      parents: [folderId],
    };

    const formData = new FormData();
    formData.append(
      'metadata',
      new Blob([JSON.stringify(metadata)], { type: 'application/json' })
    );
    formData.append('file', file);

    const response = await fetch(
      `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&key=${apiKey}`,
      {
        method: 'POST',
        body: formData,
      }
    );

    return response.json();
  }
}

main();

