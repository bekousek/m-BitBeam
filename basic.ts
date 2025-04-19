enum MBRole {
    //% block="ovladač"
    Controller,
    //% block="mozek"
    Brain
}
//% weight=101 color=#000000 icon="\uf013" block="m-Bit základní"
namespace mbitbasic {

    let currentRole: MBRole = MBRole.Controller

    //% block="nastav roli na %role"
    //% weight=100
    export function setRole(role: MBRole): void {
        currentRole = role
        radio.setGroup(42)
        if (role == MBRole.Controller) {
            radio.setTransmitPower(7)
        } else {
            radio.onReceivedString(function (msg: string) {
                // Zde později napojíme reakce na zprávy
            })
        }
    }

    //% block="pošli testovací zprávu"
    //% weight=90
    export function sendTestMessage(): void {
        if (currentRole == MBRole.Controller) {
            radio.sendString("test")
        }
    }
}
