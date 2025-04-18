# 小谷记账簿 - 多功能个人记账系统

![系统截图](https://via.placeholder.com/800x400?text=Demo+Screenshot) <!-- 建议替换为实际截图 -->

一个融合控制台操作与Web可视化界面的个人记账管理系统，支持多维度财务统计、数据持久化存储和跨平台使用。

## ✨ 功能特性

### 控制台版本
- 📝 收支记录管理（收入/支出分类）
- 🔍 多条件查询与统计（总收支/分类统计）
- 💾 数据文件持久化存储（TXT格式）
- 📊 ASCII风格报表输出

### Web可视化版本
- 🎨 响应式现代UI设计
- 📈 交互式图表（收支比例饼图/月度趋势图）
- 📥 一键导出Excel报表
- 🗑️ 记录编辑/删除操作
- 🛠️ 智能本地存储（LocalStorage）
- 📱 移动端自适应布局
- 🗂️ 多级分类管理（6种支出+3种收入类别）

## 🛠️ 技术栈

**核心架构**  
`C++11` `HTML5` `CSS3` `JavaScript`

**可视化组件**  
📊 Chart.js (数据图表)  
📑 SheetJS (Excel导出)

**样式框架**  
🎨 Bootstrap 5.1

## ⚙️ 安装指南

### 控制台版本
```bash
# 克隆仓库
git clone https://github.com/yourusername/accounting-system.git

# 编译项目（需安装g++）
cd console-version
g++ main.cpp account_item.cpp common.cpp -o AccountBook

# 运行程序
./AccountBook
