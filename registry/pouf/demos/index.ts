import type { Demo } from './types'
import { buttonDemos } from './button'
import { inputDemos } from './input'
import { stackDemos, rowDemos, gridDemos, shellDemos, sidebarDemos } from './layout'
import { headingDemos, textDemos } from './text'
import { cardDemos, rowCardDemos } from './surface'
import { statDemos, metricDemos } from './readout'
import { segmentedDemos } from './segmented'
import { numberInputDemos } from './number-input'
import { blobDemos, badgeDemos, dotDemos, figureDemos } from './media'
import { statusDemos, freshnessDemos, modeBannerDemos } from './status'
import { emptyDemos, skeletonDemos, errorNoteDemos } from './feedback'
import { toastDemos } from './toast'
import { toasterDemos } from './toaster'
import { alertBellDemos } from './alert-bell'
import { selectDemos, switchDemos, tooltipDemos, confirmDemos, dialogDemos, comboboxDemos } from './controls'
import { navLinkDemos } from './nav-link'
import { bottomNavDemos } from './bottom-nav'
import { iconDemos } from './icon'
import { errorBoundaryDemos } from './error-boundary'
import { checkboxDemos } from './checkbox'
import { radioGroupDemos } from './radio-group'
import { sliderDemos } from './slider'
import { tabsDemos, accordionDemos, collapsibleDemos } from './disclosure'
import { separatorDemos } from './separator'
import { dropdownMenuDemos } from './dropdown-menu'
import { hoverCardDemos } from './hover-card'
import { progressDemos } from './progress'
import { avatarDemos } from './avatar'
import { sheetDemos } from './sheet'
import { scrollAreaDemos } from './scroll-area'
import { aspectRatioDemos } from './aspect-ratio'
import { toggleGroupDemos } from './toggle-group'
import { tableDemos } from './table'
import { paginationDemos } from './pagination'
import { breadcrumbDemos } from './breadcrumb'
import { areaChartDemos, barChartDemos, lineChartDemos, pieChartDemos } from './charts'

export const allDemos: Record<string, Demo[]> = {
  stack: stackDemos,
  row: rowDemos,
  grid: gridDemos,
  shell: shellDemos,
  sidebar: sidebarDemos,
  heading: headingDemos,
  text: textDemos,
  card: cardDemos,
  'row-card': rowCardDemos,
  stat: statDemos,
  metric: metricDemos,
  segmented: segmentedDemos,
  button: buttonDemos,
  input: inputDemos,
  'number-input': numberInputDemos,
  blob: blobDemos,
  badge: badgeDemos,
  dot: dotDemos,
  figure: figureDemos,
  status: statusDemos,
  freshness: freshnessDemos,
  'mode-banner': modeBannerDemos,
  empty: emptyDemos,
  skeleton: skeletonDemos,
  'error-note': errorNoteDemos,
  toast: toastDemos,
  toaster: toasterDemos,
  'alert-bell': alertBellDemos,
  select: selectDemos,
  switch: switchDemos,
  tooltip: tooltipDemos,
  confirm: confirmDemos,
  dialog: dialogDemos,
  combobox: comboboxDemos,
  'nav-link': navLinkDemos,
  'bottom-nav': bottomNavDemos,
  icon: iconDemos,
  'error-boundary': errorBoundaryDemos,
  checkbox: checkboxDemos,
  'radio-group': radioGroupDemos,
  slider: sliderDemos,
  tabs: tabsDemos,
  accordion: accordionDemos,
  collapsible: collapsibleDemos,
  separator: separatorDemos,
  'dropdown-menu': dropdownMenuDemos,
  'hover-card': hoverCardDemos,
  progress: progressDemos,
  avatar: avatarDemos,
  sheet: sheetDemos,
  'scroll-area': scrollAreaDemos,
  'aspect-ratio': aspectRatioDemos,
  'toggle-group': toggleGroupDemos,
  table: tableDemos,
  pagination: paginationDemos,
  breadcrumb: breadcrumbDemos,
  'area-chart': areaChartDemos,
  'bar-chart': barChartDemos,
  'line-chart': lineChartDemos,
  'pie-chart': pieChartDemos,
}
