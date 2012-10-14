jQuery(function ($) {

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

    POPUP.init();
    YA_LECTURES.init($('#tab-1'));

    $('#import-form').submit(function (e) {
        e.preventDefault();

        var newLectures = JSON.parse($(this).find('textarea').val());

        YA_LECTURES.add(newLectures);
    });

    $('#newLecture').click(function () {

        POPUP.show({formClass: 'popup_dialog_form_add', header: 'Добавить новую лекцию', submitText: 'Добавить', oldDate: '14.10.2012'});

        return false;
    });
});