//BUDGET CONTROLLER
var budgetController = (function() {

    // do stuff

})();





//UI CONTROLLER
var UIController = (function() {
    var DOMstr;

    DOMstr = {
        inputBtn: '.add__btn'
    };

    return {
        getDOMstr: function() {
            return DOMstr;
        },

        getInput: function() {
            
        }
    };

})();






//GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {
    var setupEventListeners, ctrlAddItem, DOM;

    DOM = UICtrl.getDOMstr();

    ctrlAddItem = function() {

        // get the field input data

        // add the item to the budget controller

        // add new item to the UI

        // calculate the budget

        // display the budget on the UI
       console.log('It works!');
    };

    
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event) {
        if(event.keyCode === 13 || event.which === 13) {
            ctrlAddItem(); 
        }
    });

})(budgetController, UIController);



























