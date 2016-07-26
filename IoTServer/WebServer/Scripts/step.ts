///<reference path="../Typings/jquery.d.ts"/>
namespace ProjectJar {
    export class Step {
        private static Classes = {
            "over": "overFull",
            "under": "underFull",
            "full": "full"
        };

        private static ErrorMargin = 0.05; //5%

        public next: Function;
        private $progress: JQuery;
        private $bar: JQuery;
        private $checkbox: JQuery;

        constructor(
            public description: string,
            public amount: number,
            public $selector: JQuery
        ) {
            this.render();
            this.next = null;
        }

        render() {
            this.$selector.empty();
            this.$checkbox = $("<div class='ms-Grid-col ms-u-sm1 stepCheckbox'><i class='ms-Icon ms-Icon--checkboxEmpty'></i></div>").appendTo(this.$selector);
            let $step = $("<div class='ms-Grid-col ms-u-sm11'></div>").appendTo(this.$selector);
            $(`<div class='stepTitle'>${this.description}</div>`).appendTo($step);
            this.$bar = $("<div class='stepBar'></div>").appendTo($step);
            this.$progress = $("<div class='stepProgress'></div>").appendTo(this.$bar);
        }

        start() {
            // TODO: poll sensor for data
            let x = 0;
            let id = setInterval(() => {
                if (x > 10) {
                    clearInterval(id);
                } else {
                    this.update(x * 10);
                    x++;
                }
            }, 200);
        };

        update(percentFull: number) {
            this.$progress.width(percentFull + "%");
            let status = this.withinMargin(percentFull, 100);
            switch (status) {
                case 1:
                    this.$progress.addClass(Step.Classes.over);
                    this.$progress.removeClass(Step.Classes.under);
                    this.$progress.removeClass(Step.Classes.full);
                    break;
                case 0:
                    this.$progress.addClass(Step.Classes.full);
                    this.$progress.removeClass(Step.Classes.under);
                    this.$progress.removeClass(Step.Classes.over);
                    this.complete();
                    break;
                case -1:
                default:
                    this.$progress.addClass(Step.Classes.under);
                    this.$progress.removeClass(Step.Classes.over);
                    this.$progress.removeClass(Step.Classes.full);
                    break;
            }
        }

        complete() {
            $(".ms-Icon", this.$checkbox).removeClass("ms-Icon--checkboxEmpty");
            $(".ms-Icon", this.$checkbox).addClass("ms-Icon--checkbox");

            if (this.next != null) {
                this.next();
            }
        }

        private withinMargin(current: number, expected: number) {
            let margin = expected * Step.ErrorMargin;
            if (current >= expected - margin && current <= expected + margin) {
                return 0;
            } else if (current < expected - margin) {
                return -1;
            } else {
                return 1;
            }
        }
    }
}