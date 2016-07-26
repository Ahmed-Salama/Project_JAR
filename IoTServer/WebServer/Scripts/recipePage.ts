$(document).ready(function () {
    // generate recipes
    let recipeConfig: ProjectJar.RecipeStep[] = [];
    for (let i = 0; i < 5; i++) {
        let stepNumber = i + 1;
        let recipeStep: ProjectJar.RecipeStep = {
            Order: stepNumber,
            Amount: 100,
            Description: "Sample step " + stepNumber
        };
        recipeConfig.push(recipeStep);
    }
    let $content = $("#recipe");
    let recipe = new ProjectJar.Recipe(recipeConfig, $content);
    recipe.render();
    recipe.start();
});