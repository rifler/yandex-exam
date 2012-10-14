var YA_LECTURES = (function ($, ich) {

    var
        LECTURES_STORAGE_NAME = 'YaLectures',
        INDEXES_STORAGE_NAME = 'YaIndexes',
        lectures = JSON.parse(localStorage.getItem(LECTURES_STORAGE_NAME)) || {},
        indexes  = JSON.parse(localStorage.getItem(INDEXES_STORAGE_NAME)) || [],
        $mainBlock,

        init = function (mainBlock) {
            var lngth = indexes.length,
                html = [];

            $mainBlock = mainBlock;

            for (var i = 0; i < lngth; i++) {
                html.push(ich.dateBlockTemplate({date: indexes[i], lectureList: lectures[indexes[i]]}));
            }

            $mainBlock
                .append(html);
        },

        dateReturn = function (dateObj) {
            var date = $.trim(dateObj.date) || '01.01.1970',
                time = $.trim(dateObj.time) || '00:00:00',
                dateArr = date.split('.');

            return (new Date(dateArr[1] + '/' + dateArr[0] + '/' + dateArr[2] + ' ' + time)).getTime();
        },

        insertToLectures = function (sourceArr, newElem) {
            var lngth = sourceArr.length,
                flag = false,
                date1,
                date2,
                i;

            for (i = 0; i < lngth; i++) {
                date1 = dateReturn({date: newElem.date, time: newElem.time});
                date2 = dateReturn({date: sourceArr[i].date, time: sourceArr[i].time});

                if (date1 < date2) {
                    sourceArr.splice(i, 0, newElem);
                    flag = true;
                    break;
                } else if (date1 === date2) {
                    return -1;
                }
            }

            /* Либо sourceArr пуст, либо вставляем в конец */
            if (!flag) {
                sourceArr.push(newElem);
            }

            return i;
        },

        insertToIndexes = function (sourceArr, newElem) {
            var lngth = sourceArr.length,
                flag = false,
                date1,
                date2,
                i;

            for (i = 0; i < lngth; i++) {
                date1 = dateReturn({date: newElem});
                date2 = dateReturn({date: sourceArr[i]});

                if (date1 > date2) {
                    sourceArr.splice(i, 0, newElem);
                    flag = true;
                    break;
                } else if (date1 === date2) {
                    return -1;
                }
            }

            /* Либо sourceArr пуст, либо вставляем в конец */
            if (!flag) {
                sourceArr.push(newElem);
            }

            return i;
        },

        save = function () {
            localStorage.setItem(LECTURES_STORAGE_NAME, JSON.stringify(lectures));
            localStorage.setItem(INDEXES_STORAGE_NAME, JSON.stringify(indexes));
        },

        drawDayBlock = function (index, length, elem) {
            if (index === 0) {
                $mainBlock
                    .prepend(ich.dateBlockTemplate({date: elem.date, lectureList: lectures[elem.date]}));
            } else if ((index + 1) === length) {
                $mainBlock
                    .append(ich.dateBlockTemplate({date: elem.date, lectureList: lectures[elem.date]}));
            } else if (index > 0) {
                $mainBlock
                    .children(':eq(' + index + ')')
                        .before(ich.dateBlockTemplate({date: elem.date, lectureList: lectures[elem.date]}));
            }
        },

        drawLectureBlock = function (index, length, elem) {
            if (index === 0) {
                $mainBlock
                    .find('.date_block[data-date="' + elem.date + '"] .date_content')
                        .prepend(ich.dateBlockItemTemplate({lectureList: lectures[elem.date][index]}));
            } else if ((index + 1) === length) {
                $mainBlock
                    .find('.date_block[data-date="' + elem.date + '"] .date_content')
                        .append(ich.dateBlockItemTemplate({lectureList: lectures[elem.date][index]}));
            } else if (index > 0) {
                $mainBlock
                    .find('.date_block[data-date="' + elem.date + '"] .date_item:eq(' + index + ')')
                        .before(ich.dateBlockItemTemplate({lectureList: lectures[elem.date][index]}));
            }
        },

        canInsert = function (date, time) {
            var lngth = (lectures[date] !== undefined) ? lectures[date].length : 0,
                date1 = dateReturn({date: date, time: time}),
                date2,
                flag = true,
                i;

            for (i = 0; i < lngth; i++) {
                date2 = dateReturn({date: lectures[date][i].date, time: lectures[date][i].time});

                if (date1 === date2) {
                    flag = false;
                    break;
                }
            }

            return flag;
        },

        getJSON = function () {
            var res = [],
                lngth;

            for (var i in lectures) {
                if (lectures.hasOwnProperty(i)) {
                    lngth = lectures[i].length;
                    for (var j = 0; j < lngth; j++) {
                        res.push(lectures[i][j]);
                    }
                }
            }

            return JSON.stringify(res);
        }

        add = function (newLectures) {
            var index,
                lngth = newLectures.length,
                i;

            for (i = 0; i < lngth; i++) {
                if (typeof newLectures[i].thesis == 'string') {
                    newLectures[i].thesis = [newLectures[i].thesis];
                }
                /* Если такой ключ уже есть в массиве индексов, то вставляем только в лекции */
                /* Иначе вставляем новый элемент в индексы и создаем в лекциях новый массив на эту дату с новым элементом */
                if (indexes.indexOf(newLectures[i].date) >= 0) {
                    index = insertToLectures(lectures[newLectures[i].date], newLectures[i]);
                    drawLectureBlock(index, lectures[newLectures[i].date].length, newLectures[i]);
                } else {
                    index = insertToIndexes(indexes, newLectures[i].date);
                    lectures[newLectures[i].date] = [newLectures[i]];
                    drawDayBlock(index, indexes.length, newLectures[i]);
                }
            }

            save();
        },

        edit = function (edLecture) {
            var oldDatee = edLecture.oldDate,
                oldTime = edLecture.oldTime,
                newDate = dateReturn({date: edLecture.date, time: edLecture.time}),
                oldDate = dateReturn({date: edLecture.oldDate, time: edLecture.oldTime});

            delete edLecture.oldDate;
            delete edLecture.oldTime;

            if (newDate != oldDate) {
                if (canInsert(edLecture.date, edLecture.time)) {
                    remove({type: 'lecture', date: oldDatee, time: oldTime, speed: 0});//oldDatee, oldTime);
                    add([edLecture]);
                }

            } else {
                setLecture(edLecture.date, edLecture.time, edLecture);
                redrawLecture(edLecture.date, edLecture.time, edLecture);
            }
        },

        redrawLecture = function (date, time, elem) {
            $mainBlock
                .find('.date_block[data-date="' + elem.date + '"] .date_item[data-time="' + elem.time + '"]')
                    .empty()
                    .append(ich.dateBlockItemInner(elem));

        },

        deleteBlock = function (date) {
            var index = indexes.indexOf(date);

            indexes.splice(index, 1);
            delete lectures[date];
        },

        deleteLecture = function (date, time) {
            var result = false,
                dayLectures = lectures[date],
                lngth = dayLectures.length;

            if (lngth == 1) {
                deleteBlock(date);
                result = true;
            } else {
                for (var i = 0; i < lngth; i++) {
                    if (dayLectures[i].time == time) {
                        dayLectures.splice(i, 1);
                        break;
                    }
                }
            }

            return result;
        },

        remove = function (obj) {
            var date = obj.date || obj.elem.data('date'),
                time = obj.time || obj.elem.data('time'),
                elem = obj.elem,
                speed = (obj.speed !== undefined) ? obj.speed : 'fast';

            if (obj.type == 'block') {
                deleteBlock(date);
            } else if (obj.type == 'lecture') {
                elem = elem || $mainBlock.find('.date_block[data-date="' + date + '"] .date_item[data-time="' + time + '"]')
                if (deleteLecture(date, time)) {
                    elem = elem.closest('.date_block');
                }
            }

            elem.fadeOut(speed, function () {
                $(this).remove();
            });

            save();
        },

        getLecture = function (date, time) {
            var lngth = lectures[date].length;

            for (var i = 0; i < lngth; i++) {
                if (lectures[date][i].time == time) {
                    return lectures[date][i];
                }
            }
        },

        setLecture = function (date, time, newObj) {
            var l = getLecture(date, time);

            $.extend(getLecture(date, time), newObj);

            save();
        };

    return {
        init: init,
        add: add,
        remove: remove,
        edit: edit,
        getLecture: getLecture,
        getJSON: getJSON
    };

})(window.jQuery, window.ich);