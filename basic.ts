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
    //% block="Servo 0"
    P0 = AnalogPin.P0,
    //% block="Servo 1"
    P1 = AnalogPin.P1,
    //% block="Servo 2"
    P2 = AnalogPin.P2
}

//% color=#000000 icon="\uf013" block="m-Bit základní" weight=101
namespace mbitbasic {

    let handlers: { [key: string]: () => void } = {}

//% group="ovladač"
//% block="nastav roli na ovladač a kanál rádia na %channel"
//% channel.min=0 channel.max=255
//% weight=100
export function setupController(channel: number): void {
    radio.setGroup(channel)
    radio.setTransmitPower(7)

    let prevA = false
    let prevB = false
    let prevAB = false
    let prevLogo = false

    basic.forever(function () {
        const a = input.buttonIsPressed(Button.A)
        const b = input.buttonIsPressed(Button.B)
        const ab = input.buttonIsPressed(Button.AB)
        const logo = input.logoIsPressed()

        if (a !== prevA) {
            radio.sendValue("btn-A", a ? 1 : 0)
            prevA = a
        }
        if (b !== prevB) {
            radio.sendValue("btn-B", b ? 1 : 0)
            prevB = b
        }
        if (ab !== prevAB) {
            radio.sendValue("btn-AB", ab ? 1 : 0)
            prevAB = ab
        }
        if (logo !== prevLogo) {
            radio.sendValue("btn-LOGO", logo ? 1 : 0)
            prevLogo = logo
        }

        basic.pause(20)
    })
}



    //% group="mozek"
    //% block="nastav roli na mozek a kanál rádia na %channel"
    //% channel.min=0 channel.max=255
    //% weight=100
    export function setupBrain(channel: number): void {
        radio.setGroup(channel)
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

let servoSpeedMap: { [pin: number]: number } = {}
let servoAngleMap: { [pin: number]: number } = {}

//% group="mozek"
//% block="nastav 360° %servo na rychlost %speed"
//% speed.min=-100 speed.max=100
//% weight=90
export function setContinuousServo(servo: MBServoPin, speed: number): void {
    const minPulse = 1000
    const maxPulse = 2000
    const centerPulse = 1500
    const pulse = centerPulse + (speed / 100) * (maxPulse - centerPulse)
    pins.servoSetPulse(servo, pulse)
    servoSpeedMap[servo] = speed
}

//% group="mozek"
//% block="nastav 180° %servo na úhel %angle°"
//% angle.min=0 angle.max=180
//% weight=85
export function setStandardServo(servo: MBServoPin, angle: number): void {
    pins.servoWritePin(servo, angle)
    servoAngleMap[servo] = angle
}

//% group="mozek"
//% block="změň rychlost 360° %servo o %delta"
//% delta.min=-100 delta.max=100
//% weight=84
export function changeContinuousServoSpeed(servo: MBServoPin, delta: number): void {
    let current = servoSpeedMap[servo] || 0
    let next = Math.max(-100, Math.min(100, current + delta))
    setContinuousServo(servo, next)
}

//% group="mozek"
//% block="změň úhel 180° %servo o %delta°"
//% delta.min=-180 delta.max=180
//% weight=83
export function changeStandardServoAngle(servo: MBServoPin, delta: number): void {
    let current = servoAngleMap[servo] || 90
    let next = Math.max(0, Math.min(180, current + delta))
    setStandardServo(servo, next)
}


let buttonStates: { [key: string]: boolean } = {
    "btn-A": false,
    "btn-B": false,
    "btn-AB": false,
    "btn-LOGO": false
}

radio.onReceivedValue(function (name: string, value: number) {
    if (buttonStates.hasOwnProperty(name)) {
        buttonStates[name] = value === 1
    }
})

/**
 * Při držení tlačítka opakuj kód dokud je tlačítko stisknuté.
 */
//% group="mozek"
//% block="při držení %btn na ovladači"
//% draggableParameters
//% weight=94
export function whileRemoteButtonHeld(btn: MBRemoteButton, handler: () => void): void {
    let key = buttonName(btn)
    control.inBackground(function () {
        let wasPressed = false
        while (true) {
            if (buttonStates[key]) {
                if (!wasPressed) {
                    wasPressed = true
                }
                handler()
            } else if (wasPressed) {
                // Tlačítko bylo puštěno, obnova výchozího stavu?
                wasPressed = false
            }
            basic.pause(20)
        }
    })
}

/**
 * Vrací true, pokud je dané tlačítko na ovladači aktuálně stisknuté.
 */
//% group="mozek"
//% block="na ovladači je %btn zmáčknuto"
//% weight=93
export function isRemoteButtonPressed(btn: MBRemoteButton): boolean {
    return buttonStates[buttonName(btn)]
}

// Pomocná funkce pro převod enum na string
function buttonName(btn: MBRemoteButton): string {
    switch (btn) {
        case MBRemoteButton.A: return "btn-A"
        case MBRemoteButton.B: return "btn-B"
        case MBRemoteButton.AB: return "btn-AB"
        case MBRemoteButton.Logo: return "btn-LOGO"
    }
    return ""
}
    
}
