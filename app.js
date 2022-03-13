const UserSessions = require('./UserSessions');


(async function() {
  require('dotenv').config()
  const us = new UserSessions();
  const userSessions = await us.splitUserSessionsByActivities();
  console.log("#### USER SESSIONS #####", userSessions);
  const result = await us.postSessions(userSessions);
  console.log("#### POST RESULT #####", result);
})();
