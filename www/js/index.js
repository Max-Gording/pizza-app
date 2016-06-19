/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    state: "startAppNoRotate",

    initialize: function() {
        this.bindEvents();
        //    alert("goingState =" +  app.goingState);
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', app.onDeviceReady, false);
        //    alert ("Первый Eventlistener");
        document.addEventListener('online', app.onOnline, false);
        document.addEventListener('offline', app.onOffline, false);
        //    alert("Еще два листенера");

    },
    // deviceready Event Handler

    onDeviceReady: function() {
        window.open = window.cordova.InAppBrowser.open;
        /*    function onOffline(){
         app.goingState = "no-internet";
         //   app.stopRotation();
         alert("Keine Internet Verbindung!");
         }

         function onOnline(){
         app.goingState = "connected";
         //   app.stopRotation();
         alert("Verbinden!");
         }
         */
        //   alert(app.goingState);
        if (app.onOnline() == true) {
            //     alert(app.goingState);
            var ref = window.open('http://v2.pizza-web.de/', '_system', 'location=no,hidden=yes,closebuttoncaption=Done,toolbar=no');
            app.goingState = "loading";
            var loadStopCallback = function (event) {
                //     alert('stop: ' + event.url);
                // setTimeout(function(){ app.stopRotation()},40);
                app.stopRotation();
                ref.show();
                app.goingState = "show-shop";
            }
            ref.addEventListener('loadstop', loadStopCallback);
        }

    },


    stopRotation: function(){
        //    alert("Попали в stopRotation");
        //    app.goingState = "stopped";
        var circularProgressContainer = document.querySelector('#circular-progress');
        circularProgressContainer.classList.remove("visible");
        circularProgressContainer.classList.add("not-visible");
    },

    startRotation: function(){
        var circularProgressContainer = document.querySelector('#circular-progress');
        circularProgressContainer.classList.remove("not-visible");
        circularProgressContainer.classList.add("visible");
    },

    onOffline: function(){
        app.goingState = "no-internet";
        app.stopRotation();
        alert("Leider gibt es keine Internetverbindung.  Die Bestellung konnte nicht aufgegeben werden. Schließen Sie bitee die App um später zu probieren.");
        var noInternetMsgContainer = document.querySelector('#no-internet-msg-container');
        noInternetMsgContainer.classList.remove("not-visible");
        noInternetMsgContainer.classList.add("visible");
    },

    onOnline: function(){
        app.goingState = "connected";
        //  app.startRotation();
        //    alert("Verbinden!");
        var noInternetMsgContainer = document.querySelector('#no-internet-msg-container');
        noInternetMsgContainer.classList.remove("visible");
        noInternetMsgContainer.classList.add("not-visible");
        return true;
    },


    get goingState() {
        return this.state;
    },

    set goingState(value){
        this.state = value;
        //   alert("Только что присвоили state = " + this.state)
    },


};
