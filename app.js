const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const employeeArray = [];

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
        stopPrompt();
      })
      .catch(function (err) {
        if (err) throw err;
      });
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
        fs.writeFile(outputPath, employeeList, function (err) {
            console.log("Logged initial prompt inputs!");
          if (err) throw err;
        });
      } else {
        initialQuestions();
      }
    });
}
