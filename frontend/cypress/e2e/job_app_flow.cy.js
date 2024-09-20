describe("Job Tracker Full Flow", () => {
  const randomUsername = `user${Math.floor(Math.random() * 10000)}`;
  const randomEmail = `user${Math.floor(Math.random() * 10000)}@example.com`;
  const randomPassword = `Pass${Math.random().toString(36).substr(2, 8)}`;

  const jobTitle = "Software Engineer";
  const editedJobTitle = "Senior Software Engineer";
  const companyName = "TechCorp";
  const jobDescription = "Develop and maintain software applications.";
  const jobRequirements = "5 years of experience with React and Node.js.";

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

    // Fill out the job form
    cy.get('input[id="title"]').type(jobTitle);
    cy.get('input[id="company"]').type(companyName);
    cy.get('textarea[id="description"]').type(jobDescription);
    cy.get('textarea[id="requirements"]').type(jobRequirements);

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
