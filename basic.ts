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

    input.onButtonPressed(Button.A, function () {
        radio.sendValue("btn-A", 1)
    })
    input.onButtonReleased(Button.A, function () {
        radio.sendValue("btn-A", 0)
    })

    input.onButtonPressed(Button.B, function () {
        radio.sendValue("btn-B", 1)
    })
    input.onButtonReleased(Button.B, function () {
        radio.sendValue("btn-B", 0)
    })

    input.onButtonPressed(Button.AB, function () {
        radio.sendValue("btn-AB", 1)
    })
    input.onButtonReleased(Button.AB, function () {
        radio.sendValue("btn-AB", 0)
    })

    input.onLogoEvent(TouchButtonEvent.Pressed, function () {
        radio.sendValue("btn-LOGO", 1)
    })
    input.onLogoEvent(TouchButtonEvent.Released, function () {
        radio.sendValue("btn-LOGO", 0)
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
    }

    //% group="mozek"
    //% block="nastav 180° %servo na úhel %angle°"
    //% angle.min=0 angle.max=180
    //% weight=85
    export function setStandardServo(servo: MBServoPin, angle: number): void {
        pins.servoWritePin(servo, angle)
    }


let buttonStates: { [key: string]: boolean } = {
    "btn-A": false,
    "btn-B": false,
    "btn-AB": false,
    "btn-LOGO": false
}

radio.onReceivedValue(function (name: string, value: number) {
    if (name in buttonStates) {
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
