namespace ProjectJar {
    export interface Service {
        getWeight(): JQueryDeferred<number>;
        getTemperature(): JQueryDeferred<number>;
    }

    export class RealData implements Service {

        private static GetDataAsDeferred(url: string) {
            let deferred = $.Deferred();
            $.ajax({
                url: url,
                type: "GET"
            }).done((data) => {
                deferred.resolve(data);
            }).fail((xhr, status, error) => {
                deferred.reject(xhr, status, error);
            });
            return deferred;
        }

        constructor() { }

        getWeight() {
            return RealData.GetDataAsDeferred("/api/weight/get");
        }

        getTemperature() {
            return RealData.GetDataAsDeferred("/api/temperature/get");
        }
    }
    
    export class SimulatedData implements Service {
        private weight: number;
        private temperature: number;

        constructor() {
            this.weight = 0;
            this.temperature = 0;
        }

        getWeight() {
            let weight = this.weight;
            let deferred = $.Deferred();
            if (weight === 0) {
                this.weight = 250;
            } else if (weight >= 600) {
                this.weight = 600;
            } else {
                this.weight += 50;
            }
            deferred.resolve(this.weight);
            return deferred;
        }

        getTemperature() {
            let deferred = $.Deferred();
            if (this.temperature >= 120) {
                this.temperature = 120;
            } else {
                this.temperature += 10;
            }
            deferred.resolve(this.temperature);
            return deferred;
        }
    }
}