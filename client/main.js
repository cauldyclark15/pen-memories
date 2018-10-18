const uploadForm = document.getElementById('uploadForm');
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const firebasemsg = document.getElementById('firebasemsg');

uploadForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const formData = new FormData();
  //fileInput.files - Nodelist

  for (var i = 0; i < fileInput.files.length; i++) {
    formData.append('inputFile', fileInput.files[i]);

    if (fileInput.files.length != 0) {
      messageTest = '';
      firebasemsg.innerHTML = `<br><div>Loading...</div>`;
      firebaseUpload(fileInput.files[i]);
    }
  }

  fetch('/upload', {
    method: 'POST',
    body: formData,
  })
    .then(res => {
      return res.json();
    })
    .then(json => {
      console.log(json);
      alert(json.message);
      fileInput.value = '';
      updateImageDisplay();
    })
    .catch(error => console.log(error.message));
});

fileInput.addEventListener('change', updateImageDisplay);

function updateImageDisplay() {
  while (preview.firstChild) {
    preview.removeChild(preview.firstChild);
  }

  var curFiles = fileInput.files;
  if (curFiles.length === 0) {
    var para = document.createElement('p');
    para.textContent = 'No files currently selected for upload';
    preview.appendChild(para);
  } else {
    var list = document.createElement('ol');
    preview.appendChild(list);
    for (var i = 0; i < curFiles.length; i++) {
      var listItem = document.createElement('li');
      var para = document.createElement('p');
      if (validFileType(curFiles[i])) {
        para.textContent =
          'File name ' +
          curFiles[i].name +
          ', file size ' +
          returnFileSize(curFiles[i].size) +
          '.';
        var image = document.createElement('img');
        image.src = window.URL.createObjectURL(curFiles[i]);
        listItem.appendChild(para);
      } else {
        para.textContent =
          'File name ' +
          curFiles[i].name +
          ': Not a valid file type. Update your selection.';
        listItem.appendChild(para);
      }

      list.appendChild(listItem);
    }
  }
}

var fileTypes = ['image/jpeg', 'image/pjpeg', 'image/png'];

function validFileType(file) {
  for (var i = 0; i < fileTypes.length; i++) {
    if (file.type === fileTypes[i]) {
      return true;
    }
  }

  return false;
}

function returnFileSize(number) {
  if (number < 1024) {
    return number + 'bytes';
  } else if (number >= 1024 && number < 1048576) {
    return (number / 1024).toFixed(1) + 'KB';
  } else if (number >= 1048576) {
    return (number / 1048576).toFixed(1) + 'MB';
  }
}

//==================================
//      FIREBASE
//==================================

const ref = firebase.storage().ref('images');
var messageTest = '';

function firebaseUpload(files) {
  const filename = +new Date() + '-' + files.name;
  const metadata = { contentType: files.type };

  console.log(filename, metadata);

  const task = ref.child(filename).put(files, metadata);

  task.then(snapshot => snapshot.ref.getDownloadURL()).then(url => {
    console.log(`FirebaseURL: ${url}`);
    messageTest += `<br><a href='${url}' target='_blank'>Check the Firebase Image</a>`;
    firebasemsg.innerHTML = messageTest;
  });
}
