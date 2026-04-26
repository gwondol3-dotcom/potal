document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-app-form');
    const nameInput = document.getElementById('app-name');
    const urlInput = document.getElementById('app-url');
    const appGrid = document.getElementById('app-grid');
    const emptyState = document.getElementById('empty-state');
    const appCount = document.getElementById('app-count');

    // 알록달록한 그라데이션 색상 배열
    const cardGradients = [
        'from-pink-500 to-rose-500',
        'from-orange-400 to-red-500',
        'from-amber-400 to-orange-500',
        'from-emerald-400 to-teal-500',
        'from-cyan-500 to-blue-500',
        'from-blue-500 to-indigo-600',
        'from-violet-500 to-purple-600',
        'from-fuchsia-500 to-pink-600'
    ];

    // 앱 데이터 로드 (로컬 스토리지)
    let apps = JSON.parse(localStorage.getItem('webapps')) || [];

    // URL 형식 보정 (http, https 가 없으면 붙여줌)
    const formatUrl = (url) => {
        if (!/^https?:\/\//i.test(url)) {
            return `https://${url}`;
        }
        return url;
    };

    // 앱 데이터 저장
    const saveApps = () => {
        localStorage.setItem('webapps', JSON.stringify(apps));
    };

    // 랜덤 그라데이션 선택
    const getRandomGradient = () => {
        const randomIndex = Math.floor(Math.random() * cardGradients.length);
        return cardGradients[randomIndex];
    };

    // 앱 삭제 처리
    window.deleteApp = (id, event) => {
        event.preventDefault(); // 링크 이동 방지
        event.stopPropagation(); // 이벤트 버블링 방지
        
        if (confirm('이 웹앱을 삭제하시겠습니까?')) {
            apps = apps.filter(app => app.id !== id);
            saveApps();
            renderApps();
        }
    };

    // 호버 효과를 위한 헬퍼 (카드 첫글자 아이콘 생성)
    const getFirstChar = (name) => {
        return name ? name.charAt(0).toUpperCase() : '?';
    };

    // 앱 목록 렌더링
    const renderApps = () => {
        appGrid.innerHTML = '';
        
        appCount.textContent = `총 ${apps.length}개`;

        if (apps.length === 0) {
            emptyState.classList.remove('hidden');
            appGrid.classList.add('hidden');
            return;
        }

        emptyState.classList.add('hidden');
        appGrid.classList.remove('hidden');

        apps.forEach((app) => {
            const card = document.createElement('a');
            card.href = app.url;
            card.target = "_blank";
            card.rel = "noopener noreferrer";
            card.className = `group relative block h-40 rounded-2xl bg-gradient-to-br ${app.color} p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden`;

            card.innerHTML = `
                <!-- 장식용 배경 원형 효과 -->
                <div class="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white opacity-10 transition-transform duration-500 group-hover:scale-150"></div>
                <div class="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-black opacity-10 transition-transform duration-500 group-hover:scale-150"></div>
                
                <div class="relative h-full flex flex-col justify-between z-10">
                    <div class="flex justify-between items-start">
                        <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-sm">
                            ${getFirstChar(app.name)}
                        </div>
                        <button onclick="deleteApp(${app.id}, event)" class="text-white/60 hover:text-white hover:bg-white/20 rounded-full p-2 transition-colors focus:outline-none" aria-label="삭제">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-white mb-1 truncate">${app.name}</h3>
                        <p class="text-white/70 text-xs truncate max-w-[80%]">${app.url.replace(/^https?:\/\//i, '')}</p>
                    </div>
                </div>
            `;
            
            appGrid.appendChild(card);
        });
    };

    // 폼 제출 이벤트 처리
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = nameInput.value.trim();
        const urlValue = urlInput.value.trim();
        
        if (!name || !urlValue) return;

        const newApp = {
            id: Date.now(),
            name: name,
            url: formatUrl(urlValue),
            color: getRandomGradient()
        };

        apps.push(newApp);
        saveApps();
        renderApps();

        // 입력 폼 초기화
        nameInput.value = '';
        urlInput.value = '';
        nameInput.focus();
    });

    // 초기 렌더링
    renderApps();
});
