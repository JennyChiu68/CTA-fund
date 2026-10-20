# 美银CTA·基金动向

读懂CTA变化，看清基金流向。

以美银研报的审核数据快照为基础的 React 演示工具，包含两个页面：

- **CTA 解读**：24个标的的当期CTA信号、五个交易日情景测算、调整触发价及标的对比。
- **基金流向**：7类基金的周净流量、本期与上期对照、历史变化，以及牛熊情绪指标；支持导出当前期次的CSV。

[查看线上 Demo](https://jin10-cta-tracker.kinardqgumt.chatgpt.site/?view=1&tab=cta)

## 本地运行

需要 Node.js 22.12或更高版本（也支持20.19系列）及npm。

```sh
git clone https://github.com/JennyChiu68/CTA-fund.git
cd CTA-fund/app
npm ci
npm run dev -- --host 127.0.0.1
```

打开终端打印的本地地址。手机布局最大宽度为430px，桌面端居中展示；两个入口固定在底部。

## 构建与检查

在 `app/` 目录运行：

```sh
npm run verify:runtime
npm run build
```

构建结果位于 `app/dist/`。预览构建结果：

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

修改内容的代码入口是 `app/src/content/dashboard/`。`app/AGENTS.md` 说明运行时边界和构建要求。

## 数据与口径

| 内容 | 研报 | 已收录期次 | 最新报告日期 |
| --- | --- | --- | --- |
| CTA信号、情景和触发价 | Systematic Flows Monitor | 15期、360条标的记录 | 2026-10-16 |
| 基金流向及情绪指标 | The Flow Show | 9期、63条基金流量记录 | 2026-10-15 |

- 审核快照位于 `app/src/data.json`，共486条记录，保留报告日期、统计截止日期、报告ID和页码等来源信息。
- CTA百分比是报告中的趋势信号读数，不是实际持仓比例、收益率或涨跌概率；五日情景是条件测算。
- 基金净流入为申购减赎回，不是CTA买卖额。`flows.value` 的原始单位是十亿美元，界面及CSV乘以10，转换为亿美元。
- 基金流向统计截至2026-10-14；两个页面按各自报告日期选择历史期次。缺失期次不插值，不同基金类别也不可直接相加。
- 本项目使用已审核快照，不自动抓取后台报告，也不接入实时行情。

## 主要文件

```text
app/
  src/content/dashboard/
    DashboardContent.jsx    基金流向、情绪指标和CSV导出
    CtaModel.jsx            CTA信号、情景和触发价
    fundFlowLanguage.js     净流入/净流出比较说明
    modelLanguage.js        CTA和情绪读数说明
    ReportPeriod.jsx        报告日期选择
    cta.css                 内容样式与手机端适配
  src/data.json             审核数据快照
  src/theme.css             主题
  .openai/hosting.json      现有线上Demo的Sites标识及存储绑定
  package.json
  package-lock.json
```

## 同步版本

本次同步对应2026-10-19已发布的Demo第42版，原作者源码提交为 `f0ab42f`。保留完整应用源码、审核数据及运行说明；本地依赖、生成产物、缓存和原始研报文件不入库。

`app/.openai/hosting.json` 保留现有线上项目的标识；GitHub提交不会自动部署或更新该站点。当前运行时含按用户要求定制的底部导航，使用Data工具发布时需采用 `--source` 构建，避免覆盖这些定制。
