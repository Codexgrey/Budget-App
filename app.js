//BUDGET CONTROLLER
var budgetController = (function() {

    // do stuff

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
    var ctrlAddItem, input, DOM;

    DOM = UICtrl.getDOMstr();

    ctrlAddItem = function() {

        // get the field input data
        input = UICtrl.getInput(); console.log(input);

        // add the item to the budget controller

        // add new item to the UI

        // calculate the budget

        // display the budget on the UI

    };

    
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event) {
        if(event.keyCode === 13 || event.which === 13) {
            ctrlAddItem(); 
        }
    });

})(budgetController, UIController);



























