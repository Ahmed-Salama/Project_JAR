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
        private timeoutId: number;
        private movingAvg: MovingAverage;
        private completeCount: number;
        private completed: boolean;
        private stopReading: boolean;
        private oldresult: number;

        constructor(
            public description: string,
            public amount: number,
            public type: string,
            public $selector: JQuery
        ) {
            this.render();
            this.next = null;
            this.movingAvg = new MovingAverage();
            this.completeCount = 0;
            this.completed = false;
            this.stopReading = false;
        }

        render() {
            this.$selector.empty();
            this.$checkbox = $("<div class='ms-Grid-col stepCheckbox'><i class='ms-Icon ms-Icon--checkboxEmpty'></i></div>").appendTo(this.$selector);
            let $step = $("<div class='ms-Grid-col stepDescription'></div>").appendTo(this.$selector);
            $(`<div class='stepTitle'>${this.description}</div>`).appendTo($step);
            this.$bar = $("<div class='stepBar'></div>").appendTo($step);
            this.$progress = $("<div class='stepProgress'></div>").appendTo(this.$bar);
        }

        start() {
            this.getData();
        };

        update(percentFull: number) {
            this.$progress.width(percentFull + "%");
            let status = this.compareMargin(percentFull, 100);
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
            this.completed = true;
            $(".ms-Icon", this.$checkbox).removeClass("ms-Icon--checkboxEmpty");
            $(".ms-Icon", this.$checkbox).addClass("ms-Icon--checkbox");
        }

        moveNext() {
            this.stopReading = true;
            if (this.next != null) {
                this.next();
            }
        }

        getData() {
            if (this.type == "weight" || this.type == "temperature") {
                $.ajax({
                    url: "/api/" + this.type + "/get",
                    type: "GET"
                }).then((result) => {
                    if (this.oldresult == null || result > this.oldresult) {
                        console.log(`Time: ${new Date().toISOString()}; Value: ${result}`);
                        this.oldresult = result;
                    }
                    let percent = (result * 100.0) / this.amount;
                    this.movingAvg.add(percent);
                    
                    if (!this.completed) {
                        this.update(percent);
                        this.checkComplete();
                    }
                    else {
                        this.checkMoveNext();
                    }
                    if (!this.stopReading) {
                        this.timeoutId = setTimeout(() => {
                            this.getData();
                        }, 100);
                    }
                });
            }
        }

        private compareMargin(current: number, expected: number) {
            let margin = expected * Step.ErrorMargin;
            if (current >= expected - margin && current <= expected + margin) {
                return 0;
            } else if (current < expected - margin) {
                return -1;
            } else {
                return 1;
            }
        }

        private checkComplete() {
            if (this.compareMargin(this.movingAvg.avg(), 100) === 0) {
                this.completeCount++;
            }
            if (this.completeCount >= 5) {
                this.complete();
            }
        }

        private checkMoveNext() {
            if (this.compareMargin(this.movingAvg.avg(), 0) === 0) {
                this.moveNext();
            }
        }
    }

    class MovingAverage {
        max = 5;
        data: number[];
        latest: number; 

        constructor() {
            this.data = [];
        }

        add(value: number) {
            if (this.data.length + 1 > this.max) {
                this.data.splice(0, 1); // remove the 1st
            }
            this.data.push(value);
        }

        avg() {
            let sum = this.data.reduce((sum, cur) => { return sum += cur; });
            this.latest = (sum * 1.0) / this.data.length;
            return this.latest;
        }
    }
}