import * as echarts from "echarts/core";

import {
  TitleComponent, // 提示框
  LegendComponent,
  LegendPlainComponent,
  LegendScrollComponent,
  TooltipComponent, // 标题
  GridComponent, // 直角坐标系
} from "echarts/components";

// 图例组件
import {
  LineChart,
  BarChart,
  PieChart
} from "echarts/charts";

// 后续有更多扩展，在此引入
import {
  CanvasRenderer,
  SVGRenderer
} from "echarts/renderers"; // 渲染器

// 注册必须的组件
echarts.use([
  TitleComponent,
  LegendComponent,
  LegendPlainComponent,
  LegendScrollComponent,
  TooltipComponent,
  GridComponent,
  LineChart,
  BarChart,
  PieChart,
  CanvasRenderer,
  SVGRenderer,
]);

export default echarts;
