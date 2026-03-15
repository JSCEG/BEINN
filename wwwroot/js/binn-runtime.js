(function (window, document) {
    const config = window.BEINN_RUNTIME || {};
    const $ = window.jQuery;

    function initNotifications() {
        if (!$ || !config.urls?.getNotifications) {
            return;
        }

        function renderNotificationLink(notification) {
            const params = new URLSearchParams({
                titulo: notification.titulo_Notificacion || '',
                mensaje: notification.mensaje || '',
                fecha: notification.fecha_Notificacion || '',
                link: notification.link || ''
            });

            return `${config.urls.notificationDetailsBase}?${params.toString()}`;
        }

        function loadNotifications() {
            $.ajax({
                url: config.urls.getNotifications,
                type: 'GET',
                data: { userId: config.userId },
                success: function (data) {
                    const notificationCount = data.totalUnreadCount || 0;
                    const notifications = data.notifications || [];
                    const notificationBadge = $('#notification-count');

                    if (notificationCount > 0) {
                        notificationBadge.text(notificationCount).removeClass('hidden');
                    } else {
                        notificationBadge.addClass('hidden');
                    }

                    const notificationsList = $('#notifications-list');
                    notificationsList.empty();

                    notifications.forEach(function (notification) {
                        const maxLength = 100;
                        const shortMessage = (notification.mensaje || '').length > maxLength
                            ? notification.mensaje.substring(0, maxLength) + '...'
                            : (notification.mensaje || '');

                        const notificationItem = `
                            <div class="item p-3" data-id="${notification.id}">
                                <div class="row gx-2 justify-content-between align-items-center">
                                    <div class="col-auto">
                                        <img class="profile-image" src="${config.assets.notificationImage}" alt="">
                                    </div>
                                    <div class="col">
                                        <div class="info">
                                            <div class="title"><strong>${notification.titulo_Notificacion || ''}</strong></div>
                                            <div class="desc">${shortMessage}</div>
                                            <div class="meta">${notification.timeAgo || ''}</div>
                                        </div>
                                    </div>
                                </div>
                                <a class="link-mask" href="${renderNotificationLink(notification)}" target="_blank" onclick="window.markAsRead(${notification.id}, this)"></a>
                            </div>`;

                        notificationsList.append(notificationItem);
                    });
                }
            });
        }

        window.markAsRead = function (notificationId, linkElement) {
            $.ajax({
                url: config.urls.markNotificationAsRead,
                type: 'POST',
                data: { notificationId: notificationId },
                success: function (response) {
                    if (!response.success) {
                        return;
                    }

                    const notificationItem = $(linkElement).closest('.item');
                    notificationItem.remove();

                    const notificationBadge = $('#notification-count');
                    const currentCount = parseInt(notificationBadge.text(), 10) || 0;
                    const newCount = currentCount - 1;

                    if (newCount > 0) {
                        notificationBadge.text(newCount);
                    } else {
                        notificationBadge.addClass('hidden');
                    }

                    loadNotifications();
                    window.open($(linkElement).attr('href'), '_blank');
                }
            });
        };

        loadNotifications();
        window.setInterval(loadNotifications, 60000);

        $('#generate-test-notification').on('click', function () {
            $.ajax({
                url: config.urls.generateTestNotification,
                type: 'POST',
                data: { userId: config.userId },
                success: function (response) {
                    if (response.success) {
                        loadNotifications();
                        window.alert('Notificación de prueba generada con éxito.');
                    }
                }
            });
        });
    }

    function initActivityTracking() {
        if (!$ || !config.urls?.registrarActividad || !config.userId || config.userId === 'N/A') {
            return;
        }

        function debounce(func, delay) {
            let debounceTimer;
            return function () {
                const context = this;
                const args = arguments;
                clearTimeout(debounceTimer);
                debounceTimer = window.setTimeout(function () {
                    func.apply(context, args);
                }, delay);
            };
        }

        function registrarActividad(tipo, elemento, idElemento, valor) {
            $.ajax({
                url: config.urls.registrarActividad,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    userId: config.userId,
                    userName: config.userName,
                    pageName: config.pageName,
                    controllerName: config.controllerName,
                    actionName: config.actionName,
                    tipo: tipo,
                    elemento: elemento,
                    idElemento: idElemento,
                    valor: valor,
                    additionalData: config.additionalData
                })
            });
        }

        registrarActividad('Sin Dato', 'Sin Dato', 'Sin Dato', 'Sin Dato');

        $(document).on('click', 'table button', function () {
            registrarActividad('click', 'button', this.id, $(this).text());
        });

        $(document).on('blur', 'table input[type="text"]', debounce(function () {
            registrarActividad('input', 'textbox', this.id, $(this).val());
        }, 1000));

        $(document).on('change', 'table input[type="checkbox"]', function () {
            registrarActividad('click', 'checkbox', this.id, this.checked ? 'checked' : 'unchecked');
        });

        $(document).on('change', 'table input[type="radio"]', function () {
            registrarActividad('click', 'radio', this.id, $(this).val());
        });

        $(document).on('change', 'table select', function () {
            registrarActividad('change', 'dropdown', this.id, $(this).val());
        });

        $(document).on('click', 'button', function () {
            if (!$(this).closest('table').length) {
                registrarActividad('click', 'button', this.id, $(this).text());
            }
        });

        $(document).on('blur', 'input[type="text"]', function () {
            if (!$(this).closest('table').length) {
                const inputElement = this;
                window.setTimeout(function () {
                    registrarActividad('input', 'textbox', inputElement.id, $(inputElement).val());
                }, 2000);
            }
        });

        $(document).on('change', 'input[type="checkbox"]', function () {
            if (!$(this).closest('table').length) {
                registrarActividad('click', 'checkbox', this.id, this.checked ? 'checked' : 'unchecked');
            }
        });

        $(document).on('change', 'input[type="radio"]', function () {
            if (!$(this).closest('table').length) {
                registrarActividad('click', 'radio', this.id, $(this).val());
            }
        });

        $(document).on('change', 'select', function () {
            if (!$(this).closest('table').length) {
                registrarActividad('change', 'dropdown', this.id, $(this).val());
            }
        });
    }

    function initStickyTables() {
        const tableContainer = document.querySelector('.table-container');
        const table = document.querySelector('.table');

        if (!tableContainer || !table) {
            return;
        }

        tableContainer.addEventListener('scroll', function () {
            const ths = table.querySelectorAll('thead th');
            const tds = table.querySelectorAll('tbody td:first-child');
            const thFirstColumn = table.querySelector('thead th:first-child');

            ths.forEach(function (th) {
                th.style.transform = `translateY(${tableContainer.scrollTop}px)`;
            });

            tds.forEach(function (td) {
                td.style.transform = `translateX(${tableContainer.scrollLeft}px)`;
            });

            if (thFirstColumn) {
                thFirstColumn.style.transform = `translate(${tableContainer.scrollLeft}px, ${tableContainer.scrollTop}px)`;
            }
        });
    }

    function initHeartbeat() {
        if (!$ || !config.urls?.heartbeat) {
            return;
        }

        $('#sessionExpireModal').modal({
            backdrop: 'static',
            keyboard: false,
            show: false
        });

        window.setInterval(function () {
            $.ajax({
                url: config.urls.heartbeat,
                method: 'POST',
                success: function (data) {
                    if (!data.expiracionCercana) {
                        return;
                    }

                    $('#sessionExpireModalLabel').text('Advertencia de Expiración de Sesión');
                    $('#sessionExpireModal .modal-body').text('Su sesión está a punto de expirar. ¿Desea continuar trabajando o cerrar la sesión?');
                    $('#btnCerrarSesion').show();
                    $('#btnContinuarSesion').text('Continuar Sesión').show();
                    $('#sessionExpireModal').modal('show');
                },
                error: function (xhr) {
                    if (xhr.status !== 401) {
                        return;
                    }

                    $('#sessionExpireModalLabel').text('Sesión Expirada');
                    $('#sessionExpireModal .modal-body').text('Su sesión ha expirado. Será redirigido a la página de inicio de sesión.');
                    $('#btnCerrarSesion').hide();
                    $('#btnContinuarSesion').text('Ir a Login').off('click').on('click', function () {
                        window.location.href = config.urls.login;
                    });
                    $('#sessionExpireModal').modal('show');
                }
            });
        }, 60000);

        $('#btnCerrarSesion').on('click', function () {
            window.location.href = config.urls.sesionExpirada;
        });

        $('#btnContinuarSesion').on('click', function () {
            $.ajax({
                url: config.urls.actualizarInicioSesion,
                method: 'POST',
                success: function () {
                    $('#sessionExpireModal').modal('hide');
                }
            });
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        initStickyTables();

        if ($) {
            $(function () {
                initNotifications();
                initActivityTracking();
                initHeartbeat();
            });
        }
    });
})(window, document);
