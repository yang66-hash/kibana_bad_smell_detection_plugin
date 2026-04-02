# 模块使用情况分析报告

## 核心坏味道检测功能
- knowledge_base/ - 知识库 ✅ 核心功能
- detection_overview/ - 检测概览 ✅ 核心功能  
- show_detection_result/ - 显示检测结果 ✅ 核心功能
- detction_view/ - 检测视图 ✅ 核心功能

## 可能无用的APM功能模块
1. **correlations** (52KB) - 相关性分析
   - 使用情况: 24个文件引用
   - 状态: 在路由中未使用，可删除

2. **anomaly_detection** (28KB) - 异常检测
   - 使用情况: 26个文件引用
   - 状态: 在settings路由中使用，但BSD可能不需要

3. **mobile** (8KB) - 移动端支持
   - 使用情况: 93个文件引用
   - 状态: 在路由配置中大量使用，但BSD可能不需要

4. **waterfall** (8KB) - 瀑布图
   - 使用情况: 55个文件引用
   - 状态: 在路由中使用，但BSD可能不需要

5. **custom_link** (16KB) - 自定义链接
   - 使用情况: 18个文件引用
   - 状态: 在settings路由中使用，但BSD可能不需要

6. **storage_explorer** (未知大小) - 存储探索器
   - 使用情况: 9个文件引用
   - 状态: 在路由中使用，但BSD可能不需要

7. **fleet** (未知大小) - Fleet集成
   - 使用情况: 13个文件引用
   - 状态: 在模板中使用，但BSD可能不需要

8. **serverless** (未知大小) - 无服务器支持
   - 使用情况: 31个文件引用
   - 状态: 在模板中使用，但BSD可能不需要

## 建议删除的模块
基于坏味道检测的核心功能，以下模块可以安全删除：
- correlations
- anomaly_detection  
- mobile
- waterfall
- custom_link
- storage_explorer
- fleet
- serverless
