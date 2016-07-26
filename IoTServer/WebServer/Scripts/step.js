///<reference path="../Typings/jquery.d.ts"/>
var ProjectJar;
(function (ProjectJar) {
    var Step = (function () {
        function Step(description, amount, $selector) {
            this.description = description;
            this.amount = amount;
            this.$selector = $selector;
            this.render();
            this.next = null;
        }
        Step.prototype.render = function () {
            this.$selector.empty();
            this.$checkbox = $("<div class='ms-Grid-col ms-u-sm1 stepCheckbox'><i class='ms-Icon ms-Icon--checkboxEmpty'></i></div>").appendTo(this.$selector);
            var $step = $("<div class='ms-Grid-col ms-u-sm11'></div>").appendTo(this.$selector);
            $("<div class='stepTitle'>" + this.description + "</div>").appendTo($step);
            this.$bar = $("<div class='stepBar'></div>").appendTo($step);
            this.$progress = $("<div class='stepProgress'></div>").appendTo(this.$bar);
        };
        Step.prototype.start = function () {
            var _this = this;
            this.getWeight();
            // TODO: poll sensor for data
            var x = 0;
            var id = setInterval(function () {
                if (x > 10) {
                    clearInterval(id);
                }
                else {
                    _this.update(x * 10);
                    x++;
                }
            }, 200);
        };
        ;
        Step.prototype.update = function (percentFull) {
            this.$progress.width(percentFull + "%");
            var status = this.withinMargin(percentFull, 100);
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
        };
        Step.prototype.complete = function () {
            $(".ms-Icon", this.$checkbox).removeClass("ms-Icon--checkboxEmpty");
            $(".ms-Icon", this.$checkbox).addClass("ms-Icon--checkbox");
            if (this.next != null) {
                this.next();
            }
        };
        Step.prototype.getWeight = function () {
            $.ajax({
                url: "/api/weight",
                type: "GET"
            }).done(function (result) {
                console.log(result);
            });
        };
        Step.prototype.withinMargin = function (current, expected) {
            var margin = expected * Step.ErrorMargin;
            if (current >= expected - margin && current <= expected + margin) {
                return 0;
            }
            else if (current < expected - margin) {
                return -1;
            }
            else {
                return 1;
            }
        };
        Step.Classes = {
            "over": "overFull",
            "under": "underFull",
            "full": "full"
        };
        Step.ErrorMargin = 0.05; //5%
        return Step;
    }());
    ProjectJar.Step = Step;
})(ProjectJar || (ProjectJar = {}));
//# sourceMappingURL=step.js.map