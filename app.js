const UserSessions = require('./UserSessions');

require('dotenv').config();

(async function() {
  const us = new UserSessions();
  const userSessions = await us.splitUserSessionsByActivities();
  console.log("#### USER SESSIONS #####", userSessions);
  await us.postSessions(userSessions);
})();
