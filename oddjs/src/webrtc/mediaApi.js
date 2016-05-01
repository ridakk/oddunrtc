export default class MediaApi {

  // TODO: add method to check input output device availability

  static deviceList() {
    return new Promise((resolve, reject) => {
      navigator.mediaDevices.enumerateDevices()
        .then((deviceInfos) => {
          resolve(deviceInfos);
        })
        .catch((error) => {
          // TODO: define and return error object
          reject(error);
        });
    });
  }

  static requestPermission(constraints = {
    audio: true,
    video: true
  }) {
    return new Promise((resolve, reject) => {
      navigator.getUserMedia(constraints, (stream) => {
        resolve(stream);
      }, (error) => {
        // TODO: define and return error object
        reject(error);
      });
    });
  }

}
