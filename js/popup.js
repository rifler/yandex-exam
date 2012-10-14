var POPUP = (function ($, ich, ya_lectures) {
    var
        bg = $('<div class="popup_background" />'),
        dialog = $('<div class="popup_dialog" />'),

        hide = function () {
            bg.hide();
            dialog.hide();
        },

        show = function (contentObj) {
            dialog
                .empty()
                .append(ich.formTemplate(contentObj))
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
                .on('click', '.date_block_delete', function () {
                    ya_lectures.remove({type: 'block', elem: $(this).closest('.date_block')})
                })
                .on('click', '.date_item_delete', function () {
                    ya_lectures.remove({type: 'lecture', elem: $(this).closest('.date_item')})
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
                    show(lecture);

                    return false;
                })
                .on('click', '.newLecture', function () {
                    POPUP.show({formClass: 'popup_dialog_form_add',
                                header: 'Добавить новую лекцию',
                                submitText: 'Добавить',
                                oldDate: '14.10.2012'
                            });

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