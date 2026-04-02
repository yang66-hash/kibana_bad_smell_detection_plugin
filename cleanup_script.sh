#!/bin/bash

echo "🧹 开始清理项目..."

# 1. 删除console.log语句（保留注释掉的）
echo "📝 清理console.log语句..."
find . -name "*.ts" -o -name "*.tsx" | xargs sed -i '/^\s*console\.log/d'

# 2. 删除空行（保留必要的空行）
echo "📄 清理多余空行..."
find . -name "*.ts" -o -name "*.tsx" | xargs sed -i '/^$/N;/^\n$/d'

# 3. 删除TODO/FIXME注释（可选）
echo "📋 清理TODO/FIXME注释..."
find . -name "*.ts" -o -name "*.tsx" | xargs sed -i '/^\s*\/\/\s*TODO/d'
find . -name "*.ts" -o -name "*.tsx" | xargs sed -i '/^\s*\/\/\s*FIXME/d'

# 4. 删除未使用的import（需要手动检查）
echo "📦 检查未使用的import..."
echo "请手动检查以下文件中的import语句："
find . -name "*.ts" -o -name "*.tsx" | xargs grep -l "import.*from" | head -10

echo "✅ 清理完成！"
