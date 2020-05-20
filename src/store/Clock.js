export default class Clock {
    constructor(){
          this.callback = (time) => { alert("no callback set")};
    }

    startTimer = () => {
        this.timerHandled(this.callback)
        this.timeout = setTimeout(this.startTimer, 1000);
    }

    stopTimer = () => {
        clearTimeout(this.timeout);
    }

    static time(){
        var today = new Date();
        var h = today.getHours();
        var m = today.getMinutes();
        var s = today.getSeconds();

        m = _checkTime(m);
        s = _checkTime(s);
        return [h,m,s];
    }

    get time(){
        return Clock.timeString();
    }

    static timeString() {
        var [h,m,s] = Clock.time();
        return `${h}:${m}:${s}`;
    }

    get date(){
        return Clock.date();
    }

    static date(){
        return new Date();
    }

    get dateString(){
        return Clock.dateString();
    }

    static dateString(){
        var date = new Date();
        var [d,m,y] = [date.getDate(),date.getMonth(),date.getFullYear()];
        return `${months[m]} ${d} ${y}`;
    }

    static timerUnhandled = (callback) => {
        var today = new Date();
        var [h, m, s] = [today.getHours(),today.getMinutes(),today.getSeconds()]; 
        m = _checkTime(m);
        s = _checkTime(s);

        callback(`${h}:${m}:${s}`);
        setTimeout(this.timerUnhandled, 1000, callback);  
    }

    static isoTimestamp = () => {
        var date = new Date(); 
        return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, -1);
    }

    timerHandled = (callback) => {
        var today = new Date();
        var [h, m, s] = [today.getHours(),today.getMinutes(),today.getSeconds()]; 
        m = _checkTime(m);
        s = _checkTime(s);

        callback(`${h}:${m}:${s}`);
    }

}

const months = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const _checkTime = (i) => {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}
