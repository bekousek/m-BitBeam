enum MBRemoteButton {
    //% block="A"
    A,
    //% block="B"
    B,
    //% block="A+B"
    AB,
    //% block="logo"
    Logo
}

enum MBServoPin {
    //% block="servo 0 (P0)"
    P0 = AnalogPin.P0,
    //% block="servo 1 (P1)"
    P1 = AnalogPin.P1,
    //% block="servo 2 (P2)"
    P2 = AnalogPin.P2
}

//% color=#000000 icon="\uf013" block="m-Bit základní"
namespace mbitbasic {

    let handlers: { [key: string]: () => void } = {}

    //% group="ovladač"
    //% block="nastav roli na ovladač"
    //% weight=100
    export function setupController(): void {
        radio.setGroup(42)
        radio.setTransmitPower(7)

        input.onButtonPressed(Button.A, function () {
            radio.sendString("btn-A")
        })

        input.onButtonPressed(Button.B, function () {
            radio.sendString("btn-B")
        })

        input.onButtonPressed(Button.AB, function () {
            radio.sendString("btn-AB")
        })

        input.onLogoEvent(TouchButtonEvent.Pressed, function () {
            radio.sendString("btn-LOGO")
        })
    }

    //% group="mozek"
    //% block="nastav roli na mozek"
    //% weight=100
    export function setupBrain(): void {
        radio.setGroup(42)
        radio.onReceivedString(function (msg: string) {
            const handler = handlers[msg]
            if (handler) {
                handler()
            }
        })
    }

    //% group="mozek"
    //% block="po zmáčknutí %btn na ovladači"
    //% draggableParameters
    //% weight=95
    export function onRemoteButtonPressed(btn: MBRemoteButton, handler: () => void): void {
        let key = ""
        switch (btn) {
            case MBRemoteButton.A: key = "btn-A"; break
            case MBRemoteButton.B: key = "btn-B"; break
            case MBRemoteButton.AB: key = "btn-AB"; break
            case MBRemoteButton.Logo: key = "btn-LOGO"; break
        }
        handlers[key] = handler
    }

    //% group="mozek"
    //% block="nastav 360° %servo na rychlost %speed"
    //% speed.min=-100 speed.max=100
    //% weight=90
    export function setContinuousServo(servo: MBServoPin, speed: number): void {
        // speed: -100 to 100 → pulse width: ~1ms to ~2ms (50 Hz)
        const minPulse = 1000
        const maxPulse = 2000
        const centerPulse = 1500
        const pulse = centerPulse + (speed / 100) * (maxPulse - centerPulse)
        pins.servoSetPulse(servo, pulse)
    }

    //% group="mozek"
    //% block="nastav 180° %servo na úhel %angle°"
    //% angle.min=0 angle.max=180
    //% weight=85
    export function setStandardServo(servo: MBServoPin, angle: number): void {
        pins.servoWritePin(servo, angle)
    }
}
