/**
 * 抽离createStream的公共处理函数
 */
async function createLocalStream(constraints, container) {
  localStream = TRTC.createStream(constraints);
  try {
    await localStream.initialize();
  } catch (error) {
    handleGetUserMediaError(error);
  }
  container && localStream.play(container);
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

/**
 * 判断是否展示弹窗
 */
function deviceDialogInit() {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then(() => {
      if (hasCameraDevice) hasCameraConnect = true;
      if (hasMicDevice) hasMicConnect = true;
      // 更新首页popover的option list
      getDevicesList();
      // 展示连接结果
      showDeviceStatus();
    })
    .catch((err) => {
      console.log("getUserMedia err", err.name, err.message);
    });
}
deviceDialogInit();
start();
