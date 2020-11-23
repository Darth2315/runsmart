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

    // TABS

    const tabContent = document.querySelectorAll('.catalog__content'),
          tabWrapper = document.querySelector('.catalog__tabs'),
          tabs = document.querySelectorAll('.catalog__tab');

    function hideTabContent() {
        tabContent.forEach(item => {
            item.style.display = 'none';
        });
        tabs.forEach(item => {
            item.classList.remove('catalog__tab_active');
        });
    }

    function showTabContent(i=0) {
        tabContent[i].style.display = 'flex';
        tabs[i].classList.add('catalog__tab_active');
    }

    hideTabContent();
    showTabContent();

    tabWrapper.addEventListener('click', (e) => {
        const target = e.target;
        if (target && target.classList.contains('catalog__tab')) {
            console.log('2click');
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    // Details in card & Back in card
    const details = document.querySelectorAll('.catalog-item__link'),
          itemContent = document.querySelectorAll('.catalog-item__content'),
          itemList = document.querySelectorAll('.catalog-item__list'),
          backBtn = document.querySelectorAll('.catalog-item__back');

    function toggleTabActiveClass(trigger) {
        trigger.forEach((item, i) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                itemContent[i].classList.toggle('catalog-item__content_active');
                itemList[i].classList.toggle('catalog-item__list_active');
            });
        });
    }
    toggleTabActiveClass(details);
    toggleTabActiveClass(backBtn);

    // Modal
    const overlay = document.querySelector('.overlay'),
          modalConsalt = document.querySelector('#consultation'),
          modalOrder = document.querySelector('#order'),
          modalThanks = document.querySelector('#thanks'),
          btnConsalt = document.querySelectorAll('[data-modal=consultation]'),
          btnCatalog = document.querySelectorAll('.catalog .button'),
          close = document.querySelectorAll('.modal__close'),
          modalDescr = document.querySelectorAll('#order .modal__descr'),
          itemSubtitle = document.querySelectorAll('.catalog-item__subtitle');


    function showModal(modal) {
        overlay.style.display = 'block';
        modal.style.display = 'block';
        modal.classList.add('fade');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        overlay.style.display = 'none';
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    function showModalByTrigger(trigger, modal) {
        trigger.forEach((item, i) => {
            item.addEventListener('click', () => {
                showModal(modal);
                
                if (item.classList.contains('button_mini')) {
                    const titleItem = itemSubtitle[i].textContent;
                    
                    modalDescr.forEach(title => {
                        title.textContent = titleItem;
                    });
                }           
            });
        });
    }
    showModalByTrigger(btnConsalt, modalConsalt);
    showModalByTrigger(btnCatalog, modalOrder);

    function closeModalByTrigger(trigger, modal) {
        trigger.forEach(item => {
            item.addEventListener('click', () => {
                closeModal(modal);
            });
        });
    }
    closeModalByTrigger(close, modalConsalt);
    closeModalByTrigger(close, modalOrder);

    function closeModalByEscape(modal) {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Escape' && modal.style.display === 'block') {
                closeModal(modal);
            }
        });
    }
    closeModalByEscape(modalConsalt);
    closeModalByEscape(modalOrder);

    //Form send and validation
    const forms = document.querySelectorAll('form'),
          inputs = document.querySelectorAll('input');

    const message = {
        nameError: "Ім'я має містити 2 і більше символів",
        phoneError: "Введіть номер телефону в форматі +380978442210",
        emailError: "Адреса поштової скриньки має містити @",
        loading: "Завантаження...",
        success: "Відправка пройшла успішно!",
        error: "Щось пішло не так..."
    };

    const postData = async (url, data) => {
        document.querySelector('.status').textContent(message.loading);
        let res = await fetch(url, {
            method: 'POST',
            body: data
        });
        return await res.text();
    };

    forms.forEach(item => {
        item.addEventListener('submit', (e) => {
            e.preventDefault();
            let statusMessage = document.createElement('div');
            statusMessage.classList.add('status');
            statusMessage.style.cssText = `
                font-size: 15px;
                margin: 15px auto;
                color: red;
            `;
            statusMessage.textContent = message.nameError;
            item.appendChild(statusMessage);

            const formData = new FormData(item);

            postData('server.php', formData)
            .then(res => {
                console.log(res);
                statusMessage.textContent = message.success;
            })
            .catch(() => statusMessage.textContent = message.error)
            .finally(() => {
                clearInputs();
            });
        });
    });
    
});