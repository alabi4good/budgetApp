var budgetController = (function() {
    
    
    class Item {
        constructor(id, description, value){
            this.id = id;
            this.description = description;
            this.value = value;
        }
    }
    
    
    class Expense extends Item{
        constructor(id, description, value){
            super(id, description, value);
            this.percentage = -1;
        }
        
        calcPercentage(totalIncome) {
            if(totalIncome > 0) {
                 this.percentage = Math.round((this.value/totalIncome) * 100);
            }else {
                this.percentage = -1;
            }
           
        }
        
        getPercentage() {
            return this.percentage;
        }
    }
    
    
    class Income extends Item{
        constructor(id, description, value){
            super(id, description, value);
            
        }
    }
    
    
    var calculateTotal = function(type) {
      var sum = 0;
        
        data.allItems[type].forEach(cur => sum += cur.value);
        
        data.totals[type] = sum;
        
    };
    
    //data structure for budget 
    var data = {
        //all items( new expense and new income)
        allItems: {
            exp: [],
            inc: []
        },
        //total number of expenses and income
        totals: {
        exp: 0,
        inc: 0
        },
        budget: 0,
        percentage: 0
    };
    
    //destructure the data structure
    var {allItems, totals, budget, percentage} = data;
    
    return {
        addItem: (type, des, val) => {
            let newItem, ID;
            
            //[1,2,3,4,5] next ID = 5
            //[1,2,4,6,8] next = 9
            //ID = last ID + 1
            
            
            if(allItems[type].length > 0) {
                //create new id
                ID = allItems[type][allItems[type].length - 1].id + 1;
            }else {
                ID = 0;
            }
            
            //create new item based on inc or exp
             if(type === 'exp') {
                 newItem = new Expense(ID, des, val);
             } else if(type === 'inc') {
                 newItem = new Income(ID, des, val);
             }
            //push new item into the array
            allItems[type].push(newItem);
            //return the new item
            return newItem;
        },
        
        
        deleteItem: function(type, id) {
          var ids,index;
            
            //returns an array of all the ids present in the DOM
             ids = data.allItems[type].map(cur => cur.id);
             
            //get the index number of the id passed into the function
            index = ids.indexOf(id);
            
            //remove the id from the array if it exits
            if(index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },
        
        //calculate the budget
        calculateBudget: function() {
          
            //calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            //calculate the budget: income - expenses
            budget = totals.inc - totals.exp;
            
            //calculate the percentage of income spent
            if(totals.inc > 0) {
                percentage = Math.round((totals.exp/totals.inc) * 100);
            } else {
                percentage  = -1;
            }
            
        },
        
        
        calculatePercentages: function() {
        
            data.allItems.exp.forEach(cur => cur.calcPercentage(totals.inc));
            
        },
        
        getPercentages: function() {
           let allPerc = data.allItems.exp.map(cur => cur.getPercentage());
            
            return allPerc;
        },
        
        getBudget: function() {
          
            return {
                budget: budget,
                totalInc: totals.inc,
                totalExp: totals.exp,
                percentage: percentage
            };
        },
      
        testing: function(){
            console.log(data);
            
        }
    }
    
})();





var UIController = (function() {
    
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container:'.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    }
    
    //destructuring the DOMStrings object
    const {inputType, inputDescription, inputValue, inputBtn,incomeContainer, expenseContainer, budgetLabel, incomeLabel, expensesLabel, percentageLabel,container,expensesPercLabel,dateLabel} = DOMStrings;
    
    
    
       var formatNumber = function(num, type) {
            var numSplit, int, dec;
            
            /*
            + or - before number
            exactly 2 decimal points
            comma separating the thousands
            */
            
            num = Math.abs(num);
            num = num.toFixed(2);
            
            numSplit = num.split('.');
            
            int = numSplit[0];
            if(int.length > 3){
                int = int.substr(0,1) + ',' + int.substr(int.length - 3, 3); //input 23510, output 23,510
                
            }
            
            dec = numSplit[1];
            
            return(type == 'exp'? '-': '+') + ' ' + int + '.' + dec;
        };
        
        
    
    return {
       
        getInput: function() {
            
            return {
                 type: document.querySelector(inputType).value,
                 description: document.querySelector(inputDescription).value,
                 value: parseFloat(document.querySelector(inputValue).value)
            }
            
        },
        //add item into the UI
          addListItem: function(obj, type) {
            let html,newHtml,element;
            //create html string with placeholder text
            if(type === 'inc') {
                
                element = incomeContainer;
                html = ' <div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"> <div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                
            } else if(type === 'exp'){
                
                element = expenseContainer;  
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            //replace the placeholder text with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
            
            //insert html into the DOM
              document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        
        //delete item from the UI
        deleteListItem: function(selectorID) {
            
            let el = document.getElementById(selectorID);
            //traverse a level up and then remove the direct child
            el.parentNode.removeChild(el);
        },
        
        
        //clear the input fields
        clearFields: function() {
          let fields, fieldsArr;
            //query selector all the input fields
           fields =  document.querySelectorAll(`${inputDescription}, ${inputValue}`);
            
            //convert the nodeList into an array using the Array.from() from es6
            fieldsArr = Array.from(fields);
            
            //loop through the array and clear the fields
            fieldsArr.map((cur, i) => {
                cur.value = "";
                cur.focus();
            });
            
            
        },
        
        //display the budget
        displayBudget: function(obj) {
            var type;
            let {budget, totalInc, totalExp, percentage} = obj;
            
            obj.budget > 0 ? type = 'inc': type = 'exp';
            
            document.querySelector(budgetLabel).innerHTML = formatNumber(budget,type);
            document.querySelector(incomeLabel).innerHTML = formatNumber(totalInc, 'inc');
            document.querySelector(expensesLabel).innerHTML = formatNumber(totalExp, 'exp');
             
          if(percentage > 0) {
              document.querySelector(percentageLabel).innerHTML = `${percentage}%`;
          } else {
              document.querySelector(percentageLabel).innerHTML = '---';
          }
           
        },
        
        displayPercentages: function(percentages) {
            let fields, fieldsArr;
            fields = document.querySelectorAll(expensesPercLabel);
            fieldsArr = Array.from(fields);
            fieldsArr.map((cur, i) => {
                if(percentages[i] > 0) {
                    cur.textContent = percentages[i] + '%';
                }else{
                    cur.textContent = '---';
                } 
                
            });
        },
        
        
        displayMonth:function() {
        
            let now, month,months, year;
             now = new Date();
            month = now.getMonth();
            months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            year = now.getFullYear();
            document.querySelector(dateLabel).textContent = `${months[month]} ${year}`;
        },
        
        
        changedType: function() {
            var fields, fieldsArr;
            fields = document.querySelectorAll(inputType + ',' + inputDescription + ',' + inputValue);
            
            fieldsArr = Array.from(fields).map(cur => cur.classList.toggle('red-focus'));
            document.querySelector(inputBtn).classList.toggle('red');
        },
        
        
        getDOMStrings: function() {
            return DOMStrings;
        }
    };
    
})();


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

