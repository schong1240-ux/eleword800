// script.js

document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('app-container');

    function showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
            screen.classList.add('hidden');
        });
        const activeScreen = document.getElementById(screenId);
        if (activeScreen) {
            activeScreen.classList.remove('hidden');
            activeScreen.classList.add('active');
            // 화면이 활성화될 때마다 특정 이벤트 리스너를 다시 연결해야 하는 경우 여기에 추가
            if (screenId.startsWith('onboarding-screen-')) {
                setupOnboardingNavigation();
            }
            if (screenId === 'main-dashboard-screen') {
                setupMainDashboardListeners();
            }
            if (screenId === 'learning-selection-screen') {
                setupLearningSelectionListeners();
            }
            if (screenId === 'word-card-screen') {
                setupWordCardListeners();
            }
            if (screenId === 'word-quiz-screen') {
                setupWordQuizListeners();
            }
            if (screenId === 'my-wordbook-screen') {
                setupMyWordbookListeners();
            }
            if (screenId === 'learning-report-screen') {
                setupLearningReportListeners();
            }
            if (screenId === 'settings-screen') {
                setupSettingsListeners();
            }
        }
    }

    // 스플래시 화면
    function renderSplashScreen() {
        // 스플래시 화면은 한 번만 렌더링되도록 수정
        if (!document.getElementById('splash-screen')) {
            appContainer.insertAdjacentHTML('beforeend', `
                <div id="splash-screen" class="screen active">
                    <h1>NE능률</h1>
                    <div class="spinner"></div>
                </div>
            `);
        }
        setTimeout(() => {
            showScreen('onboarding-screen-1'); // 첫 번째 온보딩 화면으로 이동
        }, 2000);
    }

    // 온보딩 화면
    let currentOnboardingScreen = 1;
    const totalOnboardingScreens = 3;

    function renderOnboardingScreen(screenNum) {
        let title = '';
        let description = '';
        let image = '';

        if (screenNum === 1) {
            title = '맞춤형 학습';
            description = '학습자 레벨에 맞춰 단어를 추천하고, 효율적인 학습 경로를 제공합니다.';
            image = 'https://via.placeholder.com/200/6200ee/ffffff?text=Custom+Learning';
        } else if (screenNum === 2) {
            title = '게임화된 요소';
            description = '다양한 퀴즈와 챌린지로 지루함 없이 단어를 마스터하세요.';
            image = 'https://via.placeholder.com/200/03dac6/ffffff?text=Gamified+Elements';
        } else if (screenNum === 3) {
            title = 'AI 발음 피드백';
            description = '정확한 발음을 위한 AI 피드백으로 자신감을 키워줍니다.';
            image = 'https://via.placeholder.com/200/bb86fc/ffffff?text=AI+Feedback';
        }

        const onboardingScreenElement = document.getElementById(`onboarding-screen-${screenNum}`);
        if (!onboardingScreenElement) { // 화면이 없으면 새로 추가
            appContainer.insertAdjacentHTML('beforeend', `
                <div id="onboarding-screen-${screenNum}" class="screen onboarding-screen hidden">
                    <img src="${image}" alt="${title}">
                    <h2>${title}</h2>
                    <p>${description}</p>
                    <div class="onboarding-dots">
                        ${Array.from({ length: totalOnboardingScreens }, (_, i) => `<span class="dot ${i + 1 === screenNum ? 'active' : ''}"></span>`).join('')}
                    </div>
                    <div class="onboarding-navigation">
                        ${screenNum > 1 ? '<button id="prev-onboarding">이전</button>' : '<span></span>'}
                        <button id="next-onboarding">${screenNum === totalOnboardingScreens ? '시작하기' : '다음'}</button>
                    </div>
                </div>
            `);
        } else { // 화면이 있으면 내용만 업데이트
            onboardingScreenElement.querySelector('img').src = image;
            onboardingScreenElement.querySelector('h2').textContent = title;
            onboardingScreenElement.querySelector('p').textContent = description;
            onboardingScreenElement.querySelector('.onboarding-dots').innerHTML = 
                `${Array.from({ length: totalOnboardingScreens }, (_, i) => `<span class="dot ${i + 1 === screenNum ? 'active' : ''}"></span>`).join('')}`;
            onboardingScreenElement.querySelector('.onboarding-navigation').innerHTML = 
                `${screenNum > 1 ? '<button id="prev-onboarding">이전</button>' : '<span></span>'}
                <button id="next-onboarding">${screenNum === totalOnboardingScreens ? '시작하기' : '다음'}</button>`;
        }
    }

    function setupOnboardingNavigation() {
        const nextButton = document.getElementById('next-onboarding');
        const prevButton = document.getElementById('prev-onboarding');
        const currentScreenElement = document.querySelector('.onboarding-screen.active');
        if (!currentScreenElement) return;

        const screenNum = parseInt(currentScreenElement.id.split('-')[2]);

        if (nextButton) {
            nextButton.onclick = () => {
                if (screenNum < totalOnboardingScreens) {
                    currentOnboardingScreen++;
                    showScreen(`onboarding-screen-${currentOnboardingScreen}`);
                } else {
                    showScreen('login-signup-screen');
                }
            };
        }

        if (prevButton) {
            prevButton.onclick = () => {
                if (screenNum > 1) {
                    currentOnboardingScreen--;
                    showScreen(`onboarding-screen-${currentOnboardingScreen}`);
                }
            };
        }
        // 점 업데이트
        document.querySelectorAll('.onboarding-dots .dot').forEach((dot, index) => {
            if (index + 1 === screenNum) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // 로그인/회원가입 화면
    function renderLoginSignupScreen() {
        if (!document.getElementById('login-signup-screen')) {
            appContainer.insertAdjacentHTML('beforeend', `
                <div id="login-signup-screen" class="screen hidden">
                    <h2>로그인 또는 회원가입</h2>
                    <div class="form-group">
                        <label for="email">이메일</label>
                        <input type="email" id="email" placeholder="이메일 주소">
                    </div>
                    <div class="form-group">
                        <label for="password">비밀번호</label>
                        <input type="password" id="password" placeholder="비밀번호">
                    </div>
                    <button class="btn-primary" id="login-button">로그인</button>
                    <div class="social-login-buttons">
                        <button class="google">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google">
                            Google로 로그인
                        </button>
                        <button class="kakao">
                            <img src="https://developers.kakao.com/assets/img/about/logos/kakaolink_icon.png" alt="Kakao">
                            카카오로 로그인
                        </button>
                    </div>
                </div>
            `);
        }
    }

    function setupLoginSignupListeners() {
        document.getElementById('login-button').onclick = () => {
            alert('로그인 기능은 아직 구현되지 않았습니다.');
            showScreen('main-dashboard-screen'); // 임시로 메인 화면으로 이동
        };
    }

    // 메인 대시보드 화면
    function renderMainDashboardScreen() {
        if (!document.getElementById('main-dashboard-screen')) {
            appContainer.insertAdjacentHTML('beforeend', `
                <div id="main-dashboard-screen" class="screen hidden">
                    <h2>메인 대시보드</h2>
                    <p>학습자의 현재 레벨, 학습 진행률, 오늘 학습해야 할 단어 수, 학습 챌린지 정보 등을 보여줍니다.</p>
                    <div class="tab-bar">
                        <button id="tab-learn">학습 시작</button>
                        <button id="tab-wordbook">단어장</button>
                        <button id="tab-profile">프로필/설정</button>
                        <button id="tab-report">리포트</button>
                    </div>
                </div>
            `);
        }
    }

    function setupMainDashboardListeners() {
        document.getElementById('tab-learn').onclick = () => showLearningSelectionScreen();
        document.getElementById('tab-wordbook').onclick = () => showMyWordbookScreen();
        document.getElementById('tab-profile').onclick = () => showSettingsScreen();
        document.getElementById('tab-report').onclick = () => showLearningReportScreen();
    }

    // 학습 선택 화면
    function renderLearningSelectionScreen() {
        if (!document.getElementById('learning-selection-screen')) {
            appContainer.insertAdjacentHTML('beforeend', `
                <div id="learning-selection-screen" class="screen hidden">
                    <h2>학습 모드 선택</h2>
                    <button class="btn-primary" id="new-word-learning">신규 단어 학습</button>
                    <button class="btn-primary" id="review-quiz">복습 퀴즈</button>
                    <button class="btn-primary" id="spelling-practice">스펠링 연습</button>
                    <button class="btn-primary" id="listening-practice">듣기 연습</button>
                </div>
            `);
        }
    }

    function setupLearningSelectionListeners() {
        document.getElementById('new-word-learning').onclick = () => showWordCardScreen();
        document.getElementById('review-quiz').onclick = () => showWordQuizScreen();
        document.getElementById('spelling-practice').onclick = () => alert('스펠링 연습 화면 준비 중...');
        document.getElementById('listening-practice').onclick = () => alert('듣기 연습 화면 준비 중...');
    }

    // 단어 카드 화면
    let currentWordIndex = 0;
    function renderWordCardScreen() {
        // 단어 카드 화면은 매번 새로운 단어를 보여주기 위해 내용을 업데이트합니다.
        const word = words[currentWordIndex];
        if (!word) {
            alert('모든 단어를 학습했습니다!');
            currentWordIndex = 0; // 초기화
            showScreen('main-dashboard-screen');
            return;
        }

        const wordCardScreenElement = document.getElementById('word-card-screen');
        if (!wordCardScreenElement) {
            appContainer.insertAdjacentHTML('beforeend', `
                <div id="word-card-screen" class="screen hidden">
                    <h2>단어 카드</h2>
                    <div class="word-card">
                        <p class="word-spelling"></p>
                        <p class="word-meaning"></p>
                        <button id="speak-word">발음 듣기</button>
                        <button id="memorized-word">암기 완료</button>
                        <button id="difficult-word">어려운 단어</button>
                        <button id="next-word">다음 단어</button>
                    </div>
                </div>
            `);
        }
        // 단어 내용 업데이트
        const activeWordCardScreen = document.getElementById('word-card-screen');
        if (activeWordCardScreen) {
            activeWordCardScreen.querySelector('.word-spelling').textContent = word.spelling;
            activeWordCardScreen.querySelector('.word-meaning').textContent = word.meaning;
        }
    }

    function setupWordCardListeners() {
        document.getElementById('speak-word').onclick = () => {
            const word = words[currentWordIndex];
            if (word) {
                const utterance = new SpeechSynthesisUtterance(word.spelling);
                speechSynthesis.speak(utterance);
            }
        };
        document.getElementById('memorized-word').onclick = () => {
            const word = words[currentWordIndex];
            if (word) {
                if (!myWordbook.some(w => w.spelling === word.spelling)) {
                    myWordbook.push({ ...word, status: 'memorized' });
                    alert(`${word.spelling} (을)를 암기 완료 단어장에 추가했습니다.`);
                }
            }
            moveToNextWordCard();
        };
        document.getElementById('difficult-word').onclick = () => {
            const word = words[currentWordIndex];
            if (word) {
                if (!myWordbook.some(w => w.spelling === word.spelling)) {
                    myWordbook.push({ ...word, status: 'difficult' });
                    alert(`${word.spelling} (을)를 어려운 단어장에 추가했습니다.`);
                }
            }
            moveToNextWordCard();
        };
        document.getElementById('next-word').onclick = () => {
            moveToNextWordCard();
        };
    }

    function moveToNextWordCard() {
        currentWordIndex++;
        renderWordCardScreen(); // 새 단어 카드 렌더링
        showScreen('word-card-screen'); // 화면 표시
    }

    // 단어 퀴즈 화면 (객관식/주관식)
    let currentQuizWordIndex = 0;
    function renderWordQuizScreen() {
        const word = words[currentQuizWordIndex];
        if (!word) {
            alert('모든 퀴즈를 완료했습니다!');
            currentQuizWordIndex = 0; // 초기화
            showScreen('main-dashboard-screen');
            return;
        }

        const isMultipleChoice = Math.random() < 0.5; // 50% 확률로 객관식 또는 주관식
        let quizContentHtml = '';
        const correctAnswer = word.spelling;

        if (isMultipleChoice) {
            const options = [word.spelling];
            while (options.length < 4) {
                const randomIndex = Math.floor(Math.random() * words.length);
                const randomWord = words[randomIndex];
                if (!options.includes(randomWord.spelling)) {
                    options.push(randomWord.spelling);
                }
            }
            options.sort(() => Math.random() - 0.5); // 보기 섞기

            quizContentHtml = `
                <p class="quiz-question">다음 단어의 뜻은 무엇일까요? <br><strong>${word.meaning}</strong></p>
                <div class="quiz-options">
                    ${options.map(option => `<button class="quiz-option-button">${option}</button>`).join('')}
                </div>
            `;
        } else {
            quizContentHtml = `
                <p class="quiz-question">다음 뜻에 맞는 단어를 입력하세요. <br><strong>${word.meaning}</strong></p>
                <input type="text" class="quiz-input" id="quiz-answer" placeholder="정답을 입력하세요">
                <button class="quiz-submit-button" id="submit-quiz">제출</button>
            `;
        }

        const wordQuizScreenElement = document.getElementById('word-quiz-screen');
        if (!wordQuizScreenElement) {
            appContainer.insertAdjacentHTML('beforeend', `
                <div id="word-quiz-screen" class="screen hidden">
                    <h2>단어 퀴즈</h2>
                    <div id="quiz-content">${quizContentHtml}</div>
                    <div class="quiz-feedback"></div>
                    <button class="btn-primary" id="quiz-back-button" style="margin-top: 20px;">뒤로</button>
                </div>
            `);
        } else {
            wordQuizScreenElement.querySelector('#quiz-content').innerHTML = quizContentHtml;
            wordQuizScreenElement.querySelector('.quiz-feedback').textContent = ''; // 피드백 초기화
        }
    }

    function setupWordQuizListeners() {
        const word = words[currentQuizWordIndex];
        if (!word) return; // 단어가 없으면 리스너 설정하지 않음
        const correctAnswer = word.spelling;

        document.getElementById('quiz-back-button').onclick = () => {
            currentQuizWordIndex = 0; // 퀴즈 인덱스 초기화
            showScreen('learning-selection-screen');
        };

        // 객관식 버튼 리스너 (동적으로 추가될 수 있으므로 querySelectorAll 사용)
        document.querySelectorAll('#word-quiz-screen .quiz-option-button').forEach(button => {
            button.onclick = (e) => {
                // 이전에 추가된 클래스 제거
                document.querySelectorAll('#word-quiz-screen .quiz-option-button').forEach(btn => {
                    btn.classList.remove('correct', 'incorrect');
                });

                if (e.target.textContent.toLowerCase() === correctAnswer.toLowerCase().split(',')[0].trim()) {
                    e.target.classList.add('correct');
                    document.querySelector('#word-quiz-screen .quiz-feedback').textContent = '정답입니다!';
                    document.querySelector('#word-quiz-screen .quiz-feedback').style.color = 'green';
                } else {
                    e.target.classList.add('incorrect');
                    document.querySelector('#word-quiz-screen .quiz-feedback').textContent = `오답입니다. 정답은 ${correctAnswer.split(',')[0].trim()} 입니다.`;
                    document.querySelector('#word-quiz-screen .quiz-feedback').style.color = 'red';
                    document.querySelectorAll('#word-quiz-screen .quiz-option-button').forEach(btn => {
                        if (btn.textContent.toLowerCase() === correctAnswer.toLowerCase().split(',')[0].trim()) {
                            btn.classList.add('correct');
                        }
                    });
                }
                setTimeout(() => {
                    currentQuizWordIndex++;
                    renderWordQuizScreen();
                    showScreen('word-quiz-screen');
                }, 1500);
            };
        });

        // 주관식 제출 버튼 리스너 (존재할 경우)
        const submitQuizButton = document.getElementById('submit-quiz');
        if (submitQuizButton) {
            submitQuizButton.onclick = () => {
                const userAnswer = document.getElementById('quiz-answer').value.trim();
                const feedbackDiv = document.querySelector('#word-quiz-screen .quiz-feedback');
                if (userAnswer.toLowerCase() === correctAnswer.toLowerCase().split(',')[0].trim()) {
                    feedbackDiv.textContent = '정답입니다!';
                    feedbackDiv.style.color = 'green';
                } else {
                    feedbackDiv.textContent = `오답입니다. 정답은 ${correctAnswer.split(',')[0].trim()} 입니다.`;
                    feedbackDiv.style.color = 'red';
                }
                setTimeout(() => {
                    currentQuizWordIndex++;
                    renderWordQuizScreen();
                    showScreen('word-quiz-screen');
                }, 1500);
            };
        }
    }

    // 나만의 단어장 화면
    let myWordbook = [];
    function renderMyWordbookScreen() {
        const myWordbookScreenElement = document.getElementById('my-wordbook-screen');
        if (!myWordbookScreenElement) {
            appContainer.insertAdjacentHTML('beforeend', `
                <div id="my-wordbook-screen" class="screen hidden">
                    <h2>나만의 단어장</h2>
                    <div class="wordbook-list"></div>
                    <button class="btn-primary" id="wordbook-back-button" style="margin-top: 20px;">뒤로</button>
                </div>
            `);
        }
        // 단어장 목록 업데이트
        const wordbookList = document.querySelector('#my-wordbook-screen .wordbook-list');
        if (wordbookList) {
            wordbookList.innerHTML = `
                ${myWordbook.length > 0 ? 
                    myWordbook.map(word => `
                        <div class="wordbook-item">
                            <span>${word.spelling} - ${word.meaning} (${word.status === 'memorized' ? '암기 완료' : '어려운 단어'})</span>
                            <button data-spelling="${word.spelling}">삭제</button>
                        </div>
                    `).join('') 
                    : '<p>아직 단어가 없습니다.</p>'
                }
            `;
        }
    }

    function setupMyWordbookListeners() {
        document.querySelectorAll('#my-wordbook-screen .wordbook-item button').forEach(button => {
            button.onclick = (e) => {
                const spellingToRemove = e.target.dataset.spelling;
                myWordbook = myWordbook.filter(word => word.spelling !== spellingToRemove);
                renderMyWordbookScreen(); // 화면 새로고침
                showScreen('my-wordbook-screen'); // 화면 표시 유지
            };
        });
        document.getElementById('wordbook-back-button').onclick = () => showScreen('main-dashboard-screen');
    }

    // 학습 리포트 화면
    function renderLearningReportScreen() {
        if (!document.getElementById('learning-report-screen')) {
            appContainer.insertAdjacentHTML('beforeend', `
                <div id="learning-report-screen" class="screen hidden">
                    <h2>학습 리포트</h2>
                    <div class="report-stats">
                        <div class="stat-box">
                            <h3>총 학습 단어</h3>
                            <p id="report-total-words"></p>
                        </div>
                        <div class="stat-box">
                            <h3>암기 완료 단어</h3>
                            <p id="report-memorized-words"></p>
                        </div>
                        <div class="stat-box">
                            <h3>어려운 단어</h3>
                            <p id="report-difficult-words"></p>
                        </div>
                        <div class="stat-box">
                            <h3>퀴즈 정답률</h3>
                            <p id="report-quiz-rate"></p>
                        </div>
                    </div>
                    <div class="chart-container">
                        <p>학습 통계 차트 (구현 예정)</p>
                    </div>
                    <button class="btn-primary" id="back-to-dashboard-from-report" style="margin-top: 20px;">대시보드로 돌아가기</button>
                </div>
            `);
        }
        // 임시 데이터 업데이트
        const totalWordsLearned = myWordbook.length;
        const memorizedWordsCount = myWordbook.filter(w => w.status === 'memorized').length;
        const difficultWordsCount = myWordbook.filter(w => w.status === 'difficult').length;
        const totalQuizAttempted = currentQuizWordIndex; // 퀴즈 시도 횟수
        const quizCorrectRate = totalQuizAttempted > 0 ? (Math.floor(Math.random() * 20) + 80) : 0; // 임시 정답률 80~99%

        document.getElementById('report-total-words').textContent = totalWordsLearned;
        document.getElementById('report-memorized-words').textContent = memorizedWordsCount;
        document.getElementById('report-difficult-words').textContent = difficultWordsCount;
        document.getElementById('report-quiz-rate').textContent = `${quizCorrectRate}%`;
    }

    function setupLearningReportListeners() {
        document.getElementById('back-to-dashboard-from-report').onclick = () => showScreen('main-dashboard-screen');
    }

    // 설정 화면
    function renderSettingsScreen() {
        if (!document.getElementById('settings-screen')) {
            appContainer.insertAdjacentHTML('beforeend', `
                <div id="settings-screen" class="screen hidden">
                    <h2>설정</h2>
                    <div class="setting-item">
                        <label for="notification-toggle">알림 설정</label>
                        <input type="checkbox" id="notification-toggle" checked>
                    </div>
                    <div class="setting-item">
                        <label for="difficulty-select">학습 난이도</label>
                        <select id="difficulty-select">
                            <option value="easy">쉬움</option>
                            <option value="medium" selected>보통</option>
                            <option value="hard">어려움</option>
                        </select>
                    </div>
                    <div class="setting-item">
                        <label>앱 정보</label>
                        <span>버전 1.0.0</span>
                    </div>
                    <button class="btn-primary" id="back-from-settings" style="margin-top: 20px;">뒤로</button>
                </div>
            `);
        }
    }

    function setupSettingsListeners() {
        document.getElementById('back-from-settings').onclick = () => showScreen('main-dashboard-screen');
    }

    // 헬퍼 함수: 화면 보여주기 및 관련 리스너 설정
    function showLearningSelectionScreen() {
        renderLearningSelectionScreen();
        showScreen('learning-selection-screen');
    }

    function showWordCardScreen() {
        renderWordCardScreen();
        showScreen('word-card-screen');
    }

    function showWordQuizScreen() {
        renderWordQuizScreen();
        showScreen('word-quiz-screen');
    }

    function showMyWordbookScreen() {
        renderMyWordbookScreen();
        showScreen('my-wordbook-screen');
    }

    function showLearningReportScreen() {
        renderLearningReportScreen();
        showScreen('learning-report-screen');
    }

    function showSettingsScreen() {
        renderSettingsScreen();
        showScreen('settings-screen');
    }

    // 초기화 함수
    function initializeApp() {
        // 모든 화면을 한 번만 DOM에 추가하고 hidden 상태로 둡니다.
        renderSplashScreen();
        renderOnboardingScreen(1);
        renderOnboardingScreen(2);
        renderOnboardingScreen(3);
        renderLoginSignupScreen();
        renderMainDashboardScreen();
        renderLearningSelectionScreen();
        renderWordCardScreen();
        renderWordQuizScreen();
        renderMyWordbookScreen();
        renderLearningReportScreen();
        renderSettingsScreen();

        // 모든 화면의 이벤트 리스너를 초기화 시점에 연결합니다.
        // showScreen 함수가 호출될 때마다 해당 화면의 리스너를 다시 설정하도록 변경했습니다.
    }

    initializeApp();

});
