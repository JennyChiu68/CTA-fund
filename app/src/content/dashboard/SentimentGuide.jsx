import React from 'react';
import {DataComponent} from '../../data-app-public.jsx';
export function SentimentGuide({current,components}){
 const rules=[
  {key:'bull',name:'市场情绪是否过热？',metric:'美银牛熊指标',value:current.bull,unit:'/ 10',state:current.bull>8?'hot':current.bull<2?'cold':'neutral',period:'1–3个月',rule:'高于8为逆向卖出，低于2为逆向买入。',reason:current.bull>8?'指标高于8，市场情绪偏热，留意回撤风险。':current.bull<2?'指标低于2，报告认为市场过于悲观。它提醒关注情绪修复，不代表马上会涨。':'指标未进入报告设定的极端情绪区间。'},
  {key:'cash',name:'基金经理手里的现金多吗？',metric:'基金经理现金比例',value:current.cash,unit:'%',state:current.cash<=4?'hot':current.cash>=5?'cold':'neutral',period:'4周',rule:'现金不高于4%为逆向卖出，不低于5%为逆向买入。',reason:current.cash<=4?'现金不高于4%，受访基金经理现金缓冲较少、情绪偏积极。':current.cash>=5?'受访基金经理留存的现金偏多，报告将其视为偏谨慎的情绪信号。':'现金比例处于报告规则的中性区间。'},
  current.breadthSignal?{key:'breadth',name:'市场广度触发逆向信号了吗？',metric:'全球广度规则读数',value:current.breadth,unit:'%',state:current.breadthSignal==='Buy'?'cold':current.breadthSignal==='Sell'?'hot':'neutral',period:'3个月',rule:current.breadthRule,reason:`本期规则读数 ${current.breadth.toFixed(1)}%，报告规则提示${current.breadthSignal==='Buy'?'偏冷':current.breadthSignal==='Sell'?'偏热':'中性'}。这是情绪规则，非交易指令；读数不是站在均线上的市场占比。`}:{key:'breadth',name:'过热是否扩散到多数市场？',metric:'超买市场占比',value:current.breadth,unit:'%',state:current.breadth>88?'hot':'neutral',period:'3个月',rule:'超买市场占比高于88%触发逆向卖出。',reason:'比较过热市场的覆盖范围，当前读数是否越过阈值见下方原始规则。'},
  {key:'globalFlow',name:'全球资金流是否过于极端？',metric:'四周流量占资产规模',value:current.globalFlow,unit:'%',state:current.globalFlow>1?'hot':current.globalFlow< -1?'cold':'neutral',period:'8周',rule:'四周流入高于资产规模1%为逆向卖出，流出超过1%为逆向买入。',reason:'统计全球股票与高收益债的四周资金流，判断流入或流出是否到了极端水平。'},
  {key:'emFlow',name:'新兴市场资金流是否过于极端？',metric:'四周流量占资产规模',value:current.emFlow,unit:'%',state:current.emFlow>1.5?'hot':current.emFlow< -3?'cold':'neutral',period:'8周',rule:'四周流入高于资产规模1.5%为逆向卖出，流出超过3%为逆向买入。',reason:'统计新兴市场股票基金的四周流量；负数表示净流出，并不自动构成买入信号。'}
 ];
 const hot=rules.filter(r=>r.state==='hot').length,cold=rules.filter(r=>r.state==='cold').length;
 const renderRule=r=><section className="cta-answer-panel" key={r.key}><DataComponent showActions={false} id={`rule-${r.key}`} queryId="signals" title={r.name} kind="custom" sourceRows={[current]} displayRows={[current]} description={`报告指标：${r.metric}；${r.rule}观察周期${r.period}。`}>
  <div className="cta-reading-plain"><div><span>{r.metric}</span><strong>{r.value.toFixed(1)}<small>{r.unit}</small></strong></div><b className={`cta-status ${r.state}`}>{r.state==='hot'?'提示偏热':r.state==='cold'?'提示偏冷':'未触发提醒'}</b></div>
  <p className="cta-explain">{r.reason}</p><p className="cta-reference-caption">观察周期：{r.period}</p>
 </DataComponent></section>;
 return <div className="cta-readable">
  <section className="cta-answer-panel"><DataComponent showActions={false} id="sentiment-summary" queryId="signals" title="这期报告提醒什么？" kind="custom" sourceRows={[current]} displayRows={[current]} description="按原报告五项逆向规则归纳，不把五项指标相加或转成涨跌概率。"><p className="cta-answer-headline">{hot?`${hot} 项规则提示情绪偏热`:cold?`${cold} 项规则提示情绪偏冷`:'五项规则均未触发极端提醒'}</p><p className="cta-explain">{hot?'市场情绪偏乐观，留意反向波动。':cold?'市场悲观程度值得留意，报告规则关注潜在情绪修复。':'未触发阈值不等于没有风险，也不代表价格一定上涨。'}</p><span className="cta-reference-caption">情绪指标，非CTA仓位或交易指令 · 观察数周至数月</span></DataComponent></section>
  {rules.slice(0,2).map(renderRule)}
  <section className="cta-expand-panel"><h3 className="cta-section-title"><span>其他三项规则<small>市场广度、全球与新兴市场资金流</small></span></h3><div className="cta-expand-body cta-nested-rules">{rules.slice(2).map(renderRule)}</div></section>
  <section className="cta-expand-panel"><header className="cta-panel-heading"><h3>哪些情绪分项处于历史高位？</h3><p>六个分项的历史分位数</p></header><div className="cta-expand-body"><p className="cta-explain">分位数越高，说明该分项相对历史越偏热；不是持仓比例。</p><DataComponent showActions={false} id="position-components" queryId="components" title="情绪分项的历史位置" kind="custom" sourceRows={components} displayRows={components} description="报告给出的历史分位数，不代表仓位比例。"><div className="cta-components">{components.map(r=><div key={r.component}><span>{r.component}</span><div className="cta-component-track"><i style={{width:`${r.percentile}%`}}/></div><b>{r.percentile}分位</b></div>)}</div></DataComponent></div></section>
 </div>
}
