#!/bin/bash

echo "🎯 保守删除方案 - 只删除最确定不需要的模块"

# 创建备份
BACKUP_DIR="../bad_smell_detection_plugin_conservative_backup_$(date +%Y%m%d_%H%M%S)"
echo "📦 创建备份到: $BACKUP_DIR"
cp -r . "$BACKUP_DIR"

echo ""
echo "将删除以下确定不需要的模块:"
echo "  - correlations (相关性分析) - 52KB"
echo "  - custom_link (自定义链接) - 16KB" 
echo "  - storage_explorer (存储探索器) - 未知大小"
echo ""

read -p "确认删除这些模块？(y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 取消删除"
    exit 1
fi

echo "🧹 开始保守删除..."

# 删除最确定不需要的模块
echo "删除correlations模块..."
rm -rf common/correlations
rm -rf public/components/app/correlations

echo "删除custom_link模块..."
rm -rf common/custom_link
rm -rf public/components/app/settings/custom_link
rm -rf public/components/shared/transaction_action_menu/custom_link_menu_section
rm -rf public/components/shared/transaction_action_menu/custom_link_flyout.tsx

echo "删除storage_explorer模块..."
rm -rf common/storage_explorer_types.ts
rm -rf public/components/app/storage_explorer
rm -rf public/components/routing/home/storage_explorer.tsx

echo "✅ 保守删除完成！"
echo "📊 删除统计:"
echo "  - 删除了3个确定不需要的模块"
echo "  - 保留了可能有用的模块(mobile, waterfall, fleet等)"
echo "  - 备份位置: $BACKUP_DIR"
echo ""
echo "💡 如果项目运行正常，可以考虑进一步删除其他模块"
