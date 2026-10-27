// Renderiza os gráficos de um HTML: cada <figure data-chart='{...}'> recebe um SVG estático do ECharts.
// O bloco data-chart é a única coisa que a IA escreve; o preset da Solaria monta o resto.
// Uso: node gallery/charts/render.mjs <arquivo.html> [saída.html]
import { readFile, writeFile } from "node:fs/promises";
import * as echarts from "echarts";

const color = {
  ink: "#242628",
  muted: "#62676f",
  line: "#e5e7eb",
  soft: "#c9ccd1",
  accent: "#ff6500",
  accentSoft: "#ffc199",
  good: "#18794e",
  bad: "#b42318",
};
const font = '"Plus Jakarta Sans", "Segoe UI", system-ui, Arial, sans-serif';
const sizes = { full: [640, 280], half: [312, 220], spark: [120, 36] };

const number = (value, spec) =>
  `${spec.prefix ?? ""}${Number(value).toLocaleString("pt-BR", { maximumFractionDigits: spec.decimals ?? 1 })}${spec.suffix ?? ""}`;

const axisText = { color: color.muted, fontFamily: font, fontSize: 10 };
const base = (spec) => ({
  animation: false,
  textStyle: { fontFamily: font, color: color.ink },
  grid: { left: 8, right: 16, top: 24, bottom: 8, containLabel: true },
});
const categoryAxis = (labels) => ({
  type: "category",
  data: labels,
  axisLine: { lineStyle: { color: color.soft } },
  axisTick: { show: false },
  axisLabel: { ...axisText, interval: 0, hideOverlap: false },
});
const valueAxis = (spec) => ({
  type: "value",
  splitLine: { lineStyle: { color: color.line } },
  axisLabel: { ...axisText, formatter: (value) => number(value, spec) },
});
const label = (spec, position = "top") => ({
  show: true,
  position,
  fontFamily: font,
  fontSize: 10,
  fontWeight: 600,
  color: color.ink,
  formatter: ({ value }) => number(Array.isArray(value) ? value[1] : value, spec),
});

// Barras: uma série, a categoria em destaque em laranja e o resto em cinza.
function bar(spec, horizontal = false) {
  const rows = horizontal ? [...spec.data].sort((a, b) => a[1] - b[1]) : spec.data;
  const labels = rows.map(([name]) => name);
  const series = {
    type: "bar",
    barMaxWidth: horizontal ? 18 : 36,
    data: rows.map(([name, value]) => ({
      value,
      itemStyle: { color: name === spec.highlight ? color.accent : color.soft, borderRadius: horizontal ? [0, 3, 3, 0] : [3, 3, 0, 0] },
    })),
    label: label(spec, horizontal ? "right" : "top"),
  };
  return horizontal
    ? {
        ...base(spec),
        grid: { left: 8, right: 36, top: 8, bottom: 8, containLabel: true },
        xAxis: { ...valueAxis(spec), show: false },
        yAxis: categoryAxis(labels),
        series: [series],
      }
    : { ...base(spec), xAxis: categoryAxis(labels), yAxis: { ...valueAxis(spec), show: false }, series: [series] };
}

// Linhas: a primeira série em tinta, a segunda em laranja; rótulo direto no último ponto, sem legenda.
function line(spec, area = false) {
  const palette = [color.ink, color.accent, color.muted];
  return {
    ...base(spec),
    grid: { left: 8, right: 72, top: 16, bottom: 8, containLabel: true },
    xAxis: { ...categoryAxis(spec.labels), boundaryGap: false },
    yAxis: valueAxis(spec),
    series: spec.series.map((serie, index) => ({
      type: "line",
      name: serie.name,
      data: serie.values,
      symbol: "none",
      lineStyle: { width: 2, color: palette[index], type: serie.dashed ? "dashed" : "solid" },
      areaStyle: area && index === 0 ? { color: color.accent, opacity: 0.08 } : undefined,
      endLabel: { show: true, fontFamily: font, fontSize: 10, fontWeight: 600, color: palette[index], formatter: serie.name },
      labelLayout: { moveOverlap: "shiftY" },
    })),
  };
}

// Real × plano no padrão IBCS: plano em contorno, real cheio e a variação colorida acima.
function variance(spec) {
  const labels = spec.data.map(([name]) => name);
  const deltas = spec.data.map(([, actual, plan]) => actual - plan);
  return {
    ...base(spec),
    grid: [
      { left: 8, right: 8, top: 18, height: "20%", containLabel: true },
      { left: 8, right: 8, top: "34%", bottom: 8, containLabel: true },
    ],
    xAxis: [
      { ...categoryAxis(labels), gridIndex: 0, show: false },
      { ...categoryAxis(labels), gridIndex: 1 },
    ],
    yAxis: [
      { type: "value", gridIndex: 0, show: false },
      { type: "value", gridIndex: 1, show: false },
    ],
    series: [
      {
        type: "bar",
        xAxisIndex: 0,
        yAxisIndex: 0,
        barMaxWidth: 10,
        data: deltas.map((value) => ({ value, itemStyle: { color: value >= 0 ? color.good : color.bad } })),
        label: { ...label(spec), formatter: ({ value }) => `${value > 0 ? "+" : ""}${number(value, spec)}`, color: color.muted, fontWeight: 500 },
      },
      {
        type: "bar",
        xAxisIndex: 1,
        yAxisIndex: 1,
        barMaxWidth: 30,
        barGap: "-70%",
        data: spec.data.map(([, , plan]) => plan),
        itemStyle: { color: "#ffffff", borderColor: color.ink, borderWidth: 1 },
      },
      {
        type: "bar",
        xAxisIndex: 1,
        yAxisIndex: 1,
        barMaxWidth: 30,
        data: spec.data.map(([, actual]) => actual),
        itemStyle: { color: color.ink },
        label: { ...label(spec, "insideTop"), color: "#ffffff", distance: 6 },
      },
    ],
  };
}

// Rosca só para duas ou três partes; a primeira em laranja.
function donut(spec) {
  const palette = [color.accent, color.soft, color.line];
  return {
    ...base(spec),
    series: [
      {
        type: "pie",
        radius: ["58%", "82%"],
        label: { show: true, fontFamily: font, fontSize: 10, color: color.ink, formatter: ({ name, percent }) => `${name}\n${percent.toLocaleString("pt-BR")}%` },
        labelLine: { length: 6, length2: 6 },
        data: spec.data.map(([name, value], index) => ({ name, value, itemStyle: { color: palette[index] } })),
      },
    ],
  };
}

// Sparkline para cartão de KPI: sem eixos, último ponto marcado.
function spark(spec) {
  const values = spec.values;
  return {
    animation: false,
    grid: { left: 2, right: 6, top: 6, bottom: 6 },
    xAxis: { type: "category", show: false, data: values.map((_, index) => index) },
    yAxis: { type: "value", show: false, scale: true },
    series: [
      {
        type: "line",
        data: values,
        symbol: (_, params) => (params.dataIndex === values.length - 1 ? "circle" : "none"),
        symbolSize: 5,
        lineStyle: { width: 1.5, color: color.ink },
        itemStyle: { color: color.accent },
      },
    ],
  };
}

const presets = {
  bar: (spec) => bar(spec),
  rank: (spec) => bar(spec, true),
  line: (spec) => line(spec),
  area: (spec) => line(spec, true),
  variance,
  donut,
  spark,
};

export function renderChart(spec) {
  const preset = presets[spec.type];
  if (!preset) throw new Error(`tipo de gráfico desconhecido: ${spec.type}`);
  const [width, height] = spec.type === "spark" ? sizes.spark : sizes[spec.size ?? "full"];
  const chart = echarts.init(null, null, { renderer: "svg", ssr: true, width, height });
  chart.setOption(preset(spec));
  const svg = chart.renderToSVGString();
  chart.dispose();
  return svg.replace("<svg ", `<svg role="img" aria-label="${(spec.alt ?? "").replaceAll('"', "&quot;")}" `);
}

const decode = (text) =>
  text.replaceAll("&quot;", '"').replaceAll("&#39;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&amp;", "&");

// Troca o SVG de cada figura; rodar de novo regenera, porque o bloco data-chart fica no HTML.
export function renderCharts(html) {
  let count = 0;
  const output = html.replace(
    /(<(?:figure|div)\b[^>]*\bdata-chart='([^']*)'[^>]*>)(?:\s*<div class="chart-svg">[\s\S]*?<\/svg><\/div>)?/g,
    (_match, open, json) => {
      count += 1;
      return `${open}<div class="chart-svg">${renderChart(JSON.parse(decode(json)))}</div>`;
    },
  );
  return { html: output, count };
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replaceAll("\\", "/").split("/").pop())) {
  const [source, target = source] = process.argv.slice(2);
  if (!source) {
    console.error("uso: node gallery/charts/render.mjs <arquivo.html> [saída.html]");
    process.exit(1);
  }
  const { html, count } = renderCharts(await readFile(source, "utf8"));
  await writeFile(target, html);
  console.log(`${target} (${count} gráficos)`);
}
