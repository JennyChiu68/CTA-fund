import React,{useState,useRef} from 'react';
import {useDataApp,DataComponent,Dropdown,SegmentedControl} from '../../data-app-public.jsx';
import {direction,modelSummary,changeMeaning,instrumentName} from './modelLanguage.js';
import {ReportPeriod} from './ReportPeriod.jsx';
const terms=[['short','短期'],['medium','中期'],['long','长期']];
const sign=v=>`${v>0?'+':''}${v}`;
const signalValue=v=>v==null?'未披露':`${sign(v)}%`;
const price=v=>v==null?'未披露':v.toLocaleString('en-US',{maximumFractionDigits:4});
const tone=v=>v>0?'inflow':v<0?'outflow':'';
const paths={bear:'下跌路径',median:'中间路径',bull:'上涨路径'};
export function CtaModel(){
 const {queries}=useDataApp(),allRows=queries.cta?.rows||[];
 const reportDates=[...new Set(allRows.map(r=>r.date))].sort().reverse();
 const [reportDate,setReportDate]=useState(reportDates[0]||'');
 const rows=allRows.filter(r=>r.date===reportDate);
 const [selected,setSelected]=useState('GC'),[category,setCategory]=useState('全部'),[scenario,setScenario]=useState('median');
 const detailRef=useRef(null),row=rows.find(r=>r.code===selected)||rows[0],visible=rows.filter(r=>category==='全部'||r.category===category);
 const selectCategory=value=>{setCategory(value);if(value!=='全部'&&row?.category!==value){const first=rows.find(r=>r.category===value);if(first)setSelected(first.code)}};
 if(!row)return <p>CTA 数据暂不可用。</p>;
 return <div className="cta-model cta-readable">
  <ReportPeriod reportType="CTA" dates={reportDates} value={reportDate} onChange={setReportDate} cutoff={row.dataAsOf||reportDate} nonRealtime/>
  <div className="cta-compact-selectors"><Dropdown label="资产类别" value={category} choices={['全部','股票','债券','商品','外汇']} onChange={selectCategory}/><Dropdown label="选择标的" value={selected} choices={visible.map(r=>r.code)} choiceLabels={Object.fromEntries(visible.map(r=>[r.code,`${instrumentName(r)} · ${r.code}`]))} onChange={setSelected}/></div>
  <section ref={detailRef} className="cta-answer-panel">
   <div className="cta-model-title"><div><span className="cta-eyebrow">{row.code==='GC'?'COMEX · GC':`${row.code} · ${row.category}`}</span><h3>{instrumentName(row)}</h3></div><div><span>报告参考价</span><strong>{price(row.price)}</strong>{row.code==='GC'&&<small className="cta-price-unit">美元/金衡盎司</small>}</div></div>
   <DataComponent showActions={false} id="cta-current-strength" queryId="cta" title="报告当期CTA信号" kind="custom" sourceRows={[row]} displayRows={[row]} description="所选报告中的CTA趋势信号，并非实际持仓。短、中、长期是三种观察周期，不是未来1、3、5天。正值偏多、负值偏空，0为中性；±100%为读数两端。">
    <p className="cta-answer-headline">{modelSummary(row)}</p>
    <div className="cta-direction-grid cta-state-cards" data-reviewed-rows>{terms.map(([key,label])=><div key={key}><span>{label}</span><strong className={tone(row[key+'_current'])}>{direction(row[key+'_current'])}</strong><small>读数 <b>{signalValue(row[key+'_current'])}</b></small></div>)}</div>
    <div className="cta-strength-scale" aria-label="CTA信号读数：负100%最强偏空，0中性，正100%最强偏多"><div aria-hidden="true"/><span>−100% 最强偏空</span><span>0 中性</span><span>+100% 最强偏多</span></div>
    <p className="cta-state-note">离0越远，CTA方向信号越强；非实际仓位或涨跌幅。</p>
   </DataComponent>
  </section>
  <section className="cta-expand-panel cta-scenario-panel"><div className="cta-expand-body">
   <DataComponent showActions={false} id="cta-scenario" queryId="cta" title="五日情景 · CTA信号变化" kind="custom" sourceRows={[row]} displayRows={terms.map(([k])=>({code:row.code,term:k,current:row[k+'_current'],projected:row[k+'_'+scenario],scenario,date:row.date,dataAsOf:row.dataAsOf||reportDate}))} description={`以${row.dataAsOf||reportDate}当期读数为起点，按原报告 Bearish / Median / Bullish 价格路径，测算第5个交易日结束时的模型状态。中间路径是中位路径，不等于价格不变。短中长期是模型观察窗口，不是未来1、3、5天。报告未提供情景概率；这些是当时的条件测算，不是后来已实现的数据，也不能换算为资金买卖金额。`}>
    <p className="cta-path-prompt">以本期数据为起点，测算5个交易日后的CTA信号</p>
    <div className="cta-scenario-switch"><SegmentedControl value={scenario} options={Object.entries(paths).map(([value,label])=>({value,label}))} onChange={setScenario}/></div>
    <p className="cta-path-caption">{scenario==='median'?'中间路径由报告设定，不代表价格不变。':`以下为报告设定的${paths[scenario]}测算结果。`}</p>
    <div className="cta-projection-comparison" data-reviewed-rows>
     <div className="cta-projection-labels"><span>周期</span><span>当期</span><span aria-hidden="true"/><span>5日后测算</span></div>
     {terms.map(([key,label])=><div className="cta-projection-line" key={key}><span className="cta-projection-term">{label}</span><span className="cta-projection-before">{signalValue(row[key+'_current'])}</span><span className="cta-projection-arrow" aria-hidden="true">→</span><strong className={tone(row[key+'_'+scenario])}>{signalValue(row[key+'_'+scenario])}</strong><p>{changeMeaning(row[key+'_current'],row[key+'_'+scenario])}</p></div>)}
    </div>
    <p className="cta-compact-note">情景测算，不代表必然发生。</p>
   </DataComponent>
  </div></section>
  <TriggerPanel key={`${reportDate}:${row.code}`} row={row}/>
  <section className="cta-expand-panel cta-comparison-panel"><div className="cta-expand-body">
   <DataComponent showActions={false} id="cta-matrix" queryId="cta" title="各标的CTA信号" kind="table" sourceRows={visible} displayRows={visible} description="正值偏多、负值偏空、零为中性。百分比不是实际仓位。触发价可在所选标的详情中查看。">
    <p className="cta-comparison-caption">{visible.length} 个标的 · 点击名称查看详情</p>
    <div className="cta-table-scroll"><table className="cta-model-table cta-plain-table"><thead><tr><th>标的</th>{terms.map(([k,n])=><th key={k}>{n}</th>)}</tr></thead><tbody>{visible.map(r=><tr key={r.code}><td><button onClick={()=>{setSelected(r.code);detailRef.current?.scrollIntoView({behavior:'smooth',block:'start'})}}>{instrumentName(r)}<small>{r.code}</small></button></td>{terms.map(([k])=><td key={k}><b className={tone(r[k+'_current'])}>{direction(r[k+'_current'])}</b><small>{signalValue(r[k+'_current'])}</small></td>)}</tr>)}</tbody></table></div>
   </DataComponent>
  </div></section>

 </div>
}
function TriggerPanel({row}){
 const reference=row.price,valid=Number.isFinite(reference)&&reference>0;
 const derived={...row,reference:valid?reference:null,referenceType:'报告历史价'};
 const hasRanges=row.buyLow!=null||row.sellLow!=null;
 return <section className="cta-answer-panel cta-trigger-panel"><DataComponent showActions={false} id="cta-trigger" queryId="cta" title="CTA调整触发价" kind="custom" sourceRows={[row]} displayRows={[derived]} description="原报告模型买卖触发价，不是用户入场建议。区间代表不同模型的触发点可能不同；买入可能包括平空或加多，卖出可能包括减多或加空。距离按所选报告参考价计算，并非实时距离；未披露不等于没有触发风险。">
  <p className="cta-trigger-intro">报告估算的CTA调整价位，不随上方情景切换。</p>
  {hasRanges?<><div className="cta-trigger-reference"><span>当期参考价</span><b>{price(reference)}</b><span>{row.code==='GC'?'美元/金衡盎司':'报告报价'}</span></div><div className="cta-trigger-levels" data-reviewed-rows>{[{key:'buy',name:'买入方向触发价',note:'可能回补空单或增加多单'},{key:'sell',name:'卖出方向触发价',note:'可能减少多单或增加空单'}].map(t=>{const low=row[t.key+'Low'],high=row[t.key+'High'];return low==null?<div key={t.key} className="cta-trigger-unavailable"><span>{t.name}</span><span>本期未提供</span></div>:<div key={t.key} className="cta-trigger-level"><div className="cta-trigger-label"><b>{t.name}</b><span>{t.note}</span></div><strong>{low===high?price(low):`${price(low)} – ${price(high)}`}</strong><p>{triggerDistance(reference,low,high)}</p></div>})}</div></>:<div className="cta-trigger-empty" data-reviewed-rows>本期未提供买入、卖出触发价。</div>}
  <p className="cta-compact-note">{hasRanges?'距离按当期参考价计算 · 非实时距离、非入场价':'未提供不代表CTA不会调整。'}</p>
 </DataComponent></section>
}
function triggerDistance(reference,low,high){
 if(!Number.isFinite(reference)||reference<=0)return '参考价未提供，暂不计算距离';
 if(reference>=low&&reference<=high)return '当期参考价已位于此区间';
 const up=reference<low,target=up?low:high;
 return `${up?'上涨':'下跌'} ${Math.abs((target/reference-1)*100).toFixed(2)}% 触及${up?'下沿':'上沿'}`;
}
