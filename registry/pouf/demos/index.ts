import type { Demo } from './types'
import { coreDemos } from './core-index'
import { areaChartDemos, barChartDemos, lineChartDemos, pieChartDemos } from './charts'

export { coreDemos }

export const chartDemos: Record<string, Demo[]> = {
  'area-chart': areaChartDemos,
  'bar-chart': barChartDemos,
  'line-chart': lineChartDemos,
  'pie-chart': pieChartDemos,
}

export const allDemos: Record<string, Demo[]> = {
  ...coreDemos,
  ...chartDemos,
}
