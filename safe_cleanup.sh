#!/bin/bash

echo "🛡️ 安全清理脚本 - 会先备份再清理"

# 创建备份目录
BACKUP_DIR="../bad_smell_detection_plugin_backup_$(date +%Y%m%d_%H%M%S)"
echo "📦 创建备份到: $BACKUP_DIR"
cp -r . "$BACKUP_DIR"

echo "✅ 备份完成！"

# 询问用户是否继续
read -p "是否继续清理？(y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 取消清理"
    exit 1
fi

echo "🧹 开始清理..."

# 1. 删除console.log（保留注释的）
echo "📝 清理console.log语句..."
find . -name "*.ts" -o -name "*.tsx" | xargs sed -i '/^\s*console\.log/d'

# 2. 删除多余空行
echo "📄 清理多余空行..."
find . -name "*.ts" -o -name "*.tsx" | xargs sed -i '/^$/N;/^\n$/d'

# 3. 删除TODO注释
echo "📋 清理TODO注释..."
find . -name "*.ts" -o -name "*.tsx" | xargs sed -i '/^\s*\/\/\s*TODO/d'

echo "✅ 清理完成！"
echo "📊 清理统计："
echo "  - 删除了console.log语句"
echo "  - 删除了多余空行"
echo "  - 删除了TODO注释"
echo "  - 备份位置: $BACKUP_DIR"
