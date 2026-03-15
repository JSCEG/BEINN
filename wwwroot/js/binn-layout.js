document.addEventListener('DOMContentLoaded', function () {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    }

    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarMobile = document.getElementById('sidebarMobile');

    if (sidebarToggle && sidebarMobile && typeof bootstrap !== 'undefined') {
        const offcanvasInstance = new bootstrap.Offcanvas(sidebarMobile, {
            backdrop: true,
            keyboard: true
        });

        sidebarToggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.toggle('is-active');

            if (window.innerWidth >= 992) {
                document.body.classList.toggle('sidebar-collapsed');
            } else {
                offcanvasInstance.toggle();
            }

            window.setTimeout(function () {
                if (typeof sankeyChart !== 'undefined' && sankeyChart) {
                    sankeyChart.resize();
                }
                if (typeof subSankeyChart !== 'undefined' && subSankeyChart) {
                    subSankeyChart.resize();
                }
            }, 220);
        });

        document.querySelectorAll('[data-bs-toggle="collapse"]').forEach(function (button) {
            button.addEventListener('click', function (e) {
                e.stopPropagation();
            });
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth >= 992 && sidebarMobile.classList.contains('show')) {
                offcanvasInstance.hide();
            }
        });
    }
});

window.addEventListener('load', function () {
    if (window.jQuery) {
        window.jQuery('#page-preloader').removeClass('is-visible').fadeOut('slow');
    }
});

if (window.jQuery) {
    window.jQuery(function ($) {
        let pageDots = 0;
        let ajaxDots = 0;

        window.setInterval(function () {
            $('#page-dots').text('.'.repeat(pageDots));
            pageDots = (pageDots + 1) % 4;
        }, 500);

        window.setInterval(function () {
            $('#ajax-dots').text('.'.repeat(ajaxDots));
            ajaxDots = (ajaxDots + 1) % 4;
        }, 500);

        $('form').on('submit', function () {
            if ($(this).attr('id') === 'form-upload-files' || !$.fn.valid || $(this).valid()) {
                $('#page-preloader').addClass('is-visible').show();
            }
        });

        if ($('.validation-summary-errors').length > 0) {
            $('#page-preloader').removeClass('is-visible').hide();
            window.alert('Por favor, completa todos los campos obligatorios.');
        }

        $(document).ajaxStart(function () {
            $('#ajax-preloader').addClass('is-visible').show();
        }).ajaxStop(function () {
            $('#ajax-preloader').removeClass('is-visible').hide();
        });
    });
}
