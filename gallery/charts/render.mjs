// Renderiza os gráficos de um HTML: cada <div data-chart='{...}'> recebe um SVG estático do ECharts.
// O bloco data-chart é a única coisa que a IA escreve; o preset da Solaria monta o resto: escala, rótulos de valor,
// legenda com padrão, linhas de referência e, se pedido, a tabela com os números.
// Uso: node gallery/charts/render.mjs <arquivo.html> [saída.html]
import { readFile, writeFile } from "node:fs/promises";
import * as echarts from "echarts";

const color = {
  ink: "#242628",
  text: "#3d4249",
  muted: "#62676f",
  faint: "#8b9098",
  grid: "#eceef1",
  axis: "#c9ccd1",
  neutral: "#b9bdc4",
  neutralDark: "#6b7078",
  accent: "#ff6500",
  accentDark: "#c84b18",
  accentWash: "#ffe7d6",
  good: "#18794e",
  bad: "#b42318",
  paper: "#ffffff",
};
// Ordem categórica validada (laranja da marca, azul, verde-água, violeta). Acima de quatro séries, junte em "Outros".
const palette = ["#ff6500", "#2a78d6", "#1baf7a", "#6250d6"];
// Padrões na ordem das séries, como segunda codificação: liso, listras, pontos, listras cruzadas.
const patterns = {
  solid: undefined,
  stripes: { symbol: "rect", symbolSize: 1, color: "rgba(255,255,255,0.55)", dashArrayX: [1, 0], dashArrayY: [2, 3], rotation: Math.PI / 4 },
  dots: { symbol: "circle", symbolSize: 0.9, color: "rgba(255,255,255,0.75)", dashArrayX: [3, 2], dashArrayY: [3, 2] },
  cross: { symbol: "rect", symbolSize: 1, color: "rgba(255,255,255,0.55)", dashArrayX: [1, 0], dashArrayY: [2, 3], rotation: -Math.PI / 4 },
  hatch: { symbol: "rect", symbolSize: 1, color: "rgba(36,38,40,0.35)", dashArrayX: [1, 0], dashArrayY: [1.5, 3], rotation: Math.PI / 4 },
};
const order = ["solid", "stripes", "dots", "cross"];
const font = '"Plus Jakarta Sans", "Segoe UI", system-ui, Arial, sans-serif';
const sizes = { full: [640, 300], half: [312, 240], tall: [640, 380], spark: [120, 36] };

// ---------- Números ----------

export function number(value, spec = {}) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "";
  let n = Number(value);
  let unit = "";
  if (spec.compact && Math.abs(n) >= 1e6) [n, unit] = [n / 1e6, " mi"];
  else if (spec.compact && Math.abs(n) >= 1e4) [n, unit] = [n / 1e3, " mil"];
  const decimals = spec.decimals ?? (unit || !Number.isInteger(n) ? 1 : 0);
  const text = n.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: decimals });
  return `${spec.prefix ?? ""}${text.replace("-", "−")}${unit}${spec.suffix ?? ""}`;
}
const signed = (value, spec) => `${value > 0 ? "+" : ""}${number(value, spec)}`;
const percent = (value) => `${number(value, { decimals: 1 })}%`;

// ---------- Peças comuns ----------

const text = (size = 11, weight = 500, fill = color.muted) => ({ fontFamily: font, fontSize: size, fontWeight: weight, color: fill });
const base = (spec, extra = {}) => ({
  animation: false,
  textStyle: { fontFamily: font, color: color.ink },
  grid: { left: 4, right: 12, top: spec.legend === false ? 18 : 40, bottom: 4, containLabel: true },
  ...extra,
});
const legend = (names, spec) =>
  names.length > 1 && spec.legend !== false
    ? { top: 0, left: 0, itemWidth: 12, itemHeight: 12, itemGap: 14, icon: "roundRect", textStyle: text(11, 600, color.text), data: names }
    : undefined;
const categoryAxis = (labels, spec = {}) => ({
  type: "category",
  data: labels,
  axisLine: { lineStyle: { color: color.axis } },
  axisTick: { show: false },
  axisLabel: { ...text(11, 600, color.text), interval: 0, hideOverlap: false, margin: 8 },
  name: spec.xName,
  nameLocation: "middle",
  nameGap: 28,
  nameTextStyle: text(10, 500),
});
// Eixo x de categorias: cada nome ganha a largura da sua coluna e quebra em linhas em vez de encavalar.
const xCategory = (labels, spec) => {
  const axis = categoryAxis(labels, spec);
  const width = Math.max(36, Math.floor(((spec.width ?? 640) - 70) / labels.length) - 6);
  return { ...axis, axisLabel: { ...axis.axisLabel, width, overflow: "break", lineHeight: 13 } };
};
const valueAxis = (spec, extra = {}) => ({
  type: "value",
  splitNumber: 4,
  splitLine: { lineStyle: { color: color.grid, width: 1 } },
  axisLabel: { ...text(10), formatter: (value) => number(value, { ...spec, decimals: spec.axisDecimals ?? spec.decimals }) },
  name: spec.yName,
  nameLocation: "end",
  nameTextStyle: { ...text(10), align: "left", padding: [0, 0, 0, -28] },
  ...extra,
});
const valueLabel = (spec, position = "top", extra = {}) => ({
  show: true,
  position,
  distance: 4,
  ...text(11, 700, color.ink),
  formatter: ({ value }) => number(Array.isArray(value) ? value[value.length - 1] : value, spec),
  ...extra,
});
// Linhas de referência: meta (tracejada, com nome) e média.
function references(spec, horizontal = false) {
  const lines = [];
  const key = horizontal ? "xAxis" : "yAxis";
  for (const target of [].concat(spec.target ?? [])) {
    const { value, label: name = "Meta" } = typeof target === "number" ? { value: target } : target;
    lines.push({
      [key]: value,
      lineStyle: { color: color.ink, type: [4, 3], width: 1 },
      label: { ...text(10, 700, color.ink), position: horizontal ? "insideEndTop" : "insideEndTop", formatter: `${name} ${number(value, spec)}` },
    });
  }
  if (spec.average)
    lines.push({
      type: "average",
      name: "Média",
      lineStyle: { color: color.neutralDark, type: [2, 3], width: 1 },
      label: { ...text(10, 600, color.muted), position: "insideEndTop", formatter: ({ value }) => `Média ${number(value, spec)}` },
    });
  return lines.length ? { silent: true, symbol: "none", data: lines } : undefined;
}
const highlights = (spec) => new Set([].concat(spec.highlight ?? []));
// Cor e padrão de uma série: tom (accent, neutral, ou a ordem da paleta) e padrão (solid, stripes, dots, cross, hatch).
function look(serie, index, spec) {
  const tone = serie.tone ?? spec.tone;
  const fill =
    serie.color ?? (tone === "neutral" ? color.neutral : tone === "dark" ? color.neutralDark : tone === "accent" ? color.accent : palette[index % palette.length]);
  const pattern = serie.pattern ?? (spec.patterns === false ? "solid" : order[index % order.length]);
  return { color: fill, decal: patterns[pattern === "hatch" && fill === color.accent ? "stripes" : pattern] };
}
// Largura reservada para os nomes de um eixo de categorias horizontal, para que nada seja cortado.
const nameWidth = (names) => Math.max(...names.map((name) => String(name).length)) * 6.6 + 14;
const radius = (horizontal) => (horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]);

// ---------- Tipos ----------

// Colunas ou barras de uma série: destaque em laranja, o resto em cinza; valor na ponta; meta e média opcionais.
// data: [["Nome", valor, {"pattern":"hatch"}?], ...]
function bar(spec, horizontal = false) {
  const rows = horizontal && spec.sort !== false ? [...spec.data].sort((a, b) => b[1] - a[1]) : spec.data;
  const marked = highlights(spec);
  const series = {
    type: "bar",
    barMaxWidth: horizontal ? 20 : 34,
    barCategoryGap: "38%",
    data: rows.map(([name, value, options = {}]) => {
      const on = marked.size ? marked.has(name) : true;
      const fill = on ? color.accent : color.neutral;
      return {
        value,
        itemStyle: { color: fill, borderRadius: radius(horizontal), decal: options.pattern ? patterns[options.pattern === "hatch" && on ? "stripes" : options.pattern] : undefined },
        label: { color: on ? color.ink : color.muted },
      };
    }),
    label: valueLabel(spec, horizontal ? "right" : "top"),
    markLine: references(spec, horizontal),
  };
  const labels = rows.map(([name]) => name);
  if (horizontal)
    return {
      ...base(spec, { grid: { left: 4, right: 44, top: spec.target ? 22 : 6, bottom: 4, containLabel: true } }),
      xAxis: { ...valueAxis(spec), show: spec.axis === true },
      yAxis: { ...categoryAxis(labels, spec), inverse: true, axisLine: { show: false } },
      series: [series],
    };
  return {
    ...base(spec, { grid: { left: 4, right: 12, top: 26, bottom: 4, containLabel: true } }),
    xAxis: xCategory(labels, spec),
    yAxis: { ...valueAxis(spec), show: spec.axis !== false },
    series: [series],
  };
}

// Barras agrupadas, como os comparativos de benchmark: uma cor e um padrão por série, valor em cada barra.
// labels: categorias; series: [{"name","values","tone"?,"pattern"?}]; horizontal opcional.
function group(spec) {
  const horizontal = spec.horizontal === true;
  const names = spec.series.map(({ name }) => name);
  // Muitas barras por grupo: o valor sobe na vertical para não encavalar.
  const dense = !horizontal && spec.series.length * spec.labels.length > 9;
  const series = spec.series.map((serie, index) => {
    const { color: fill, decal } = look(serie, index, spec);
    return {
      type: "bar",
      name: serie.name,
      data: serie.values,
      barMaxWidth: horizontal ? 16 : 26,
      barGap: "12%",
      barCategoryGap: "30%",
      itemStyle: { color: fill, decal, borderRadius: radius(horizontal) },
      label:
        spec.values === false
          ? undefined
          : dense
            ? { ...valueLabel(spec, "top", text(9.5, 700, color.ink)), rotate: 90, align: "left", verticalAlign: "middle", distance: 4 }
            : valueLabel(spec, horizontal ? "right" : "top", text(10, 700, color.ink)),
      markLine: index === 0 ? references(spec, horizontal) : undefined,
    };
  });
  const category = horizontal ? { ...categoryAxis(spec.labels, spec), inverse: true, axisLine: { show: false } } : xCategory(spec.labels, spec);
  return {
    ...base(spec, { grid: { left: 4, right: horizontal ? 44 : 12, top: dense ? 64 : 40, bottom: 4, containLabel: true } }),
    legend: legend(names, spec),
    xAxis: horizontal ? { ...valueAxis(spec), show: spec.axis === true } : category,
    yAxis: horizontal ? category : valueAxis(spec),
    series,
  };
}

// Colunas empilhadas (ou 100% com "percent": true): 2 px de papel entre as partes, total no topo e rótulo dentro
// só quando a parte comporta o texto.
function stack(spec) {
  const horizontal = spec.horizontal === true;
  const totals = spec.labels.map((_, column) => spec.series.reduce((sum, serie) => sum + (serie.values[column] ?? 0), 0));
  const share = (value, column) => (spec.percent ? (value / totals[column]) * 100 : value);
  const peak = spec.percent ? 100 : Math.max(...totals);
  const shown = spec.percent ? { ...spec, suffix: "%", decimals: 0 } : spec;
  const series = spec.series.map((serie, index) => {
    const { color: fill, decal } = look(serie, index, spec);
    const last = index === spec.series.length - 1;
    return {
      type: "bar",
      name: serie.name,
      stack: "total",
      barMaxWidth: horizontal ? 22 : 40,
      data: serie.values.map((value, column) => ({
        value: share(value, column),
        label: {
          show: share(value, column) / peak > 0.09,
          position: "inside",
          ...text(10, 700, decal ? color.ink : index === 0 || fill === palette[1] || fill === palette[3] ? color.paper : color.ink),
          // Sobre padrão, o número vai numa pastilha de papel para continuar legível.
          ...(decal ? { backgroundColor: "rgba(255,255,255,0.92)", padding: [1, 4], borderRadius: 3 } : {}),
          formatter: () => number(share(value, column), shown),
        },
      })),
      itemStyle: { color: fill, decal, borderColor: color.paper, borderWidth: 1, borderRadius: last ? radius(horizontal) : 0 },
    };
  });
  if (!spec.percent)
    series.push({
      type: "bar",
      stack: "total",
      silent: true,
      data: totals.map(() => 0),
      itemStyle: { color: "transparent" },
      label: { show: true, position: horizontal ? "right" : "top", ...text(11, 800, color.ink), formatter: ({ dataIndex }) => number(totals[dataIndex], spec) },
    });
  const category = horizontal ? { ...categoryAxis(spec.labels, spec), inverse: true, axisLine: { show: false } } : xCategory(spec.labels, spec);
  const values = valueAxis(shown, spec.percent ? { max: 100 } : {});
  return {
    ...base(spec),
    legend: legend(spec.series.map(({ name }) => name), spec),
    xAxis: horizontal ? { ...values, show: false } : category,
    yAxis: horizontal ? category : values,
    series,
  };
}

// Linhas: uma cor por série, marcador e valor no último ponto, nome no fim da linha; "dashed" para plano ou meta.
// area: true pinta a primeira série com uma lavagem de 10%. "mark" destaca máximo e mínimo da primeira série.
function line(spec, area = false) {
  const names = spec.series.map(({ name }) => name);
  return {
    ...base(spec, { grid: { left: 4, right: names.length > 1 ? 96 : 44, top: names.length > 1 ? 40 : 18, bottom: 4, containLabel: true } }),
    legend: legend(names, spec),
    xAxis: { ...categoryAxis(spec.labels, spec), boundaryGap: false, axisLabel: { ...text(10, 600, color.text), hideOverlap: true } },
    yAxis: valueAxis(spec, { scale: spec.zero === false }),
    series: spec.series.map((serie, index) => {
      const fill = serie.color ?? (serie.tone === "neutral" ? color.neutralDark : palette[index % palette.length]);
      const last = serie.values.length - 1;
      return {
        type: "line",
        name: serie.name,
        data: serie.values.map((value, point) => ({
          value,
          symbol: point === last ? "circle" : "none",
          symbolSize: 9,
          itemStyle: { color: fill, borderColor: color.paper, borderWidth: 2 },
        })),
        showSymbol: true,
        lineStyle: { width: 2, color: fill, type: serie.dashed ? [5, 4] : "solid", cap: "round", join: "round" },
        itemStyle: { color: fill },
        areaStyle: (area && index === 0) || serie.area ? { color: fill, opacity: 0.1 } : undefined,
        endLabel: {
          show: true,
          formatter: ({ value }) => (names.length > 1 ? `{v|${number(value, spec)}}{n|${serie.name}}` : `{v|${number(value, spec)}}`),
          rich: { v: text(10.5, 800, color.ink), n: { ...text(10, 500, color.muted), padding: [0, 0, 0, 5] } },
        },
        labelLayout: { moveOverlap: "shiftY" },
        markLine: index === 0 ? references(spec) : undefined,
        markPoint:
          index === 0 && spec.mark
            ? {
                symbol: "circle",
                symbolSize: 7,
                itemStyle: { color: fill, borderColor: color.paper, borderWidth: 2 },
                label: { ...text(10, 700, color.ink), position: "top", distance: 6, formatter: ({ value }) => number(value, spec) },
                data: [{ type: "max" }, { type: "min" }],
              }
            : undefined,
      };
    }),
  };
}

// Real × plano no padrão IBCS: plano em contorno, real cheio com o valor, e a variação colorida acima.
function variance(spec) {
  const labels = spec.data.map(([name]) => name);
  const deltas = spec.data.map(([, actual, plan]) => actual - plan);
  return {
    ...base(spec),
    legend: { ...legend(["Real", "Plano"], spec), top: 0, right: 0, left: "auto" },
    grid: [
      { left: 4, right: 4, top: 30, height: 44, containLabel: false },
      { left: 4, right: 4, top: 128, bottom: 4, containLabel: true },
    ],
    xAxis: [
      { ...categoryAxis(labels), gridIndex: 0, show: false },
      { ...xCategory(labels, spec), gridIndex: 1 },
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
        barMaxWidth: 12,
        data: deltas.map((value) => ({
          value,
          itemStyle: { color: value >= 0 ? color.good : color.bad, borderRadius: value >= 0 ? [3, 3, 0, 0] : [0, 0, 3, 3] },
          label: { position: value >= 0 ? "top" : "bottom" },
        })),
        label: { show: true, ...text(10.5, 700, color.ink), formatter: ({ value }) => signed(value, spec) },
        markLine: { silent: true, symbol: "none", data: [{ yAxis: 0 }], lineStyle: { color: color.axis, type: "solid" }, label: { show: false } },
      },
      {
        type: "bar",
        name: "Plano",
        xAxisIndex: 1,
        yAxisIndex: 1,
        barMaxWidth: 52,
        barGap: "-82%",
        data: spec.data.map(([, , plan]) => plan),
        itemStyle: { color: color.paper, borderColor: color.ink, borderWidth: 1.2 },
        label: { show: true, position: "top", ...text(10, 600, color.muted), formatter: ({ value }) => `plano ${number(value, spec)}` },
      },
      {
        type: "bar",
        name: "Real",
        xAxisIndex: 1,
        yAxisIndex: 1,
        barMaxWidth: 40,
        data: spec.data.map(([, actual]) => actual),
        itemStyle: { color: color.neutralDark },
        label: { ...valueLabel(spec, "insideTop"), color: color.paper, distance: 6 },
      },
    ],
  };
}

// Cascata (ponte): do valor inicial ao final pelas contribuições; aumento em verde, queda em vermelho, totais em tinta.
// start: ["Nome", valor]; data: [["Contribuição", delta], ...]; end: "Nome do total"
function waterfall(spec) {
  const [startName, startValue] = spec.start;
  const labels = [startName, ...spec.data.map(([name]) => name), spec.end ?? "Total"];
  const base = [0];
  const visible = [{ value: startValue, itemStyle: { color: color.neutralDark, borderRadius: [4, 4, 0, 0] } }];
  let level = startValue;
  for (const [, delta] of spec.data) {
    const next = level + delta;
    base.push(Math.min(level, next));
    visible.push({ value: Math.abs(delta), delta, itemStyle: { color: delta >= 0 ? color.good : color.bad, borderRadius: 2 } });
    level = next;
  }
  base.push(0);
  visible.push({ value: level, itemStyle: { color: color.accent, borderRadius: [4, 4, 0, 0] } });
  // "zero": false aproxima o eixo das variações; as barras de total ficam cortadas no mínimo do eixo.
  const tops = [startValue, ...visible.slice(1, -1).map((bar, index) => base[index + 1] + bar.value), level];
  const lows = [...base.slice(1, -1), startValue, level];
  const low = Math.min(...lows);
  const floor = spec.zero === false ? Math.max(0, Math.floor((low - (Math.max(...tops) - low) * 0.6) / 100) * 100) : undefined;
  return {
    animation: false,
    textStyle: { fontFamily: font, color: color.ink },
    grid: { left: 4, right: 12, top: 26, bottom: 4, containLabel: true },
    xAxis: xCategory(labels, spec),
    yAxis: valueAxis(spec, floor === undefined ? {} : { min: floor }),
    series: [
      { type: "bar", stack: "w", silent: true, itemStyle: { color: "transparent" }, data: base, barMaxWidth: 40 },
      {
        type: "bar",
        stack: "w",
        barMaxWidth: 40,
        data: visible,
        label: {
          show: true,
          position: "top",
          ...text(11, 700, color.ink),
          formatter: ({ dataIndex, value }) => (dataIndex === 0 || dataIndex === labels.length - 1 ? number(value, spec) : signed(visible[dataIndex].delta, spec)),
        },
      },
    ],
  };
}

// Rosca para até cinco partes, total no centro e nome, valor e porcentagem em cada parte.
function donut(spec) {
  const total = spec.data.reduce((sum, [, value]) => sum + value, 0);
  const tones = spec.data.length <= 2 ? [color.accent, color.neutral] : [...palette, color.neutral];
  return {
    animation: false,
    textStyle: { fontFamily: font, color: color.ink },
    title: {
      text: number(total, spec),
      subtext: spec.totalLabel ?? "total",
      left: "center",
      top: "40%",
      textStyle: text(20, 800, color.ink),
      subtextStyle: text(10, 600, color.muted),
      itemGap: 2,
    },
    series: [
      {
        type: "pie",
        radius: ["46%", "66%"],
        center: ["50%", "52%"],
        padAngle: 1.2,
        itemStyle: { borderColor: color.paper, borderWidth: 1, borderRadius: 3 },
        label: {
          show: true,
          overflow: "none",
          formatter: ({ name, value, percent: share }) => `{n|${name}}\n{v|${number(value, spec)}}{p|${number(share, { decimals: 1 })}%}`,
          rich: { n: text(10, 600, color.muted), v: text(11, 800, color.ink), p: { ...text(10, 600, color.muted), padding: [0, 0, 0, 4] } },
        },
        labelLine: { length: 8, length2: 10, lineStyle: { color: color.axis } },
        data: spec.data.map(([name, value], index) => ({
          name,
          value,
          itemStyle: { color: tones[index % tones.length], decal: index > 0 && spec.patterns !== false ? patterns[order[index % order.length]] : undefined },
        })),
      },
    ],
  };
}

// Quartis para o boxplot: mínimo, Q1, mediana, Q3 e máximo (cercas de Tukey) e os pontos fora delas.
function quartiles(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const at = (p) => {
    const index = (sorted.length - 1) * p;
    const low = Math.floor(index);
    return sorted[low] + (sorted[Math.ceil(index)] - sorted[low]) * (index - low);
  };
  const [q1, median, q3] = [at(0.25), at(0.5), at(0.75)];
  const fence = 1.5 * (q3 - q1);
  const inside = sorted.filter((value) => value >= q1 - fence && value <= q3 + fence);
  return { box: [inside[0], q1, median, q3, inside[inside.length - 1]], outliers: sorted.filter((value) => !inside.includes(value)) };
}

// Boxplot por categoria: caixa de Q1 a Q3, mediana escrita ao lado, bigodes e pontos fora da curva.
// data: [["Nome", [mín, q1, mediana, q3, máx]]] ou [["Nome", [valores brutos...]]]
function boxplot(spec) {
  const marked = highlights(spec);
  const rows = spec.data.map(([name, values]) => ({ name, ...(values.length === 5 && spec.raw !== true ? { box: values, outliers: [] } : quartiles(values)) }));
  const labels = rows.map(({ name }) => name);
  return {
    ...base(spec, { grid: { left: 4, right: 12, top: 18, bottom: 4, containLabel: true } }),
    xAxis: xCategory(labels, spec),
    yAxis: valueAxis(spec, { scale: spec.zero !== true }),
    series: [
      {
        type: "boxplot",
        boxWidth: [14, 34],
        data: rows.map(({ name, box }) => {
          const on = marked.size ? marked.has(name) : true;
          return { value: box, itemStyle: { color: on ? color.accentWash : "#f1f2f4", borderColor: on ? color.accent : color.neutralDark, borderWidth: 1.5 } };
        }),
      },
      {
        type: "scatter",
        symbolSize: 1,
        itemStyle: { color: "transparent" },
        data: rows.map(({ box }, index) => [index, box[2]]),
        label: { show: true, position: "right", distance: 20, ...text(10, 800, color.ink), formatter: ({ value }) => number(value[1], spec) },
      },
      {
        type: "scatter",
        symbolSize: 6,
        itemStyle: { color: color.paper, borderColor: color.neutralDark, borderWidth: 1.5 },
        data: rows.flatMap(({ outliers }, index) => outliers.map((value) => [index, value])),
      },
    ],
  };
}

// Histograma: distribuição em faixas encostadas, com média ou mediana marcadas.
// values: [números] e bins (quantidade de faixas), ou data: [["faixa", contagem]]
function histogram(spec) {
  let rows = spec.data;
  if (!rows) {
    const values = spec.values;
    const min = spec.min ?? Math.min(...values);
    const max = spec.max ?? Math.max(...values);
    const bins = spec.bins ?? 8;
    const step = (max - min) / bins;
    rows = Array.from({ length: bins }, (_, index) => {
      const from = min + step * index;
      const to = from + step;
      const count = values.filter((value) => value >= from && (index === bins - 1 ? value <= to : value < to)).length;
      const edge = (value) => number(value, { decimals: spec.binDecimals ?? 0 });
      return [`${edge(from)}–${edge(to)}`, count];
    });
  }
  return {
    ...base(spec, { grid: { left: 4, right: 12, top: 26, bottom: 4, containLabel: true } }),
    xAxis: {
      ...categoryAxis(rows.map(([name]) => name), spec),
      axisLabel: { ...text(9.5, 600, color.text), interval: 0 },
      name: spec.xName ?? (spec.suffix ? `faixas, em${spec.suffix}` : undefined),
    },
    yAxis: valueAxis({ ...spec, prefix: "", suffix: "" }),
    series: [
      {
        type: "bar",
        barCategoryGap: 2,
        data: rows.map(([, count]) => count),
        itemStyle: { color: color.accent, borderRadius: [3, 3, 0, 0] },
        label: { show: true, position: "top", ...text(10, 700, color.ink) },
      },
    ],
  };
}

// Dispersão: cada ponto com 2 px de papel em volta, os destacados com nome, tendência linear e médias opcionais.
// points: [[x, y, "nome"?], ...]; xName e yName dizem as unidades.
function scatter(spec) {
  const marked = highlights(spec);
  const points = spec.points;
  const extra = [];
  if (spec.trend) {
    const n = points.length;
    const mx = points.reduce((s, [x]) => s + x, 0) / n;
    const my = points.reduce((s, [, y]) => s + y, 0) / n;
    const slope = points.reduce((s, [x, y]) => s + (x - mx) * (y - my), 0) / points.reduce((s, [x]) => s + (x - mx) ** 2, 0);
    const xs = points.map(([x]) => x);
    const [x0, x1] = [Math.min(...xs), Math.max(...xs)];
    extra.push({
      type: "line",
      silent: true,
      symbol: "none",
      data: [
        [x0, my + slope * (x0 - mx)],
        [x1, my + slope * (x1 - mx)],
      ],
      lineStyle: { color: color.neutralDark, type: [5, 4], width: 1.2 },
    });
  }
  const means = spec.quadrants
    ? {
        silent: true,
        symbol: "none",
        lineStyle: { color: color.axis, type: "solid" },
        label: { ...text(9.5, 600, color.faint), position: "insideEndTop", formatter: ({ value }) => `média ${number(value, spec)}` },
        data: [{ type: "average", valueDim: "x" }, { type: "average", valueDim: "y" }],
      }
    : undefined;
  const axis = (name, extraAxis) => ({ ...valueAxis(spec), name, nameLocation: "middle", nameGap: 26, nameTextStyle: text(10, 600, color.muted), scale: true, ...extraAxis });
  return {
    ...base(spec, { grid: { left: 12, right: 72, top: 22, bottom: 22, containLabel: true } }),
    xAxis: axis(spec.xName, { splitLine: { lineStyle: { color: color.grid } }, axisLine: { show: false } }),
    yAxis: { ...axis(spec.yName), nameGap: 34 },
    series: [
      {
        type: "scatter",
        symbolSize: 10,
        data: points.map(([x, y, name]) => {
          const on = name && marked.has(name);
          return {
            value: [x, y],
            name,
            itemStyle: { color: on ? color.accent : color.neutral, borderColor: color.paper, borderWidth: 2, opacity: 1 },
            label: { show: Boolean(on || (name && spec.labelAll)), position: "right", ...text(10, on ? 700 : 600, on ? color.ink : color.muted), formatter: name },
          };
        }),
        markLine: means,
      },
      ...extra,
    ],
  };
}

// Mapa de calor: uma só cor, do papel ao laranja escuro, com o valor em cada célula.
// x: rótulos das colunas; y: rótulos das linhas; data: [[coluna, linha, valor]]
function heatmap(spec) {
  const values = spec.data.map(([, , value]) => value);
  const [min, max] = [Math.min(...values), Math.max(...values)];
  return {
    animation: false,
    textStyle: { fontFamily: font, color: color.ink },
    grid: { left: 4, right: 4, top: 4, bottom: 34, containLabel: true },
    xAxis: { ...categoryAxis(spec.x, spec), position: "top", axisLine: { show: false }, splitArea: { show: false } },
    yAxis: { ...categoryAxis(spec.y, spec), inverse: true, axisLine: { show: false } },
    visualMap: {
      min,
      max,
      calculable: false,
      orient: "horizontal",
      left: "center",
      bottom: 0,
      itemWidth: 10,
      itemHeight: 160,
      text: [number(max, spec), number(min, spec)],
      textStyle: text(10, 600, color.muted),
      inRange: { color: ["#fff3eb", "#ffc49b", "#ff8a3d", "#ff6500", "#a33d00"] },
    },
    series: [
      {
        type: "heatmap",
        data: spec.data,
        itemStyle: { borderColor: color.paper, borderWidth: 2, borderRadius: 3 },
        label: {
          show: spec.values !== false,
          ...text(9.5, 700, color.ink),
          formatter: ({ value }) => number(value[2], spec),
        },
      },
    ],
  };
}

// Funil: etapas em barras horizontais decrescentes, com o valor e a conversão desde a etapa anterior.
function funnel(spec) {
  const rows = spec.data;
  const first = rows[0][1];
  return {
    ...base(spec, { grid: { left: nameWidth(rows.map(([name]) => name)), right: 170, top: 6, bottom: 4, containLabel: false } }),
    xAxis: { type: "value", show: false, max: first },
    yAxis: { ...categoryAxis(rows.map(([name]) => name), spec), inverse: true, axisLine: { show: false } },
    series: [
      {
        type: "bar",
        barMaxWidth: 26,
        data: rows.map(([, value], index) => ({
          value,
          itemStyle: { color: index === rows.length - 1 ? color.accent : color.neutral, borderRadius: [0, 4, 4, 0] },
        })),
        label: {
          show: true,
          position: "right",
          formatter: ({ value, dataIndex }) =>
            `{v|${number(value, spec)}}{p|${dataIndex ? `${percent((value / rows[dataIndex - 1][1]) * 100)} da etapa anterior` : "100%"}}`,
          rich: { v: text(11, 800, color.ink), p: { ...text(10, 500, color.muted), padding: [0, 0, 0, 6] } },
        },
      },
    ],
  };
}

// Bullet: realizado (barra fina) contra a meta (traço) sobre faixas de referência em cinza.
// data: [["Indicador", realizado, meta, [ruim, ok, bom]?]]
function bullet(spec) {
  const rows = spec.data;
  const max = spec.max ?? Math.max(...rows.flatMap(([, actual, target, bands = []]) => [actual, target, ...bands])) * 1.05;
  const bandTones = ["#e3e5e8", "#eceef1", "#f5f6f8"];
  const bandSeries = [0, 1, 2].map((step) => ({
    type: "bar",
    stack: "bands",
    silent: true,
    barWidth: 22,
    data: rows.map(([, , , bands = [max * 0.6, max * 0.85, max]]) => (bands[step] ?? max) - (step ? bands[step - 1] : 0)),
    itemStyle: { color: bandTones[step] },
  }));
  return {
    ...base(spec, { grid: { left: nameWidth(rows.map(([name]) => name)), right: 56, top: 16, bottom: 22, containLabel: false } }),
    xAxis: { ...valueAxis(spec), max, show: spec.axis !== false },
    yAxis: { ...categoryAxis(rows.map(([name]) => name), spec), inverse: true, axisLine: { show: false } },
    series: [
      ...bandSeries,
      {
        type: "bar",
        barWidth: 8,
        barGap: "-68%",
        z: 3,
        data: rows.map(([, actual, target]) => ({ value: actual, itemStyle: { color: actual >= target ? color.ink : color.accent, borderRadius: 2 } })),
      },
      // O realizado escrito à direita da faixa, longe do traço da meta.
      {
        type: "scatter",
        symbolSize: 1,
        itemStyle: { color: "transparent" },
        data: rows.map((_, index) => [max, index]),
        label: { show: true, position: "right", distance: 8, ...text(11, 800, color.ink), formatter: ({ dataIndex }) => number(rows[dataIndex][1], spec) },
      },
      {
        type: "scatter",
        z: 4,
        symbol: "rect",
        symbolSize: [3, 24],
        itemStyle: { color: color.ink },
        data: rows.map(([, , target], index) => [target, index]),
        label: { show: true, position: "top", distance: 2, ...text(9.5, 600, color.muted), formatter: ({ value }) => `meta ${number(value[0], spec)}` },
      },
    ],
  };
}

// Haltere (antes e depois): dois pontos por linha ligados por um traço, com os dois valores escritos.
// data: [["Nome", antes, depois]]; names: ["Antes", "Depois"]
function dumbbell(spec) {
  const rows = spec.data;
  const [before, after] = spec.names ?? ["Antes", "Depois"];
  const point = (index, fill, side) => ({
    type: "scatter",
    name: [before, after][index],
    symbolSize: 11,
    z: 3,
    itemStyle: { color: fill, borderColor: color.paper, borderWidth: 2 },
    data: rows.map((row, rowIndex) => [row[index + 1], rowIndex]),
    label: {
      show: true,
      position: side,
      distance: 8,
      ...text(10.5, index ? 800 : 600, index ? color.ink : color.muted),
      formatter: ({ value }) => number(value[0], spec),
    },
  });
  return {
    ...base(spec, { grid: { left: nameWidth(rows.map(([name]) => name)), right: 40, top: 40, bottom: 22, containLabel: false } }),
    legend: legend([before, after], spec),
    xAxis: { ...valueAxis(spec), min: ({ min, max }) => Math.floor(min - (max - min) * 0.3), max: ({ min, max }) => Math.ceil(max + (max - min) * 0.15) },
    yAxis: { ...categoryAxis(rows.map(([name]) => name), spec), inverse: true, axisLine: { show: false } },
    series: [
      {
        type: "lines",
        coordinateSystem: "cartesian2d",
        silent: true,
        lineStyle: { color: color.axis, width: 3, opacity: 1 },
        data: rows.map(([, from, to], index) => ({ coords: [[from, index], [to, index]] })),
      },
      point(0, color.neutralDark, rows.some(([, from, to]) => from > to) ? "right" : "left"),
      point(1, color.accent, rows.some(([, from, to]) => from > to) ? "left" : "right"),
    ],
  };
}

// Sparkline para cartão de KPI: sem eixos, último ponto marcado. "on": true para fundo laranja.
function spark(spec) {
  const values = spec.values;
  const stroke = spec.on ? color.paper : color.ink;
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
        symbolSize: 6,
        lineStyle: { width: 1.6, color: stroke },
        itemStyle: { color: spec.on ? color.paper : color.accent, borderColor: spec.on ? color.accent : color.paper, borderWidth: 1.5 },
        areaStyle: { color: stroke, opacity: 0.08 },
      },
    ],
  };
}

const presets = {
  bar: (spec) => bar(spec),
  rank: (spec) => bar(spec, true),
  group,
  stack,
  line: (spec) => line(spec),
  area: (spec) => line(spec, true),
  variance,
  waterfall,
  donut,
  boxplot,
  histogram,
  scatter,
  heatmap,
  funnel,
  bullet,
  dumbbell,
  spark,
};
export const types = Object.keys(presets);

// Tabela com os números do gráfico, para quem precisa do valor exato (e para leitores de tela).
function table(spec) {
  const cell = (value) => `<td class="num">${number(value, spec)}</td>`;
  let head = [];
  let body = [];
  if (spec.labels && spec.series) {
    head = ["", ...spec.series.map(({ name }) => name)];
    body = spec.labels.map((label, index) => [`<td>${label}</td>`, ...spec.series.map(({ values }) => cell(values[index]))]);
  } else if (spec.type === "variance") {
    head = ["", "Real", "Plano", "Variação"];
    body = spec.data.map(([name, actual, plan]) => [`<td>${name}</td>`, cell(actual), cell(plan), `<td class="num">${signed(actual - plan, spec)}</td>`]);
  } else if (spec.data && typeof spec.data[0]?.[1] === "number") {
    head = ["", spec.valueName ?? "Valor"];
    body = spec.data.map(([name, value]) => [`<td>${name}</td>`, cell(value)]);
  }
  if (!body.length) return "";
  return `<table class="data chart-table"><thead><tr>${head.map((name, index) => `<th${index ? ' class="num"' : ""}>${name}</th>`).join("")}</tr></thead><tbody>${body.map((row) => `<tr>${row.join("")}</tr>`).join("")}</tbody></table>`;
}

export function renderChart(spec) {
  const preset = presets[spec.type];
  if (!preset) throw new Error(`tipo de gráfico desconhecido: ${spec.type}; use ${types.join(", ")}`);
  const [width, height] = spec.type === "spark" ? sizes.spark : [sizes[spec.size ?? "full"][0], spec.height ?? sizes[spec.size ?? "full"][1]];
  const chart = echarts.init(null, null, { renderer: "svg", ssr: true, width, height });
  chart.setOption(preset({ ...spec, width }));
  const svg = chart.renderToSVGString();
  chart.dispose();
  const labelled = svg.replace("<svg ", `<svg role="img" aria-label="${(spec.alt ?? "").replaceAll('"', "&quot;")}" `);
  return spec.table ? `${labelled}${table(spec)}` : labelled;
}

const decode = (value) =>
  value.replaceAll("&quot;", '"').replaceAll("&#39;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&amp;", "&");

// Troca o SVG de cada figura; rodar de novo regenera, porque o bloco data-chart fica no HTML.
export function renderCharts(html) {
  let count = 0;
  const output = html.replace(
    /(<(?:figure|div)\b[^>]*\bdata-chart='([^']*)'[^>]*>)(?:\s*<div class="chart-svg">[\s\S]*?<\/div><!--\/chart-->)?/g,
    (_match, open, json) => {
      count += 1;
      return `${open}<div class="chart-svg">${renderChart(JSON.parse(decode(json)))}</div><!--/chart-->`;
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
