/**
 * 华峰石化数字孪生平台 - 公共JavaScript
 */

// 全局配置
const AppConfig = {
    projectName: '华峰石化数字孪生平台',
    version: '1.0.0',
    updateInterval: 5000, // 数据刷新间隔(ms)
};

// 工具函数
const Utils = {
    // 格式化日期时间
    formatDateTime(date, format = 'YYYY-MM-DD HH:mm:ss') {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const seconds = String(d.getSeconds()).padStart(2, '0');
        
        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('ss', seconds);
    },
    
    // 格式化数字
    formatNumber(num, decimals = 2) {
        if (num === null || num === undefined) return '-';
        return Number(num).toFixed(decimals);
    },
    
    // 格式化文件大小
    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
    },
    
    // 获取状态颜色类
    getStatusClass(status) {
        const statusMap = {
            'normal': 'success',
            'online': 'success',
            'running': 'success',
            'warning': 'warning',
            'alarm': 'danger',
            'danger': 'danger',
            'error': 'danger',
            'offline': 'danger',
            'stopped': 'danger'
        };
        return statusMap[status] || 'info';
    },
    
    // 防抖
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // 节流
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // 生成唯一ID
    generateId() {
        return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },
    
    // 深拷贝
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },
    
    // 本地存储
    storage: {
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.error('Storage set error:', e);
                return false;
            }
        },
        get(key, defaultValue = null) {
            try {
                const value = localStorage.getItem(key);
                return value ? JSON.parse(value) : defaultValue;
            } catch (e) {
                console.error('Storage get error:', e);
                return defaultValue;
            }
        },
        remove(key) {
            localStorage.removeItem(key);
        },
        clear() {
            localStorage.clear();
        }
    }
};

// 认证管理
const Auth = {
    // 检查登录状态
    isLoggedIn() {
        return sessionStorage.getItem('isLoggedIn') === 'true';
    },
    
    // 获取当前用户
    getUser() {
        const userStr = sessionStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },
    
    // 登录
    login(username, userInfo = {}) {
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('user', JSON.stringify({
            name: username,
            ...userInfo
        }));
    },
    
    // 登出
    logout() {
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('user');
        window.location.href = 'login.html';
    },
    
    // 检查权限
    hasPermission(permission) {
        const user = this.getUser();
        if (!user) return false;
        // 实际项目中应根据用户角色判断权限
        return user.permissions?.includes(permission) || user.role === '管理员';
    }
};

// 导航管理
const Navigation = {
    currentPage: 'dashboard',
    
    // 页面配置
    pages: {
        'index': { title: '总览', icon: 'home', url: 'index.html' },
        'tank-monitoring': { title: '罐区监控', icon: 'box', url: 'tank-monitoring.html' },
        'equipment': { title: '设备管理', icon: 'cpu', url: 'equipment.html' },
        'video': { title: '视频监控', icon: 'video', url: 'video.html' },
        'analysis': { title: '数据分析', icon: 'bar-chart', url: 'analysis.html' },
        'settings': { title: '系统设置', icon: 'settings', url: 'settings.html' }
    },
    
    // 初始化导航
    init() {
        this.updateActiveNav();
        this.bindEvents();
    },
    
    // 更新活动导航
    updateActiveNav() {
        const path = window.location.pathname;
        const filename = path.split('/').pop().replace('.html', '');
        
        document.querySelectorAll('.sidebar-nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === filename) {
                item.classList.add('active');
            }
        });
        
        // 更新面包屑
        const page = this.pages[filename];
        if (page) {
            const breadcrumb = document.querySelector('.header-breadcrumb');
            if (breadcrumb) {
                breadcrumb.innerHTML = `
                    <span class="header-breadcrumb-item">首页</span>
                    <span class="header-breadcrumb-sep">/</span>
                    <span class="header-breadcrumb-item active">${page.title}</span>
                `;
            }
        }
    },
    
    // 绑定事件
    bindEvents() {
        // 侧边栏折叠
        const toggleBtn = document.querySelector('.header-toggle');
        const sidebar = document.querySelector('.app-sidebar');
        
        if (toggleBtn && sidebar) {
            toggleBtn.addEventListener('click', () => {
                sidebar.classList.toggle('collapsed');
            });
        }
        
        // 导航点击
        document.querySelectorAll('.sidebar-nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const page = item.dataset.page;
                if (page) {
                    window.location.href = this.pages[page]?.url || page + '.html';
                }
            });
        });
        
        // 用户菜单
        const userMenu = document.querySelector('.header-user');
        const userDropdown = document.querySelector('.user-dropdown');
        
        if (userMenu && userDropdown) {
            userMenu.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle('open');
            });
            
            document.addEventListener('click', () => {
                userDropdown.classList.remove('open');
            });
        }
        
        // 登出
        const logoutBtn = document.querySelector('[data-action="logout"]');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                Auth.logout();
            });
        }
    }
};

// 模态框管理
const Modal = {
    // 打开模态框
    open(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    },
    
    // 关闭模态框
    close(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    },
    
    // 初始化所有模态框
    init() {
        // 关闭按钮
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.closest('.modal-overlay').classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // 点击外部关闭
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });
    }
};

// 提示消息
const Toast = {
    show(message, type = 'info', duration = 3000) {
        // 创建提示元素
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-icon">
                ${this.getIcon(type)}
            </div>
            <div class="toast-message">${message}</div>
        `;
        
        // 添加样式
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: ${this.getBgColor(type)};
            border: 1px solid ${this.getBorderColor(type)};
            border-radius: 8px;
            color: white;
            font-size: 14px;
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideInRight 0.3s ease;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `;
        
        document.body.appendChild(toast);
        
        // 自动移除
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },
    
    getIcon(type) {
        const icons = {
            success: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
            error: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
            warning: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
            info: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
        };
        return icons[type] || icons.info;
    },
    
    getBgColor(type) {
        const colors = {
            success: 'rgba(0, 255, 136, 0.9)',
            error: 'rgba(255, 71, 87, 0.9)',
            warning: 'rgba(255, 170, 0, 0.9)',
            info: 'rgba(0, 212, 255, 0.9)'
        };
        return colors[type] || colors.info;
    },
    
    getBorderColor(type) {
        const colors = {
            success: '#00ff88',
            error: '#ff4757',
            warning: '#ffaa00',
            info: '#00d4ff'
        };
        return colors[type] || colors.info;
    }
};

// 表格工具
const Table = {
    // 排序
    sort(table, column, direction = 'asc') {
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        
        rows.sort((a, b) => {
            const aVal = a.cells[column].textContent.trim();
            const bVal = b.cells[column].textContent.trim();
            
            // 尝试数值排序
            const aNum = parseFloat(aVal);
            const bNum = parseFloat(bVal);
            
            if (!isNaN(aNum) && !isNaN(bNum)) {
                return direction === 'asc' ? aNum - bNum : bNum - aNum;
            }
            
            // 字符串排序
            return direction === 'asc' 
                ? aVal.localeCompare(bVal) 
                : bVal.localeCompare(aVal);
        });
        
        rows.forEach(row => tbody.appendChild(row));
    },
    
    // 筛选
    filter(table, callback) {
        const tbody = table.querySelector('tbody');
        const rows = tbody.querySelectorAll('tr');
        
        rows.forEach(row => {
            if (callback(row)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    },
    
    // 分页
    paginate(table, options = {}) {
        const { itemsPerPage = 10 } = options;
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const totalPages = Math.ceil(rows.length / itemsPerPage);
        
        // 显示第一页
        this.showPage(table, 1, itemsPerPage);
        
        return {
            totalPages,
            showPage: (page) => this.showPage(table, page, itemsPerPage),
            nextPage: (current) => this.showPage(table, Math.min(current + 1, totalPages), itemsPerPage),
            prevPage: (current) => this.showPage(table, Math.max(current - 1, 1), itemsPerPage)
        };
    },
    
    showPage(table, page, itemsPerPage) {
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        
        rows.forEach((row, index) => {
            const start = (page - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            
            if (index >= start && index < end) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
};

// 图表工具（基础实现）
const Charts = {
    // 折线图
    createLineChart(container, data, options = {}) {
        const {
            labels = [],
            datasets = [],
            colors = ['#00d4ff', '#00ff88', '#ffaa00', '#ff4757'],
            showArea = true,
            showGrid = true,
            animated = true
        } = options;
        
        const width = container.clientWidth;
        const height = container.clientHeight || 200;
        const padding = { top: 20, right: 20, bottom: 30, left: 50 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;
        
        // 计算数据范围
        let maxValue = 0;
        let minValue = 0;
        datasets.forEach(ds => {
            const values = ds.data || [];
            maxValue = Math.max(maxValue, ...values);
            minValue = Math.min(minValue, ...values);
        });
        
        const range = maxValue - minValue || 1;
        const yScale = chartHeight / range;
        
        // 生成SVG
        let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
        
        // 网格线
        if (showGrid) {
            for (let i = 0; i <= 5; i++) {
                const y = padding.top + (chartHeight / 5) * i;
                const value = maxValue - (range / 5) * i;
                svg += `
                    <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" 
                        stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
                    <text x="${padding.left - 10}" y="${y + 4}" 
                        fill="#5a6a8a" font-size="10" text-anchor="end">${value.toFixed(1)}</text>
                `;
            }
        }
        
        // 绘制每个数据集
        datasets.forEach((ds, dsIndex) => {
            const color = colors[dsIndex % colors.length];
            const points = ds.data.map((value, i) => {
                const x = padding.left + (chartWidth / (ds.data.length - 1)) * i;
                const y = padding.top + chartHeight - (value - minValue) * yScale;
                return `${x},${y}`;
            });
            
            // 区域填充
            if (showArea) {
                const areaPath = `M${padding.left},${padding.top + chartHeight} ${points.map(p => `L${p}`).join(' ')} L${padding.left + chartWidth},${padding.top + chartHeight} Z`;
                svg += `<defs>
                    <linearGradient id="gradient${dsIndex}" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:${color};stop-opacity:0.3"/>
                        <stop offset="100%" style="stop-color:${color};stop-opacity:0"/>
                    </linearGradient>
                </defs>
                <path d="${areaPath}" fill="url(#gradient${dsIndex})"/>`;
            }
            
            // 折线
            const linePath = `M${points.join(' L')}`;
            svg += `<path d="${linePath}" fill="none" stroke="${color}" stroke-width="2" 
                ${animated ? 'class="chart-line-animated"' : ''}/>`;
            
            // 数据点
            if (options.showPoints !== false) {
                points.forEach((point, i) => {
                    const [x, y] = point.split(',');
                    svg += `<circle cx="${x}" cy="${y}" r="4" fill="${color}">
                        <title>${ds.label}: ${ds.data[i]}</title>
                    </circle>`;
                });
            }
        });
        
        // X轴标签
        labels.forEach((label, i) => {
            const x = padding.left + (chartWidth / (labels.length - 1)) * i;
            svg += `<text x="${x}" y="${height - 8}" fill="#5a6a8a" font-size="10" text-anchor="middle">${label}</text>`;
        });
        
        svg += '</svg>';
        
        container.innerHTML = svg;
        return container;
    },
    
    // 柱状图
    createBarChart(container, data, options = {}) {
        const { 
            labels = [],
            datasets = [],
            colors = ['#00d4ff', '#00ff88', '#ffaa00', '#ff4757'],
            horizontal = false,
            stacked = false
        } = options;
        
        const width = container.clientWidth;
        const height = container.clientHeight || 200;
        const padding = { top: 20, right: 20, bottom: 40, left: 50 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;
        
        // 计算最大值
        let maxValue = 0;
        if (stacked) {
            labels.forEach((_, i) => {
                const sum = datasets.reduce((acc, ds) => acc + (ds.data?.[i] || 0), 0);
                maxValue = Math.max(maxValue, sum);
            });
        } else {
            datasets.forEach(ds => {
                maxValue = Math.max(maxValue, ...(ds.data || []));
            });
        }
        
        const barWidth = horizontal ? chartHeight / labels.length : chartWidth / labels.length;
        const barPadding = barWidth * 0.2;
        
        let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
        
        // 网格线
        for (let i = 0; i <= 5; i++) {
            const pos = padding.top + (chartHeight / 5) * i;
            const value = maxValue - (maxValue / 5) * i;
            svg += `
                <line x1="${padding.left}" y1="${pos}" x2="${width - padding.right}" y2="${pos}" 
                    stroke="rgba(255,255,255,0.05)"/>
                <text x="${padding.left - 10}" y="${pos + 4}" 
                    fill="#5a6a8a" font-size="10" text-anchor="end">${value.toFixed(0)}</text>
            `;
        }
        
        // 绘制柱子
        labels.forEach((label, i) => {
            let offset = 0;
            
            datasets.forEach((ds, dsIndex) => {
                const value = ds.data?.[i] || 0;
                const color = ds.color || colors[dsIndex % colors.length];
                
                if (horizontal) {
                    const barLength = (value / maxValue) * chartWidth;
                    const y = padding.top + (chartHeight / labels.length) * i + barPadding;
                    const h = barWidth - barPadding * 2;
                    
                    svg += `<rect x="${padding.left}" y="${y}" width="${barLength}" height="${h}" 
                        fill="${color}" rx="2">
                        <title>${label}: ${value}</title>
                    </rect>`;
                } else {
                    const barHeight = stacked 
                        ? (value / maxValue) * chartHeight 
                        : (value / maxValue) * chartHeight;
                    const x = padding.left + barWidth * i + barPadding;
                    const w = (barWidth - barPadding * 2) / (stacked ? 1 : datasets.length);
                    
                    svg += `<rect x="${x + w * dsIndex + (stacked ? offset : 0)}" 
                        y="${padding.top + chartHeight - barHeight}" 
                        width="${stacked ? (value / maxValue) * chartWidth : w}" 
                        height="${barHeight}" fill="${color}" rx="2">
                        <title>${label}: ${value}</title>
                    </rect>`;
                    
                    if (stacked) offset += barHeight;
                }
            });
            
            // X轴标签
            const x = horizontal 
                ? padding.left + chartWidth + 10 
                : padding.left + barWidth * i + barWidth / 2;
            const y = horizontal 
                ? padding.top + (chartHeight / labels.length) * i + barWidth / 2 + 4
                : height - 10;
            
            svg += `<text x="${x}" y="${y}" fill="#5a6a8a" font-size="10" 
                text-anchor="${horizontal ? 'start' : 'middle'}">${label}</text>`;
        });
        
        svg += '</svg>';
        container.innerHTML = svg;
        return container;
    },
    
    // 饼图
    createPieChart(container, data, options = {}) {
        const { colors = ['#00d4ff', '#00ff88', '#ffaa00', '#ff4757', '#9b59b6'] } = options;
        
        const width = container.clientWidth;
        const height = container.clientHeight || 200;
        const radius = Math.min(width, height) / 2 - 20;
        const centerX = width / 2;
        const centerY = height / 2;
        
        const total = data.reduce((sum, item) => sum + item.value, 0);
        
        let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
        
        let startAngle = 0;
        
        data.forEach((item, i) => {
            const percentage = item.value / total;
            const endAngle = startAngle + percentage * Math.PI * 2;
            
            const x1 = centerX + radius * Math.cos(startAngle);
            const y1 = centerY + radius * Math.sin(startAngle);
            const x2 = centerX+ radius * Math.cos(endAngle);
            const y2 = centerY + radius * Math.sin(endAngle);
            
            const largeArc = percentage > 0.5 ? 1 : 0;
            
            const path = [
                `M ${centerX} ${centerY}`,
                `L ${x1} ${y1}`,
                `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
                'Z'
            ].join(' ');
            
            svg += `<path d="${path}" fill="${colors[i % colors.length]}" stroke="#0a0e17" stroke-width="2">
                <title>${item.label}: ${item.value} (${(percentage * 100).toFixed(1)}%)</title>
            </path>`;
            
            // 标签线
            const midAngle = startAngle + percentage * Math.PI;
            const labelRadius = radius + 20;
            const labelX = centerX + labelRadius * Math.cos(midAngle);
            const labelY = centerY + labelRadius * Math.sin(midAngle);
            
            svg += `<text x="${labelX}" y="${labelY}" fill="#8b9dc3" font-size="11" 
                text-anchor="${labelX > centerX ? 'start' : 'end'}">
                ${item.label} (${(percentage * 100).toFixed(0)}%)
            </text>`;
            
            startAngle = endAngle;
        });
        
        svg += '</svg>';
        container.innerHTML = svg;
        return container;
    }
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 检查登录
    if (!Auth.isLoggedIn() && !window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
        return;
    }
    
    // 更新时间
    const timeElements = document.querySelectorAll('.header-time, .current-time');
    if (timeElements.length > 0) {
        const updateTime = () => {
            const now = new Date();
            const formatted = Utils.formatDateTime(now, 'YYYY-MM-DD HH:mm:ss');
            timeElements.forEach(el => el.textContent = formatted);
        };
        updateTime();
        setInterval(updateTime, 1000);
    }
    
    // 初始化导航
    Navigation.init();
    
    // 初始化模态框
    Modal.init();
});

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    .chart-line-animated {
        stroke-dasharray: 1000;
        stroke-dashoffset: 1000;
        animation: drawLine 2s ease forwards;
    }
    @keyframes drawLine {
        to { stroke-dashoffset: 0; }
    }
`;
document.head.appendChild(style);

// 导出到全局
window.App = {
    config: AppConfig,
    utils: Utils,
    auth: Auth,
    nav: Navigation,
    modal: Modal,
    toast: Toast,
    table: Table,
    charts: Charts
};
