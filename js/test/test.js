// setup logging stuffs
TRTC.Logger.setLogLevel(TRTC.Logger.LogLevel.DEBUG);
TRTC.Logger.enableUploadLog();

// 用于记录检测结果，生成检测报告
// has---Device 是否检测到当前系统有---设备
// has---Connect 是否检测到当前浏览器有---连接
let hasCameraDevice = false,
  hasMicDevice = false,
  hasVoiceDevice = false,
  hasCameraConnect,
  hasVoiceConnect,
  hasMicConnect,
  hasNetworkConnect;
let localStream = null;
let completedTestingPageIdList = [];
let curTestingPageId = "";

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

  localStream.resume();
}

// localStream.on('error', error => {
//   const errorCode = error.getCode();
//   if (errorCode === 0x4043) {
//     // PLAY_NOT_ALLOWED,引导用户手势操作并调用 stream.resume 恢复音视频播放
//     localStream.resume()
//   }
// })

/**
 * 更新首页popover的option list
 */
function getDevicesList() {
  // populate camera options
  TRTC.getCameras().then((devices) => {
    console.log(devices);
  });
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
      // // 展示连接结果
      // showDeviceStatus();
    })
    .catch((err) => {
      console.log("getUserMedia err", err.name, err.message);
    });
}
deviceDialogInit();
start();
