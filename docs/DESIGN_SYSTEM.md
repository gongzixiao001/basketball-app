# 网站视觉规范与来源

## 方向

遵照本次最新指示：网站改为白色底。选用APP现有white-red（白红）主题，不修改Android APP。
保持暖白、竞技红、深色文字、细边框、圆角控制和玻璃层次；网站采用更疏朗的内容排版。
不添加无依据的用户数量、评分、性能数据或第三方背书。

## 提取值

来源：outputs/v3.4.11/src/themes.json → white-red.tokens。

| 变量 | 实际值 | 网站用途 |
|---|---|---|
| canvas | #f0f0eb | 暖白背景 |
| surface | #fffefa | 面板底色 |
| raised | #f2e4e2 | 淡红层次 |
| text | #22242a | 正文 |
| muted | #6b6566 | 说明文字 |
| edge | #d6c9c6 | 边界 |
| accent | #b51f32 | 主操作/强调 |
| accentInk | #fff8f5 | 红色按钮文字 |

字体：APP现有BebasNeue-Regular.ttf用于数字，BarlowCondensed-Bold.ttf用于短标签。中文、日文使用设备系统字体；字体附OFL许可证。
图标：APP现有icons/glowing-basketball.png，仅制作512像素WebP和64像素favicon副本。

## 网站适配值

这些是网站布局决定，不声称APP已有相同参数：

- 内容最大宽1184px；桌面双列首屏，手机单列；700px与950px断点。
- 玻璃面板26px圆角，半透明暖白渐变、24px背景模糊、1px高光边和低透明阴影。
- 主按钮至少50px高；画廊选项至少77px高；3px竞技红键盘焦点。
- 真实backdrop-filter；不支持时回退为实色。
- 克制的进入和位移动画；prefers-reduced-motion关闭动画和平滑滚动。

## 素材真实性

docs/screenshot-sources.json记录6张实际运行Android APK的原图。
副本无损WebP编码，不改写界面、不替换文字、不伪造数据；手机外框是网站展示容器。
源截图v3.4.7，2026-10-16采集，Android 15模拟器，使用演示球员。
摄像截图色块为模拟器相机测试画面，不代表真实拍摄质量；页面已说明。

## 国际化与待确认项

- 四种语言共享98个翻译键；切换不重载，保存于本站localStorage。
- 英文/日文正式商标译名待确认，保留中文品牌；繁体显示「鬧鐘刺客」。
- 作者姓名保留原文「土鱼」，使用指定Gmail。
- 正式演示视频及封面尚未提供，显示准备中。
- 新版真机截图可后续替换，现有截图标明版本。
