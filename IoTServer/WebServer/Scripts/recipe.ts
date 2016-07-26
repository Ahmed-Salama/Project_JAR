namespace ProjectJar {
    export interface RecipeStep {
        Order: number;
        Description: string;
        Amount: number;
    }
    export class Recipe {
        public steps: Step[];
        
        constructor(public recipeSteps: RecipeStep[], public $selector: JQuery) {
            this.steps = [];
        }

        render() {
            this.recipeSteps.forEach((step, index) => {
                let $step = $("<div class='ms-Grid-row stepContainer'></div>").appendTo(this.$selector);
                let stepObj = new Step(step.Description, step.Amount, $step);
                this.steps.push(stepObj);
                // store this step's start function in the previous step
                if (index > 0) {
                    this.steps[index - 1].next = stepObj.start.bind(stepObj);
                }
            });

            // store complete as the last step
            this.steps[this.steps.length - 1].next = this.complete.bind(this);
        }

        start() {
            this.steps[0].start();
        }

        complete() {
            $("<div class='ms-font-xl ms-fontColor-green' style='text-align:center'>Complete!</div>").appendTo(this.$selector);
        }

    }
}