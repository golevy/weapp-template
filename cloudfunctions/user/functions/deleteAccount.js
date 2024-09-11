const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});
const db = cloud.database();
const _ = db.command;
const COLLECTION_NAME_USERS = 'users';

exports.main = async (props, context) => {
  const openid = cloud.getWXContext().OPENID;

  try {
    const deleteUserResult = await db
      .collection(COLLECTION_NAME_USERS)
      .where({
        _openid: openid,
      })
      .remove();

    return {
      success: true,
      data: {
        deleteUserResult,
      },
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};
