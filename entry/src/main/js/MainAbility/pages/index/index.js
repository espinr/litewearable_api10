import sensor from '@system.sensor';
import device from '@system.device';
import app from '@system.app';

export default {
    data: {
        index: 0,
        sensors: {
            onbody: 0,
            steps: 0,
            barometer: 0
        },
        reading: {
            info: false,
            steps: false,
            onbody: false,
            barometer: false
        },
        device: {
            brand: "-",
            manufacturer: "-",
            model: "-",
            product: "-",
            region: "-",
            apiVersion: "-"
        },
        title: ''
    },
    onInit() {
    },
    onDestroy() {
        this.unsubscribeAll();
    },
    closeApp() {
        app.terminate();
    },
    getInfoDevice() {
        var self = this;
        this.reading.info = true;
        device.getInfo({
            success: function(data) {
                self.device = {
                    brand: data.brand,
                    manufacturer: data.manufacturer,
                    model: data.model,
                    product: data.product,
                    region: data.region,
                    apiVersion: data.apiVersion
                }
                console.log(JSON.stringify(data));
            },
            fail: function(data, code) {
                console.error('Failed to obtain device information. Error code:'+ code + '; Error information: ' + data);
            },
        });
    },
    readSteps() {
        var self = this;
        sensor.subscribeStepCounter ({
            success: function(data) {
                self.reading.steps = true;
                self.sensors.steps = data.steps;
                console.log(JSON.stringify(data));
            },
            fail: function(data, code) {
                console.error('Subscription failed. Code: ' + code + '; Data: ' + data);
            }
        });
    },
    readOnBody() {
        var self = this;
        this.reading.onbody = true;
        sensor.subscribeOnBodyState({
            success: function(data) {
                console.log('on body?:' + data.value);
                self.sensors.onbody = data.value;
            },
            fail: function(data, code) {
                console.error('Subscription failed. Code: ' + code + '; Data: ' + data);
            },
        });
    },
    readBarometer() {
        var self = this;
        this.reading.barometer= true;
        sensor.subscribeBarometer ({
            success: function(data) {
                self.sensors.barometer = data.pressure;
                console.log(JSON.stringify(data));
            },
            fail: function(data, code) {
                console.error('Subscription failed. Code: ' + code + '; Data: ' + data);
            }
        });
    },
    unsubscribeAll() {
        sensor.unsubscribeBarometer();
        sensor.unsubscribeStepCounter();
    }
}


