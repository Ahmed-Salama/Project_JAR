$(document).ready(function () {
    // generate recipes
    var recipeConfig = [];
    for (var i = 0; i < 5; i++) {
        var stepNumber = i + 1;
        var recipeStep = {
            Order: stepNumber,
            Amount: 100,
            Description: "Sample step " + stepNumber
        };
        recipeConfig.push(recipeStep);
    }
    var $content = $("#recipe");
    var recipe = new ProjectJar.Recipe(recipeConfig, $content);
    recipe.render();
    recipe.start();
});
