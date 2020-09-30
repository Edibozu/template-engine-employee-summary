// Devs and files that will be used of pulled upon this this application
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
// created an empty array, where the data will go once the user answers all of the prompts.
const employeeArray = [];
// The initial questions that will be asked about every employee.
initialQuestions();

function initialQuestions(userInput) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "What is employee name? ",
      },
      {
        type: "input",
        name: "id",
        message: "What is employee ID? ",
      },
      {
        type: "input",
        name: "email",
        message: "What is employee email? ",
      },
      {
        type: "list",
        name: "role",
        message: "Please select your role: ",
        choices: ["Manager", "Engineer", "Intern"],
      },
    ])
    .then(function (response) {
      console.log(response);
      positionQuestions(response);
    })
    .catch(function (err) {
      if (err) throw err;
      });
}
// Created a second set of prompts because every employee wil have different roles.
// Depending the the role selected during the prompts, this will create a specific qustion to be asked.
// A manager is aked to proved an office number.
function positionQuestions(userResponse) {
  if (userResponse.role === "Manager") {
    inquirer
      .prompt([
        {
          type: "input",
          name: "officeNumber",
          message: "Please enter office number: ",
        },
      ])
      .then(function (positionResponse) {
        const manager = new Manager(
          userResponse.name,
          userResponse.id,
          userResponse.email,
          positionResponse.officeNumber
        );
        employeeArray.push(manager);
        // After every employee input, the user will be asked whether they'd like to stop adding employees.
        stopPrompt();
      })
      .catch(function (err) {
        if (err) throw err;
      });
      // An engineer will be asked to provide a GitHub account.
  } else if (userResponse.role === "Engineer") {
    inquirer
      .prompt([
        {
          type: "input",
          name: "github",
          message: "Please enter employee GitHub username: ",
        },
      ])
      .then(function (positionResponse) {
        const engineer = new Engineer(
          userResponse.name,
          userResponse.id,
          userResponse.email,
          positionResponse.github
        );
        employeeArray.push(engineer);
        stopPrompt();
      })
      .catch(function (err) {
        if (err) throw err;
      });
  } else {
      // an intern will be asked to provide the name of the school they attended. 
    inquirer
      .prompt([
        {
          type: "input",
          name: "school",
          message: "Where did employee attend school? ",
        },
      ])
      .then(function (positionResponse) {
        const intern = new Intern(
          userResponse.name,
          userResponse.id,
          userResponse.email,
          positionResponse.school
        );
        employeeArray.push(intern);
        stopPrompt();
      })
      .catch(function (err) {
        if (err) throw err;
      });
  }
}
// This function is what asks the user whether they's like to stop adding employees.
// If they select no, the initial qiestions will be asked again.
// This will continue until the user answers with "no".
function stopPrompt() {
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "stop",
        message: "Would you like to stop adding employees?",
      },
    ])
    .then(function (response) {
      if (response.stop) {
        const employeeList = render(employeeArray);
        // When the user is done logging in employees, the application will create an html file within the "ouput" folder.
        fs.writeFile(outputPath, employeeList, function (err) {
            console.log("Logged initial prompt inputs!");
          if (err) throw err;
        });
      } else {
        initialQuestions();
      }
    });
}
