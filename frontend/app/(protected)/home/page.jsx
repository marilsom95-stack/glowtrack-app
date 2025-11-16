'use client';

import DailyMotivation from '../../../components/sections/DailyMotivation.jsx';
import HomeQuickActions from '../../../components/sections/HomeQuickActions.jsx';
import RoutineChecklist from '../../../components/sections/RoutineChecklist.jsx';
import WaterTracker from '../../../components/sections/WaterTracker.jsx';

export default function HomePage() {
  return (
    <div className="space-y-6">
      <DailyMotivation />
      <HomeQuickActions />
      <div className="grid gap-6 lg:grid-cols-2">
        <WaterTracker />
        <RoutineChecklist />
      </div>
    </div>
  );
}
