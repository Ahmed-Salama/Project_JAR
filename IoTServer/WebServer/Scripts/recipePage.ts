/*
let EggRecipe: ProjectJar.RecipeStep[] = [
    {
        Description: "2 eggs",
        Amount: 2,
        Type: null
    },
    {
        Description: "7 tablespoons milk",
        Amount: 7,
        Type: "weight"
    },
    {
        Description: "1/2 teaspoon salt",
        Amount: 0.5,
        Type: "weight"
    },
    {
        Description: "1/4 teaspoon pepper",
        Amount: 0.25,
        Type: "weight"
    },
    {
        Description: "1 tablespoon olive oil",
        Amount: 1,
        Type: "weight"
    },
    {
        Description: "Beat eggs; add milk, salt, & pepper",
        Amount: null,
        Type: null
    },
    {
        Description: "Coat a skillet with olive oil and heat to medium heat",
        Amount: 50,
        Type: "temperature"
    },
    {
        Description: "Pour egg mixture into hot skillet. Cook & stir until set (~3min)",
        Amount: 3 * 60 * 1000, // 3 min
        Type: "time"
    }
];*/

let EggRecipe: ProjectJar.RecipeStep[] = [
    {
        Description: "Add 150 ml of milk",
        Amount: 600,
        Type: "weight"
    },
    {
        Description: "Add 1/2 tsp of salt",
        Amount: 300,
        Type: "weight"
    },
    {
        Description: "Heat the pan to 160F",
        Amount: 160,
        Type: "temperature"
    }
];

$(document).ready(function () {
    // generate recipes    
    let $content = $("#recipe");
    let recipe = new ProjectJar.Recipe(EggRecipe, $content);
    recipe.render();
    recipe.start();
});