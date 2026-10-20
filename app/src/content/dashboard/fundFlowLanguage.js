export const flowLabel = value => value < 0 ? '净流出' : value > 0 ? '净流入' : '净流量';
const amount = value => Math.abs(value).toLocaleString('zh-CN', {maximumFractionDigits:1});
const reading = value => `${flowLabel(value)}${amount(value)}亿美元`;

// Values are in 亿美元, after conversion from the reviewed source unit.
export function fundFlowComparison(current, previous) {
  if (!Number.isFinite(current)) return '本期未提供数据。';
  if (!Number.isFinite(previous)) return `本周${reading(current)}。`;
  if (current === previous) return `本周${reading(current)}，与上期持平。`;
  if (current === 0) return `上期${reading(previous)}，本周净流量为0。`;
  if (previous === 0) return `上期净流量为0，本周${reading(current)}。`;
  if (Math.sign(current) !== Math.sign(previous)) return `上期${reading(previous)}，本周转为${reading(current)}。`;
  const change = Math.abs(current) > Math.abs(previous) ? '增加' : '减少';
  return `本周${reading(current)}，${flowLabel(current)}较上期${change}${amount(Math.abs(current)-Math.abs(previous))}亿美元。`;
}
