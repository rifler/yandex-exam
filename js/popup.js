var POPUP = (function ($, ich, ya_lectures) {
    var
        bg = $('<div class="popup_background" />'),
        dialog = $('<div class="popup_dialog" />'),

        hide = function () {
            bg.hide();
            dialog.hide();

            $('.datepicker').remove();
        },

        show = function (contentObj, template) {
            dialog
                .empty()
                .append(ich[template](contentObj))
                .show();

            dialog
                .find('.datepicker')
                    .datepicker();
            bg.show();
        },

        init = function () {
            $('body')
                .append(bg)
                .append(dialog)
                .on('click', '.date_item', function () {
                    var elem = $(this),
                        lecture = ya_lectures.getLecture(elem.data('date'), elem.data('time'));

                    show(lecture, 'detailedInfoTemplate');

                    return false;
                })
                .on('click', '.date_block_delete', function () {
                    ya_lectures.remove({type: 'block', elem: $(this).closest('.date_block')})

                    return false;
                })
                .on('click', '.date_item_delete', function () {
                    ya_lectures.remove({type: 'lecture', elem: $(this).closest('.date_item')})

                    return false;
                })
                .on('click', '.date_item_edit', function () {
                    var elem = $(this).closest('.date_item'),
                        lecture = ya_lectures.getLecture(elem.data('date'), elem.data('time')),
                        extObj = {
                            formClass: 'popup_dialog_form_edit',
                            header: 'Редактировать лекцию',
                            submitText: 'Изменить',
                            oldDate: lecture.date,
                            oldTime: lecture.time
                        };

                    $.extend(lecture, extObj);
                    show(lecture, 'formTemplate');

                    return false;
                })
                .on('click', '.newLecture', function () {
                    show({formClass: 'popup_dialog_form_add',
                                header: 'Добавить новую лекцию',
                                submitText: 'Добавить',
                                oldDate: '14.10.2012'
                            }, 'formTemplate');

                    return false;
                })
                .on('click', '.import', function () {
                    show({type: 'import', submitText: 'Импорт',header: 'Импортировать'}, 'importExportTemplate');

                    return false;
                })
                .on('click', '.export', function () {
                    show({type: 'export', submitText: 'Экспорт',header: 'Экспортировать'}, 'importExportTemplate');

                    return false;
                });

            bg.on('click', function () {
                hide();
            });

            dialog
                .on('click', '.popup_form_delete_item', function () {
                    $(this)
                        .closest('label')
                            .remove();

                    return false;
                })
                .on('click', '.popup_form_add_item', function () {
                    $(this)
                        .closest('fieldset')
                            .append(ich.newThesisTemplate());

                    return false;
                })
                .on('submit', '.popup_dialog_form_add', function (e) {
                    e.preventDefault();

                    ya_lectures.add([$(this).serializeObject()]);

                    hide();
                })
                .on('submit', '.popup_dialog_form_edit', function (e) {
                    e.preventDefault();

                    ya_lectures.edit($(this).serializeObject());

                    hide();
                })
                .on('submit', '.popup_dialog_form_import', function (e) {
                    e.preventDefault();

                    var newLectures = JSON.parse($(this).find('textarea').val());

                    ya_lectures.add(newLectures);

                    hide();
                })
                .on('submit', '.popup_dialog_form_export', function (e) {
                    e.preventDefault();

                    $(this)
                        .find('textarea')
                            .val(ya_lectures.getJSON());
                });
        };

    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    }

    return {
        init: init,
        show: show,
        hide: hide
    };
})(window.jQuery, window.ich, window.YA_LECTURES);