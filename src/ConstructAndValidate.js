const dateValidation = (date) => {
    //check if date exists and is of type Date and has valid number value
    return date && Object.prototype.toString.call(new Date(date)) === "[object Date]" && !isNaN(new Date(date));
}

const numberValidation = (number) => {
    const numberValue = parseInt(number);
    //check if number has a valid number value
    return !isNaN(numberValue);
  }

const constructAndValidate = (employeeID, projectID, dateFrom, dateTo, targetArray) => {
    if(numberValidation(employeeID) && numberValidation(projectID) && dateValidation(dateFrom) && (dateValidation(dateTo)|| dateTo==='NULL')){
        const today = new Date();
        const todayString = `${today.getFullYear()}-${
          today.getMonth() + 1
        }-${today.getDate()}`; //represent today with year, month, date
        const employee ={ //constructing the new employee
            "employeeID": employeeID,
            "projectID": projectID,
            "dateFrom": dateFrom,
            "dateTo": dateTo !== "NULL" ? dateTo : todayString, //if date is 'NULL', it is valid as today
        };
        targetArray.push(employee) //add the employee in the array
    }
    else{
        throw("Invalid type of data in the file!")
    }
    }
 export default constructAndValidate