import React from 'react';
import {Dropdown,InfoTooltip} from '../../data-app-public.jsx';

export function ReportPeriod({dates,value,onChange,cutoff,nonRealtime=true,reportType}){
 const ordered=[...dates].sort().reverse();
 const labels=Object.fromEntries(ordered.map(date=>[date,date+(date===ordered[0]?' · 最新':'')]));
 const distinctCutoff=cutoff&&cutoff!==value;
 return <div className="cta-report-period">
  <div className={`cta-period-row${nonRealtime||distinctCutoff?' has-status':''}`}>
   <Dropdown label={`${reportType}报告日期`} value={value} choices={ordered} choiceLabels={labels} onChange={onChange}/>
   {(nonRealtime||distinctCutoff)&&<span className="cta-period-status">
    {nonRealtime&&'非实时'}
    <InfoTooltip label="报告日期说明">本页为{reportType}报告；两个页面分别更新、分别选期。{distinctCutoff&&<> 数据截至 {cutoff}。</>}</InfoTooltip>
   </span>}
  </div>
 </div>;
}
