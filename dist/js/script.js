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

    function moveNext() {
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
    }
 
    function movePrev() {
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
    }

    // arrow next
    next.addEventListener('click', () => {
        moveNext();
    });

    // arrow prev
    prev.addEventListener('click', () => {
        movePrev();
    });

    // swipe
    function swiper() {
        slides.forEach(item => {
            item.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const touch = e.targetTouches[0];
                var midpoint = Math.floor(screen.width/2);
                var px = touch.pageX;
                if (px < midpoint) {
                    movePrev();
                } else {
                    moveNext();
                }
            });
        });
    }
    swiper();

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
        if (target && target.closest('.catalog__tab')) {
            tabs.forEach((item, i) => {
                if (target == item || target.parentElement == item) {
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

    let scroll = calcScroll();

    function showModal(modal) {
        modal.classList.remove('fadeOut');
        overlay.classList.remove('fadeOut');
        overlay.classList.add('fadeIn');
        modal.classList.add('fadeIn');
        overlay.style.display = 'block';
        modal.style.display = 'block';
        document.body.style.marginRight = `${scroll}px`;       
        document.body.style.overflow = 'hidden';
        upElem.style.right = `${40 + scroll}px`;
    }

    function closeModal(modal) {
        modal.classList.remove('fadeIn');
        overlay.classList.remove('fadeIn');
        modal.classList.add('fadeOut');
        overlay.classList.add('fadeOut');
        document.body.style.overflow = '';
        document.body.style.marginRight = '0px';
        upElem.style.right = '';
        setTimeout(() => {
            overlay.style.display = 'none';
            modal.style.display = 'none';
        }, 500);
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

    function closeModalByOverlay(modal) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal(modal);
            }
        });
    }
    closeModalByOverlay(modalConsalt);
    closeModalByOverlay(modalOrder);
    closeModalByOverlay(modalThanks);

    // Remove scroll jump
    function calcScroll() {
        const div = document.createElement('div');
        div.style.width = '50px';
        div.style.height = '50px';
        div.style.overflowY = 'scroll';
        div.style.visibility = 'hidden';
        document.body.appendChild(div);

        let scrollWidth = div.offsetWidth - div.clientWidth;
        div.remove();

        return scrollWidth;
    }

    //Form send and validation
    const forms = document.querySelectorAll('form'),
          inputs = document.querySelectorAll('input'),
          phoneInputs = document.querySelectorAll('input[name="phone"]'),
          nameInputs = document.querySelectorAll('input[name="name"]');

    const message = {
        nameError: "Ім'я має містити 2 і більше символів",
        phoneError: "Некоректний номер телефону",
        emailError: "Адреса поштової скриньки має містити @",
        loading: '../img/spinner.svg',
        success: "Відправка пройшла успішно!",
        error: "Щось пішло не так..."
    };

    // function checkInputs(inputName, typeMessage, numberOfSymbol) {
    //     inputName.forEach(item => {
    //         item.addEventListener('input', () => {
    
    //             let attantionMessage = document.createElement('div');
    //             attantionMessage.textContent = typeMessage;
    //             attantionMessage.classList.add('attantionMessage');
                
    //             if (typeMessage === typeMessage) {
    //                 if (item.value.length < numberOfSymbol && !document.querySelector('.attantionMessage')) {
    //                     item.parentNode.insertBefore(attantionMessage, item.nextSibling);
    //                     item.style.border = '2px solid red';
    //                 } else if (item.value.length == numberOfSymbol && document.querySelector('.attantionMessage')) {
    //                     document.querySelector('.attantionMessage').remove();
    //                     item.style.border = 'none';
    //                 }
    //             }
    //         });
    //     });
    // }
    // checkInputs(phoneInputs, message.phoneError, 19);
    // checkInputs(nameInputs, message.nameError, 2);

    const postData = async (url, data) => {
        let res = await fetch(url, {
            method: 'POST',
            body: data
        });
        return await res.text();
    };

    const clearInputs = () => {
        inputs.forEach(item => {
            item.value = '';
        });
    };
    
    forms.forEach(item => {
        item.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const spinner = document.createElement('img');
            spinner.src = message.loading;
            spinner.classList.add('modal__spinner');
            item.appendChild(spinner);

            const formData = new FormData(item);

            postData('mailer/smart.php', formData)
            .then(res => {
                console.log(res);
                showModal(modalThanks);
            })
            .catch(() => modalThanks.textContent = message.error)
            .finally(() => {
                clearInputs();
                spinner.remove();
                modalConsalt.style.display = 'none';
                modalOrder.style.display = 'none';
                setTimeout(() => {
                    closeModal(modalThanks);
                }, 5000);
            });
        });
    });
 

    // tel mask
    let setCursorPosition = (pos, elem) => {
        elem.focus();

        if (elem.setSelectionRange) {
            elem.setSelectionRange(pos, pos);
        } else if (elem.createTextRange) {
            let range = elem.createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    };

    function createMask(event) {
        let matrix = '+38 (0__) ___ __ __',
            i = 0,
            def = matrix.replace(/\D/g, ''),
            val = this.value.replace(/\D/g, '');

        if (def.length > val.length) {
            val = def;
        }

        this.value = matrix.replace(/./g, function(a) {
            return /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? '' : a;
        });

        if (event.type === 'blur') {
            if (this.value.length == 2) {
                this.value = '';
            }
        } else {
            setCursorPosition(this.value.length, this);
        }
    }

    phoneInputs.forEach(item => {
        item.addEventListener('input', createMask);
        item.addEventListener('blur', createMask);
        item.addEventListener('focus', createMask);
    });

    // smoth scroll
    const upElem = document.querySelector('.pageup');
    
    window.addEventListener('scroll', () => {
        if (document.documentElement.scrollTop > 1600) {
            upElem.classList.add('fadeIn');
            upElem.classList.remove('fadeOut');
            upElem.style.display = 'block';
        } else {
            upElem.classList.add('fadeOut');
            upElem.classList.remove('fadeIn');
            upElem.style.display = 'none';
        }
    });

    // Smooth scrolling with requestAnimationFrame
    const links = document.querySelectorAll('[href^="#"]'),
          speed = 0.3;

    links.forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault();

            let widthTop = document.documentElement.scrollTop,
                hash = this.hash,
                toBlock = document.querySelector(hash).getBoundingClientRect().top,
                start = null;

            requestAnimationFrame(step);

            function step(time) {
                if (start === null) {
                    start = time;
                }

                let progress = time - start,
                    r = (toBlock < 0 ? Math.max(widthTop - progress / speed, widthTop + toBlock) : Math.min(widthTop + progress / speed, widthTop + toBlock));

                document.documentElement.scrollTo(0, r);

                if (r != widthTop + toBlock) {
                    requestAnimationFrame(step);
                } else {
                    // location.hash = hash;
                }
            }
        });
    });

    // Animation review
    window.addEventListener('scroll', () => { 
        const reviewItem = document.querySelectorAll('.reviews__item'),
              reviewBlock = document.querySelector('.reviews');

        if (window.scrollY > reviewBlock.offsetTop - 600) {
            console.log("You've scrolled to reviews section");
            reviewItem.forEach((item, i) => {
                item.classList.add('fadeInUp');
                item.classList.add('fadeIn');
                item.style.animationDuration = `${i+=1}s`;
            });
        } else {
            reviewItem.forEach(item => {
                item.classList.remove('fadeInUp');
                item.classList.remove('fadeIn');
                item.style.animationDuration = '';
            });
        }
        // second way
        // if (reviewBlock.getBoundingClientRect().y < 0) {
        //     write something;
        // }
    });

    // add google map iframe
    function addIframe() {
        const footer = document.querySelector('.footer'),
              map = document.createElement('div');
              map.innerHTML = `
        <iframe class="footer__iframe" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10143.233810119555!2d30.60063889766774!3d50.53773388619132!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4d13e7ca501f9%3A0xc74c61c8ec57a63f!2z0YPQuy4g0JzQuNC70L7RgdC70LDQstGB0LrQsNGPLCAyLCDQmtC40LXQsiwgMDIwMDA!5e0!3m2!1sru!2sua!4v1605970184413!5m2!1sru!2sua" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>
        `;
        footer.append(map);
    }
    addIframe();
});