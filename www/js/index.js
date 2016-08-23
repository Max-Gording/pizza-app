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

    /*---------------app object property -------------------------------------------------------------------------------*/
    // Application Constructor
    initialize: function() {
        app.goingState = "startApp";
        this.bindEvents();
    },

    /*---------------app object property -------------------------------------------------------------------------------*/
    // Bind Event Listeners
     // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.

    bindEvents: function() {
        document.addEventListener('deviceready', app.onDeviceReady, false);
        //    alert ("First Eventlistener");
        document.addEventListener('online', app.onOnline, false);
        document.addEventListener('offline', function(){
                                               //  alert("Timeout");
                                               //  setTimeout(function(){app.onOffline(), 40000});
                                                  app.onOffline();
                                              }, false
                                 );
        //    alert("Next two listeners");

    },

    /*---------------app object property -------------------------------------------------------------------------------*/
    // deviceready Event Handler

    onDeviceReady: function() {
        window.open = cordova.InAppBrowser.open;

        if (app.onOnline() == true) {
            //     alert(app.goingState);
            var passData;
            app.readFromPassFile('pass_file.json', function(passFileData){
                passData = passFileData;
            });
            alert("Returne from readFromPassFile");
            if (app.passFileErrorTyp === 1){
                alert("No PassFile");
            }
            var ref = window.open('http://v2.pizza-web.de/', '_blank', 'location=no,hidden=yes,closebuttoncaption=Done,toolbar=no');
         //   var ref = window.open('http://google.com/', '_blank', 'location=yes,hidden=yes,closebuttoncaption=Done,toolbar=no,hardwareback=no');
            app.goingState = "loading";
            app.myChildWindow = ref;
            var loadStopCallback = function (event) {
                //     alert('stop: ' + event.url);
                // setTimeout(function(){ app.stopRotation()},40);
                app.stopRotation();
                ref.show();
            //    setTimeout(function(){ ref.close()},15000);
                app.goingState = "show-shop";
            }
            ref.addEventListener('loadstop', loadStopCallback);
            ref.addEventListener('exit', function(){ ref = null;});
        }

    },

    /*---------------app object property -------------------------------------------------------------------------------*/

    stopRotation: function(){
        //    alert("Попали в stopRotation");
        //    app.goingState = "stopped";
        var circularProgressContainer = document.querySelector('#circular-progress');
        circularProgressContainer.classList.remove("visible");
        circularProgressContainer.classList.add("not-visible");
    },

    /*---------------app object property -------------------------------------------------------------------------------*/

    startRotation: function(){
        var circularProgressContainer = document.querySelector('#circular-progress');
        circularProgressContainer.classList.remove("not-visible");
        circularProgressContainer.classList.add("visible");
    },

    /*---------------app object property -------------------------------------------------------------------------------*/

    onOffline: function(){
        setTimeout(closeOnOffline, 15000);
        function closeOnOffline() {
            var networkState = navigator.connection.type;
            alert("NetworkState = "+networkState);
            if (networkState == Connection.NONE){
                app.goingState = "no-internet";
                app.stopRotation();
                alert("No connection!"); //Debug
                app.myChildWindowClose();
                alert("Leider gibt es keine Internetverbindung.  Die Bestellung konnte nicht aufgegeben werden. Schließen Sie bitee die App um später zu probieren.");
                var noInternetMsgContainer = document.querySelector('#no-internet-msg-container');
                noInternetMsgContainer.classList.remove("not-visible");
                noInternetMsgContainer.classList.add("visible");
            };
        }
    },

    /*---------------app object property -------------------------------------------------------------------------------*/

    onOnline: function(){
        app.goingState = "connected";
        //  app.startRotation();
        //    alert("Verbinden!");
        var noInternetMsgContainer = document.querySelector('#no-internet-msg-container');
        noInternetMsgContainer.classList.remove("visible");
        noInternetMsgContainer.classList.add("not-visible");
        return true;
    },

    /*---------------app object property -------------------------------------------------------------------------------*/

    checkLocalStorageSupport:  function(){
        var testKey = 'test', storage = window.localStorage;
        try {
            storage.setItem(testKey, '1');
            storage.removeItem(testKey);
            return true;
        } catch (error) {
            return false;
        }
    },

    /*---------------app object property -------------------------------------------------------------------------------*/
    // Only for test

    localStoreDataTestCreate:  function(lolo, papa){
        if (app.checkLocalStorageSupport()){
            var myLocalStore = window.localStorage;
            var myLolo = lolo;
            var myPapa = papa;
            myLocalStore.setItem(myLolo, myPapa);
        }
        else{
            alert("Leider wird Ihr Browser Local Storage nicht unterstützt, und Sie können unser App nicht benutzen!");
        }
    },

    /*---------------app object property -------------------------------------------------------------------------------*/

    myChildWindowClose: function(){
        if(!((app.myChildWindow == undefined) || (app.myChildWindow == null))){
            app.myChildWindow.close();
            return;
        }
        else{return}
    },

    /*---------------app object property -------------------------------------------------------------------------------*/

    readFromPassFile: function(fileName, cb) {
        alert("Enter readFromPassFile");
        var pathToFile = cordova.file.dataDirectory + fileName;
        alert(pathToFile);
        window.resolveLocalFileSystemURL(pathToFile, function (fileEntry) {
            fileEntry.file(function (file) {
                var reader = new FileReader();

                reader.onloadend = function (e) {
                    cb(JSON.parse(this.result));
                };

                reader.readAsText(file);
            }, app.errorPassFileHandler.bind(null, fileName));
        }, app.errorPassFileHandler.bind(null, fileName));
    },

    /*---------------app object property -------------------------------------------------------------------------------*/

    errorPassFileHandler: function(fileName, e){
        alert("Enter errorPassFileHandler");
        app.passFileErrorTyp = e.code;
        alert(e.code);
    },

    /*---------------app object property -------------------------------------------------------------------------------*/

    get goingState() {
        return this.state;
    },

    set goingState(value){
        this.state = value;
        //   alert("Только что присвоили state = " + this.state)
    },

    /*---------------app object property -------------------------------------------------------------------------------*/

    get myChildWindow(){
        return this.childWindow;
    },

    /*---------------app object property -------------------------------------------------------------------------------*/

    set myChildWindow(value){
        this.childWindow = value;
    },

    /*---------------app object property -------------------------------------------------------------------------------*/

    get passFileErrorTyp(){
        return this.childWindow;
    },

    /*---------------app object property -------------------------------------------------------------------------------*/

    set passFileErrorTyp(value){
        this.childWindow = value;
    },





/*---------------app object  -------------------------------------------------------------------------------*/
};
