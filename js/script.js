jQuery(function ($) {

    POPUP.init();
    YA_LECTURES.init($('#tab-1'));

    $('#import-form').submit(function (e) {
        e.preventDefault();

        var newLectures = JSON.parse($(this).find('textarea').val());

        YA_LECTURES.add(newLectures);
    });

    $('#export-form').submit(function (e) {
        e.preventDefault();

        $(this)
            .find('textarea')
                .val(YA_LECTURES.getJSON());
    });
});