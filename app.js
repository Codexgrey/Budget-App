//BUDGET CONTROLLER
var budgetController = (function() {
    var Income, Expense, data;

    Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };


    Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };


    data = {
        allItems: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        }
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

        testing: function() {
            console.log(data);
        }

    };

})();





//UI CONTROLLER
var UIController = (function() {
    var DOMstr;

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

    return {
        getDOMstr: function() {
            return DOMstr;
        },

        getInput: function() {
            return {
                type: document.querySelector(DOMstr.inputType).value, // will be inc or exp
                description: document.querySelector(DOMstr.inputDescription).value,
                value: document.querySelector(DOMstr.inputValue).value
            };
        },

        addListItem: function(obj, type) {
            var html, newHtml, itemContainer;

            // create HTML string with some placeholder text
            if(type === 'inc') {
                itemContainer = DOMstr.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if(type === 'exp') {
                itemContainer = DOMstr.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // replace the placeholder texts with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // insert HTML into the DOM.
            document.querySelector(itemContainer).insertAdjacentHTML('beforeend', newHtml);
        },

        clearFields: function() {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstr.inputDescription + ',' + DOMstr.inputValue);
            fieldsArr = Array.prototype.slice.call(fields); //set the this variable of the call method to fields(nodeList) to return an array.

            fieldsArr.forEach(function(curr, index, arr) {
                curr.value = "";
            });
            fieldsArr[0].focus();
        }
    };

})();






//GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {
    var ctrlAddItem, setupEventListeners;

    setupEventListeners = function() {
        var DOM;

        DOM = UICtrl.getDOMstr();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function(event) {
            if(event.keyCode === 13 || event.which === 13) {
                ctrlAddItem(); 
            }
        });

    };

    ctrlAddItem = function() {
        var input, newItem;

        // get the field input data
        input = UICtrl.getInput();

        // add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        // add new item to the UI
        UICtrl.addListItem(newItem, input.type);

        // clear fields
        UICtrl.clearFields();

        // calculate the budget

        // display the budget on the UI

    };


    return {
        init: function() {
            console.log('Application has started!')
            setupEventListeners();
        }
    }

})(budgetController, UIController);


controller.init();

























