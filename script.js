// script.js

document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('app-container');

    // 전역 변수 설정
    let myWordbook = []; // 사용자 단어장 데이터 (전역으로 한 번만 선언)
    let wordsByDay = []; // 날짜별 단어 묶음
    const wordsPerDay = 25;
    const totalLearningDays = Math.ceil(words.length / wordsPerDay); // 총 학습 일수 (32일)
    let currentLearningDay = 1; // 현재 학습 중인 날짜

    // showScreen 함수 내의 render 호출 순서를 변경하여 탭바가 항상 맨 아래에 있도록 합니다.
    function showScreen(screenId) {
        console.log(`Attempting to show screen: ${screenId}`);
        const allScreens = document.querySelectorAll('.screen');
        allScreens.forEach(screen => {
            if (screen.id === screenId) {
                screen.classList.remove('hidden');
                screen.classList.add('active');
                screen.style.display = 'flex'; // 활성화 시 flex로 설정
            } else {
                screen.classList.remove('active');
                screen.classList.add('hidden');
                screen.style.display = 'none'; // 숨김 시 display: none
            }
        });

        const activeScreen = document.getElementById(screenId);
        if (activeScreen) {
            console.log(`Screen ${screenId} is active.`);
            // 각 화면이 활성화될 때마다 해당 화면의 내용을 다시 렌더링하고 리스너를 설정
            if (screenId.startsWith('onboarding-screen-')) {
                renderOnboardingScreen(currentOnboardingScreen); // 화면 내용 다시 렌더링
            } else if (screenId === 'login-signup-screen') {
                renderLoginSignupScreen();
                setupLoginSignupListeners();
            } else if (screenId === 'main-dashboard-screen') {
                renderMainDashboardScreen();
                setupMainDashboardListeners();
            } else if (screenId === 'day-selection-screen') { // 새로운 학습일 선택 화면
                renderDaySelectionScreen();
                setupDaySelectionListeners();
            } else if (screenId === 'learning-selection-screen') {
                renderLearningSelectionScreen();
                setupLearningSelectionListeners();
            } else if (screenId === 'word-card-screen') {
                renderWordCardScreen(); // 단어 카드 내용 업데이트
                setupWordCardListeners();
            } else if (screenId === 'word-quiz-screen') {
                renderWordQuizScreen(); // 퀴즈 내용 업데이트
                setupWordQuizListeners();
            } else if (screenId === 'my-wordbook-screen') {
                renderMyWordbookScreen(); // 단어장 내용 업데이트
                setupMyWordbookListeners();
            } else if (screenId === 'learning-report-screen') {
                renderLearningReportScreen(); // 리포트 내용 업데이트
                setupLearningReportListeners();
            } else if (screenId === 'settings-screen') {
                renderSettingsScreen(); // 설정 내용 업데이트
                setupSettingsListeners();
            }
        } else {
            console.error(`Error: Screen with ID ${screenId} not found.`);
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
        let iconHtml = ''; // 이미지를 아이콘 HTML로 변경

        if (screenNum === 1) {
            title = '맞춤형 학습';
            description = '학습자 레벨에 맞춰 단어를 추천하고, 효율적인 학습 경로를 제공합니다.';
            iconHtml = '<span class="onboarding-icon">🎯</span>'; // 목표 아이콘
        } else if (screenNum === 2) {
            title = '게임화된 요소';
            description = '다양한 퀴즈와 챌린지로 지루함 없이 단어를 마스터하세요.';
            iconHtml = '<span class="onboarding-icon">🎮</span>'; // 게임 아이콘
        } else if (screenNum === 3) {
            title = 'AI 발음 피드백';
            description = '정확한 발음을 위한 AI 피드백으로 자신감을 키워줍니다.';
            iconHtml = '<span class="onboarding-icon">🤖</span>'; // 로봇 아이콘
        }

        const onboardingScreenElement = document.getElementById(`onboarding-screen-${screenNum}`);
        if (!onboardingScreenElement) {
            appContainer.insertAdjacentHTML('beforeend', `
                <div id="onboarding-screen-${screenNum}" class="screen onboarding-screen hidden">
                    <div class="onboarding-image-container">${iconHtml}</div>
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
        } else {
            onboardingScreenElement.querySelector('.onboarding-image-container').innerHTML = iconHtml;
            onboardingScreenElement.querySelector('h2').textContent = title;
            onboardingScreenElement.querySelector('p').textContent = description;
            onboardingScreenElement.querySelector('.onboarding-dots').innerHTML = 
                `${Array.from({ length: totalOnboardingScreens }, (_, i) => `<span class="dot ${i + 1 === screenNum ? 'active' : ''}"></span>`).join('')}`;
            // 내비게이션 버튼을 동적으로 업데이트하는 대신, 항상 존재하도록 하고 텍스트만 변경
            const nextBtn = onboardingScreenElement.querySelector('#next-onboarding');
            if (nextBtn) {
                nextBtn.textContent = screenNum === totalOnboardingScreens ? '시작하기' : '다음';
            }
            const prevNavDiv = onboardingScreenElement.querySelector('.onboarding-navigation > span');
            if (screenNum > 1 && !onboardingScreenElement.querySelector('#prev-onboarding')) {
                // 이전 버튼이 없으면 추가
                onboardingScreenElement.querySelector('.onboarding-navigation').insertAdjacentHTML('afterbegin', '<button id="prev-onboarding">이전</button>');
            } else if (screenNum === 1 && onboardingScreenElement.querySelector('#prev-onboarding')) {
                // 첫 화면이면 이전 버튼 제거
                onboardingScreenElement.querySelector('#prev-onboarding').remove();
                // 비어있는 span을 다시 추가하여 레이아웃 유지
                onboardingScreenElement.querySelector('.onboarding-navigation').insertAdjacentHTML('afterbegin', '<span></span>');
            }
        }

        // 온보딩 화면의 DOM이 업데이트된 후에 내비게이션 리스너를 다시 설정
        setupOnboardingNavigation();
    }

    function setupOnboardingNavigation() {
        const currentScreenElement = document.querySelector('.onboarding-screen.active');
        if (!currentScreenElement) {
            console.warn('No active onboarding screen found for navigation setup.');
            return;
        }

        const nextButton = currentScreenElement.querySelector('#next-onboarding');
        const prevButton = currentScreenElement.querySelector('#prev-onboarding');
        
        const screenNum = parseInt(currentScreenElement.id.split('-')[2]);

        if (nextButton) {
            nextButton.onclick = () => {
                console.log(`Next button clicked on screen ${screenNum}`);
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
                console.log(`Previous button clicked on screen ${screenNum}`);
                if (screenNum > 1) {
                    currentOnboardingScreen--;
                    showScreen(`onboarding-screen-${currentOnboardingScreen}`); 
                }
            };
        }
        // 점 업데이트 (setupOnboardingNavigation 내에서 처리)
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

    // 학습 선택 화면 (기존) - 이제 Day Selection으로 대체되거나 Day Selection을 포함할 수 있음
    function renderLearningSelectionScreen() {
        const learningSelectionScreenElement = document.getElementById('learning-selection-screen');
        if (!learningSelectionScreenElement) {
            appContainer.insertAdjacentHTML('beforeend', `
                <div id="learning-selection-screen" class="screen hidden">
                    <h2>학습 모드 선택</h2>
                    <button class="btn-primary" id="start-day-learning">날짜별 학습 시작</button>
                    <button class="btn-primary" id="review-quiz">복습 퀴즈</button>
                    <button class="btn-primary" id="spelling-practice">스펠링 연습</button>
                    <button class="btn-primary" id="listening-practice">듣기 연습</button>
                    <button class="btn-primary" id="back-from-learning-selection" style="margin-top: 30px;">뒤로</button>
                </div>
            `);
        }
    }

    function setupLearningSelectionListeners() {
        document.getElementById('start-day-learning').onclick = () => showDaySelectionScreen();
        document.getElementById('review-quiz').onclick = () => showWordQuizScreen();
        document.getElementById('spelling-practice').onclick = () => alert('스펠링 연습 화면 준비 중...');
        document.getElementById('listening-practice').onclick = () => alert('듣기 연습 화면 준비 중...');
        document.getElementById('back-from-learning-selection').onclick = () => showScreen('main-dashboard-screen');
    }

    // 새로운 학습일 선택 화면
    function renderDaySelectionScreen() {
        const daySelectionScreenElement = document.getElementById('day-selection-screen');
        if (!daySelectionScreenElement) {
            appContainer.insertAdjacentHTML('beforeend', `
                <div id="day-selection-screen" class="screen hidden">
                    <h2>학습할 날짜 선택</h2>
                    <div class="day-grid">
                        ${Array.from({ length: totalLearningDays }, (_, i) => 
                            `<button class="day-button" data-day="${i + 1}">Day ${i + 1}</button>`
                        ).join('')}
                    </div>
                    <button class="btn-primary" id="day-selection-back-button">뒤로</button>
                </div>
            `);
        }
    }

    function setupDaySelectionListeners() {
        document.querySelectorAll('.day-button').forEach(button => {
            button.onclick = (e) => {
                currentLearningDay = parseInt(e.target.dataset.day);
                currentWordIndex = 0; // 선택된 날짜의 첫 단어부터 시작하도록 초기화
                showWordCardScreen(); // 해당 날짜의 단어 학습 시작
            };
        });
        document.getElementById('day-selection-back-button').onclick = () => showScreen('learning-selection-screen');
    }

    // 단어 카드 화면
    let currentWordIndex = 0;
    function renderWordCardScreen() {
        // 현재 학습일에 해당하는 단어 묶음에서 단어를 가져옵니다.
        const wordsForCurrentDay = wordsByDay[currentLearningDay - 1];
        const word = wordsForCurrentDay ? wordsForCurrentDay[currentWordIndex] : null;

        if (!word) {
            alert(`${currentLearningDay}일차 모든 단어를 학습했습니다!`);
            currentWordIndex = 0; // 초기화
            showScreen('day-selection-screen'); // 학습일 선택 화면으로 돌아가기
            return;
        }

        const wordCardScreenElement = document.getElementById('word-card-screen');
        if (!wordCardScreenElement) {
            appContainer.insertAdjacentHTML('beforeend', `
                <div id="word-card-screen" class="screen hidden">
                    <h2>${currentLearningDay}일차 학습</h2>
                    <div class="word-card">
                        <p class="word-spelling"></p>
                        <p class="word-meaning"></p>
                        <img class="word-image" id="word-image" alt="단어 이미지" />
                        <button id="speak-word">발음 듣기</button>
                        <button id="memorized-word">암기 완료</button>
                        <button id="difficult-word">어려운 단어</button>
                        <button id="next-word">다음 단어</button>
                    </div>
                    <button class="btn-primary" id="word-card-back-button" style="margin-top: 30px;">뒤로</button>
                </div>
            `);
        }
        // 단어 내용 업데이트
        const activeWordCardScreen = document.getElementById('word-card-screen');
        if (activeWordCardScreen) {
            activeWordCardScreen.querySelector('h2').textContent = `${currentLearningDay}일차 학습`;
            activeWordCardScreen.querySelector('.word-spelling').textContent = word.spelling;
            activeWordCardScreen.querySelector('.word-meaning').textContent = word.meaning;

            const imageEl = activeWordCardScreen.querySelector('.word-image');
            if (imageEl) {
                if (word.image) {
                    // 단어 데이터에 이미지 URL이 있는 경우 우선 사용
                    imageEl.src = word.image;
                } else {
                    // 참고 이미지 데이터가 없으면 단어 스펠링으로 검색한 무료 이미지를 사용
                    imageEl.src = `https://source.unsplash.com/featured/300x200/?${encodeURIComponent(word.spelling)}`;
                }
                imageEl.alt = word.spelling;
            }
        }
    }

    function setupWordCardListeners() {
        document.getElementById('speak-word').onclick = () => {
            const wordsForCurrentDay = wordsByDay[currentLearningDay - 1];
            const word = wordsForCurrentDay ? wordsForCurrentDay[currentWordIndex] : null;
            if (word) {
                const utterance = new SpeechSynthesisUtterance(word.spelling);
                speechSynthesis.speak(utterance);
            }
        };
        document.getElementById('memorized-word').onclick = () => {
            const wordsForCurrentDay = wordsByDay[currentLearningDay - 1];
            const word = wordsForCurrentDay ? wordsForCurrentDay[currentWordIndex] : null;
            if (word) {
                if (!myWordbook.some(w => w.spelling === word.spelling)) {
                    myWordbook.push({ ...word, status: 'memorized' });
                    alert(`${word.spelling} (을)를 암기 완료 단어장에 추가했습니다.`);
                }
            }
            moveToNextWordCard();
        };
        document.getElementById('difficult-word').onclick = () => {
            const wordsForCurrentDay = wordsByDay[currentLearningDay - 1];
            const word = wordsForCurrentDay ? wordsForCurrentDay[currentWordIndex] : null;
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
        document.getElementById('word-card-back-button').onclick = () => {
            currentWordIndex = 0; // 단어 카드 인덱스 초기화
            showScreen('day-selection-screen'); // 학습일 선택 화면으로 돌아가기
        };
    }

    function moveToNextWordCard() {
        currentWordIndex++;
        const wordsForCurrentDay = wordsByDay[currentLearningDay - 1];
        if (currentWordIndex < wordsForCurrentDay.length) {
            renderWordCardScreen(); // 새 단어 카드 렌더링
            showScreen('word-card-screen'); // 화면 표시
        } else {
            alert(`${currentLearningDay}일차 모든 단어를 학습했습니다!`);
            currentWordIndex = 0; // 초기화
            // 해당 날짜를 완료된 것으로 표시 (선택 사항)
            const dayButton = document.querySelector(`.day-button[data-day="${currentLearningDay}"]`);
            if (dayButton) {
                dayButton.classList.add('completed');
            }
            showScreen('day-selection-screen');
        }
    }

    // 단어 퀴즈 화면 (객관식/주관식)
    let currentQuizWordIndex = 0;
    function renderWordQuizScreen() {
        const word = words[currentQuizWordIndex]; // 전체 단어 목록에서 퀴즈 단어 가져오기 (날짜별 퀴즈는 추후 구현)
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
        if (!word) return; 
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
    function renderMyWordbookScreen() {
        const myWordbookScreenElement = document.getElementById('my-wordbook-screen');
        if (!myWordbookScreenElement) {
            appContainer.insertAdjacentHTML('beforeend', `
                <div id="my-wordbook-screen" class="screen hidden">
                    <h2>나만의 단어장</h2>
                    <div class="wordbook-list"></div>
                    <button class="btn-primary" id="wordbook-back-button" style="margin-top: 30px;">뒤로</button>
                </div>
            `);
        }
        // 단어장 목록 업데이트
        const wordbookList = document.querySelector('#my-wordbook-screen .wordbook-list');
        if (wordbookList) {
            if (myWordbook.length === 0) {
                wordbookList.innerHTML = '<p>아직 단어가 없습니다.</p>';
            } else {
                wordbookList.innerHTML = 
                    myWordbook.map(word => `
                        <div class="wordbook-item">
                            <span>${word.spelling} - ${word.meaning} (${word.status === 'memorized' ? '암기 완료' : '어려운 단어'})</span>
                            <button data-spelling="${word.spelling}">삭제</button>
                        </div>
                    `).join('');
            }
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

    function showDaySelectionScreen() {
        renderDaySelectionScreen();
        showScreen('day-selection-screen');
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

    // 단어 배열을 25개씩 묶어 날짜별로 나누는 함수
    function chunkWordsByDay() {
        wordsByDay = [];
        for (let i = 0; i < words.length; i += wordsPerDay) {
            wordsByDay.push(words.slice(i, i + wordsPerDay));
        }
    }

    // 초기화 함수
    function initializeApp() {
        console.log('initializeApp called.');
        chunkWordsByDay(); // 단어를 날짜별로 묶음

        // 모든 화면을 한 번만 DOM에 추가하고 hidden 상태로 둡니다.
        renderSplashScreen();
        renderOnboardingScreen(1); 
        renderOnboardingScreen(2); 
        renderOnboardingScreen(3); 

        renderLoginSignupScreen();
        renderMainDashboardScreen();
        renderLearningSelectionScreen();
        renderDaySelectionScreen(); 
        renderWordCardScreen();
        renderWordQuizScreen();
        renderMyWordbookScreen();
        renderLearningReportScreen();
        renderSettingsScreen();

        // 모든 화면의 리스너를 초기화 시점에 연결합니다.
        // showScreen 함수가 호출될 때마다 해당 화면의 리스너를 다시 설정하도록 변경했습니다.
        // 온보딩 리스너는 renderOnboardingScreen에서 호출됨
        setupLoginSignupListeners();
        setupMainDashboardListeners();
        setupLearningSelectionListeners();
        setupDaySelectionListeners(); 
        setupWordCardListeners();
        setupWordQuizListeners();
        setupMyWordbookListeners();
        setupLearningReportListeners();
        setupSettingsListeners();

        showScreen('splash-screen'); // 초기 화면은 스플래시로 설정
        console.log('Splash screen activated.');
    }

    initializeApp();

});
