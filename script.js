document.addEventListener('DOMContentLoaded', () => {
    const videoGallery = document.querySelector('.video-gallery');

    // Função para adicionar os eventos de interação a um item de vídeo
    function addVideoEventListeners(videoItem) {
        const video = videoItem.querySelector('video');
        if (!video) return;

        let hoverTimeout;

        videoItem.addEventListener('mouseenter', () => {
            hoverTimeout = setTimeout(() => {
                video.muted = true;
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => console.error("Erro ao reproduzir o preview:", error));
                }
            }, 200);
        });

        videoItem.addEventListener('mouseleave', () => {
            clearTimeout(hoverTimeout);
            video.pause();
            video.currentTime = 0;
            video.load(); // Força o recarregamento do vídeo, exibindo o poster.
        });

        videoItem.addEventListener('click', () => {
            video.controls = !video.controls;
            if (video.controls) {
                video.muted = false;
            }
        });
    }

    // Função para carregar os vídeos do arquivo JSON
    async function loadVideos() {
        try {
            const response = await fetch('videos.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const videos = await response.json();

            videoGallery.innerHTML = ''; // Limpa a galeria antes de adicionar novos vídeos

            videos.forEach(videoData => {
                const videoItem = document.createElement('div');
                videoItem.className = 'video-item';
                videoItem.innerHTML = `
                    <div class="video-embed">
                        <video muted loop preload="metadata" poster="${videoData.thumbnail}">
                            <source src="${videoData.src}" type="video/mp4">
                            Seu navegador não suporta a tag de vídeo.
                        </video>
                    </div>
                    <h3>${videoData.title}</h3>
                    <p>${videoData.description}</p>
                `;
                videoGallery.appendChild(videoItem);
                addVideoEventListeners(videoItem); // Adiciona os eventos ao novo elemento
            });
        } catch (error) {
            console.error("Não foi possível carregar os vídeos:", error);
            videoGallery.innerHTML = '<p style="color: #ff7b00;">Ocorreu um erro ao carregar os projetos. Tente novamente mais tarde.</p>';
        }
    }

    loadVideos();
});