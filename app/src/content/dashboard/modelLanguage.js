export const direction = value => value == null ? '未披露' : value > 0 ? '偏多' : value < 0 ? '偏空' : '中性';
export function modelSummary(row) {
  const values = ['short','medium','long'].map(term => row[`${term}_current`]);
  if (values.some(value => value == null)) return '部分周期未披露，无法完整比较';
  if (values.every(value => value < 0)) return '三个周期都偏空';
  if (values.every(value => value > 0)) return '三个周期都偏多';
  if (values.every(value => value === 0)) return '三个周期均为中性';
  if (values.some(value => value > 0) && values.some(value => value < 0)) return '不同周期方向不一致';
  return values.some(value => value > 0) ? '部分周期偏多，其余中性' : '部分周期偏空，其余中性';
}
export function changeMeaning(before, after) {
  if (before == null || after == null) return '报告未披露';
  if (after === before) return '方向与强度不变';
  if (after === 0) return '回到中性';
  if (before === 0) return `从中性转为${direction(after)}`;
  if (before < 0 && after > 0) return '从偏空转为偏多';
  if (before > 0 && after < 0) return '从偏多转为偏空';
  return `${direction(after)}${Math.abs(after) < Math.abs(before) ? '减弱' : after < 0 ? '加深' : '增强'}`;
}
export function distanceToRange(reference, low, high) {
  if (!Number.isFinite(reference) || reference <= 0) return '报告参考价缺失，暂不计算距离';
  if (low == null || high == null) return '报告没有给出这个方向的价格区间';
  if (reference >= low && reference <= high) return '参考价已在这个历史区间内';
  const target = reference < low ? low : high;
  return `参考价还需${reference < low ? '上涨' : '下跌'} ${Math.abs((target/reference-1)*100).toFixed(2)}% 才到区间${reference < low ? '下沿' : '上沿'}`;
}

export const instrumentName = row => row.code === 'GC' ? '黄金期货' : row.name;

export function sentimentReading(value) {
  if (!Number.isFinite(value)) return {state:'neutral',label:'未披露',gauge:'未披露',summary:'本期情绪读数未披露'};
  if (value > 8) return {state:'hot',label:'情绪偏热',gauge:'偏乐观',summary:'乐观情绪处于高位'};
  if (value < 2) return {state:'cold',label:'情绪偏冷',gauge:'偏悲观',summary:'悲观情绪处于高位'};
  return {state:'neutral',label:'情绪中性',gauge:'中性区间',summary:'未进入极端情绪区间'};
}
