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
            var newItem, ID, typeArr;

            typeArr = data.allItems[type]; //typeArr being inc or exp item arrays
            
            /* create/determine new ID
             [1, 2, 3, 4, 5], next ID = 6; This is not plausible, as we expect to delete items from both arrays.
             [1, 2, 4, 5, 8], next ID = 9; This is! As it allows for deleted items & is in order.
             .'. ID = last ID + 1
             */
            if(typeArr.length > 0) {
                ID = typeArr[typeArr.length - 1].id + 1;
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
            typeArr.push(newItem);

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

























