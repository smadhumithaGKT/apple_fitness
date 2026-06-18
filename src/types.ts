export type WorkoutType = 'Running' | 'Cycling' | 'HIIT' | 'Yoga' | 'Strength' | 'Swimming' | 'Walking';

export interface Workout {
  id: string;
  type: WorkoutType;
  date: string;
  durationMinutes: number;
  caloriesBurned: number;
  heartRateAverage: number;
  distanceKm?: number;
  notes?: string;
}

export interface DailyTargets {
  moveGoal: number; // in kcal
  exerciseGoal: number; // in minutes
  standGoal: number; // in hours
}

export interface ActivityState {
  moveCurrent: number;
  exerciseCurrent: number;
  standCurrent: number;
}

export interface SummaryMetric {
  id: string;
  label: string;
  value: string | number;
  unit: string;
  changePercent?: number; // compared to normal
  trend: 'up' | 'down' | 'stable';
  iconName: string;
  color: string;
  sparkline: number[];
}

export interface FriendActivity {
  id: string;
  name: string;
  avatarUrl: string;
  movePercent: number;
  exercisePercent: number;
  standPercent: number;
  lastActive: string;
  recentWorkout?: string;
}

export interface FitnessVideo {
  id: string;
  title: string;
  trainer: string;
  duration: number; // in minutes
  category: WorkoutType | 'Core' | 'Mindfulness';
  imageUrl: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}
