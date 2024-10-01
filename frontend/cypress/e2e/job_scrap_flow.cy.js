describe("Job Tracker Full Flow", () => {
  const randomUsername = `user${Math.floor(Math.random() * 10000)}`;
  const randomEmail = `user${Math.floor(Math.random() * 10000)}@example.com`;
  const randomPassword = `Pass${Math.random().toString(36).substr(2, 8)}`;

  const jobTitle = "Software Engineering Fall Intern";
  const editedJobTitle = "Senior Software Engineer";
  const companyName = "Imagination Land";
  const jobDescription =
    "Imagination Land Space is seeking a Software Engineering Fall Intern. Seeking an energetic, enthusiastic intern candidate who has training and interest in at least one of these skill areas: C, C++, C#, Java, XML, Windows, .NET, and UNIX, system software and scripting development, Java programming, web development, System analysis, System design, Software Design, Software Development and Implementation, Software Test, Cyber Security, System Operations.";
  const jobRequirements =
    "Current college enrollment in degree programs such as Computer Science, Systems Engineering, Electrical Engineering, Computer Engineering, Information Technology, Management Information Systems, Cyber Security or related discipline. Familiar with one or more of the following: C, C++, C#, Java, XML, Windows, .NET, and UNIX, system software and scripting development, Java programming, web development, System analysis, System design, Software Design, Software Development and Implementation, Software Test or Cyber Security, or related programming. Must be a US Citizen; this position will require a government security clearance.";

  it("should sign up, login, add a job, edit it, and delete it", () => {
    // Visit the signup page
    cy.visit("/signup");

    // Fill out signup form
    cy.get('input[id="username"]').type(randomUsername);
    cy.get('input[id="email"]').type(randomEmail);
    cy.get('input[id="password"]').type(randomPassword);

    // Submit signup form
    cy.get('button[type="submit"]').contains("Sign Up").click();

    // Verify user is redirected to login page
    cy.url().should("include", "/login");

    // Log in with the newly created user
    cy.get('input[id="username"]').type(randomUsername);
    cy.get('input[id="password"]').type(randomPassword);
    cy.get('button[type="submit"]').contains("Login").click();

    // Verify the user is redirected to the Job List page
    cy.url().should("include", "/jobs");
    cy.contains("Job List").should("be.visible");

    // Step 1: Click on the "Add New Job" button
    cy.get("button").contains("Add New Job").click();

    // Ensure we are redirected to the Add Job page
    cy.url().should("include", "/add-job");

    // Enter the URL
    cy.get('input[id="scraping_url"]').type(
      "https://yisamyan.github.io/Job-Tracker-Scraping/"
    );
    cy.get('button[type="button"]').contains("Scrape Job Details").click();
    cy.wait(20000);

    // Verify the elements have been populated
    cy.get("#title").should("have.value", jobTitle);
    cy.get("#company").should("have.value", companyName);
    cy.get("#description").should("have.value", jobDescription);
    cy.get("#requirements").should("have.value", jobRequirements);

    // Submit the job form
    cy.get('button[type="submit"]').contains("Add Job").click();

    // Verify the job is added and displayed in the Job List page
    cy.url().should("include", "/jobs");
    cy.contains(jobTitle).should("be.visible");
    cy.contains(companyName).should("be.visible");

    // Click on the "Edit" button for the newly added job
    cy.contains("Edit").click();

    // Verify we are on the Edit Job page
    cy.url().should("include", "/edit-job");

    // Edit the job title and submit the form
    cy.get('input[id="title"]').clear().type(editedJobTitle);
    cy.get('button[type="submit"]').contains("Update Job").click();

    // Verify the job title is updated in the Job List page
    cy.url().should("include", "/jobs");
    cy.contains(editedJobTitle).should("be.visible");
    cy.contains(companyName).should("be.visible");

    // Click on the "Delete" button for the edited job
    cy.contains("Delete").click();

    // Verify the job is removed from the Job List page
    cy.contains(editedJobTitle).should("not.exist");
  });
});
