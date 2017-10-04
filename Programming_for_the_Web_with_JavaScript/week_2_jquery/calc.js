/*
 * Implement all your JavaScript in this file!
 */

function State() {
    this.result = 0;
    this.prevResult = 0;
    this.error = null;
    this.history = [];
    this.hasNewOperand = false;
    this.lastOperand = null;
    this.lastOperator = null;
}

var myState = null;

$(document).ready(function name(params) {
    //$('#display').val('');
    myState = new State();

    $("button[id^='button']").click(function (event) {

        if (isNewOperation()) {
            resetCalculator();
        }

        var btn = event.target;
        var newValue = parseInt($('#display').val() + btn.value);

        if (cleanDisplay()) {
            newValue = parseInt(btn.value);
        }

        $('#display').val(newValue);
        console.log('Typing => ' + newValue);
        myState.hasNewOperand = true;
        myState.lastOperand = newValue;
    });


    $("button[id$='Button']").click(function (event) {
        var btn = event.target;

        if (btn.id === 'addButton') {
            addAndDoOperation('+');
        } else if (btn.id === 'subtractButton') {
            addAndDoOperation('-');
        } else if (btn.id === 'multiplyButton') {
            addAndDoOperation('*');
        } else if (btn.id === 'divideButton') {
            addAndDoOperation('/');
        } else if (btn.id === 'equalsButton') {
            if (ignoreEquals()) {
                console.log('Ignoring equals => ', myState.history);
                return;
            } else if (repeatLastOperation()) {
                myState.history.push(myState.prevResult);
                myState.history.push(myState.lastOperator);
                $('#display').val(myState.lastOperand);
            } 

            addAndDoOperation('=');
            archiveResult();

        } else if (btn.id === 'clearButton') {
            resetCalculator();
        }
    });

    function resetCalculator() {
        myState = new State();
        $('#display').val('');
        console.log('Reset calculator ...');
    }

    function archiveResult() {
        myState.prevResult = parseInt($('#display').val());
        myState.result = 0;
        myState.history = [];
    }

    function isNewOperation() {
        return myState.prevResult !== 0 && myState.history.length === 0;
    }

    function cleanDisplay() {
        return !myState.hasNewOperand && myState.history.length > 0 && isPreviousItemAnOperator();
    }

    function isPreviousItemAnOperator() {
        var prevOperator = myState.history[myState.history.length - 1];
        console.log('Last Item =>', prevOperator);
        return prevOperator && isNaN(prevOperator) && prevOperator !== '=';
    }

    function ignoreEquals() {
        return !myState.lastOperator || (!myState.hasNewOperand && !myState.prevResult);
    }

    function repeatLastOperation() {
        return myState.prevResult && myState.history.length == 0 && myState.lastOperator;
    }

    function isOperatorOverriding(operator) {
        return operator !== '=' && !myState.hasNewOperand && isPreviousItemAnOperator();
    }

    function isChainedOperationToProcess() {
        return myState.history.length === 3;
    }

    function addAndDoOperation(operator) {

        if (isOperatorOverriding(operator)) {
            myState.history.pop();
            myState.history.push(operator);
            console.log('Overriding operator => ', myState.history);
            return;
        }

        var displayVal = parseInt($('#display').val());

        if (isNaN(displayVal)) {
            myState.history.push(0);
        }
        else {
            myState.history.push(displayVal);
        }

        if (isChainedOperationToProcess()) {
            doOperation();
            myState.history = [];
            addAndDoOperation(operator);
        } else {
            myState.history.push(operator);
            myState.cleanDisplay = true;
            myState.hasNewOperand = false;
            console.log('History =>', myState.history);

            if (operator !== '=') {
                myState.lastOperator = operator;
            }
        }
    }

    function doOperation() {

        console.log('Executing operation array =>', myState.history);

        var displayVal = parseInt($('#display').val());

        var total = 0;
        var operation = null;
        myState.history.forEach(function (element) {

            if (new RegExp('\\d').test(element)) {
                if (operation) {
                    if (operation === '+') {
                        total += element;
                    } else if (operation === '-') {
                        total -= element;
                    } else if (operation === '*') {
                        total *= element;
                    } else if (operation === '/') {
                        if (displayVal == 0) {
                            myState.error = "Infinity";
                            return;
                        } else {
                            total /= element;
                        }
                    }

                    operation = null;
                } else {
                    total += element;
                }
            } else {
                operation = element;
            }
        });

        if (myState.error) {
            $('#display').val(myState.error);
        } else {
            console.log('Total =>', total);
            $('#display').val(total);
        }
    }

});

