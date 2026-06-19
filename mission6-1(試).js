window.onload = function() {
    datetimeshow(); 
    loadAllData(); 
    checkAlerts(); 
};

function datetimeshow(){
    const datetime = new Date();
    const year = datetime.getFullYear();
    const month = datetime.getMonth() + 1;
    const day = datetime.getDate();
    const weeks = ["日", "月", "火", "水", "木", "金", "土"];
    const week = weeks[datetime.getDay()];
    
    const datetimeview = "📅 本日の日付: " + year + "年" + month + "月" + day + "日(" + week + ")";
    const object = document.getElementById("datetime");
    if(object) {
        object.innerText = datetimeview;
    }
}

const STORAGE_KEY_FOOD = "food_stock_list_v2"; 
const STORAGE_KEY_TEMPLATE = "food_template_list_v2";

let foodList = [];       
let templateList = [];   
let currentLocationFilter = "all"; 

function saveAllData() {
    localStorage.setItem(STORAGE_KEY_FOOD, JSON.stringify(foodList));
    localStorage.setItem(STORAGE_KEY_TEMPLATE, JSON.stringify(templateList));
}

function loadAllData() {
    const storedFood = localStorage.getItem(STORAGE_KEY_FOOD);
    const storedTemplate = localStorage.getItem(STORAGE_KEY_TEMPLATE);
    
    foodList = storedFood ? JSON.parse(storedFood) : [];
    templateList = storedTemplate ? JSON.parse(storedTemplate) : [];

    foodList.forEach(item => { if (!item.location) item.location = "fridge"; });
    templateList.forEach(t => { if (!t.location) t.location = "fridge"; });

    updateFoodView();      
    updateTemplateView();  
}

function changeLocationFilter(loc) {
    currentLocationFilter = loc;
    
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    if (loc === 'all') document.getElementById('tab-all').classList.add('active');
    if (loc === 'fridge') document.getElementById('tab-fridge').classList.add('active');
    if (loc === 'freezer') document.getElementById('tab-freezer').classList.add('active');
    
    updateFoodView();
}

function addTemplate() {
    const nameInput = document.getElementById("templateName");
    const categoryInput = document.getElementById("templateCategory"); 
    const locationInput = document.getElementById("templateLocation"); 
    const daysInput = document.getElementById("templateDays");

    const name = nameInput.value.trim();
    const category = categoryInput.value; 
    const location = locationInput.value; 
    const days = parseInt(daysInput.value, 10);

    if (name === "" || isNaN(days) || days < 1) {
        alert("商品名と正しい期限（日後）を入力してください！");
        return;
    }

    const newTemplate = {
        id: Date.now(),
        name: name,
        category: category, 
        location: location, 
        days: days
    };
    templateList.push(newTemplate);

    saveAllData();          
    updateTemplateView();   

    nameInput.value = "";   
    daysInput.value = "3";
}

function updateTemplateView() {
    const container = document.getElementById("quickItemContainer");
    if (!container) return;
    
    container.innerHTML = ""; 

    if(templateList.length === 0) {
        container.innerHTML = "<p style='color:#7f8c8d; font-size:14px; margin:0;'>登録されているよく使う商品はまだありません。「登録欄を開く」から追加してください。</p>";
        return;
    }

    templateList.forEach(template => {
        const btn = document.createElement("button");
        const locClass = template.location === 'freezer' ? 'freezer-btn' : 'fridge-btn';
        const locIcon = template.location === 'freezer' ? '🧊' : '🥬';
        
        btn.className = `quick-btn ${locClass}`;
        btn.innerHTML = `${locIcon} ${template.name} <span style='font-size:11px; opacity:0.85;'>(${template.days}日後)</span>`;
        
        btn.onclick = function(e) {
            if (e.target.className === 'template-delete-btn') return;
            addStockFromTemplate(template.name, template.days, template.category, template.location);
        };

        const deleteX = document.createElement("span");
        deleteX.innerHTML = "×";
        deleteX.className = "template-delete-btn";
        deleteX.title = "マスターから削除";
        deleteX.onclick = function(e) {
            e.stopPropagation();
            if(confirm(`「${template.name}」の固定ボタンを削除しますか？`)) {
                deleteTemplate(template.id);
            }
        };
        btn.appendChild(deleteX);
        container.appendChild(btn);
    });
}

function deleteTemplate(id) {
    templateList = templateList.filter(t => t.id !== id);
    saveAllData();
    updateTemplateView();
}

function addStockFromTemplate(name, daysLater, category, location) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysLater);

    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const day = String(targetDate.getDate()).padStart(2, '0');
    const limitDate = `${year}-${month}-${day}`;

    const newItem = {
        id: Date.now() + Math.random(),
        name: name,
        category: category || "その他", 
        location: location || "fridge", 
        limitDate: limitDate,
        count: 1, 
        memo: "" 
    };
    foodList.push(newItem);

    saveAllData();
    updateFoodView();
}

function setShortcutDate(daysLater) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysLater);
    
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const day = String(targetDate.getDate()).padStart(2, '0');
    
    document.getElementById("itemDate").value = `${year}-${month}-${day}`;
}

function appendMemoTag(text) {
    const memoInput = document.getElementById("itemMemo");
    memoInput.value = text;
}

function addManualItem() {
    const nameInput = document.getElementById("itemName");
    const categoryInput = document.getElementById("itemCategory"); 
    const locationInput = document.getElementById("itemLocation"); 
    const dateInput = document.getElementById("itemDate");
    const countInput = document.getElementById("itemCount");
    const memoInput = document.getElementById("itemMemo"); 

    const name = nameInput.value.trim();
    const category = categoryInput.value; 
    const location = locationInput.value; 
    const limitDate = dateInput.value;
    const count = parseInt(countInput.value, 10);
    const memo = memoInput.value.trim(); 

    if (name === "" || limitDate === "" || isNaN(count) || count < 1) {
        alert("食材名、賞味期限、正しい個数を入力してください！");
        return;
    }

    const newItem = {
        id: Date.now(),
        name: name,
        category: category, 
        location: location, 
        limitDate: limitDate,
        count: count,
        memo: memo 
    };
    foodList.push(newItem);

    saveAllData();
    updateFoodView();

    nameInput.value = "";
    dateInput.value = "";
    countInput.value = "1";
    memoInput.value = ""; 
}

// --- 6. 在庫一覧表示（野菜類を追加したカテゴリ別表示と、指定の条件カラーシステム） ---
function updateFoodView() {
    const container = document.getElementById("foodTableContainer");
    if (!container) return;
    
    container.innerHTML = ""; 

    const sortOption = document.getElementById("sortOption")?.value || "category";
    const searchQuery = document.getElementById("searchQuery")?.value.toLowerCase().trim() || "";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let filteredMasterList = foodList.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery) || (item.memo && item.memo.toLowerCase().includes(searchQuery));
        const matchesLocation = currentLocationFilter === "all" || item.location === currentLocationFilter;
        return matchesSearch && matchesLocation;
    });

    if (filteredMasterList.length === 0) {
        container.innerHTML = "<p style='color:#7f8c8d; text-align:center; padding: 30px;'>該当する食材はありません。</p>";
        return;
    }

    function createRowHtml(item) {
        const itemDate = new Date(item.limitDate);
        itemDate.setHours(0,0,0,0);

        const diffTime = itemDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

        /* 【ご指定のカラーシステムに完全同期】 */
        let rowColor = "";
        let statusText = "";
        
        if (diffDays < 0) {
            rowColor = '#545151'; // グレー：期限切れ
            statusText = `期限切れ (${Math.abs(diffDays)}日経過)`;
        } else if (diffDays === 0) {
            rowColor = '#ef0e0e'; // 赤：当日
            statusText = "今日が期限！⚠️";
        } else if (diffDays <= 2) {
            rowColor = '#f3c73a'; // 黄：2日以内
            statusText = `あと ${diffDays} 日`;
        } else if (diffDays <= 5) {
            rowColor = '#a9d31e'; // 黄緑：5日以内
            statusText = `あと ${diffDays} 日`;
        } else {
            rowColor = '#18d34a'; // 緑：余裕あり
            statusText = `あと ${diffDays} 日`;
        }

        const tr = document.createElement("tr");
        
        if (diffDays < 0) tr.style.backgroundColor = "#f5f5f5";
        else if (diffDays === 0) tr.style.backgroundColor = "#fff3f3";
        else if (diffDays <= 2) tr.style.backgroundColor = "#fffdf0";

        const categoryBadge = (sortOption !== "category") 
            ? `<span style="color: #16a085; font-size: 11px; background: #e8f8f5; padding: 2px 6px; border-radius: 4px; margin-right: 4px; font-weight:bold;">${item.category || "その他"}</span>` 
            : "";

        const locationBadge = (currentLocationFilter === "all")
            ? (item.location === 'freezer' ? `<span class="loc-badge loc-freezer">冷凍</span>` : `<span class="loc-badge loc-fridge">冷蔵</span>`)
            : "";

        const memoText = item.memo 
            ? `<span style="color: #495057; font-size: 14px; background: #f8f9fa; padding: 4px 8px; border-radius: 4px; border-left: 3px solid #7f8c8d;">📌 ${item.memo}</span>` 
            : `<span style="color: #ccc;">-</span>`;

        tr.innerHTML = `
            <td>${locationBadge}${categoryBadge}<strong>${item.name}</strong></td>
            <td style="font-family: monospace; font-size:15px;">${item.limitDate}</td>
            <td>
                <div class="qty-controls">
                    <button class="qty-btn" onclick="changeCount(${item.id}, -1)">-</button>
                    <div class="qty-val">${item.count}</div>
                    <button class="qty-btn" onclick="changeCount(${item.id}, 1)">+</button>
                </div>
            </td>
            <td><span class="status-badge" style="background-color: ${rowColor};">${statusText}</span></td>
            <td>${memoText}</td>
            <td>
                <button class="delete-icon-btn" onclick="deleteItemDirect(${item.id})" title="完全に削除">🗑️ 削除</button>
            </td>
        `;
        return tr;
    }

    function createTableTemplate() {
        const table = document.createElement("table");
        table.innerHTML = `
            <thead>
                <tr>
                    <th style="width: 25%;">食材名</th>
                    <th style="width: 15%;">賞味期限</th>
                    <th style="width: 15%;">数量調整</th>
                    <th style="width: 20%;">状態 / 残日数</th>
                    <th style="width: 15%;">メモ</th>
                    <th style="width: 10%;">操作</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;
        return table;
    }

    if (sortOption === "category") {
        // 【修正】「野菜類」を新たな独立カテゴリとして定義
        const categories = ["肉類", "飲み物", "野菜類", "その他"];
        filteredMasterList.sort((a, b) => new Date(a.limitDate) - new Date(b.limitDate));

        categories.forEach(cat => {
            // 肉類、飲み物、野菜類のどれにも属さないものを「その他」にまとめる安全設計
            const listByCat = filteredMasterList.filter(item => 
                (item.category || "その他") === cat || 
                (cat === "その他" && !["肉類", "飲み物", "野菜類"].includes(item.category))
            );

            if (listByCat.length === 0) return;

            const heading = document.createElement("div");
            heading.className = "category-heading";
            heading.innerText = `● ${cat}（${listByCat.length}件）`;
            container.appendChild(heading);

            const table = createTableTemplate();
            const tbody = table.querySelector("tbody");

            listByCat.forEach(item => {
                tbody.appendChild(createRowHtml(item));
            });
            container.appendChild(table);
        });

    } else {
        let sortedList = [...filteredMasterList];
        if (sortOption === "date_asc") {
            sortedList.sort((a, b) => new Date(a.limitDate) - new Date(b.limitDate));
        } else if (sortOption === "id_desc") {
            sortedList.sort((a, b) => b.id - a.id);
        }

        const table = createTableTemplate();
        const tbody = table.querySelector("tbody");

        sortedList.forEach(item => {
            tbody.appendChild(createRowHtml(item));
        });
        container.appendChild(table);
    }
}

function changeCount(id, amount) {
    const item = foodList.find(item => item.id === id);
    if (item) {
        item.count += amount; 
        if (item.count <= 0) {
            foodList = foodList.filter(item => item.id !== id);
        }
    }
    saveAllData();
    updateFoodView();
}

function deleteItemDirect(id) {
    const item = foodList.find(item => item.id === id);
    if (!item) return;
    if (confirm(`「${item.name}」をリストから完全に削除しますか？`)) {
        foodList = foodList.filter(item => item.id !== id);
        saveAllData();
        updateFoodView();
    }
}

function toggleTemplateForm() {
    const container = document.getElementById("templateFormContainer");
    const btn = document.getElementById("templateToggleBtn");
    
    if (container.style.display === "none") {
        container.style.display = "block"; 
        btn.innerText = "❌ 登録欄を閉じる";
        btn.style.backgroundColor = "#e74c3c"; 
    } else {
        container.style.display = "none"; 
        btn.innerText = "🛠️ 登録欄を開く";
        btn.style.backgroundColor = "#7f8c8d"; 
    }
}

function checkAlerts() {
    if (foodList.length === 0) return; 

    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    let expiredCount = 0; 
    let warningCount = 0; 

    foodList.forEach(item => {
        const itemDate = new Date(item.limitDate);
        itemDate.setHours(0, 0, 0, 0);

        const diffTime = itemDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

        if (diffDays < 0) {
            expiredCount++; 
        } else if (diffDays <= 2) {
            warningCount++; 
        }
    });

    if (expiredCount > 0 || warningCount > 0) {
        alert(`【賞味期限のお知らせ】\n\n期限切れが ${expiredCount} 件、\n2日以内（今日を含む）が ${warningCount} 件あります。\n\n在庫一覧を確認してください。`);
    }
}

function deleteExpiredItems() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiredItems = foodList.filter(item => {
        const itemDate = new Date(item.limitDate);
        itemDate.setHours(0, 0, 0, 0);
        const matchesLocation = currentLocationFilter === "all" || item.location === currentLocationFilter;
        return itemDate < today && matchesLocation;
    });

    if (expiredItems.length === 0) {
        const placeName = currentLocationFilter === "fridge" ? "冷蔵庫" : (currentLocationFilter === "freezer" ? "冷凍庫" : "全体");
        alert(`現在、${placeName}に期限切れの食材はありません。`);
        return;
    }

    const placeText = currentLocationFilter === "fridge" ? "【冷蔵庫のみ】" : (currentLocationFilter === "freezer" ? "【冷凍庫のみ】" : "【冷蔵庫・冷凍庫すべて】");
    const confirmMessage = `${placeText}の期限切れ食材が ${expiredItems.length} 件あります。\nまとめて削除してもよろしいですか？`;
    if (!confirm(confirmMessage)) return;

    foodList = foodList.filter(item => {
        const itemDate = new Date(item.limitDate);
        itemDate.setHours(0, 0, 0, 0);
        const matchesLocation = currentLocationFilter === "all" || item.location === currentLocationFilter;
        return !(itemDate < today && matchesLocation);
    });

    saveAllData();
    updateFoodView();
    alert("期限切れの食材を削除しました！");
}

function exportData() {
    const data = {
        foodList: foodList,
        templateList: templateList,
        exportedAt: new Date().toISOString()
    };
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    const now = new Date();
    const dateStr = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}`;
    a.href = url;
    a.download = `food_stock_backup_${dateStr}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.foodList && data.templateList) {
                if (confirm("データを復元しますか？現在のデータは上書きされます。")) {
                    foodList = data.foodList;
                    templateList = data.templateList;
                    
                    foodList.forEach(item => { if (!item.location) item.location = "fridge"; });
                    templateList.forEach(t => { if (!t.location) t.location = "fridge"; });

                    saveAllData();
                    updateFoodView();
                    updateTemplateView();
                    alert("データの復元が完了しました！");
                }
            } else {
                alert("ファイルの形式が正しくありません。");
            }
        } catch (err) {
            alert("ファイルの読み込みに失敗しました。正しいJSONファイルを選択してください。");
        }
    };
    reader.readAsText(file);
    event.target.value = ""; 
}