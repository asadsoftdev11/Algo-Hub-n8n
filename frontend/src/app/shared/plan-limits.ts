import { Plan } from '../services/auth.service';

export interface PlanLimit {
  videos: number;
  scheduled: number;
  accounts: number;
}

export const PLAN_LIMITS: Record<Plan, PlanLimit> = {
  trial: { videos: 0, scheduled: 0, accounts: 0 },
  starter: { videos: 10, scheduled: 5, accounts: 1 },
  creator: { videos: 40, scheduled: 20, accounts: 3 },
  business: { videos: 150, scheduled: 100, accounts: 10 },
};