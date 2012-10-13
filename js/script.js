jQuery(function ($) {

    YA_LECTURES.init($('#tab-1'));

    $('#import-form').submit(function (e) {
        e.preventDefault();

        var newLectures = JSON.parse($(this).find('textarea').val());

        YA_LECTURES.add(newLectures);
    });

    $('#tab-1')
        .on('click', '.date_block_delete', function () {
            YA_LECTURES.remove('block', $(this).closest('.date_block'));
        })
        .on('click', '.date_item_delete', function () {
            YA_LECTURES.remove('lecture', $(this).closest('.date_item'));
        });
});