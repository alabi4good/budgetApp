# A JAVASCRIPT BUDGET APP 
***
This is a budget application written in vanilla javascript to calculate your total income and expenses for the month.


## LANGUAGES USED
***

HTML5  
CSS3  
JAVASCRIPT/JQUERY  


### SAMPLE OF THE JAVASCRIPT CODES I WROTE FOR THE WEBSITE PROJECT  
***
	 
    var controller = (function(UICtrl, bdgtCtrl) {
    
    var setUpEventListener = function() {
        
        var DOM = UICtrl.getDOMStrings();
        
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    
        document.addEventListener('keypress', function(e) {
          if(e.keyCode === 13 || e.which === 13) {
            
             ctrlAddItem();
          }
       });
        
      document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    
    };
    
    
     var updateBudget = function() {
        
        //1.Calculate the budget
        bdgtCtrl.calculateBudget();
         
        //2.return the budget
        var budget = bdgtCtrl.getBudget();
         
        //3.display the budget in the UI
         UICtrl.displayBudget(budget);
    };
    
    
    var updatePercentages = function() {
        let percentages;
        //1.calc percentages
        bdgtCtrl.calculatePercentages();
        
        //2.read percentages from budget controller
        percentages = bdgtCtrl.getPercentages();
        
        //3.update the UI with the new percentages
        UICtrl.displayPercentages(percentages);
    };
    
    
    var ctrlAddItem = function() {
        let newItem;
        
         //1. Get the field input data using es6 destructuring
         let {type, description, value} = UICtrl.getInput();
         
        if(description !== "" && !isNaN(value) && value > 0) {
            
            //2. Add the item to the budget controller
            newItem = bdgtCtrl.addItem(type, description, value);
        
           //3.Add the item to the UI
           UICtrl.addListItem(newItem, type);
        
           //4.clear the fields
           UICtrl.clearFields();
        
           //5.calculate and update the budget
           updateBudget();
            
            //6.calc and update percentages
            updatePercentages();
        }
        
    };
    
    
    var ctrlDeleteItem = function(e) {
     let itemID, splitID;
       itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;

       if(itemID) {
           
           splitID = itemID.split('-');
           var [type, ID] = splitID;
           type = splitID[0];
           ID = parseInt(splitID[1]);
          
           //1.delete the item from data structure
           bdgtCtrl.deleteItem(type, ID);
           
           //2.delete the item from the UI
           UICtrl.deleteListItem(itemID);
           
           //3.update and show the new budget
           updateBudget();
           
           //4.calc and update percentages
           updatePercentages();
       }
    };
    
    
    return {
        
        init: function() {
            console.log('Application Started');
            UICtrl.displayMonth();
             UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            
            setUpEventListener();
        }
    }
    
    
    })(UIController, budgetController);

    controller.init();



## EDITORS USED:
***
BRACKET  and Visual Studio Code

