#!/usr/bin/env node

import { Command } from "commander";
import readline from "readline";

// In-memory "database"
let database = [];

// Setup Commander.js
const program = new Command();
program
  .name("db-cli")
  .description("A 1970s-style command-line database interface")
  .version("1.0.0");

// Readline interface for the REPL-like experience
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "DB> ",
});

// Command: INSERT
program
  .command("INSERT <data>")
  .description("Insert a row into the database")
  .action((data) => {
    database.push(JSON.parse(data));
    console.log("Row inserted:", data);
  });

// Command: SELECT
program
  .command("SELECT")
  .description("View all rows in the database")
  .action(() => {
    console.table(database);
  });

// Command: DELETE
program
  .command("DELETE <index>")
  .description("Delete a row from the database by index")
  .action((index) => {
    if (index < 0 || index >= database.length) {
      console.log("Error: Invalid index");
    } else {
      const deleted = database.splice(index, 1);
      console.log("Deleted row:", deleted);
    }
  });

// Command: CLEAR
program
  .command("CLEAR")
  .description("Clear the entire database")
  .action(() => {
    database = [];
    console.log("Database cleared");
  });

// Interactive Command Prompt
rl.prompt();

rl.on("line", (line) => {
  const trimmedLine = line.trim();
  if (trimmedLine.toLowerCase() === "exit") {
    rl.close();
  } else {
    try {
      program.parse(trimmedLine.split(" "), { from: "user" });
    } catch (err) {
      console.error("Error processing command:", err.message);
    }
    rl.prompt();
  }
});

rl.on("close", () => {
  console.log("\nGoodbye!");
  process.exit(0);
});
