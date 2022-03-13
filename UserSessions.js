const { timeDifference, groupBy } = require('./helpers');
const fetch = require('node-fetch');

class UserSessions {
  assignUserSessions = (session, uSessions, id) => {
    const sessionCopy = JSON.parse(JSON.stringify(session));
    let sessionsCopy = JSON.parse(JSON.stringify(uSessions));
    sessionsCopy[id]
      ? sessionsCopy[id].push(sessionCopy)
      : sessionsCopy[id] = [sessionCopy];
    return sessionsCopy;
  }

  setNewUserSession = (activity) => ({
    activity_ids: [activity.id],
    duration: timeDifference(activity.answered_at, activity.first_seen_at),
    started_at: activity.first_seen_at,
    ended_at: activity.answered_at,
  });

  getActivities = async () => {
    try {
      const stream = await fetch(`${process.env.API_BASE_URL}/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${process.env.API_CREDENTIALS}`
        }
      });
      const result = await stream.json();
      return result.activities;
    } catch (err) {
      return [];
    }
  }

  postSessions = async (userSessions) => {
    try {
      const stream = await fetch(`${process.env.API_BASE_URL}/sessions`, {
        method: 'POST',
        body: JSON.stringify({ "user_sessions": userSessions }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${process.env.API_CREDENTIALS}`
        }
      });
      console.log(stream.status);
    } catch (err) {
      console.error(err);
    }
  }

  splitUserSessionsByActivities = async () => {
    let userSessions = {};
    let userSession = null;
    let lastUserId = null;

    const activities = await this.getActivities();
    const groupedActivities = groupBy(activities.sort((a, b) => (new Date(a.first_seen_at)) > (new Date(b.first_seen_at)) ? 1 : -1), "user_id")

    for (const key in groupedActivities) {
      const perUserData = groupedActivities[key];

      perUserData.forEach((activity, i) => {
        const timeBetweenActivities = i > 0 ? timeDifference(activity.first_seen_at, perUserData[i - 1].answered_at, 60) : 0;

        if (timeBetweenActivities > 5 || (i === 0 && userSession)) {
          userSessions = this.assignUserSessions(userSession, userSessions, lastUserId);
          userSession = this.setNewUserSession(activity);
        } else {
          if (!userSession) {
            userSession = this.setNewUserSession(activity)
          } else {
            userSession.duration += timeDifference(activity.answered_at, userSession.ended_at);
            userSession.ended_at = activity.answered_at;
            userSession.activity_ids.push(activity.id);
          }
        }
        lastUserId = activity.user_id;
      });
    }

    return this.assignUserSessions(userSession, userSessions, lastUserId);
  }
}

module.exports = UserSessions;