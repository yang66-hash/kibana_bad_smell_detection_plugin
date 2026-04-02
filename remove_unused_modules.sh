#!/bin/bash

echo "🗑️ 删除未使用的APM功能模块"
echo "⚠️  警告: 这将删除大量APM相关功能，请确保这些功能在你的坏味道检测插件中不需要"

# 创建备份
BACKUP_DIR="../bad_smell_detection_plugin_modules_backup_$(date +%Y%m%d_%H%M%S)"
echo "📦 创建备份到: $BACKUP_DIR"
cp -r . "$BACKUP_DIR"

# 询问用户确认
echo ""
echo "将删除以下模块:"
echo "  - correlations (相关性分析)"
echo "  - anomaly_detection (异常检测)"  
echo "  - mobile (移动端支持)"
echo "  - waterfall (瀑布图)"
echo "  - custom_link (自定义链接)"
echo "  - storage_explorer (存储探索器)"
echo "  - fleet (Fleet集成)"
echo "  - serverless (无服务器支持)"
echo ""

read -p "确认删除这些模块？(y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 取消删除"
    exit 1
fi

echo "🧹 开始删除模块..."

# 删除common目录下的模块
echo "删除common目录下的模块..."
rm -rf common/correlations
rm -rf common/anomaly_detection
rm -rf common/mobile
rm -rf common/waterfall
rm -rf common/custom_link
rm -rf common/storage_explorer
rm -rf common/fleet
rm -rf common/serverless

# 删除public目录下对应的组件
echo "删除public目录下的组件..."
rm -rf public/components/app/correlations
rm -rf public/components/app/mobile
rm -rf public/components/app/storage_explorer
rm -rf public/components/app/settings/anomaly_detection
rm -rf public/components/app/settings/custom_link
rm -rf public/components/app/transaction_details/waterfall_with_summary
rm -rf public/components/app/trace_explorer
rm -rf public/components/routing/mobile_service_detail
rm -rf public/components/routing/templates/mobile_service_template

# 删除相关的context和hooks
echo "删除相关的context和hooks..."
rm -rf public/context/anomaly_detection_jobs
rm -rf public/context/service_anomaly_timeseries
rm -rf public/hooks/use_preferred_service_anomaly_timeseries.ts

# 删除server端的相关路由
echo "删除server端的相关路由..."
rm -rf server/routes/service_map

echo "✅ 模块删除完成！"
echo "📊 删除统计:"
echo "  - 删除了8个主要功能模块"
echo "  - 删除了相关的组件、路由和配置"
echo "  - 备份位置: $BACKUP_DIR"
echo ""
echo "⚠️  注意: 你可能需要手动清理路由配置文件中的相关引用"
