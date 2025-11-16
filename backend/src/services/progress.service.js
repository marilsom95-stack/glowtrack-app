const streakMilestones = [3, 7, 14, 30];

export const updateStreak = (progress) => {
  const dates = progress.checkIns
    .map((entry) => new Date(entry.date).toDateString())
    .filter((value, index, array) => array.indexOf(value) === index)
    .sort((a, b) => new Date(b) - new Date(a));
  let streak = 0;
  let cursor = new Date();
  for (const date of dates) {
    if (new Date(date).toDateString() === cursor.toDateString()) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
};

export const calculateAchievements = (progress) => {
  const achievements = [];
  streakMilestones.forEach((milestone) => {
    if (progress.streak >= milestone) {
      achievements.push(`${milestone} dias seguidos ✨`);
    }
  });
  if (progress.checkIns.length >= 10) {
    achievements.push('10 check-ins concluídos 💪');
  }
  return achievements;
};
