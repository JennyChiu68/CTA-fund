import React, {useState} from 'react';
import {useDataApp,useDashboardTabs,DataComponent,EvidenceChart,Dialog,SortableRegion,SortableItem} from '../../data-app-public.jsx';
import './cta.css';
import {CtaModel} from './CtaModel.jsx';
import {ReportPeriod} from './ReportPeriod.jsx';
import {sentimentReading} from './modelLanguage.js';
import {flowLabel,fundFlowComparison} from './fundFlowLanguage.js';

const assets={gold:{name:'黄金',code:'GOLD',color:'#e3c688'},equity:{name:'全球股票',code:'GLOBAL EQUITY',color:'#d6b778'},bonds:{name:'全球债券',code:'GLOBAL BONDS',color:'#83aafa'},cash:{name:'货币市场',code:'MONEY MARKET',color:'#a3aabd'},us:{name:'美国股票',code:'US EQUITY',color:'#f08c89'},treasury:{name:'政府债券',code:'GOVT / TREASURY',color:'#88b6db'},ig:{name:'投资级债',code:'INVESTMENT GRADE',color:'#8fc2b8'}};
const fmt=(n,sign=true)=>`${sign&&n>0?'+':''}${n.toFixed(1)}`;
function Glyph({name='diamond',size=20}){const paths={diamond:'M3 8 7 3h10l4 5-9 13L3 8Zm0 0h18M7 3l5 18 5-18',arrow:'m7 5 7 7-7 7',star:'m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z',info:'M12 11v6m0-10v1M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',book:'M4 3h12a3 3 0 0 1 3 3v15H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Zm0 14h15M8 7h7M8 11h7',pulse:'M2 12h5l3-8 4 16 3-8h5',download:'M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5',check:'m5 12 4 4L19 6'};return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]||paths.info}/></svg>}
function Panel({id,query='signals',title,rows,children,className='',description,controls}){return <div className={`cta-panel ${className}`}><DataComponent showActions={false} id={id} queryId={query} title={title} kind="custom" sourceRows={rows} displayRows={rows} description={description} headerControls={controls}>{children}</DataComponent></div>}
function Gauge({value}){const point=(v,r)=>[150-r*Math.cos(v*Math.PI/10),150-r*Math.sin(v*Math.PI/10)];const end=point(value,106);return <div className="cta-gauge"><svg viewBox="0 0 300 177" role="img" aria-label={`牛熊指标 ${value}分，0 至 10分，高于 8 提示偏热，低于 2 提示偏冷`}><path d="M30 150 A120 120 0 0 1 270 150" fill="none" stroke="var(--cta-line)" strokeWidth="17"/>{Array.from({length:40},(_,i)=>{const a=point(i/4,120),b=point(i/4+.15,120);return <path key={i} d={`M${a} A120 120 0 0 1 ${b}`} fill="none" stroke={i<8?'#69b8ad':i<32?'#7f8595':'#e39a7c'} strokeWidth="17" opacity={i/4<=value?1:.25}/>})}<line x1="150" y1="150" x2={end[0]} y2={end[1]} stroke="#edd5a6" strokeWidth="2"/><circle cx="150" cy="150" r="5" fill="#edd5a6"/><text x="18" y="176">0</text><text x="65" y="75">2</text><text x="223" y="75">8</text><text x="274" y="176">10</text></svg><div className="cta-gauge-value"><strong>{value.toFixed(1)}</strong><span>0—10分</span></div></div>}
const notes={
 "2026-10-15": {
  "title": "股票基金流入增加，情绪回到中性",
  "body": "全球股票基金净流入645亿美元，债券基金净流入118亿美元；货币基金净流出531亿美元。",
  "goldNote": "连续第15周净流入。",
  "usNote": "连续第二周净流入。"
 },
 "2026-10-08": {
  "title": "货币基金转为净流入，情绪降温",
  "body": "货币基金净流入1664亿美元，债券基金净流入338亿美元；全球股票基金净流入124亿美元。",
  "goldNote": "连续第14周净流入。",
  "usNote": "近三周首次净流入。"
 },
 "2026-10-01": {
  "title": "股票基金转为净流入，情绪仍偏热",
  "body": "全球股票基金净流入158亿美元，债券基金净流入188亿美元；货币基金净流出1180亿美元。",
  "goldNote": "连续第13周净流入。",
  "usNote": "连续第二周净流出。"
 },
 "2026-09-25": {
  "title": "股票基金转为净流出，情绪仍偏热",
  "body": "全球股票基金净流出102亿美元，债券基金净流入173亿美元。牛熊指标由9.5降至9.3。",
  "goldNote": "连续第12周净流入。",
  "usNote": ""
 },
 "2026-09-17": {
  "title": "股票基金流入增加，情绪仍偏热",
  "body": "全球股票基金净流入793亿美元，货币基金净流出759亿美元。牛熊指标维持9.5。",
  "goldNote": "",
  "usNote": "结束连续三周净流出；报告称为三个月最大单周净流入。"
 },
 "2026-08-20": {
  "title": "股票基金净流入，情绪偏热",
  "body": "全球股票基金净流入401亿美元，黄金基金净流入38亿美元。牛熊指标为9.5。",
  "goldNote": "",
  "usNote": "报告称为三周最大单周净流入。"
 },
 "2026-08-28": {
  "title": "黄金基金流入增加，美股基金转为流出",
  "body": "黄金基金净流入73亿美元，美国股票基金净流出44亿美元。牛熊指标升至9.7。",
  "goldNote": "报告称为2025年10月以来最大单周净流入。",
  "usNote": "五周来首次净流出。"
 },
 "2026-09-03": {
  "title": "股票基金流入减少，情绪仍偏热",
  "body": "货币基金净流入300亿美元，全球股票基金净流入28亿美元。牛熊指标为9.6。",
  "goldNote": "",
  "usNote": "连续第二周净流出。"
 },
 "2026-09-10": {
  "title": "美股基金持续净流出，情绪仍偏热",
  "body": "美国股票基金连续三周净流出；全球股票基金净流入增加，黄金基金净流入减少。",
  "goldNote": "",
  "usNote": "连续三周净流出，三周合计约142亿美元。"
 }
};
export function DashboardContent(){
 const {queries}=useDataApp();
 const {activeTabId}=useDashboardTabs([{id:'cta',label:'CTA 解读',previousLabels:['CTA 模型']},{id:'overview',label:'基金流向',previousLabels:['资金雷达'],aliases:['signals']}]);
 const signals=queries.signals?.rows||[],flows=queries.flows?.rows||[];
 const latestDate=signals.map(r=>r.date).sort().at(-1);
 const [selectedDate,setDate]=useState(null),[asset,setAsset]=useState('gold'),[dialog,setDialog]=useState(null),[csvText,setCsvText]=useState('');
 if(!signals.length)return <div className="cta-empty">报告数据暂不可用，请刷新后重试。</div>;
 const date=selectedDate&&signals.some(r=>r.date===selectedDate)?selectedDate:latestDate;
 const current=signals.find(r=>r.date===date),prev=[...signals].filter(r=>r.date<date).sort((a,b)=>b.date.localeCompare(a.date))[0],currentFlows=flows.filter(r=>r.date===date),history=flows.filter(r=>r.metric===asset&&r.date<=date),m=10,unitName='亿美元',get=(id,d=date)=>flows.find(r=>r.date===d&&r.metric===id)?.value,latestNote=notes[date];
 const sentiment=sentimentReading(current.bull);
 const trendRows=history.map(r=>({date:r.weekEnd,净流量:r.value*m}));
 const exportCSV=()=>{const rows=[['报告日期','统计截止','基金类别','周净流量（正为流入，负为流出）','单位'],...currentFlows.map(r=>[r.date,r.weekEnd,r.asset,r.value*m,unitName])];const csv='\ufeff'+rows.map(r=>r.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\r\n');setCsvText(csv);setDialog('export')};
 const downloadCSV=()=>{const url=URL.createObjectURL(new Blob([csvText],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=`BofA-fund-flow-${date}.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
 const selected=get(asset),previous=prev?get(asset,prev.date):null,total=history.reduce((sum,r)=>sum+r.value,0);
 const flowSummary=fundFlowComparison(selected*m,previous===null?null:previous*m);
 const extraNote=asset==='gold'?latestNote.goldNote:asset==='us'?latestNote.usNote:'';
 const sentimentChange=current.bull-current.previousBull;
 const renderAsset=(id)=>{const a=assets[id],v=get(id);return <button key={id} className={`cta-asset ${asset===id?'selected':''}`} onClick={()=>setAsset(id)} aria-pressed={asset===id}><span className="cta-asset-icon" style={{color:a.color}}>{id==='gold'?'Au':id==='us'?'US':id==='bonds'?'FI':id==='cash'?'$':id==='equity'?'EQ':id==='ig'?'IG':'TS'}</span><span className="cta-asset-name">{a.name}<small>{a.code}</small></span><span className={`cta-asset-value ${v>=0?'inflow':'outflow'}`}>{fmt(v*m)}<small>{v>=0?'净流入':'净流出'}</small></span></button>};
 return <article className="cta-app">
  <p className="cta-product-subtitle">读懂CTA变化，看清基金流向</p>
  {activeTabId==='overview'&&<div className="cta-toolbar cta-period-toolbar has-export"><ReportPeriod reportType="基金" dates={signals.map(s=>s.date)} value={date} onChange={setDate} cutoff={current.weekEnd}/><div className="cta-toolbar-actions"><button className="cta-icon-button" onClick={exportCSV} aria-label="导出本期数据"><Glyph name="download"/></button></div></div>}
  {activeTabId==='cta'&&<CtaModel/>}
  {(activeTabId==='overview'||!activeTabId)&&<>
   <div className="cta-brief"><div className="cta-brief-label"><Glyph name="pulse"/>当期观察</div><div><h3>{latestNote.title}</h3><p>{latestNote.body}</p></div><span className="cta-tag">研究解读</span></div>
   <SortableRegion id="cta-overview-top" variant="freeform" className="cta-top-grid">
    <SortableItem id="sentiment" label="牛熊指标" kind="custom"><Panel id="sentiment" title="市场情绪 · 牛熊指标" rows={[current]} description="牛熊指标衡量市场情绪，0—10分；高于8偏热，低于2偏冷。它不是CTA趋势信号。"><div className="cta-sentiment"><Gauge value={current.bull}/><div className="cta-sentiment-copy"><span className={`cta-pill ${sentiment.state==='hot'?'warn':sentiment.state==='cold'?'cool':''}`}>{sentiment.label}</span><p>{sentiment.summary}</p><span className="cta-secondary">{sentimentChange===0?'较上期持平':`较上期${sentimentChange>0?'上升':'下降'}${Math.abs(sentimentChange).toFixed(1)}分`}<br/>高于8分偏热<br/>低于2分偏冷</span></div></div></Panel></SortableItem>
    <SortableItem id="flow-overview" label="本周基金净流量" kind="custom"><Panel id="flow-overview" query="flows" title="本周基金净流量" rows={currentFlows.filter(r=>['equity','bonds','cash','gold'].includes(r.metric))} description={`所选报告统计周的基金净流量，单位${unitName}。正值为净流入，负值为净流出；不代表全市场资金流量，各类别不可直接加总。`}><div className="cta-bar-legend"><span>资产</span><span>净流入＋ / 净流出− · {unitName}</span></div><div className="cta-flow-bars">{['bonds','cash','equity','gold'].sort((a,b)=>get(b)-get(a)).map(id=><button key={id} onClick={()=>setAsset(id)} className={asset===id?'active':''} aria-label={`查看${assets[id].name}趋势`}><span>{assets[id].name}</span><span className="cta-bar-track"><i style={{width:`${Math.abs(get(id))/Math.max(...currentFlows.filter(r=>['equity','bonds','cash','gold'].includes(r.metric)).map(r=>Math.abs(r.value)))*100}%`,background:get(id)<0?'#7abdb4':assets[id].color}}/></span><b className={get(id)<0?'outflow':''}>{fmt(get(id)*m)}</b></button>)}</div><div className="cta-panel-note">净流入＝申购减赎回，并非CTA买卖额</div></Panel></SortableItem>
   </SortableRegion>
   <div className="cta-section-title"><h3>各类基金流向</h3><span>选择类别查看历史变化</span></div>
   <div className="cta-workspace"><section className="cta-asset-list"><div className="cta-list-head"><b>基金类别</b><span>{unitName}</span></div>{Object.keys(assets).map(renderAsset)}</section><section className="cta-detail"><div className="cta-detail-heading"><div><span className="cta-eyebrow" style={{color:assets[asset].color}}>{assets[asset].code}</span><h3>{assets[asset].name}基金</h3></div></div><p className="cta-fund-unit">金额单位：亿美元</p><div className="cta-stat-row" data-reviewed-rows><div><span>本周{flowLabel(selected)}</span><strong className={selected>=0?'inflow':'outflow'}>{fmt(Math.abs(selected*m),false)}</strong></div><div><span>{previous===null?'上期':'上期'+flowLabel(previous)}</span><b>{previous===null?'—':fmt(Math.abs(previous*m),false)}</b></div><div><span>{history.length}期{flowLabel(total)}合计</span><b>{fmt(Math.abs(total*m),false)}</b></div></div><EvidenceChart showActions={false} id="asset-flow-history" queryId="flows" title="基金每周净流量" rows={trendRows} sourceRows={history} spec={{type:'bar',x:'date',y:'净流量',colors:{净流量:assets[asset].color},showLegend:false,valueDecimals:1,showXAxisLabel:false,showYAxisLabel:false,stackable:false}} height={205} description={`统计周截止日；单位${unitName}。仅展示截至所选报告的已收录期次，合计不代表连续区间总量。`}/><div className="cta-interpretation"><Glyph name="pulse" size={18}/><div><b>{previous===null?'本周基金流量':'较上期变化'}</b><p>{flowSummary}{extraNote}</p></div></div></section></div>

  </>}
  <p className="cta-research-notice">研究资料，仅供参考，不构成投资建议。</p>
  <Dialog open={dialog==='export'} onClose={()=>setDialog(null)} title="导出本期基金流量"><div className="cta-dialog-content"><p>{date} · {currentFlows.length} 类资产 · {unitName}</p><button className="cta-action-button" onClick={downloadCSV}><Glyph name="download"/>下载 CSV</button><textarea className="cta-csv-preview" aria-label="CSV 数据预览" value={csvText} readOnly onClick={e=>e.currentTarget.select()}/></div></Dialog>
 </article>;
}
