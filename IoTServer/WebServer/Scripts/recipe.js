var ProjectJar;
(function (ProjectJar) {
    var Recipe = (function () {
        function Recipe(recipeSteps, $selector) {
            this.recipeSteps = recipeSteps;
            this.$selector = $selector;
            this.steps = [];
        }
        Recipe.prototype.render = function () {
            var _this = this;
            this.recipeSteps.forEach(function (step, index) {
                var $step = $("<div class='ms-Grid-row stepContainer'></div>").appendTo(_this.$selector);
                var stepObj = new ProjectJar.Step(step.Description, step.Amount, $step);
                _this.steps.push(stepObj);
                // store this step's start function in the previous step
                if (index > 0) {
                    _this.steps[index - 1].next = stepObj.start.bind(stepObj);
                }
            });
            // store complete as the last step
            this.steps[this.steps.length - 1].next = this.complete.bind(this);
        };
        Recipe.prototype.start = function () {
            this.steps[0].start();
        };
        Recipe.prototype.complete = function () {
            $("<div class='ms-font-xl ms-fontColor-green' style='text-align:center'>Complete!</div>").appendTo(this.$selector);
        };
        return Recipe;
    }());
    ProjectJar.Recipe = Recipe;
})(ProjectJar || (ProjectJar = {}));
