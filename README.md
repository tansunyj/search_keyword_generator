# 高级SEO搜索关键词生成器

这是一个基于AI技术的高级SEO关键词生成器和解释工具，帮助内容创作者、营销人员和SEO专家生成高质量、高转化率的搜索关键词。

## 功能特点

- **关键词生成**：根据用户输入的搜索意图，生成优化的高级SEO关键词列表
- **关键词解释**：分析并解释任何高级SEO关键词的含义、搜索意图和潜在价值
- **示例库**：提供丰富的高级SEO关键词示例，按不同行业和类别分类
- **多语言支持**：支持多种语言的关键词生成和解释

## 技术栈

- React
- TypeScript
- TailwindCSS
- OpenAI API

## 本地开发

### 前提条件

- Node.js (v14+)
- npm 或 yarn

### 安装步骤

1. 克隆仓库
   ```bash
   git clone https://github.com/yourusername/seo-keywords-generator.git
   cd seo-keywords-generator
   ```

2. 安装依赖
   ```bash
   npm install
   # 或
   yarn install
   ```

3. 创建环境变量文件
   在项目根目录创建 `.env.local` 文件，添加以下内容：
   ```
   REACT_APP_AI_API_URL=https://openkey.cloud/v1/chat/completions
   REACT_APP_AI_API_KEY=your_api_key_here
   ```

4. 启动开发服务器
   ```bash
   npm start
   # 或
   yarn start
   ```

5. 打开浏览器访问 http://localhost:3000

## 部署到Vercel

1. 在Vercel上创建新项目，连接到GitHub仓库

2. 在环境变量设置中添加以下变量：
   - `REACT_APP_AI_API_URL`: AI API的URL
   - `REACT_APP_AI_API_KEY`: AI API的密钥（重要：这是敏感信息，必须在Vercel仪表板中设置，不要硬编码在代码中）
   - `REACT_APP_KEYWORD_GENERATOR_PROMPT`(可选): 自定义关键词生成器提示词
   - `REACT_APP_KEYWORD_EXPLAINER_PROMPT`(可选): 自定义关键词解释器提示词

3. 部署项目

## 自定义提示词

可以通过环境变量自定义AI提示词：

- `REACT_APP_KEYWORD_GENERATOR_PROMPT`: 关键词生成器提示词
- `REACT_APP_KEYWORD_EXPLAINER_PROMPT`: 关键词解释器提示词

如果不设置，系统将使用默认提示词。

## SEO优化

本项目已经进行了以下SEO优化：

1. **Meta标签**：每个页面都有适当的标题、描述和关键词标签
2. **语义HTML**：使用语义化的HTML结构，包括适当的标题层次（H1、H2等）
3. **Sitemap.xml**：提供了网站地图，帮助搜索引擎索引所有页面
4. **Robots.txt**：配置了爬虫访问规则
5. **响应式设计**：网站在各种设备上都能正常显示
6. **内部链接**：页面之间有清晰的导航和内部链接

### 更新SEO设置

如果需要更新SEO设置，可以修改以下文件：

- `public/robots.txt`：更新爬虫规则
- `public/sitemap.xml`：更新网站地图
- `src/components/layout/SEOHead.tsx`：更新SEO组件
- 各页面组件中的SEOHead使用：更新特定页面的SEO标签

## 许可证

MIT
