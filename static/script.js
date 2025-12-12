const state = {
    platform: null,
    mode: null,
    url: '',
    videoInfo: null,
    selectedQuality: null,
    downloadId: null
};

function init() {
    createParticles();
    setupEventListeners();
    initButterflyEffect();
    initGhostCursor();
}

function initButterflyEffect() {
    const colors = ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b'];
    let lastX = 0;
    let lastY = 0;
    let throttle = false;

    document.addEventListener('mousemove', (e) => {
        if (throttle) return;
        throttle = true;

        setTimeout(() => {
            throttle = false;
        }, 30);

        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 10) {
            createButterfly(e.clientX, e.clientY, colors);
            lastX = e.clientX;
            lastY = e.clientY;
        }
    });
}

function createButterfly(x, y, colors) {
    const butterfly = document.createElement('div');
    butterfly.className = 'butterfly-particle';

    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 10 + 5;
    const angle = Math.random() * 360;
    const spread = Math.random() * 60 - 30;

    butterfly.style.cssText = `
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        box-shadow: 0 0 ${size * 2}px ${color}, 0 0 ${size * 4}px ${color};
        --spread-x: ${spread}px;
        --spread-y: ${-30 - Math.random() * 50}px;
        --rotation: ${angle}deg;
    `;

    document.body.appendChild(butterfly);

    setTimeout(() => {
        butterfly.remove();
    }, 1000);
}

function initGhostCursor() {
    const ghosts = [];
    const ghostCount = 8;

    for (let i = 0; i < ghostCount; i++) {
        const ghost = document.createElement('div');
        ghost.className = 'ghost-cursor';
        ghost.style.opacity = 1 - (i / ghostCount);
        ghost.style.transform = `scale(${1 - (i * 0.08)})`;
        ghost.style.left = '-100px';
        ghost.style.top = '-100px';
        document.body.appendChild(ghost);
        ghosts.push({ el: ghost, x: -100, y: -100 });
    }

    let mouseX = -100;
    let mouseY = -100;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateGhosts() {
        let x = mouseX;
        let y = mouseY;

        ghosts.forEach((ghost, index) => {
            const speed = 0.15 - (index * 0.01);
            ghost.x += (x - ghost.x) * speed;
            ghost.y += (y - ghost.y) * speed;
            ghost.el.style.left = ghost.x + 'px';
            ghost.el.style.top = ghost.y + 'px';
            x = ghost.x;
            y = ghost.y;
        });

        requestAnimationFrame(animateGhosts);
    }

    animateGhosts();
}

function createParticles() {
    const container = document.getElementById('particles');

    for (let i = 0; i < 80; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        const size = Math.random() * 6 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';

        const colors = ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.boxShadow = `0 0 ${size * 2}px ${particle.style.background}`;

        container.appendChild(particle);
    }

    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        star.style.animationDuration = (2 + Math.random() * 2) + 's';
        container.appendChild(star);
    }

    for (let i = 0; i < 15; i++) {
        const shape = document.createElement('div');
        shape.className = 'floating-shape';
        shape.style.left = Math.random() * 100 + '%';
        shape.style.top = Math.random() * 100 + '%';
        shape.style.animationDelay = Math.random() * 10 + 's';
        shape.style.animationDuration = (20 + Math.random() * 15) + 's';
        const size = Math.random() * 80 + 40;
        shape.style.width = size + 'px';
        shape.style.height = size + 'px';

        const colors = ['rgba(139, 92, 246, 0.1)', 'rgba(236, 72, 153, 0.08)', 'rgba(6, 182, 212, 0.08)'];
        shape.style.background = colors[Math.floor(Math.random() * colors.length)];

        container.appendChild(shape);
    }
}

function setupEventListeners() {
    document.getElementById('ytCard').addEventListener('click', () => selectPlatform('youtube'));
    document.getElementById('musicCard').addEventListener('click', () => selectPlatform('music'));

    document.getElementById('singleCard').addEventListener('click', () => selectMode('single'));
    document.getElementById('playlistCard').addEventListener('click', () => selectMode('playlist'));

    document.getElementById('backToStep1').addEventListener('click', () => goToStep(1));
    document.getElementById('backToStep2').addEventListener('click', () => goToStep(2));

    document.getElementById('fetchBtn').addEventListener('click', fetchVideoInfo);
    document.getElementById('urlInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') fetchVideoInfo();
    });

    document.getElementById('downloadBtn').addEventListener('click', startDownload);
    document.getElementById('playlistDownloadBtn').addEventListener('click', startPlaylistDownload);
    document.getElementById('newDownloadBtn').addEventListener('click', resetApp);
    document.getElementById('retryBtn').addEventListener('click', resetApp);
}

function selectPlatform(platform) {
    state.platform = platform;

    const cards = document.querySelectorAll('.platform-card');
    cards.forEach(card => card.classList.add('selected-exit'));

    setTimeout(() => {
        if (platform === 'youtube') {
            document.getElementById('step2Title').textContent = 'Ready to download video';
            document.getElementById('modeCards').classList.add('hidden');
            goToStep(3);
        } else {
            document.getElementById('step2Title').textContent = 'What do you want to download?';
            document.getElementById('modeCards').classList.remove('hidden');
            document.getElementById('singleCard').querySelector('h3').textContent = 'Single Track';
            document.getElementById('singleCard').querySelector('p').textContent = 'Download one song as MP3';
            goToStep(2);
        }
    }, 200);
}

function selectMode(mode) {
    state.mode = mode;
    goToStep(3);
}

function goToStep(stepNum) {
    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
    document.getElementById(`step${stepNum}`).classList.add('active');

    if (stepNum === 1) {
        state.platform = null;
        state.mode = null;
    }
    if (stepNum === 2) {
        state.mode = null;
    }
    if (stepNum === 3) {
        document.getElementById('urlInput').value = '';
        document.getElementById('videoInfo').classList.add('hidden');
        document.getElementById('playlistInfo').classList.add('hidden');
        state.url = '';
        state.videoInfo = null;
        state.selectedQuality = null;
    }
}

async function fetchVideoInfo() {
    const url = document.getElementById('urlInput').value.trim();
    if (!url) return;

    state.url = url;
    const fetchBtn = document.getElementById('fetchBtn');
    const fetchLoading = document.getElementById('fetchLoading');
    const urlContainer = document.querySelector('.url-input-container');

    fetchBtn.classList.add('loading');
    urlContainer.classList.add('hidden');
    fetchLoading.classList.remove('hidden');
    document.body.classList.add('loading-active');
    if (document.activeElement) {
        document.activeElement.blur();
    }

    try {
        const response = await fetch('/api/info', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
        });

        const data = await response.json();

        if (data.error) {
            alert(data.error);
            fetchBtn.classList.remove('loading');
            urlContainer.classList.remove('hidden');
            fetchLoading.classList.add('hidden');
            document.body.classList.remove('loading-active');
            return;
        }

        state.videoInfo = data;

        if (data.is_playlist) {
            showPlaylistInfo(data);
        } else {
            showVideoInfo(data);
        }

    } catch (error) {
        alert('Failed to fetch video info. Please check the URL.');
    }

    fetchBtn.classList.remove('loading');
    urlContainer.classList.remove('hidden');
    fetchLoading.classList.add('hidden');
    document.body.classList.remove('loading-active');
}

function showVideoInfo(data) {
    document.getElementById('videoInfo').classList.remove('hidden');
    document.getElementById('playlistInfo').classList.add('hidden');

    document.getElementById('thumbnail').src = data.thumbnail || '';
    document.getElementById('videoTitle').textContent = data.title;
    document.getElementById('channelName').textContent = data.channel;

    if (data.duration) {
        const mins = Math.floor(data.duration / 60);
        const secs = data.duration % 60;
        document.getElementById('duration').textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    } else {
        document.getElementById('duration').textContent = '';
    }

    const qualityGrid = document.getElementById('qualityGrid');
    qualityGrid.innerHTML = '';

    if (state.platform === 'youtube') {
        data.video_qualities.forEach((q, index) => {
            const option = createQualityOption(q.label, 'video', q.height, index === 0);
            qualityGrid.appendChild(option);
        });

        const bestAudioOption = createQualityOption('Best Audio (MP3)', 'audio', 'best', false);
        qualityGrid.appendChild(bestAudioOption);

    } else {
        data.audio_qualities.forEach((q, index) => {
            const option = createQualityOption(q.label, 'audio', q.abr, index === 0);
            qualityGrid.appendChild(option);
        });
    }

    const firstOption = qualityGrid.querySelector('.quality-option');
    if (firstOption) {
        firstOption.classList.add('selected');
        state.selectedQuality = {
            type: firstOption.dataset.type,
            value: firstOption.dataset.value
        };
    }
}

function createQualityOption(label, type, value, isFirst) {
    const option = document.createElement('button');
    option.className = 'quality-option';
    option.dataset.type = type;
    option.dataset.value = value;

    option.innerHTML = `
        <div class="quality-label">${label}</div>
        <div class="quality-type">${type === 'video' ? 'Video' : 'Audio'}</div>
    `;

    option.addEventListener('click', () => selectQuality(option));

    return option;
}

function selectQuality(option) {
    document.querySelectorAll('.quality-option').forEach(opt => opt.classList.remove('selected'));
    option.classList.add('selected');

    state.selectedQuality = {
        type: option.dataset.type,
        value: option.dataset.value
    };
}

function showPlaylistInfo(data) {
    document.getElementById('videoInfo').classList.add('hidden');
    document.getElementById('playlistInfo').classList.remove('hidden');

    document.getElementById('playlistTitle').textContent = data.title;
    document.getElementById('playlistCount').textContent = `${data.count} tracks`;
}

async function startDownload() {
    if (!state.selectedQuality) return;

    let mode;
    if (state.selectedQuality.type === 'video') {
        if (state.selectedQuality.value === 'best') {
            mode = 'video_best';
        } else {
            mode = 'video_quality';
        }
    } else {
        if (state.selectedQuality.value === 'best') {
            mode = 'audio_best';
        } else {
            mode = 'audio_quality';
        }
    }

    await initiateDownload(mode, state.selectedQuality.value);
}

async function startPlaylistDownload() {
    await initiateDownload('playlist', null);
}

async function initiateDownload(mode, quality) {
    goToStep(4);

    document.querySelector('.progress-section').classList.remove('hidden');
    document.getElementById('completeSection').classList.add('hidden');
    document.getElementById('errorSection').classList.add('hidden');

    try {
        const response = await fetch('/api/download', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                url: state.url,
                mode: mode,
                quality: quality
            })
        });

        const data = await response.json();

        if (data.error) {
            showError(data.error);
            return;
        }

        state.downloadId = data.download_id;
        trackProgress(data.download_id);

    } catch (error) {
        showError('Failed to start download');
    }
}

function trackProgress(downloadId) {
    const eventSource = new EventSource(`/api/progress/${downloadId}`);

    eventSource.onmessage = (event) => {
        const progress = JSON.parse(event.data);

        updateProgressUI(progress);

        if (progress.status === 'complete') {
            eventSource.close();
            showComplete();
        } else if (progress.status === 'error') {
            eventSource.close();
            showError(progress.message);
        }
    };

    eventSource.onerror = () => {
        eventSource.close();
    };
}

function updateProgressUI(progress) {
    const progressFill = document.querySelector('.progress-fill');
    const progressPercent = document.getElementById('progressPercent');
    const progressStatus = document.getElementById('progressStatus');
    const progressTitle = document.getElementById('progressTitle');

    const loaderGlitch = document.getElementById('loaderGlitch');
    const loaderHamster = document.getElementById('loaderHamster');
    const loaderBox = document.getElementById('loaderBox');
    const loaderGlow = document.getElementById('loaderGlow');

    loaderGlitch.classList.add('hidden');
    loaderHamster.classList.add('hidden');
    loaderBox.classList.add('hidden');
    loaderGlow.classList.add('hidden');

    progressFill.style.width = progress.percent + '%';
    progressPercent.textContent = Math.round(progress.percent) + '%';

    if (progress.status === 'downloading') {
        loaderHamster.classList.remove('hidden');
        progressTitle.textContent = 'Downloading...';
        let speedText = '';
        if (progress.speed) {
            const speedMB = (progress.speed / 1024 / 1024).toFixed(2);
            speedText = ` at ${speedMB} MB/s`;
        }
        progressStatus.textContent = `Downloading${speedText}...`;
    } else if (progress.status === 'processing') {
        loaderBox.classList.remove('hidden');
        progressTitle.textContent = 'Processing...';
        progressStatus.textContent = 'Converting and processing file...';
    } else if (progress.status === 'starting' || progress.status === 'waiting') {
        loaderGlitch.classList.remove('hidden');
        progressTitle.textContent = 'Starting...';
        progressStatus.textContent = 'Preparing download...';
    }
}

function showComplete() {
    document.querySelector('.progress-section').classList.add('hidden');
    document.getElementById('completeSection').classList.remove('hidden');
}

function showError(message) {
    document.querySelector('.progress-section').classList.add('hidden');
    document.getElementById('errorSection').classList.remove('hidden');
    document.getElementById('errorMessage').textContent = message;
}

function resetApp() {
    state.platform = null;
    state.mode = null;
    state.url = '';
    state.videoInfo = null;
    state.selectedQuality = null;
    state.downloadId = null;

    goToStep(1);
}

document.addEventListener('DOMContentLoaded', init);
