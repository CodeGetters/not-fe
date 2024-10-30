function uploadFile() {
  const input = document.getElementById("fileInput");
  const file = input.files[0];
  if (!file) {
    alert("Please select a file!");
    return;
  }

  const chunkSize = 1 * 1024 * 1024; // 1MB
  const totalChunks = Math.ceil(file.size / chunkSize);
  const maxConcurrentUploads = 3; // 最大并行上传数

  let currentChunk = 0;
  let activeUploads = 0;

  function uploadChunk(chunkNumber) {
    return new Promise((resolve, reject) => {
      const start = chunkNumber * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);

      const formData = new FormData();
      formData.append("fileChunk", chunk);
      formData.append("chunkNumber", chunkNumber);
      formData.append("totalChunks", totalChunks);
      formData.append("fileName", file.name);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "your-server-endpoint", true);

      xhr.onload = function () {
        if (xhr.status === 200) {
          resolve();
        } else {
          reject(`Upload failed for chunk ${chunkNumber}`);
        }
      };

      xhr.onerror = function () {
        reject(`Upload failed for chunk ${chunkNumber}`);
      };

      xhr.send(formData);
    });
  }

  function manageUploads() {
    const promises = [];

    while (activeUploads < maxConcurrentUploads && currentChunk < totalChunks) {
      promises.push(
        uploadChunk(currentChunk)
          .then(() => {
            activeUploads--;
            manageUploads();
          })
          .catch((error) => {
            alert(error);
            activeUploads--;
            manageUploads();
          }),
      );
      activeUploads++;
      currentChunk++;
    }

    if (currentChunk >= totalChunks && activeUploads === 0) {
      Promise.all(promises).then(() => {
        alert("Upload complete!");
      });
    }
  }

  manageUploads();
}
