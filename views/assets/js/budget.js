class Budget {
    constructor(id, income, expenses) {
        this.id = id;
        this.income = income;
        this.expenses = expenses;
    }
}

class Expense {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}

var userBudget = new Budget(Date.now, 0, []);

var chart;


function calculateIncome() {

    var income = 0;
    const wage = document.getElementById("wage").value;
    const weeklyhours = document.getElementById("weeklyhours").value;
    
    income = (parseFloat(wage)*(weeklyhours)*4.345).toFixed(2);
    return income;
}

function updateIncome() {

    document.getElementById("income").innerText = calculateIncome();
    updateBudget();

}

function updateBudget() {

    var id = Date.now();

    var income = calculateIncome();

    //  Expenses
    var expenses = []
    var table = document.getElementById("dataTable");

    // for (var i = 0; i<table.rows.length; ++i) {

    //     var row = table.rows[i];
    //     var expense = new Expense("", 0);
    //     expense.value = table.rows[i].cells[1].value;

    //     alert(expense.value);

    // }

    expenseValues = document.getElementsByClassName("expenseVal");
    expensesTypes = document.getElementsByClassName("expenseType");
    for (var i = 0; i<expenseValues.length; ++i) {
        if (expenseValues[i].value === "") expenseValues[i].value = 0;
        var expense = new Expense(expensesTypes[i].value, expenseValues[i].value);
        expenses.push(expense);
    }

    //update
    userBudget.id = id;
    userBudget.income = income;
    userBudget.expenses = expenses;

    updateChart();
    // alert(JSON.stringify(userBudget));

    
}

/*
        {  y: 0, legendText:"Groceries $", indexLabel: "Groceries $" },
        {  y: 0, legendText:"Car Payment $", indexLabel: "Car Payment $" },
        {  y: 0, legendText:"Gas $", indexLabel: "Gas $" },
        {  y: 0, legendText:"Rent/House Payment $", indexLabel: "Rent/House Payment $" },
        {  y: 0, legendText:"Subscriptions $", indexLabel: "Subscriptions $" },
        {  y: 0, legendText:"Remaining Cash $", indexLabel: "Remaining Cash $" }
*/
function updateChart() {

    chart.options.data[0].dataPoints = [];
    var leftOverIncome = userBudget.income;

    for (var i = 0; i<userBudget.expenses.length; ++i) {
        chart.options.data[0].dataPoints.push({
            y: userBudget.expenses[i].value,
            legendText: userBudget.expenses[i].type.toUpperCase(),
            indexLabel: userBudget.expenses[i].type.toUpperCase()
        });
        leftOverIncome -=  userBudget.expenses[i].value;
    }

    chart.options.data[0].dataPoints.push({
        y: leftOverIncome,
        legendText: "LEFTOVER INCOME",
        indexLabel: "LEFTOVER INCOME"
    });

    // alert(JSON.stringify(chart.options.data[0].dataPoints));
    chart.render();

}

async function loadUserData() {

    var unamefield = document.getElementById('userText');
    var uname = "User";

    var fetchURL = "";

    if (window.location.hostname === "localhost") {
        fetchURL = "http://"
    }
    else fetchURL = "https://"

    fetchURL += window.location.hostname + ":" + window.location.port + "/getuserdata";

    try {
        // alert(fetchURL);
        await fetch(fetchURL)
            .then(res => res.json())
            .then(dat => {
                if(dat != null) {
                    uname = dat.username
                }
            })
    }
    catch {
        alert("Profile Fetch Error!");
    }

    unamefield.innerHTML = `Hello ${uname}!`;

}

function init() {
    loadUserData();
    chart = new CanvasJS.Chart("chartContainer",
    {
      title:{
        text: "Budget Pie Chart",
        fontFamily: "Sans-Serif",
        fontWeight: "bolder"
      },

      legend:{
        verticalAlign: "bottom",
        horizontalAlign: "center"
      },
      data: [
      {
        //startAngle: 45,
       indexLabelFontSize: 20,
       indexLabelFontFamily: "Sans-Serif",
       indexLabelFontColor: "black",
       indexLabelLineColor: "darkgrey",
       indexLabelPlacement: "outside",
       type: "doughnut",
       showInLegend: true,
       dataPoints: [
       ]
     }
     ]
   });
    chart.render();
}

function addRow(tableID) {

    var table = document.getElementById(tableID);

    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);

    var colCount = table.rows[0].cells.length;

    for(var i=0; i<colCount; i++) {

        var newcell	= row.insertCell(i);

        newcell.innerHTML = table.rows[0].cells[i].innerHTML;
        //alert(newcell.childNodes);
        switch(newcell.childNodes[0].type) {
            case "text":
                    newcell.childNodes[0].value = "";
                    break;
            case "checkbox":
                    newcell.childNodes[0].checked = false;
                    break;
            case "select-one":
                    newcell.childNodes[0].selectedIndex = 0;
                    break;
        }
    }
}

function deleteRow(tableID) {
    try {
        var table = document.getElementById(tableID);
        var rowCount = table.rows.length;

        for(var i=0; i<rowCount; i++) {
            var row = table.rows[i];
            var chkbox = row.cells[0].childNodes[0];
            if(null != chkbox && true == chkbox.checked) {
                if(rowCount <= 1) {
                    alert("Cannot delete all the rows.");
                    break;
                }
                table.deleteRow(i);
                rowCount--;
                i--;
            }
        }
    }
    catch(e) {
        alert(e);
    }
}
