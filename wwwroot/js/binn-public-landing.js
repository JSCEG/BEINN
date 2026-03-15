document.addEventListener('DOMContentLoaded', function () {
    const offerModal = document.getElementById('offerModal');
    const offerNextBtn = document.getElementById('offerNextBtn');
    const offerSelectedLabel = document.getElementById('offerSelectedLabel');
    const offerOptions = Array.from(document.querySelectorAll('.binn-offer-option'));
    const chipButtons = Array.from(document.querySelectorAll('[data-search-chip]'));
    const landingTypeInput = document.getElementById('landingType');
    const landingTypeLabel = document.getElementById('landingTypeLabel');
    const landingDatesInput = document.getElementById('landingDates');
    const landingDatesLabel = document.getElementById('landingDatesLabel');
    const landingDatesTrigger = document.getElementById('landingDatesTrigger');
    const loginForm = document.getElementById('loginForm');
    const loginModal = document.getElementById('loginModal');
    const openLoginModalButtons = document.querySelectorAll('[data-open-login-modal]');
    const closeLoginModalButtons = document.querySelectorAll('[data-close-login-modal]');
    const openOfferButtons = document.querySelectorAll('[data-open-offer-modal]');
    const closeOfferButtons = document.querySelectorAll('[data-close-offer-modal]');
    const userMenu = document.querySelector('[data-user-menu]');
    const userMenuTrigger = document.querySelector('[data-user-menu-trigger]');
    const userMenuDropdown = document.querySelector('[data-user-menu-dropdown]');
    const suggestionButtons = Array.from(document.querySelectorAll('.binn-public-suggestion'));
    const dateModal = document.getElementById('dateModal');
    const dateMonths = document.getElementById('dateMonths');
    const dateRangeStartLabel = document.getElementById('dateRangeStartLabel');
    const dateRangeEndLabel = document.getElementById('dateRangeEndLabel');
    const dateRangeNightsLabel = document.getElementById('dateRangeNightsLabel');
    const closeDateModalButtons = document.querySelectorAll('[data-close-date-modal]');
    const applyDateRangeButton = document.querySelector('[data-apply-date-range]');
    const clearDateRangeButton = document.querySelector('[data-clear-date-range]');
    const presetRangeButtons = Array.from(document.querySelectorAll('.binn-date-preset'));
    const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const weekdayNames = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
    let rangeStart = null;
    let rangeEnd = null;

    function setSearchChip(value) {
        if (landingTypeInput) {
            const labels = {
                estacionamientos: 'Estacionamiento',
                oficinas: 'Oficina privada',
                coworks: 'Cowork flexible',
                eventos: 'Salón para eventos'
            };

            landingTypeInput.value = labels[value] || value;

            if (landingTypeLabel) {
                landingTypeLabel.textContent = labels[value] || value;
            }
        }

        chipButtons.forEach((button) => {
            button.classList.toggle('is-active', button.getAttribute('data-search-chip') === value);
        });
    }

    function openOfferModal() {
        if (!offerModal) {
            return;
        }

        offerModal.classList.add('is-open');
        offerModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeOfferModal() {
        if (!offerModal) {
            return;
        }

        offerModal.classList.remove('is-open');
        offerModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function normalizeDate(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    function formatShortDate(date) {
        return `${date.getDate()} ${monthNames[date.getMonth()].slice(0, 3)}`;
    }

    function formatRangeLabel(start, end) {
        if (!start || !end) {
            return 'Agregar fechas';
        }

        return `${formatShortDate(start)} - ${formatShortDate(end)}`;
    }

    function getNightCount(start, end) {
        if (!start || !end) {
            return 0;
        }

        return Math.round((normalizeDate(end) - normalizeDate(start)) / 86400000);
    }

    function syncDateSummary() {
        if (dateRangeStartLabel) {
            dateRangeStartLabel.textContent = rangeStart ? formatShortDate(rangeStart) : 'Sin fecha';
        }

        if (dateRangeEndLabel) {
            dateRangeEndLabel.textContent = rangeEnd ? formatShortDate(rangeEnd) : 'Sin fecha';
        }

        if (dateRangeNightsLabel) {
            dateRangeNightsLabel.textContent = String(getNightCount(rangeStart, rangeEnd));
        }
    }

    function syncDateField() {
        if (landingDatesInput) {
            landingDatesInput.value = rangeStart && rangeEnd ? `${rangeStart.toISOString()}|${rangeEnd.toISOString()}` : '';
        }

        if (landingDatesLabel) {
            landingDatesLabel.textContent = formatRangeLabel(rangeStart, rangeEnd);
        }
    }

    function isSameDay(a, b) {
        return a && b &&
            a.getFullYear() === b.getFullYear() &&
            a.getMonth() === b.getMonth() &&
            a.getDate() === b.getDate();
    }

    function renderMonth(date) {
        const month = date.getMonth();
        const year = date.getFullYear();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const article = document.createElement('article');
        article.className = 'binn-date-month';

        const title = document.createElement('div');
        title.className = 'binn-date-month__title';
        title.textContent = `${monthNames[month]} ${year}`;
        article.appendChild(title);

        const weekdays = document.createElement('div');
        weekdays.className = 'binn-date-month__weekdays';
        weekdayNames.forEach((name) => {
            const span = document.createElement('span');
            span.textContent = name;
            weekdays.appendChild(span);
        });
        article.appendChild(weekdays);

        const grid = document.createElement('div');
        grid.className = 'binn-date-month__grid';

        for (let i = 0; i < firstDay.getDay(); i += 1) {
            const empty = document.createElement('div');
            empty.className = 'binn-date-day--empty';
            grid.appendChild(empty);
        }

        for (let day = 1; day <= lastDay.getDate(); day += 1) {
            const currentDate = new Date(year, month, day);
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'binn-date-day';
            button.textContent = String(day);
            button.dataset.date = currentDate.toISOString();

            if (isSameDay(currentDate, rangeStart)) {
                button.classList.add('is-start');
            }

            if (isSameDay(currentDate, rangeEnd)) {
                button.classList.add('is-end');
            }

            if (rangeStart && rangeEnd && currentDate > normalizeDate(rangeStart) && currentDate < normalizeDate(rangeEnd)) {
                button.classList.add('is-in-range');
            }

            button.addEventListener('click', function () {
                if (!rangeStart || (rangeStart && rangeEnd)) {
                    rangeStart = currentDate;
                    rangeEnd = null;
                } else if (currentDate < rangeStart) {
                    rangeEnd = rangeStart;
                    rangeStart = currentDate;
                } else {
                    rangeEnd = currentDate;
                }

                syncDateSummary();
                renderDateCalendar();
            });

            grid.appendChild(button);
        }

        article.appendChild(grid);
        return article;
    }

    function renderDateCalendar() {
        if (!dateMonths) {
            return;
        }

        dateMonths.innerHTML = '';

        const today = normalizeDate(new Date());
        dateMonths.appendChild(renderMonth(today));
        dateMonths.appendChild(renderMonth(new Date(today.getFullYear(), today.getMonth() + 1, 1)));
        syncDateSummary();
    }

    function openDateModal() {
        if (!dateModal) {
            return;
        }

        renderDateCalendar();
        dateModal.classList.add('is-open');
        dateModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeDateModal() {
        if (!dateModal) {
            return;
        }

        dateModal.classList.remove('is-open');
        dateModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function openUserMenu() {
        if (!userMenuTrigger || !userMenuDropdown) {
            return;
        }

        userMenuDropdown.hidden = false;
        userMenuTrigger.setAttribute('aria-expanded', 'true');
    }

    function closeUserMenu() {
        if (!userMenuTrigger || !userMenuDropdown) {
            return;
        }

        userMenuDropdown.hidden = true;
        userMenuTrigger.setAttribute('aria-expanded', 'false');
    }

    function toggleUserMenu() {
        if (!userMenuDropdown || userMenuDropdown.hidden) {
            openUserMenu();
            return;
        }

        closeUserMenu();
    }

    function setOfferType(type, label) {
        offerOptions.forEach((option) => {
            option.classList.toggle('is-selected', option.getAttribute('data-offer-type') === type);
        });

        if (offerSelectedLabel) {
            offerSelectedLabel.textContent = `Seleccionado: ${label}`;
        }

        if (offerNextBtn && window.urlRegistro) {
            offerNextBtn.href = `${window.urlRegistro}?tipoEspacio=${encodeURIComponent(type)}`;
        }
    }

    function openLoginModal() {
        if (!loginModal) {
            return;
        }

        loginModal.classList.add('is-open');
        loginModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        const firstInput = loginModal.querySelector('input');
        if (firstInput) {
            window.setTimeout(() => firstInput.focus(), 250);
        }
    }

    function closeLoginModal() {
        if (!loginModal) {
            return;
        }

        loginModal.classList.remove('is-open');
        loginModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function togglePasswordState() {
        const passwordInput = document.getElementById('claveInput');
        const icon = document.getElementById('iconoClave');

        if (!passwordInput || !icon) {
            return;
        }

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.className = 'bi bi-eye-slash-fill';
        } else {
            passwordInput.type = 'password';
            icon.className = 'bi bi-eye-fill';
        }
    }

    window.togglePassword = togglePasswordState;

    openOfferButtons.forEach((button) => {
        button.addEventListener('click', openOfferModal);
    });

    if (landingDatesTrigger) {
        landingDatesTrigger.addEventListener('click', openDateModal);
    }

    openLoginModalButtons.forEach((button) => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            openLoginModal();
        });
    });

    closeLoginModalButtons.forEach((button) => {
        button.addEventListener('click', function () {
            closeLoginModal();
        });
    });

    closeDateModalButtons.forEach((button) => {
        button.addEventListener('click', closeDateModal);
    });

    if (applyDateRangeButton) {
        applyDateRangeButton.addEventListener('click', function () {
            syncDateField();
            closeDateModal();
        });
    }

    if (clearDateRangeButton) {
        clearDateRangeButton.addEventListener('click', function () {
            rangeStart = null;
            rangeEnd = null;
            syncDateSummary();
            syncDateField();
            renderDateCalendar();
        });
    }

    presetRangeButtons.forEach((button) => {
        button.addEventListener('click', function () {
            const days = Number(this.getAttribute('data-range-days') || '0');
            const today = normalizeDate(new Date());
            rangeStart = today;
            rangeEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + days);
            syncDateSummary();
            renderDateCalendar();
        });
    });

    if (userMenuTrigger) {
        userMenuTrigger.addEventListener('click', function (event) {
            event.stopPropagation();
            toggleUserMenu();
        });
    }

    if (userMenuDropdown) {
        userMenuDropdown.addEventListener('click', function (event) {
            event.stopPropagation();
        });
    }

    closeOfferButtons.forEach((button) => {
        button.addEventListener('click', closeOfferModal);
    });

    offerOptions.forEach((option) => {
        option.addEventListener('click', function () {
            const type = this.getAttribute('data-offer-type') || 'estacionamiento';
            const label = this.querySelector('strong')?.textContent?.trim() || 'Estacionamiento';
            setOfferType(type, label);
        });
    });

    chipButtons.forEach((button) => {
        button.addEventListener('click', function () {
            setSearchChip(this.getAttribute('data-search-chip') || 'estacionamientos');
        });
    });

    suggestionButtons.forEach((button) => {
        button.addEventListener('click', function () {
            const destinationInput = document.getElementById('landingDestination');
            if (destinationInput) {
                destinationInput.value = this.textContent?.trim() || '';
            }
        });
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            closeOfferModal();
            closeDateModal();
            closeLoginModal();
            closeUserMenu();
        }
    });

    document.addEventListener('click', function (event) {
        if (!userMenu || !userMenuDropdown || !userMenuTrigger) {
            return;
        }

        if (!userMenu.contains(event.target)) {
            closeUserMenu();
        }
    });

    if (loginForm) {
        loginForm.addEventListener('submit', function () {
            const submitButton = document.getElementById('btnAcceso');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="bi bi-hourglass-split"></i><span>Entrando...</span>';
            }
        });
    }

    setSearchChip('estacionamientos');
    setOfferType('estacionamiento', 'Estacionamiento');
    syncDateField();
});
