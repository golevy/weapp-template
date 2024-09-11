const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();
const COLLECTION_NAME_USERS = 'users';

exports.main = async (props, context) => {
  const openid = cloud.getWXContext().OPENID;
  const { updatedUserInfo } = props;

  try {
    const result = await db
      .collection(COLLECTION_NAME_USERS)
      .where({
        _openid: openid,
      })
      .update({
        data: updatedUserInfo,
      });

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};
