---
name: HFDigitalTwin-UIUX设计开发
overview: 为华峰石化数字孪生平台开发深蓝科技风格的数据大屏UI界面，包含顶部导航、左右数据面板、3D模型展示区、漫游控制面板和底部状态栏。
design:
  architecture:
    framework: vue
  styleKeywords:
    - 深蓝科技风
    - 数据可视化
    - 数字孪生
    - 毛玻璃效果
    - 发光文字
    - 3D沉浸感
    - 工业大屏
    - 暗色主题
  fontSystem:
    fontFamily: Noto Sans SC
    heading:
      size: 24px
      weight: 600
    subheading:
      size: 18px
      weight: 500
    body:
      size: 14px
      weight: 400
  colorSystem:
    primary:
      - "#00F0FF"
      - "#00FFA2"
    background:
      - "#0A1628"
      - "#0F1E3A"
    text:
      - "#FFFFFF"
      - "#8B9DC3"
    functional:
      - "#FF4D4F"
      - "#00FFA2"
      - "#FAAD14"
todos:
  - id: init-project
    content: 初始化Vue3+Vite项目并安装依赖（Vue3/TypeScript/Tailwind/Pinia/ECharts）
    status: completed
  - id: create-layout
    content: 创建基础布局组件（AppHeader/AppFooter/LeftPanel/RightPanel）实现毛玻璃效果和响应式框架
    status: completed
    dependencies:
      - init-project
  - id: left-panels
    content: 开发左侧数据面板（ZoneStatsCard传感器仪表盘DeviceListAlertList）
    status: completed
    dependencies:
      - create-layout
  - id: right-panels
    content: 开发右侧数据面板（VideoPlayerSensorDetail趋势图ReportPanel）
    status: completed
    dependencies:
      - create-layout
  - id: spark-viewer
    content: 集成Spark引擎创建3D模型渲染组件（SparkViewer）支持PLY模型加载
    status: completed
    dependencies:
      - init-project
  - id: point-markers
    content: 实现3D图钉点位标注组件（PointMarker）支持四种状态颜色和交互
    status: completed
    dependencies:
      - spark-viewer
  - id: roam-control
    content: 开发漫游控制面板（RoamControl）实现自动/自由漫游模式切换
    status: completed
    dependencies:
      - spark-viewer
  - id: dashboard-view
    content: 组装DashboardView页面整合所有组件实现完整数据大屏
    status: completed
    dependencies:
      - left-panels
      - right-panels
      - spark-viewer
      - point-markers
      - roam-control
  - id: responsive-optimize
    content: 实现响应式适配笔记本端侧边栏折叠功能和多分辨率适配
    status: completed
    dependencies:
      - dashboard-view
---

## 产品概述

华峰石化数字孪生平台是一个基于Vue3 + Spark技术栈的工业数字孪生可视化系统，面向石化工业罐区监控场景。

## 核心功能

1. **数据大屏首页**：深蓝科技风格的数据可视化大屏，采用三栏布局（左侧面板20%、中心3D模型60%、右侧面板20%）
2. **顶部导航栏**：企业Logo、系统标题（带发光效果）、系统设置/用户信息
3. **左侧数据面板**：罐区统计卡片、传感器数据概览仪表盘、设备状态列表、告警信息列表
4. **中心3D实景模型区**：Spark引擎加载3DGS模型、图钉点位标注（红/蓝/绿/灰四色状态）、悬浮漫游控制面板
5. **右侧数据面板**：实时监控画面、传感器详细数据与趋势图、检测报告面板、快捷操作区
6. **底部状态栏**：系统状态、数据刷新时间、告警信息滚动条
7. **漫游功能**：自动漫游（预设路径+速度调节）和自由漫游（WASD+鼠标控制）两种模式
8. **响应式适配**：支持1920×1080到4K大屏，笔记本端侧边栏可折叠

## 技术约束

- 前端框架：Vue 3
- 3D引擎：Spark（Gaussian Splatting渲染）
- 配色：主背景#0A1628、主色调#00F0FF、辅助色#00FFA2、告警色#FF4D4F
- 字体：思源黑体/微软雅黑
- 3D模型资源：PLY文件（https://storage.yzs.im/Huafeng-0212/ply/0-5.ply）

## Tech Stack

- **Frontend Framework**: Vue 3 + TypeScript
- **Build Tool**: Vite
- **3D Engine**: Spark (Gaussian Splatting)
- **UI Styling**: Tailwind CSS + 自定义CSS变量
- **State Management**: Pinia
- **Routing**: Vue Router
- **Charts**: ECharts
- **Icons**: Heroicons / Lucide Vue

## Implementation Approach

### 系统架构

采用组件化分层架构，按功能模块划分组件，确保可维护性和复用性：

```
src/
├── components/          # 公共组件
│   ├── layout/         # 布局组件（Header/Sidebar/Footer）
│   ├── panels/         # 数据面板组件
│   ├── charts/         # 图表组件
│   └── common/         # 通用UI组件
├── views/              # 页面视图
├── stores/             # Pinia状态管理
├── composables/        # Vue组合式函数
├── utils/              # 工具函数
└── assets/             # 静态资源
```

### 3D渲染方案

- 使用Spark引擎加载3DGS PLY模型
- 实现LOD分级渲染优化性能
- 图钉点位使用Billboard技术始终面向相机
- 漫游功能通过控制相机position和target实现

### 响应式设计

- 使用CSS Grid布局主框架
- 大屏固定20%-60%-20%比例
- 笔记本端侧边栏通过transform实现滑入滑出
- 使用CSS媒体查询适配不同分辨率

### 性能优化

- 3D模型异步加载，显示loading状态
- 图表使用requestAnimationFrame节流
- 告警列表虚拟滚动
- 使用keep-alive缓存非活动面板

## Directory Structure

```
/Users/lakerman/CodeBuddy/huafeng/HFDigitalTwin/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppHeader.vue          # [NEW] 顶部导航栏（64px，毛玻璃效果）
│   │   │   ├── AppFooter.vue          # [NEW] 底部状态栏（告警滚动）
│   │   │   ├── LeftPanel.vue          # [NEW] 左侧数据面板容器
│   │   │   └── RightPanel.vue         # [NEW] 右侧数据面板容器
│   │   ├── panels/
│   │   │   ├── ZoneStatsCard.vue      # [NEW] 罐区统计卡片
│   │   │   ├── SensorGauge.vue        # [NEW] 传感器仪表盘
│   │   │   ├── DeviceList.vue         # [NEW] 设备状态列表
│   │   │   ├── AlertList.vue          # [NEW] 告警信息列表
│   │   │   ├── VideoPlayer.vue        # [NEW] 实时监控画面
│   │   │   ├── SensorDetail.vue       # [NEW] 传感器详细数据+趋势图
│   │   │   └── ReportPanel.vue        # [NEW] 检测报告面板
│   │   ├── map/
│   │   │   ├── SparkViewer.vue        # [NEW] Spark 3D模型渲染组件
│   │   │   ├── PointMarker.vue        # [NEW] 3D图钉点位组件
│   │   │   └── RoamControl.vue        # [NEW] 漫游控制面板（悬浮）
│   │   └── charts/
│   │       └── TrendChart.vue         # [NEW] 趋势曲线图组件
│   ├── views/
│   │   └── DashboardView.vue          # [NEW] 数据大屏首页
│   ├── stores/
│   │   ├── deviceStore.ts             # [NEW] 设备数据状态管理
│   │   ├── alertStore.ts              # [NEW] 告警状态管理
│   │   └── roamStore.ts               # [NEW] 漫游状态管理
│   ├── composables/
│   │   ├── useSpark.ts                # [NEW] Spark引擎初始化
│   │   ├── useResponsive.ts           # [NEW] 响应式布局
│   │   └── useAutoScroll.ts           # [NEW] 自动滚动
│   ├── utils/
│   │   └── constants.ts               # [NEW] 常量定义（颜色、配置）
│   ├── App.vue                        # [NEW] 根组件
│   └── main.ts                        # [NEW] 入口文件
├── docs/
│   └── UI功能需求文档.md              # [EXIST] 需求文档
├── public/
│   └── models/                        # [NEW] 3D模型资源目录
├── index.html                         # [NEW] HTML入口
├── vite.config.ts                     # [NEW] Vite配置
├── tailwind.config.js                 # [NEW] Tailwind配置
├── tsconfig.json                      # [NEW] TypeScript配置
└── package.json                       # [NEW] 项目依赖
```

## 设计风格

采用深蓝科技风（Deep Blue Tech Style），符合工业数字孪生平台的专业调性。设计参考低空经济无人机数字孪生可视化平台，强调数据可视化的专业性和现代感。

## 设计特点

- **深色主题**：深海军蓝背景（#0A1628）减少视觉疲劳，突出数据内容
- **高对比亮色**：青蓝色（#00F0FF）作为主色调，用于关键数据和交互元素
- **毛玻璃效果**：导航栏和面板使用半透明背景+模糊效果，增加层次感
- **发光文字**：标题文字添加text-shadow发光效果，增强科技感
- **数据可视化**：使用ECharts仪表盘、折线图等多样化图表展示数据
- **3D沉浸感**：中心区域最大化展示3D实景模型，营造身临其境的感觉

## 布局设计

采用经典的三栏式数据大屏布局：

- 顶部：64px固定导航栏，Logo+标题+功能按钮
- 主体：三栏布局，左右各20%数据面板，中间60% 3D模型区
- 底部：40px状态栏，显示系统状态和告警滚动

## 响应式策略

- 大屏（>=1920px）：标准三栏布局
- 中屏（1366-1919px）：侧边栏可折叠收起，点击按钮展开
- 小屏（<1366px）：不建议使用，提示使用更大屏幕

## 交互动效

- 面板hover效果：边框高亮、轻微阴影
- 图钉点位：呼吸动画效果，悬停放大
- 数据刷新：数字滚动动画
- 告警信息：横向无缝滚动
- 漫游模式切换：平滑过渡动画