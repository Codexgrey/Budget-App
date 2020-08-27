//BUDGET CONTROLLER
var budgetController = (function() {
    var Income, Expense, data, calcTotals;

    Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };


    Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };


    Expense.prototype.calcPercentage = function(totalIncome) {
        if(totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };


    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };


    calcTotals = function(type) {
        var sum, itemArr;
        sum = 0;
        itemArr = data.allItems[type];

        itemArr.forEach(function(curr) {
            sum += curr.value;
        })
        data.totals[type] = sum;
    };


    data = {
        allItems: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        },
        budget: 0,
        percentage: -1
    };



    return {
        addItem: function(type, des, val) {
            var newItem, ID, itemArr;

            itemArr = data.allItems[type]; //itemArr being inc or exp item arrays
            
            /* create/determine new ID
             [1, 2, 3, 4, 5], next ID = 6; This is not plausible, as we expect to delete items from both arrays.
             [1, 2, 4, 5, 8], next ID = 9; This is! As it allows for deleted items & is in order.
             .'. ID = last ID + 1
             */
            if(itemArr.length > 0) {
                ID = itemArr[itemArr.length - 1].id + 1;
            } else {
                ID = 0;
            }
            
            // create newItem based on 'inc' or 'exp' type
            if(type === 'inc') {
                newItem = new Income(ID, des, val);
            } else if(type === 'exp') {
                newItem = new Expense(ID, des, val);
            }

            // add newItem into our data structure
            itemArr.push(newItem);

            // return newItem
            return newItem;
        },

        deleteItem: function(type, id) {
            var itemArr, ids;

            /*
             id = 6
             itemArr[id]; isn't going to work!
             ids = [1, 2, 4, 6, 8]; <-- because!
             index = 3.
             */

            itemArr = data.allItems[type];
            ids = itemArr.map(function(curr) {
                return curr.id;
            });

            index = ids.indexOf(id);
            if(index !== -1) {
                itemArr.splice(index, 1);
            };

        },

        calcBudget: function() {

            // calculate the total inc and exp
            calcTotals('inc');
            calcTotals('exp');

            // calculate the budget: inc - exp
            data.budget = data.totals.inc - data.totals.exp;

            // calculate percentage of income spent
            if(data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
            
        },

        calcPercents: function() {
            var expArr, totalIncome;

            expArr = data.allItems.exp;
            totalIncome = data.totals.inc;
                expArr.forEach(function(curr) {
                    curr.calcPercentage(totalIncome);
                });
        },

        getPercents: function() {
            var expArr, allPercents;

            expArr = data.allItems.exp;
            allPercents = expArr.map(function(curr) {
                return curr.getPercentage();
            });
            return allPercents;
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },

        testing: function() {
            console.log(data);
        }

    };

})();





//UI CONTROLLER
var UIController = (function() {
    var DOMstr, formatNumber;

    DOMstr = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercentLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };


    formatNumber = function(num, type) {
        var numSplit, int, dec, type;

        /* RULES
         +/- before num
         exactly 2 decimal places
         commas seperating thousands
         i.e 2310.457 -> + 2310.46
             2000 -> + 2,000.00
         */

         num = Math.abs(num);
         num = num.toFixed(2);
         numSplit = num.split('.');

         int = numSplit[0];
         dec = numSplit[1];

         if(int.length > 3) {
             int = int.substr(0, int.length - 3) +','+ int.substr(int.length - 3, 3); //input 23210, output 23,210
         } 
         return (type === 'inc' ? '+' : '-') +' '+ int +'.'+ dec;
    };


    return {
        getDOMstr: function() {
            return DOMstr;
        },

        getInput: function() {
            return {
                type: document.querySelector(DOMstr.inputType).value, // will be inc or exp
                description: document.querySelector(DOMstr.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstr.inputValue).value)
            };
        },

        addListItem: function(obj, type) {
            var html, newHtml, itemContainer;

            // create HTML string with some placeholder text
            if(type === 'inc') {
                itemContainer = DOMstr.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if(type === 'exp') {
                itemContainer = DOMstr.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // replace the placeholder texts with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            // insert HTML into the DOM.
            document.querySelector(itemContainer).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function(selectorID) {
            var item;

            // item to be deleted
            item = document.getElementById(selectorID);
            item.parentNode.removeChild(item);
        },

        clearFields: function() {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstr.inputDescription + ',' + DOMstr.inputValue);
            fieldsArr = Array.prototype.slice.call(fields); //set the this variable of the call method to fields(nodeList) to return an array.

            fieldsArr.forEach(function(curr, index, arr) {
                curr.value = "";
            });
            fieldsArr[0].focus();
        },

        displayBudget: function(obj) {
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstr.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstr.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstr.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

            if(obj.percentage > 0) {
                document.querySelector(DOMstr.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstr.percentageLabel).textContent = '---';
            };
        },

        displayPercents: function(percentage) {
            var fields, nodeListForEach;

            fields = document.querySelectorAll(DOMstr.expensesPercentLabel);
            nodeListForEach = function(list, callback) {
                for(var i = 0; i < list.length; i++) {
                    callback(list[i], i);
                }
            };

            nodeListForEach(fields, function(curr, index) {
                if(percentage[index] > 0) {
                    curr.textContent = percentage[index] + '%';
                } else {
                    curr.textContent = '---';
                }
            });
        },

        displayDate: function() {
            var now, month, months, year;

            now = new Date(); //e.g christmas = new Date(2020, 11, 25); Date is zero based.
            month = now.getMonth();
            months = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];
            year = now.getFullYear();

            document.querySelector(DOMstr.dateLabel).textContent = months[month] + ' ' + year;
        }

    };

})();






//GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {
    var ctrlAddItem, setupEventListeners, updateBudget, ctrlDeleteItem, updatePercents;

    setupEventListeners = function() {
        var DOM;

        DOM = UICtrl.getDOMstr();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function(event) {
            if(event.keyCode === 13 || event.which === 13) {
                ctrlAddItem(); 
            }
        });
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };


    updateBudget = function() {
        var budget;

        // calculate the budget
        budgetCtrl.calcBudget();

        // return the budget
        budget = budgetCtrl.getBudget();

        // display the budget on the UI
        UICtrl.displayBudget(budget);
    };


    ctrlAddItem = function() {
        var input, newItem;

        // get the field input data
        input = UICtrl.getInput();

        if(input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // add new item to the UI
            UICtrl.addListItem(newItem, input.type);

            // clear fields
            UICtrl.clearFields();

            // calculate and update budget
            updateBudget();

            // calculate and update percentages
            updatePercents();
        }
    };


    ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if(itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // delete item from the data structure
            budgetCtrl.deleteItem(type, ID);

            // delete item from the UI
            UICtrl.deleteListItem(itemID);

            // update & show the new budget
            updateBudget();

            // calculate and update percentages
            updatePercents();
        }
    };


    updatePercents = function() {
        var percents;

        // calculate percentages
        budgetCtrl.calcPercents();

        // read percentages from the budget controller
        percents = budgetCtrl.getPercents();

        // update the UI with the new percentages
        UICtrl.displayPercents(percents);
    };


    return {
        init: function() {
            console.log('Application has started!')
            UICtrl.displayDate();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    }

})(budgetController, UIController);


controller.init();

























