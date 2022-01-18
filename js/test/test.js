TRTC.Logger.setLogLevel(TRTC.Logger.LogLevel.DEBUG);

let localStream = null;

/**
 * 抽离createStream的公共处理函数
 */
async function createLocalStream(constraints, container) {
  localStream = TRTC.createStream(constraints);
  try {
    await localStream.initialize();
  } catch (error) {
    // handleGetUserMediaError(error);
  }
  container && localStream.play(container, { muted: true });
}

async function start() {
  let cameraDevices = await TRTC.getCameras();
  console.log(cameraDevices);

  var device = cameraDevices[0];
  // 创建本地视频流
  await createLocalStream(
    {
      audio: false,
      video: true,
      cameraId: device.deviceId,
    },
    "camera-video"
  );
}

function getDevicesList() {
  TRTC.getCameras().then((devices) => {
    console.log(devices);
  });
}

function deviceDialogInit(e) {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then(() => {
      getDevicesList();
    })
    .catch((err) => {
      
      const file = document.getElementById("fileElem");

      if (file) {
          e.preventDefault(); // prevent navigation to "#"
          file.click();
      }

      console.log("getUserMedia err", err.name, err.message);
    });
}

const open_camera = document.getElementById("open_camera");

open_camera.onclick = function (e) {
  deviceDialogInit(e);
  start();
};

const get_frame = document.getElementById("get_frame");
get_frame.onclick = function () {
  const frame = localStream.getVideoFrame();
  if (frame) {
    $("#current_frame").attr("src", frame);
  }
};

function blobToDataURL(blob, cb) {
  let reader = new FileReader();
  reader.onload = function (evt) {
      var base64 = evt.target.result
      cb(base64)
  };
  reader.readAsDataURL(blob);
}

function changeImg() {
  var img = file.files[0]
  if (img) {
      var url = URL.createObjectURL(img);
      var base64 = blobToDataURL(img, function (base64Url) {
          console.log(base64Url)
      })
  }
}