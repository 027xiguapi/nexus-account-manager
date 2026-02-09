#!/bin/bash

# 版本更新脚本
# 用法: ./scripts/bump-version.sh 1.1.0

if [ -z "$1" ]; then
  echo "错误: 请提供版本号"
  echo "用法: ./scripts/bump-version.sh 1.1.0"
  exit 1
fi

NEW_VERSION=$1

echo "更新版本到 $NEW_VERSION..."

# 更新 package.json
npm version $NEW_VERSION --no-git-tag-version

# 更新 src-tauri/tauri.conf.json
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  sed -i '' "s/\"version\": \".*\"/\"version\": \"$NEW_VERSION\"/" src-tauri/tauri.conf.json
else
  # Linux
  sed -i "s/\"version\": \".*\"/\"version\": \"$NEW_VERSION\"/" src-tauri/tauri.conf.json
fi

# 更新 src-tauri/Cargo.toml
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  sed -i '' "s/^version = \".*\"/version = \"$NEW_VERSION\"/" src-tauri/Cargo.toml
else
  # Linux
  sed -i "s/^version = \".*\"/version = \"$NEW_VERSION\"/" src-tauri/Cargo.toml
fi

echo "✅ 版本已更新到 $NEW_VERSION"
echo ""
echo "下一步："
echo "1. 检查更改: git diff"
echo "2. 提交更改: git add . && git commit -m \"chore: bump version to $NEW_VERSION\""
echo "3. 创建标签: git tag v$NEW_VERSION"
echo "4. 推送代码: git push origin main --tags"
