const {count, time, timeEnd, logAll} = require("./timer");

const arrayMethods = {
    myForEach: function (cb, thisArg) {
        let myArr = thisArg || this;
        for (let i = 0; i < myArr.length; i++) {
            count('newArrayMethods', 'myForEach');
            cb(myArr[i], i, myArr);
        }
    },
    myMap: function (cb, thisArg) {
        let myArrCopy = [...(thisArg || this)];
        for (let i = 0; i < myArrCopy.length; i++) {
            count('newArrayMethods', 'myMap');
            myArrCopy[i] = cb((thisArg || this)[i], i, (thisArg || this));
        }
        return myArrCopy;
    },
    mySort: function (sortFn) {
        let sortable = this,
            sortFunc = (sortFn && typeof sortFn === 'function')
                ? sortFn
                : (a, b) => a.toString() > b.toString();
        for (let i = 0; i < sortable.length; i++) {
            count('newArrayMethods', 'mySort');
            for (let j = 0; j < sortable.length - i - 1; j++) {
                if (sortFunc(sortable[j], sortable[j + 1])) {
                    [sortable[j], sortable[j + 1]] = [sortable[j + 1], sortable[j]];
                }
            }
        }
        return sortable;
    },
    myFilter: function (cb, thisArg) {
        let filterRes = [],
            myArr = thisArg || this;
        for (let i = 0; i < myArr.length; i++) {
            count('newArrayMethods', 'myFilter');
            if (cb(myArr[i], i, myArr)) {
                filterRes.splice(filterRes.length, 0, myArr[i]);
            }
        }
        return filterRes;
    },
    myPush: function (...elements) {
        count('newArrayMethods', 'myPush');
        this.splice(this.length, 0, ...elements);
        return this.length;
    }
};

Object.keys(arrayMethods).forEach(key => {
    Array.prototype[key] = arrayMethods[key];
});

let arr = [];

time('newArrayMethods', 'myPush');
arr.myPush(...Array(1000));
timeEnd('newArrayMethods', 'myPush');

time('newArrayMethods', 'myMap');
let mapped = arr.myMap((el, i) => i);
timeEnd('newArrayMethods', 'myMap');

time('newArrayMethods', 'myForEach');
mapped.myForEach(el => {
});
timeEnd('newArrayMethods', 'myForEach');

time('newArrayMethods', 'myFilter');
mapped.myFilter(el => !(el % 2));
timeEnd('newArrayMethods', 'myFilter');

time('newArrayMethods', 'mySort');
mapped.mySort((a, b) => a > b);
timeEnd('newArrayMethods', 'mySort');

logAll();
