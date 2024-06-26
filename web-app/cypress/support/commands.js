// cypress/support/commands.js

Cypress.Commands.add("checkUserExists", (userEmail) => {
  return cy
    .request({
      method: "GET",
      url: `/api/users?email=${userEmail}`,
      failOnStatusCode: false,
    })
    .then((response) => {
      console.log("User check response:", response);
      return response;
    });
});
