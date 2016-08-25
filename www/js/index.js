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
        this.bindEvents();
        app.goingState = "start-app";
        alert("From initialize " + app.goingState);
        app.passFileReadErrorState = "";
        app.passFileWriteErrorState = "";

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




    /*---------------app object property, Main Allication  Handler-------------------------------------------------------------------------------*/

    mainAppHandler: function(calledFrom){
        switch(calledFrom){
            case "onDeviceReady":
            {
                alert("Enter mainAppHandler");
                alert(app.myNetworkState);
                if (app.goingState == "start-app" && app.myNetworkState == "connected") {
                    alert(app.goingState);
                    var passData;
                    app.readFromPassFile('pass_file.json', function (passFileData) {
                        alert("readErrorState = " + app.passFileReadErrorState);
                        if (!(passFileData == undefined) || (app.passFileReadErrorState == "error")) {
                            passData = passFileData;
                            app.goingState = "calling-hash";
                            //Here call hash-function
                        }
                    });
                }
            }
                break;

            case "errorReadPassFileHandler":
            {
                if (app.passFileErrorTyp == 1) {
                    app.enterProc();
                }
            }

        }

    },


    /*---------------app object property -------------------------------------------------------------------------------*/
    // deviceready Event Handler

    onDeviceReady: function() {
        window.open = cordova.InAppBrowser.open;
        alert("From onDeviceReady " + app.goingState);
        app.mainAppHandler("onDeviceReady");


        /*    if (app.onOnline() == true) {
         //     alert(app.goingState);
         var passData;
         app.readFromPassFile('pass_file.json', function(passFileData){
         passData = passFileData;
         });
         alert("Returne from readFromPassFile before if");
         if(app.goingState == "end-parsing-passFile" && app.goingState != "error-reading-passFile"){
         alert("Returne from readFromPassFile");
         alert("app.passFileErrorTyp = "+app.passFileErrorTyp);
         app.myChildWindowOpen();
         }
         */
        //setTimeout(function(){if  (app.passFileErrorTyp == 1){alert("No PassFile");}}, 2000);

        /* Moved to separate app property-------------------------------------------------

         var ref = window.open('http://v2.pizza-web.de/', '_blank', 'location=no,hidden=yes,closebuttoncaption=Done,toolbar=no');
         //   var ref = window.open('http://google.com/', '_blank', 'location=yes,hidden=yes,closebuttoncaption=Done,toolbar=no,hardwareback=no');
         app.goingState = "loading";
         app.myChildWindow = ref;
         alert("This is app.myChildWindow "+app.myChildWindow);
         var loadStopCallback = function (event) {
         //     alert('stop: ' + event.url);
         //  setTimeout(function(){ app.stopRotation()},40);
         app.stopRotation();
         ref.show();
         //    setTimeout(function(){ ref.close()},15000);
         app.goingState = "show-shop";
         }
         ref.addEventListener('loadstop', loadStopCallback);
         ref.addEventListener('exit', function(){ ref = null;});

         */


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
        setTimeout(closeOnOffline, 1000);
        function closeOnOffline() {
            var netState = navigator.connection.type;
            alert("NetworkState = "+netState);
            if (netState == Connection.NONE){
                app.myNetworkState = "no-internet";
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
        app.myNetworkState = "connected";
        //  app.startRotation();
        //    alert("Verbinden!");
        var noInternetMsgContainer = document.querySelector('#no-internet-msg-container');
        noInternetMsgContainer.classList.remove("visible");
        noInternetMsgContainer.classList.add("not-visible");
        app.mainAppHandler("onOnline");
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

    myChildWindowOpen: function(){

        var ref = window.open('http://v2.pizza-web.de/', '_blank', 'location=no,hidden=yes,closebuttoncaption=Done,toolbar=no');
        //   var ref = window.open('http://google.com/', '_blank', 'location=yes,hidden=yes,closebuttoncaption=Done,toolbar=no,hardwareback=no');
        app.myCildWindowState = "loading";
        app.myChildWindow = ref;
        alert("This is app.myChildWindow "+app.myChildWindow);
        var loadStopCallback = function (event) {
            //     alert('stop: ' + event.url);
            //  setTimeout(function(){ app.stopRotation()},40);
            app.stopRotation();
            ref.show();
            //    setTimeout(function(){ ref.close()},15000);
            app.myCildWindowState = "show-shop";
        }
        ref.addEventListener('loadstop', loadStopCallback);
        ref.addEventListener('exit', function(){ ref = null;});

    },


    /*---------------app object property -------------------------------------------------------------------------------*/

    myChildWindowClose: function(){
        alert("Enter myChildWindowClose");
        if(!((app.myChildWindow == undefined) || (app.myChildWindow == null))){
            alert("In loop");
            alert("This is app.myChildWindow "+app.myChildWindow);
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
                    app.goingState = "end-parsing-passFile";
                };

                reader.readAsText(file);
            }, app.errorReadPassFileHandler.bind(null, fileName));
        }, app.errorReadPassFileHandler.bind(null, fileName));
    },



    /*---------------app object property -------------------------------------------------------------------------------*/

    errorReadPassFileHandler: function(fileName, e){
        alert("Enter error reading PassFileHandler");
        app.passFileErrorTyp = e.code;
        app.passFileReadErrorState = "error";
        alert(e.code);
        app.mainAppHandler("errorReadPassFileHandler");
    },

    enterProc: function(){
        app.stopRotation();
        var passInputContainer = document.querySelector('#login-register-container');
        passInputContainer.classList.remove("not-visible");
        passInputContainer.classList.add("visible");
    },

    /*---------------app object property -------------------------------------------------------------------------------*/

    get goingState() {
        return this.goState;
    },

    set goingState(value){
        this.goState = value;
        //   alert("Только что присвоили state = " + this.state)
    },

    /*---------------app object property -------------------------------------------------------------------------------*/

    get myNetworkState() {
        return this.networkState;
    },

    set myNetworkState(value){
        this.networkState = value;
    },

    /*---------------app object property -------------------------------------------------------------------------------*/

    get passFileReadErrorState() {
        return this.passFileReadError;
    },

    set passFileReadErrorState(value){
        this.passFileReadError = value;
    },

    /*---------------app object property -------------------------------------------------------------------------------*/

    get passFileWriteErrorState() {
        return this.passFileWriteError;
    },

    set passFileWriteErrorState(value){
        this.passFileWriteError = value;
    },

    /*---------------app object property -------------------------------------------------------------------------------*/

    get myChildWindowState() {
        return this.childWindowState;
    },

    set myCildWindowState(value){
        this.childWindowState = value;
    },

    /*---------------app object property -------------------------------------------------------------------------------*/

    get myChildWindow(){
        return this.childWindow;
    },

    /*---------------app object property -------------------------------------------------------------------------------*/

    set myChildWindow(value){
        this.childWindow = value;
    },

    /*---------------app object property ?????-------------------------------------------------------------------------------*/

    get passFileErrorTyp(){
        return this.passwordFileErrorTyp;
    },

    /*---------------app object property ??????-------------------------------------------------------------------------------*/

    set passFileErrorTyp(value){
        this.passwordFileErrorTyp = value;
    },





    /*---------------app object end -------------------------------------------------------------------------------*/
};
