import { Workout, DailyTargets, ActivityState, SummaryMetric, FriendActivity, FitnessVideo } from './types';

export const INITIAL_DAILY_TARGETS: DailyTargets = {
  moveGoal: 600,       // Unit: kcal
  exerciseGoal: 30,    // Unit: minutes
  standGoal: 12,       // Unit: hours
};

export const INITIAL_ACTIVITY_STATE: ActivityState = {
  moveCurrent: 420,     // 70% of 600 kcal
  exerciseCurrent: 21,  // 70% of 30 mins
  standCurrent: 9,      // 75% of 12 hours
};

export const INITIAL_WORKOUTS: Workout[] = [
  {
    id: 'w-1',
    type: 'Running',
    date: 'Today, 8:15 AM',
    durationMinutes: 28,
    caloriesBurned: 310,
    heartRateAverage: 154,
    distanceKm: 4.8,
    notes: 'Morning jog through the neighborhood. Felt smooth throughout.',
  },
  {
    id: 'w-2',
    type: 'Strength',
    date: 'Yesterday, 5:30 PM',
    durationMinutes: 45,
    caloriesBurned: 240,
    heartRateAverage: 121,
    notes: 'Upper body hypertrophy focus. Bench, cable rows, and overhead press.',
  },
  {
    id: 'w-3',
    type: 'Yoga',
    date: 'Jun 15, 7:00 AM',
    durationMinutes: 20,
    caloriesBurned: 85,
    heartRateAverage: 98,
    notes: 'Sunrise flexibility and flow focusing on hamstring and spine relief.',
  },
  {
    id: 'w-4',
    type: 'Cycling',
    date: 'Jun 13, 6:00 PM',
    durationMinutes: 35,
    caloriesBurned: 380,
    heartRateAverage: 142,
    distanceKm: 12.5,
    notes: 'Indoor high-intensity intervals class on the stationary trainer.',
  },
  {
    id: 'w-5',
    type: 'Swimming',
    date: 'Jun 11, 2:45 PM',
    durationMinutes: 30,
    caloriesBurned: 290,
    heartRateAverage: 135,
    distanceKm: 1.2,
    notes: 'Laps at local outdoor pool. Stretched freestyle paces.',
  },
];

export const INITIAL_METRICS = (activity: ActivityState): SummaryMetric[] => [
  {
    id: 'steps',
    label: 'Steps',
    value: '8,432',
    unit: 'steps',
    changePercent: 12,
    trend: 'up',
    iconName: 'Footprints',
    color: '#00FF3C',
    sparkline: [4200, 5100, 6800, 7200, 6100, 8000, 8432],
  },
  {
    id: 'distance',
    label: 'Distance',
    value: '5.2',
    unit: 'km',
    changePercent: 8,
    trend: 'up',
    iconName: 'Navigation',
    color: '#00F0FF',
    sparkline: [2.5, 3.1, 4.2, 3.8, 3.0, 4.8, 5.2],
  },
  {
    id: 'heart-rate',
    label: 'Heart Rate',
    value: '72',
    unit: 'avg bpm',
    changePercent: -3,
    trend: 'stable',
    iconName: 'Heart',
    color: '#ff1256',
    sparkline: [62, 110, 142, 125, 74, 68, 72],
  },
  {
    id: 'calories',
    label: 'Active Energy',
    value: `${activity.moveCurrent}`,
    unit: 'kcal',
    changePercent: 15,
    trend: 'up',
    iconName: 'Zap',
    color: '#ff1256',
    sparkline: [220, 310, 150, 410, 330, 420, activity.moveCurrent],
  },
  {
    id: 'sleep',
    label: 'Sleep',
    value: '7h 12m',
    unit: 'last night',
    changePercent: 5,
    trend: 'up',
    iconName: 'Moon',
    color: '#a855f7',
    sparkline: [6.2, 7.1, 6.8, 7.5, 5.8, 8.0, 7.2],
  },
  {
    id: 'mindfulness',
    label: 'Mindful Mins',
    value: '15',
    unit: 'mins',
    changePercent: 0,
    trend: 'stable',
    iconName: 'Flower',
    color: '#22c55e',
    sparkline: [10, 10, 15, 0, 15, 15, 15],
  }
];

export const INITIAL_FRIENDS: FriendActivity[] = [
  {
    id: 'f-1',
    name: 'Sarah Jenkins',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    movePercent: 125, // completed 125% of move goal
    exercisePercent: 150,
    standPercent: 100,
    lastActive: '10m ago',
    recentWorkout: 'HIIT Workout, 30m',
  },
  {
    id: 'f-2',
    name: 'Marcus Chen',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    movePercent: 95,
    exercisePercent: 80,
    standPercent: 75,
    lastActive: '1h ago',
    recentWorkout: 'Cycling Workout, 45m',
  },
  {
    id: 'f-3',
    name: 'Elena Rostova',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    movePercent: 190,
    exercisePercent: 210,
    standPercent: 110,
    lastActive: 'Just now',
    recentWorkout: 'Outdoor Run, 55m',
  },
  {
    id: 'f-4',
    name: 'David Kim',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    movePercent: 45,
    exercisePercent: 30,
    standPercent: 50,
    lastActive: '4h ago',
    recentWorkout: 'Yoga Flow, 15m',
  },
];

export const INITIAL_VIDEOS: FitnessVideo[] = [
  {
    id: 'v-1',
    title: '30-Min Extreme Bodyweight HIIT',
    trainer: 'Bakari Williams',
    duration: 30,
    category: 'HIIT',
    difficulty: 'Advanced',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'v-2',
    title: '20-Min Energetic Vinyasa Flow',
    trainer: 'Dustin Brown',
    duration: 20,
    category: 'Yoga',
    difficulty: 'Intermediate',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'v-3',
    title: '45-Min Pure Hills Stationary Cycling',
    trainer: 'Kym Perfetto',
    duration: 45,
    category: 'Cycling',
    difficulty: 'Advanced',
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'v-4',
    title: '15-Min Core & Abs Burner',
    trainer: 'Kyle Ardill',
    duration: 15,
    category: 'Strength',
    difficulty: 'Beginner',
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'v-5',
    title: '25-Min Dumbbell Full Body Strength',
    trainer: 'Betina Gozo',
    duration: 25,
    category: 'Strength',
    difficulty: 'Intermediate',
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'v-6',
    title: '10-Min Guided Sunset Mindfulness',
    trainer: 'Jessica Skye',
    duration: 10,
    category: 'Mindfulness',
    difficulty: 'Beginner',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600',
  },
];
