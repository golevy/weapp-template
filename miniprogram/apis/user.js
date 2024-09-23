import { cloudCall, cloudFunctionCall } from '../lib/utils';

const CLOUD_FUNCTION_COLLECTION = 'user';
const COLLECTION_NAME = 'users';
const db = wx.cloud.database().collection(COLLECTION_NAME);
const app = getApp();

export function checkUserLogin() {
  return new Promise((resolve, reject) => {
    if (app.globalData.userInfo) {
      resolve(true);
    } else {
      fetchUserInfo()
        .then((userInfo) => {
          if (userInfo) {
            app.globalData.userInfo = userInfo;
            resolve(true);
          } else {
            resolve(false);
            wx.reLaunch({
              url: '/pages/onboarding/index',
            });
          }
        })
        .catch((err) => {
          reject(err);
        });
    }
  });
}

export function fetchUserInfo() {
  const call = cloudCall(db.get(), 'fetchUserInfo');
  return new Promise((resolve, reject) => {
    call
      .then((res) => {
        if (res && res.data.length > 0) {
          resolve(res.data[0]);
        } else {
          resolve(null);
        }
      })
      .catch((err) => {
        reject(`fetchUserInfo failure: ${err}`);
      });
  });
}

export function signup(user) {
  return new Promise((resolve, reject) => {
    fetchUserInfo()
      .then((userInfo) => {
        if (userInfo) {
          resolve(userInfo._id);
        } else {
          db.add({
            data: {
              ...user,
              createdAt: new Date().getTime(),
            },
          }).then((res) => {
            resolve(res._id);
          });
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function getUserProfileAndSignup() {
  return new Promise((resolve, reject) => {
    wx.getUserProfile({
      desc: '用于完善用户信息',
    })
      .then((res) => {
        const registerUserInfo = {
          ...res.userInfo,
        };
        if (registerUserInfo) {
          signup(registerUserInfo)
            .then((id) => {
              fetchUserInfo().then((newUserInfo) => {
                app.globalData.userInfo = newUserInfo;
                resolve(newUserInfo);
              });
            })
            .catch((err) => {
              reject(err);
            });
        } else {
          reject('Failed to get user profile.');
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function updateUserInfo(updatedUserInfo) {
  return cloudFunctionCall(CLOUD_FUNCTION_COLLECTION, 'updateUserInfo', {
    updatedUserInfo,
  });
}

export function deleteAccount() {
  return cloudFunctionCall(CLOUD_FUNCTION_COLLECTION, 'deleteAccount', {});
}
