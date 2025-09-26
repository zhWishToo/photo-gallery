// 照片数据数组 - 使用imgs1文件夹中的真实照片
const photos = [
    { id: 1, src: 'imgs1/DSC_0865.JPG', title: '婚纱照片 1' },
    { id: 2, src: 'imgs1/DSC_0871.JPG', title: '婚纱照片 2' },
    { id: 3, src: 'imgs1/DSC_0879.JPG', title: '婚纱照片 3' },
    { id: 4, src: 'imgs1/DSC_0885.JPG', title: '婚纱照片 4' },
    { id: 5, src: 'imgs1/DSC_0907.JPG', title: '婚纱照片 5' },
    { id: 6, src: 'imgs1/DSC_0912.JPG', title: '婚纱照片 6' },
    { id: 7, src: 'imgs1/DSC_0915.JPG', title: '婚纱照片 7' },
    { id: 8, src: 'imgs1/DSC_0922.JPG', title: '婚纱照片 8' },
    { id: 9, src: 'imgs1/DSC_0924.JPG', title: '婚纱照片 9' },
    { id: 10, src: 'imgs1/DSC_0926.JPG', title: '婚纱照片 10' },
    { id: 11, src: 'imgs1/DSC_0938.JPG', title: '婚纱照片 11' },
    { id: 12, src: 'imgs1/DSC_0970.JPG', title: '婚纱照片 12' },
    { id: 13, src: 'imgs1/DSC_0972.JPG', title: '婚纱照片 13' },
    { id: 14, src: 'imgs1/DSC_0979.JPG', title: '婚纱照片 14' },
    { id: 15, src: 'imgs1/DSC_0982.JPG', title: '婚纱照片 15' },
    { id: 16, src: 'imgs1/DSC_0983.JPG', title: '婚纱照片 16' },
    { id: 17, src: 'imgs1/DSC_0985.JPG', title: '婚纱照片 17' },
    { id: 18, src: 'imgs1/DSC_0986.JPG', title: '婚纱照片 18' },
    { id: 19, src: 'imgs1/DSC_0990.JPG', title: '婚纱照片 19' },
    { id: 20, src: 'imgs1/DSC_0993.JPG', title: '婚纱照片 20' },
    { id: 21, src: 'imgs1/DSC_1065.JPG', title: '婚纱照片 21' },
    { id: 22, src: 'imgs1/DSC_1068.JPG', title: '婚纱照片 22' },
    { id: 23, src: 'imgs1/DSC_1070.JPG', title: '婚纱照片 23' },
    { id: 24, src: 'imgs1/DSC_1072.JPG', title: '婚纱照片 24' },
    { id: 25, src: 'imgs1/DSC_1073.JPG', title: '婚纱照片 25' },
    { id: 26, src: 'imgs1/DSC_1076.JPG', title: '婚纱照片 26' },
    { id: 27, src: 'imgs1/DSC_1079.JPG', title: '婚纱照片 27' },
    { id: 28, src: 'imgs1/DSC_1080.JPG', title: '婚纱照片 28' },
    { id: 29, src: 'imgs1/DSC_1085.JPG', title: '婚纱照片 29' },
    { id: 30, src: 'imgs1/DSC_1087.JPG', title: '婚纱照片 30' },
    { id: 31, src: 'imgs1/DSC_1094.JPG', title: '婚纱照片 31' },
    { id: 32, src: 'imgs1/DSC_1095.JPG', title: '婚纱照片 32' },
    { id: 33, src: 'imgs1/DSC_1099.JPG', title: '婚纱照片 33' },
    { id: 34, src: 'imgs1/DSC_1105.JPG', title: '婚纱照片 34' }
];

// DOM 元素
const galleryGrid = document.getElementById('galleryGrid');
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modalImage');
const closeModal = document.getElementById('closeModal');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const imageInfo = document.getElementById('imageInfo');
const shareButton = document.getElementById('shareButton');
const shareTooltip = document.getElementById('shareTooltip');
const shareLink = document.getElementById('shareLink');
const copyLinkBtn = document.getElementById('copyLinkBtn');
const closeTooltip = document.getElementById('closeTooltip');

// 当前显示的照片索引
let currentIndex = 0;

// 图片变换状态
let scale = 1;
let isDragging = false;
let startX, startY;
let imgStartX, imgStartY;

// 初始化画廊
function initGallery() {
    // 清空画廊
    galleryGrid.innerHTML = '';
    
    // 创建照片网格项
    photos.forEach((photo, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.dataset.index = index;
        
        const img = document.createElement('img');
        img.src = photo.src;
        img.alt = photo.title;
        img.loading = 'lazy'; // 懒加载
        img.setAttribute('draggable', false); // 禁止拖拽
        
        galleryItem.appendChild(img);
        galleryGrid.appendChild(galleryItem);
        
        // 添加点击事件
        galleryItem.addEventListener('click', () => openModal(index));
    });
}

// 打开模态框
function openModal(index) {
    currentIndex = index;
    const photo = photos[index];
    
    modalImage.src = photo.src;
    modalImage.alt = photo.title;
    imageInfo.textContent = `${photo.title} (${index + 1}/${photos.length})`;
    
    modal.style.display = 'block';
    document.body.classList.add('modal-open'); // 防止背景滚动
    
    // 重置图片变换
    resetImageTransform();
    
    // 添加事件监听器
    document.addEventListener('keydown', handleKeyDown);
}

// 关闭模态框
function closeModalFunc() {
    modal.style.display = 'none';
    document.body.classList.remove('modal-open'); // 恢复背景滚动
    
    // 移除事件监听器
    document.removeEventListener('keydown', handleKeyDown);
}

// 显示下一张照片
function showNextPhoto() {
    currentIndex = (currentIndex + 1) % photos.length;
    updateModalContent();
}

// 显示上一张照片
function showPrevPhoto() {
    currentIndex = (currentIndex - 1 + photos.length) % photos.length;
    updateModalContent();
}

// 更新模态框内容
function updateModalContent() {
    const photo = photos[currentIndex];
    modalImage.src = photo.src;
    modalImage.alt = photo.title;
    imageInfo.textContent = `${photo.title} (${currentIndex + 1}/${photos.length})`;
    
    // 重置图片变换
    resetImageTransform();
}

// 重置图片变换
function resetImageTransform() {
    scale = 1;
    modalImage.style.transform = 'translate(-50%, -50%) scale(1)';
    modalImage.style.left = '50%';
    modalImage.style.top = '50%';
}

// 处理键盘事件
function handleKeyDown(event) {
    switch(event.key) {
        case 'Escape':
            closeModalFunc();
            break;
        case 'ArrowLeft':
            showPrevPhoto();
            break;
        case 'ArrowRight':
            showNextPhoto();
            break;
    }
}

// 触摸手势支持
let touchStartX = 0;
let touchEndX = 0;
let touchStartTime = 0;
let touchEndTime = 0;

function handleTouchStart(event) {
    // 只处理单指触摸
    if (event.touches.length === 1) {
        touchStartX = event.touches[0].clientX;
        touchStartTime = new Date().getTime();
    }
}

function handleTouchEnd(event) {
    // 只处理单指触摸
    if (event.changedTouches.length === 1) {
        touchEndX = event.changedTouches[0].clientX;
        touchEndTime = new Date().getTime();
        handleSwipeGesture();
    }
}

function handleSwipeGesture() {
    const swipeThreshold = 30; // 最小滑动距离阈值
    const swipeTimeThreshold = 300; // 最大滑动时间阈值（毫秒）
    const swipeTime = touchEndTime - touchStartTime;
    const deltaX = touchEndX - touchStartX;
    
    // 只有在快速滑动且距离足够时才切换图片
    if (swipeTime < swipeTimeThreshold && Math.abs(deltaX) > swipeThreshold) {
        if (deltaX < 0) {
            // 向左滑动，显示下一张
            showNextPhoto();
        } else {
            // 向右滑动，显示上一张
            showPrevPhoto();
        }
    }
}

// 图片缩放功能
function initImageZoom() {
    // 双击缩放
    modalImage.addEventListener('dblclick', function(e) {
        if (scale === 1) {
            scale = 2;
        } else {
            scale = 1;
        }
        this.style.transform = `translate(-50%, -50%) scale(${scale})`;
    });
    
    // 鼠标滚轮缩放
    modalImage.addEventListener('wheel', function(e) {
        e.preventDefault();
        if (e.deltaY < 0) {
            // 向上滚动，放大
            scale = Math.min(scale * 1.1, 3);
        } else {
            // 向下滚动，缩小
            scale = Math.max(scale / 1.1, 0.5);
        }
        this.style.transform = `translate(-50%, -50%) scale(${scale})`;
    });
    
    // 触摸缩放
    let initialDistance = 0;
    
    modalImage.addEventListener('touchstart', function(e) {
        if (e.touches.length === 2) {
            // 双指触摸开始
            initialDistance = Math.hypot(
                e.touches[0].pageX - e.touches[1].pageX,
                e.touches[0].pageY - e.touches[1].pageY
            );
        }
    });
    
    modalImage.addEventListener('touchmove', function(e) {
        e.preventDefault();
        if (e.touches.length === 2) {
            // 双指缩放
            const currentDistance = Math.hypot(
                e.touches[0].pageX - e.touches[1].pageX,
                e.touches[0].pageY - e.touches[1].pageY
            );
            
            if (initialDistance > 0) {
                scale *= (currentDistance / initialDistance);
                scale = Math.min(Math.max(scale, 0.5), 3);
                this.style.transform = `translate(-50%, -50%) scale(${scale})`;
                initialDistance = currentDistance;
            }
        }
    });
    
    modalImage.addEventListener('touchend', function() {
        initialDistance = 0;
    });
}

// 分享功能
function initShareFeature() {
    // 设置分享链接
    const currentUrl = window.location.href;
    shareLink.value = currentUrl;
    
    // 分享按钮点击事件
    shareButton.addEventListener('click', function() {
        // 检查是否支持 Web Share API
        if (navigator.share) {
            navigator.share({
                title: '陈婚纱相册',
                text: '分享这个美好的婚纱相册',
                url: currentUrl
            }).catch(error => {
                console.log('分享失败:', error);
                // 如果 Web Share API 失败，则显示手动分享提示
                showShareTooltip();
            });
        } else {
            // 不支持 Web Share API，显示手动分享提示
            showShareTooltip();
        }
    });
    
    // 复制链接按钮
    copyLinkBtn.addEventListener('click', function() {
        shareLink.select();
        document.execCommand('copy');
        
        // 显示复制成功提示
        const originalText = copyLinkBtn.textContent;
        copyLinkBtn.textContent = '已复制!';
        setTimeout(() => {
            copyLinkBtn.textContent = originalText;
        }, 2000);
    });
    
    // 关闭提示框
    closeTooltip.addEventListener('click', function() {
        shareTooltip.style.display = 'none';
    });
    
    // 点击背景关闭提示框
    shareTooltip.addEventListener('click', function(e) {
        if (e.target === shareTooltip) {
            shareTooltip.style.display = 'none';
        }
    });
}

// 显示分享提示框
function showShareTooltip() {
    shareTooltip.style.display = 'flex';
}

// 事件监听器
closeModal.addEventListener('click', closeModalFunc);
prevBtn.addEventListener('click', showPrevPhoto);
nextBtn.addEventListener('click', showNextPhoto);

// 点击模态框背景关闭
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        closeModalFunc();
    }
});

// 添加触摸事件监听
modalImage.addEventListener('touchstart', handleTouchStart);
modalImage.addEventListener('touchend', handleTouchEnd);

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initGallery();
    initImageZoom();
    initShareFeature();
});