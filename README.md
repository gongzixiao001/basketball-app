# 闹钟刺客 · 官方下载网站

静态 HTML / CSS / JavaScript，无构建框架、无 npm 依赖、无第三方统计、无外部字体请求。

- 网站：https://gongzixiao001.github.io/basketball-app/
- 仓库：https://github.com/gongzixiao001/basketball-app
- APK：https://github.com/gongzixiao001/basketball-app/releases
- 联系：alick.ceng@gmail.com

## 文件

| 路径 | 用途 |
|---|---|
| index.html / styles.css / app.js | 页面、白红玻璃样式、交互 |
| data/i18n.json | 简体、繁体、英语、日语；同一组键 |
| data/release.json | 已核验的版本、APK体积、SHA-256、发布日期与真实下载地址 |
| data/site.json | 演示视频地址、海报与联系信息 |
| assets/images | APP现有图标及真实Android截图的WebP副本 |
| assets/fonts | APP现有字体及许可证 |
| docs/DESIGN_SYSTEM.md | 设计来源、视觉规范和待确认项 |
| docs/screenshot-sources.json | 截图采集版本、日期、尺寸和原图哈希 |
| scripts/check_site.py | 相对路径、四语言、图片和发布状态检查 |
| scripts/sync_release.py | 从真实GitHub Releases更新下载信息 |

## 本地预览

在此目录运行Python 3：

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

打开 http://127.0.0.1:8765/。语言选择保存在本站浏览器中，不读取或修改APP偏好。

## GitHub Pages发布

采用 **main分支 / 根目录**，不是SPA，不需要重写路由：

1. 提交并推送本目录的静态文件到main。
2. 仓库Settings → Pages → Source：Deploy from a branch。
3. Branch：main；Folder：/(root)；Save。
4. 等待Pages任务完成，再核验网站。

内部资源使用相对路径，兼容 /basketball-app/ 项目站点；.nojekyll跳过不需要的Jekyll处理。
参考：[GitHub Pages发布设置](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)。

## 更新APK

1. 在GitHub Releases创建实际版本标签，上传APK并Publish release。
2. 运行：

```powershell
python scripts/sync_release.py
python scripts/check_site.py
```

3. 在data/i18n.json的四种语言中更新版本说明。
4. 提交并推送data/release.json和文案文件，Pages自动重新发布。

脚本只读取非草稿、非预发布、已上传完成的.apk附件。没有正式APK时保留待发布状态，绝不拼接猜测地址。
发布日期来自published_at；体积来自附件size；SHA-256来自附件digest或实际文件。
页面在发布状态、地址、日期及体积均有效时才开放下载。浏览时不请求GitHub API，避免限流和额外加载。

## 替换演示视频

1. 将真实视频放到assets/video/demo.mp4，或使用公开HTTPS视频地址。
2. 在data/site.json设置video.src，可选设置video.poster。
3. 页面自动以原生播放器替换准备中占位。不自动播放，不伪造素材。

当前未提供正式演示片。截图来自v3.4.7模拟器中的实际APP；最新APK版本与截图版本分开标注。

## Android项目

这是独立网站仓库。仅复制展示资源，不包含或修改Android代码、比赛库、私人球员档案、签名密钥或Gradle配置。
