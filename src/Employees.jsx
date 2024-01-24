import React, { useState, useEffect } from "react";
import findCommonDays from "./FindCommonDays";
import constructAndValidate from "./ConstructAndValidate";
import EmployeeTable from "./EmployeeTable";

const Employees = () => {
    //Declaring and first initialising file, columns and rows for the table
  const [file, setFile] = useState(null);
  const [columns, setColumns] = useState([])
  const [rows, setRows] = useState([])


  const handleFileChange = (event) => {
    setFile(event.target.files[0]); //set the chosen file to the variable
  };

  //Executing this code every time file has changed
  useEffect(() => {
    if (file) {
      const fileReader = new FileReader(); //initialising the file reader
      fileReader.addEventListener("load", (event) => { //when file is loaded
        const data = event.target.result;
        const dataArray = data
          .trim()  //remove the white spaces atthe beginning and at the end
          .replace(/\r?\n|\r/g, ",") //put comma if there are new lines or carriage return
          .replace(/\s/g, "") //remove white spaces between the values
          .split(","); //separate the element with separator comma
        const rowsArray = []; //array for every row / employee-project
        const arrayLength = dataArray.length;
        if (arrayLength > 0) {
          for(let i = 0; i < arrayLength ; i+=4){ // for every 4 consecutive elements 
            try{
            constructAndValidate(dataArray[i], dataArray[i+1], dataArray[i+2], dataArray[i+3], rowsArray) //check if data format is correct and push in the array
            }
            catch(e){
                alert(e) //receive a message if there is an exception
            }
          }
          rowsArray.sort((a, b) => a.employeeID.localeCompare(b.employeeID)); //sort by employeeID, so we have consecutive records for all project of every employee
          let startID = rowsArray[0].employeeID; // start with the first employee
          const employeeArray = [];
          let finalEmployee = { //initialising the first employee with his first project
            "employeeID": startID,
            "projects": [
              {
                "projectID": rowsArray[0].projectID,
                "dateFrom": rowsArray[0].dateFrom,
                "dateTo": rowsArray[0].dateTo,
              },
            ],
          };
          const rowsLength = rowsArray.length;
          for (let i = 1; i < rowsLength; i++) {
            if (rowsArray[i].employeeID === startID) { //if the next employee has the same ID, add his projects
              finalEmployee.projects.push({
                "projectID": rowsArray[i].projectID,
                "dateFrom": rowsArray[i].dateFrom,
                "dateTo": rowsArray[i].dateTo,
              });
            } else {
              employeeArray.push(finalEmployee); //if not, add the employee to the array
              startID = rowsArray[i].employeeID; //and begin with another employee
              finalEmployee = {
               "employeeID": startID,
                "projects": [
                  {
                    "projectID": rowsArray[i].projectID,
                    "dateFrom": rowsArray[i].dateFrom,
                    "dateTo": rowsArray[i].dateTo,
                  },
                ],
              };
              if (i === rowsLength - 1) { //if there are no more rows, add the last employee
                employeeArray.push(finalEmployee);
              }
            }
          }
          const employeeLength = employeeArray.length;
          let maxDays = 0; //temporary variable for maxDays
          let commonDays = 0; //temporary variable for commonDays
          let topPair = {}; //temporary topPair
          let commonProjects = []; //array for common projects of every pair
          for (let i = 0; i < employeeLength; i++) { //compare every employee to every another
            for (let j = i + 1; j < employeeLength; j++) { //without duplicates
              for (let projectJ of employeeArray[j].projects) {
                for (let projectI of employeeArray[i].projects) {
                  if (projectJ.projectID === projectI.projectID) { //if they worked on the same project
                    const thisCommonDays = findCommonDays( //store their commondays for this project
                      Date.parse(projectI.dateFrom),
                      Date.parse(projectI.dateTo),
                      Date.parse(projectJ.dateFrom),
                      Date.parse(projectJ.dateTo)
                    );
                    if (thisCommonDays > 0) {
                      commonDays += thisCommonDays; //add the days for this project to the total common days
                      commonProjects.push({ //add their common project 
                        "projectID": projectI.projectID,
                        "daysWorked": thisCommonDays,
                      });
                    }
                  }
                }
              }
              if (commonDays > maxDays) { //if their commonDays are more than the maxDays to this moment
                maxDays = commonDays; //they become maxDays
                topPair = { //and these employees are the new top pair
                  "Employee ID 1": employeeArray[j].employeeID,
                  "Employee ID 2": employeeArray[i].employeeID,
                  "Common Project": commonProjects[0].projectID,
                  "Total Common Days": commonDays,
                };
              }
              commonDays = 0; //prepare for the next iteration
              commonProjects = [];

            }
          }
          const topPairArray=[]
          topPairArray.push(topPair) //push the final top pair in array, so it can be represented in a table
          setColumns([ //columns for the table
            "Employee ID 1",
            "Employee ID 2",
            "Common Project", 
            "Total Common Days", 
        ])
        setRows(topPairArray) //rows for the table
        }
        else{
            alert("No data!") //receive error message, if the data array is empty
        }
      });
      fileReader.readAsText(file); //reading the file in form of text
    }
    
  }, [file]);

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      {file ? file.name : "File not selected"}
      <EmployeeTable columns={columns} rows={rows} />
    </div>
  );
};

export default Employees;
