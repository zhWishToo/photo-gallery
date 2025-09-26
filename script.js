// 照片数据数组 - 使用本地示例图片
const photos = [
    { id: 1, src: 'images/sample1.jpg', title: '示例照片 1' },
    { id: 2, src: 'images/sample2.jpg', title: '示例照片 2' },
    { id: 3, src: 'images/sample3.jpg', title: '示例照片 3' },
    { id: 4, src: 'images/sample4.jpg', title: '示例照片 4' },
    { id: 5, src: 'images/sample5.jpg', title: '示例照片 5' }
];

// DOM 元素
const galleryGrid = document.getElementById('galleryGrid');
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modalImage');
const closeModal = document.getElementById('closeModal');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const imageInfo = document.getElementById('imageInfo');

// 当前显示的照片索引
let currentIndex = 0;

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
    document.body.style.overflow = 'hidden'; // 防止背景滚动
    
    // 重置图片变换
    resetImageTransform();
    
    // 添加键盘事件监听
    document.addEventListener('keydown', handleKeyDown);
}

// 关闭模态框
function closeModalFunc() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // 恢复背景滚动
    
    // 移除键盘事件监听
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
    modalImage.style.transform = 'scale(1)';
    modalImage.style.left = '0px';
    modalImage.style.top = '0px';
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
    touchStartX = event.changedTouches[0].screenX;
    touchStartTime = new Date().getTime();
}

function handleTouchEnd(event) {
    touchEndX = event.changedTouches[0].screenX;
    touchEndTime = new Date().getTime();
    handleSwipeGesture();
}

function handleSwipeGesture() {
    const swipeThreshold = 50; // 最小滑动距离阈值
    const swipeTimeThreshold = 300; // 最大滑动时间阈值（毫秒）
    const swipeTime = touchEndTime - touchStartTime;
    
    // 只有在快速滑动且距离足够时才切换图片
    if (swipeTime < swipeTimeThreshold) {
        if (touchStartX - touchEndX > swipeThreshold) {
            // 向左滑动，显示下一张
            showNextPhoto();
        } else if (touchEndX - touchStartX > swipeThreshold) {
            // 向右滑动，显示上一张
            showPrevPhoto();
        }
    }
}

// 图片缩放功能
let scale = 1;
let isDragging = false;
let startX, startY;
let imgStartX, imgStartY;

// 初始化图片缩放功能
function initImageZoom() {
    // 重置图片变换
    resetImageTransform();
    
    // 双击缩放
    modalImage.addEventListener('dblclick', function(e) {
        if (scale === 1) {
            scale = 2;
        } else {
            scale = 1;
        }
        this.style.transform = `scale(${scale})`;
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
        this.style.transform = `scale(${scale})`;
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
        } else if (e.touches.length === 1) {
            // 单指触摸，用于拖拽
            isDragging = true;
            startX = e.touches[0].pageX;
            startY = e.touches[0].pageY;
            imgStartX = parseFloat(this.style.left) || 0;
            imgStartY = parseFloat(this.style.top) || 0;
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
                this.style.transform = `scale(${scale})`;
                initialDistance = currentDistance;
            }
        } else if (isDragging && e.touches.length === 1) {
            // 单指拖拽
            const dx = e.touches[0].pageX - startX;
            const dy = e.touches[0].pageY - startY;
            
            this.style.left = (imgStartX + dx) + 'px';
            this.style.top = (imgStartY + dy) + 'px';
        }
    });
    
    modalImage.addEventListener('touchend', function() {
        initialDistance = 0;
        isDragging = false;
    });
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
});