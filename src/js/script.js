window.addEventListener('DOMContentLoaded', () => {

    // slider
    const slider = document.querySelector('.carousel'),
          slides = document.querySelectorAll('.carousel__slide'),
          next = document.querySelector('.carousel__next'),
          prev = document.querySelector('.carousel__prev'),
          slidesWrapper = document.querySelector('.carousel__wrapper'),
          slidesField = document.querySelector('.carousel__inner'),
          width = window.getComputedStyle(slidesWrapper).width;
    
    let slideIndex = 1,
        offset = 0;

    slidesField.style.width = 100 * slides.length + '%';
    
    slides.forEach(item => {
        item.style.width = width;
    });

    // dots
    const indicators = document.createElement('ol');
    indicators.classList.add('carousel__indicators');
    slider.append(indicators);
    let dots = [];

    for(let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        dot.classList.add('carousel__dot');
        dot.setAttribute('data-slide-to', i+1);
        indicators.append(dot);
        if (i == 0) {
            dot.style.opacity = 1;
        }
        dots.push(dot);
    }

    function currentDot() {
        dots.forEach(item => item.style.opacity = '.5');
        dots[slideIndex - 1].style.opacity = 1;
    }

    // dots click
    dots.forEach(item => {
        item.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-slide-to');
            slideIndex = slideTo;
            offset = +width.slice(0, width.length - 2) * (slideTo - 1);
            
            slidesField.style.transform = `translateX(-${offset}px)`;
            currentDot();
        });
    });

    // arrow next
    next.addEventListener('click', () => {
        if (offset == +width.slice(0, width.length -2) * (slides.length - 1)) {
            offset = 0;
        } else {
            offset += +width.slice(0, width.length -2);
        }
        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == slides.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }
        currentDot();
    });

    // arrow prev
    prev.addEventListener('click', () => {
        if (offset == 0) {
            offset = +width.slice(0, width.length - 2) * (slides.length - 1);
        } else {
            offset -= +width.slice(0, width.length - 2);
        }
        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == 1) {
            slideIndex = slides.length;
        } else {
            slideIndex--;
        }
        currentDot();
    });
});