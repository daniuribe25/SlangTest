const activitiesResponse = [
  {
    "id": 1,
    "user_id": "daniel",
    "first_seen_at": "2021-09-13T02:38:16.117-04:00",
    "answered_at": "2021-09-13T02:38:34.117-04:00",
  },
  {
    "id": 2,
    "user_id": "daniel",
    "first_seen_at": "2021-09-13T02:41:51.117-04:00",
    "answered_at": "2021-09-13T02:42:07.117-04:00",
  },
  {
    "id": 3,
    "user_id": "daniel",
    "first_seen_at": "2021-09-13T02:44:25.117-04:00",
    "answered_at": "2021-09-13T02:45:36.117-04:00",
  },
  {
    "id": 4,
    "user_id": "daniel",
    "first_seen_at": "2021-09-13T02:50:56.117-04:00",
    "answered_at": "2021-09-13T02:51:34.117-04:00",
  },
  {
    "id": 5,
    "user_id": "daniel",
    "first_seen_at": "2021-09-13T02:52:51.117-04:00",
    "answered_at": "2021-09-13T02:53:07.117-04:00",
  },
  {
    "id": 6,
    "user_id": "daniel",
    "first_seen_at": "2021-09-13T02:59:25.117-04:00",
    "answered_at": "2021-09-13T02:59:56.117-04:00",
  },
  {
    "id": 7,
    "user_id": "uribe",
    "first_seen_at": "2021-09-13T02:52:51.117-04:00",
    "answered_at": "2021-09-13T02:53:07.117-04:00",
  },
  {
    "id": 8,
    "user_id": "uribe",
    "first_seen_at": "2021-09-13T03:55:25.117-04:00",
    "answered_at": "2021-09-13T03:58:36.117-04:00",
  },
];

const groupBy = (collection, property) =>{
  let val, result = {};
  for (let i = 0; i < collection.length; i++) {
    val = collection[i][property];
    if (val in result) {
      result[val].push(collection[i]);
    } else {
      result[val] = [collection[i]];
    }
  }
  return result;
}


const timeDifference = (t1, t2, timeMultiplier=1) => (
  (new Date(t1).getTime() - new Date(t2).getTime()) / (1000 * timeMultiplier)
);

module.exports = {
  groupedActivities: groupBy(activitiesResponse.sort((a, b) => (new Date(a.first_seen_at)) > (new Date(b.first_seen_at)) ? 1 : -1), "user_id"),
  groupBy,
  timeDifference,
}