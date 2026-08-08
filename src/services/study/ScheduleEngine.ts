import { ScheduleItem } from '../../types';

export interface GroupedSchedule {
  morning: ScheduleItem[];
  afternoon: ScheduleItem[];
  evening: ScheduleItem[];
}

export class ScheduleEngine {
  static getGroupedSchedule(schedule: ScheduleItem[]): GroupedSchedule {
    const sorted = [...schedule].sort((a, b) => a.startTime.localeCompare(b.startTime));
    return {
      morning: sorted.filter((item) => {
        const hour = parseInt(item.startTime.split(':')[0], 10);
        return hour < 12 || item.timeOfDay === 'MORNING';
      }),
      afternoon: sorted.filter((item) => {
        const hour = parseInt(item.startTime.split(':')[0], 10);
        return (hour >= 12 && hour < 17) || item.timeOfDay === 'AFTERNOON';
      }),
      evening: sorted.filter((item) => {
        const hour = parseInt(item.startTime.split(':')[0], 10);
        return hour >= 17 || item.timeOfDay === 'EVENING';
      }),
    };
  }

  static getNextScheduledActivity(schedule: ScheduleItem[]): ScheduleItem | null {
    const upcoming = schedule.filter((s) => s.status === 'UPCOMING' || s.status === 'CURRENT');
    if (upcoming.length === 0) return null;
    return upcoming.sort((a, b) => a.startTime.localeCompare(b.startTime))[0];
  }

  static isCurrentOrUpcoming(item: ScheduleItem): boolean {
    return item.status === 'CURRENT' || item.status === 'UPCOMING';
  }
}
