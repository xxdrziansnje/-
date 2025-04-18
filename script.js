// 存储记录的数组
let records = JSON.parse(localStorage.getItem('records')) || [];

// 获取DOM元素
const form = document.getElementById('expenseForm');
const recordsList = document.getElementById('recordsList');
const totalIncome = document.getElementById('totalIncome');
const totalExpense = document.getElementById('totalExpense');
const balance = document.getElementById('balance');

// 图表实例
let pieChart;
let lineChart;

// 添加新的全局变量
let filteredRecords = [];
const modal = document.getElementById('editModal');
const closeBtn = document.getElementsByClassName('close')[0];

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    initCharts();
    updateUI();
});

// 添加记录
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const now = new Date();
    const defaultDate = now.toISOString().split('T')[0]; // 获取当前日期 YYYY-MM-DD

    const record = {
        id: Date.now(),
        date: document.getElementById('date').value || defaultDate,
        amount: parseFloat(document.getElementById('amount').value),
        type: document.getElementById('type').value || 'expense', // 默认为支出
        category: document.getElementById('category').value || '其他',
        description: document.getElementById('description').value || ''
    };
    
    records.push(record);
    localStorage.setItem('records', JSON.stringify(records));
    updateUI();
    form.reset();
});

// 删除记录
function deleteRecord(id) {
    records = records.filter(record => record.id !== id);
    localStorage.setItem('records', JSON.stringify(records));
    updateUI();
}

// 筛选功能
function filterByMonth() {
    const monthFilter = document.getElementById('monthFilter').value;
    if (!monthFilter) return;
    
    filteredRecords = records.filter(record => 
        record.date.startsWith(monthFilter)
    );
    updateUI(filteredRecords);
}

function clearFilter() {
    document.getElementById('monthFilter').value = '';
    filteredRecords = [];
    updateUI(records);
}

// 导出功能
function exportToExcel() {
    const dataToExport = (filteredRecords.length > 0 ? filteredRecords : records)
        .map(record => ({
            日期: record.date,
            类型: record.type === 'income' ? '收入' : '支出',
            分类: record.category,
            描述: record.description,
            金额: record.amount
        }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "记账记录");
    XLSX.writeFile(workbook, "记账记录.xlsx");
}

// 编辑功能
function editRecord(id) {
    const record = records.find(r => r.id === id);
    if (!record) return;

    document.getElementById('editId').value = record.id;
    document.getElementById('editDate').value = record.date;
    document.getElementById('editAmount').value = record.amount;
    document.getElementById('editType').value = record.type;
    document.getElementById('editCategory').value = record.category;
    document.getElementById('editDescription').value = record.description;

    modal.style.display = "block";
}

// 关闭模态框
closeBtn.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// 处理编辑表单提交
document.getElementById('editForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const id = parseInt(document.getElementById('editId').value);
    const recordIndex = records.findIndex(r => r.id === id);
    
    if (recordIndex === -1) return;

    records[recordIndex] = {
        id: id,
        date: document.getElementById('editDate').value,
        amount: parseFloat(document.getElementById('editAmount').value),
        type: document.getElementById('editType').value,
        category: document.getElementById('editCategory').value,
        description: document.getElementById('editDescription').value
    };

    localStorage.setItem('records', JSON.stringify(records));
    modal.style.display = "none";
    updateUI(filteredRecords.length > 0 ? filteredRecords : records);
});

// 修改更新UI函数以接受数据参数
function updateUI(dataToShow = records) {
    // 更新记录列表
    recordsList.innerHTML = dataToShow.map(record => `
        <tr>
            <td>${record.date}</td>
            <td class="${record.type}">${record.type === 'income' ? '收入' : '支出'}</td>
            <td>${record.category}</td>
            <td>${record.description}</td>
            <td class="${record.type}">
                ${record.type === 'income' ? '+' : '-'}¥${record.amount}
            </td>
            <td>
                <button class="btn-edit" onclick="editRecord(${record.id})">编辑</button>
                <button class="btn-delete" onclick="deleteRecord(${record.id})">删除</button>
            </td>
        </tr>
    `).join('');
    
    // 计算统计数据
    const income = dataToShow
        .filter(record => record.type === 'income')
        .reduce((sum, record) => sum + record.amount, 0);
    
    const expense = dataToShow
        .filter(record => record.type === 'expense')
        .reduce((sum, record) => sum + record.amount, 0);
    
    totalIncome.textContent = `¥${income.toFixed(2)}`;
    totalExpense.textContent = `¥${expense.toFixed(2)}`;
    balance.textContent = `¥${(income - expense).toFixed(2)}`;

    updateCharts(dataToShow);
}

// 初始化图表
function initCharts() {
    // 饼图
    const pieCtx = document.getElementById('pieChart').getContext('2d');
    pieChart = new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: ['收入', '支出'],
            datasets: [{
                data: [0, 0],
                backgroundColor: ['#4CAF50', '#f44336']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // 折线图
    const lineCtx = document.getElementById('lineChart').getContext('2d');
    lineChart = new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: '收入',
                borderColor: '#4CAF50',
                data: []
            }, {
                label: '支出',
                borderColor: '#f44336',
                data: []
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// 修改更新图表函数以接受数据参数
function updateCharts(dataToShow = records) {
    // 更新饼图
    const income = dataToShow
        .filter(record => record.type === 'income')
        .reduce((sum, record) => sum + record.amount, 0);
    
    const expense = dataToShow
        .filter(record => record.type === 'expense')
        .reduce((sum, record) => sum + record.amount, 0);

    pieChart.data.datasets[0].data = [income, expense];
    pieChart.update();

    // 更新折线图
    const monthlyData = {};
    dataToShow.forEach(record => {
        const month = record.date.substring(0, 7);
        if (!monthlyData[month]) {
            monthlyData[month] = { income: 0, expense: 0 };
        }
        monthlyData[month][record.type] += record.amount;
    });

    const months = Object.keys(monthlyData).sort();
    const incomeData = months.map(month => monthlyData[month].income);
    const expenseData = months.map(month => monthlyData[month].expense);

    lineChart.data.labels = months;
    lineChart.data.datasets[0].data = incomeData;
    lineChart.data.datasets[1].data = expenseData;
    lineChart.update();
} 