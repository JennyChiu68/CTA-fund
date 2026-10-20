import React from 'react';
export function ReportSource({name,date,details,note,href}){
 return <footer className="report-source" aria-label="本页报告来源">
  <span className="report-source-label">本页报告来源</span>
  <strong>美银全球研究</strong><b lang="en">{name}</b>
  <p>报告日期：<time dateTime={date}>{date}</time></p><p>{details}</p>
  <p className="report-source-note">{note}</p>
  {href&&<a href={href} target="_blank" rel="noreferrer">查看原报告 ↗</a>}
 </footer>;
}
