//Global Variables For Content Script
const $ = jQuery = require('jquery');
const config = require('./config.json');
var gmDebug = false;
var GeniusMailPersonalization = [];
var GMLaunchedCompose = false;
var SheetLaunched = false;
var payloads = {};
// Variables for different stages of Auto Follow up
var FirstStage = {};
var SecondStage = {};
var ThirdStage = {};
var FourthStage = {};
var FifthStage = {};
var SixthStage = {};
var SeventhStage = {};
var EighthStage = {};
var AF = [];
var AFCampaign = [];
//***** End *****/
var extId = "5e8f1b0f568e944b9d224187";
var popup = false;

window.onload = function () {
    console.log("Its loding here");
    //Google Auth submission button
    $("#submit_approve_access").on("click", function () {
        setTimeout(curentTabClose, 6000);
    });

    //GoogleAuth window closing
    function curentTabClose() {
        setTimeout(curentTabClose, 6000);
        window.close();
        if (popup == false) {
            GeniusMail()
        }
    }

    InboxSDK.load(2, 'sdk_30275566_68262f84cc').then(function (sdk) {
        try {
            var email_address = sdk.User.getEmailAddress();
            console.log("Here is Gmail User Email Address", email_address)
            UserStatus(email_address);
            //Message received from Background page
            chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
                if (msg.action == 'SendIt') {
                    UserStatus(email_address);
                }
            });

            //Function for Launching the  Genius Mail Extension
            function GeniusMail() {
                console.log("genius mail function launched");
                popup = true;
                //Resetting GeniusMailPersonalization value
                $(".T-I").on("click", function () {
                    if (!SheetLaunched) {
                        console.log("SheetLaunched false");
                        if (GeniusMailPersonalization.length > 0) {
                            GeniusMailPersonalization.splice(0, GeniusMailPersonalization.length);
                            console.log(GeniusMailPersonalization);
                        }
                    }
                    AFCampaign = [];
                    AFCampainDetails()
                });
                var ComposeTagger = "x";
                var QuerySelector = "";
                var SearchInput;

                //determine old gmail vs new gmail vs inbox
                if (document.location.href.indexOf("mail.google.com") >= 0) {
                    if (sdk.User.isUsingGmailMaterialUI()) {
                        App = "newGmail";
                    } else {
                        App = "oldGmail";
                    }
                } else {
                    App = "Inbox"
                }
                //*********************
                //begin interval
                var SearchInputCounter = 0;
                var SearchInputExists = setInterval(function () {
                    if (SearchInputCounter >= 100) {
                        clearInterval(SearchInputExists);
                    }
                    if (document.querySelector("input[spellcheck='false'][name='q']") != null) {
                        clearInterval(SearchInputExists);
                        SearchInput = document.querySelector("input[spellcheck='false'][name='q']");
                    }
                    SearchInputCounter++;
                }, 500);
                //********
                var TopAreaCounter = 0;
                var TopAreaExists = setInterval(function () {
                    if (document.querySelector("[role='search']") != null) {
                        clearInterval(TopAreaExists);

                        var searchForm = document.querySelector("[role='search']");
                        var SearchWidth = searchForm.parentElement;
                        var varTestElement = SearchWidth.parentElement;
                        var varElements = SearchWidth.parentElement;
                        var varElements2 = SearchWidth.parentElement;
                        var varElements3 = SearchWidth.parentElement;

                        //have to have this here because the input box doesn't appear until after this other stuff also exists
                        // Creating the div for Connect to Spreadsheet Button
                        if (App == "newGmail") {
                            var divButtons = document.createElement("div");
                            divButtons.style.width = "100%";
                            divButtons.style.display = "flex";
                        }
                        //gmImport is the spreadsheets button
                        var gmImport = document.createElement("div");
                        gmImport.setAttribute("id", "gmimport");
                        gmImport.innerHTML = "Connect Email List";
                        if (App == "newGmail") {
                            gmImport.style.width = "20px";
                        }
                        gmImport.style.display = 'block';
                        gmImport.style.marginLeft = '2px';
                        gmImport.style.color = "white";
                        gmImport.style.padding = "9px 5px 0px 12px";
                        gmImport.style.fontWeight = "bold";
                        gmImport.style.fontSize = "11px";
                        gmImport.style.backgroundPosition = "center center";
                        gmImport.style.backgroundRepeat = "no-repeat";
                        gmImport.style.backgroundColor = "#c42329";
                        gmImport.style.backgroundImage = "url('https://www.gmass.co/images/GMassSheetsIcon-tiny.png')";
                        gmImport.style.cursor = "pointer";
                        gmImport.title = "Connect to an email list in a Google Docs spreadsheet.";

                        gmImport.addEventListener("click", function () {
                            LaunchImport();
                        });
                        // Creating the div for Launching Manual Followup Button
                        if (App == "newGmail") {

                            //appending to our own element, so this will always work
                            divButtons.appendChild(gmImport);
                        } else {
                            //old gmail
                            if (varElements2 != null) {
                                varElements2.appendChild(gmImport);
                            }
                        }
                        //campaign followup button
                        var gmCampaigns = document.createElement("div");
                        gmCampaigns.setAttribute("id", "gmcampaigns");
                        gmCampaigns.innerHTML = "Follow-up Campaign";
                        if (App == "newGmail") {
                            gmCampaigns.style.width = "20px";
                        }
                        gmCampaigns.style.display = 'block';
                        gmCampaigns.style.marginLeft = '2px';
                        gmCampaigns.style.color = "white";
                        gmCampaigns.style.padding = "9px 5px 0px 12px";
                        gmCampaigns.style.fontWeight = "bold";
                        gmCampaigns.style.fontSize = "11px";
                        gmCampaigns.style.backgroundPosition = "center center";
                        gmCampaigns.style.backgroundRepeat = "no-repeat";
                        gmCampaigns.style.backgroundColor = "#c42329";
                        gmCampaigns.style.backgroundImage = "url('https://www.gmass.co/images/GMassFollowupIcon.png')";
                        gmCampaigns.style.cursor = "pointer";
                        gmCampaigns.title = "Send a follow-up campaign based on opens and clicks.";

                        gmCampaigns.addEventListener("click", function () {
                            LaunchFollowup();
                        });
                        if (App == "newGmail") {
                            //appending to our own element, so this will always work
                            divButtons.appendChild(gmCampaigns);
                        } else {
                            if (varElements3 != null) {
                                varElements3.appendChild(gmCampaigns);
                            }
                        }
                        if (App == "newGmail") {
                            if (varElements != null) {
                                varElements.insertBefore(divButtons, varElements.lastChild);
                                if (SearchWidth != null) {
                                    SearchWidth.style.paddingRight = "5px";
                                    SearchWidth.style.maxWidth = "722px";
                                }
                            } else {
                                //butterbar alert
                                window.onload = function (e) {
                                    sdk.ButterBar.showMessage({ html: "<span style='color: red'>WARNING:</span><span style='color: yellow'>" + Date() + ":</span> The gm buttons at the top didn't load. This includes the Build List button, the Google Sheet Connector button, and the Manual Followup button. This happens when Google changes Gmail's code, and gm hasn't adapted yet. Usually our engineers react right away, and this should be fixed shortly. Feel free to also <a style='color: #99FFFF' target='_blog' href='https://www.gmass.co/g/support'>submit a support request</a> to make sure we're aware.", time: 20000 });
                                }
                            }
                        }
                    } else {
                        console.log("waiting for top area: " + TopAreaCounter);
                    }
                    TopAreaCounter++;
                    //end interval
                }, 500);
                //********************		
                // Register view handler comes into existance which handles all the operations of Composeview Window
                sdk.Compose.registerComposeViewHandler(function (composeView) {
                    var settingsID = makeid();
                    var MainButtonPressed = false;
                    var LoadedCampaigns = false;
                    if (!(App == "Inbox" && composeView.isInlineReplyForm())) {
                        var FromHandlerCount = 0;
                        var ComposeLaunchTime = new Date().getTime();
                        composeView.on('fromContactChanged', function (event) {
                            var today = new Date();

                            //when compose is first launched, this event fires, i guess when from address is initially set
                            //adding timer element just IN CASE someday it doesn't fire when compose first launches
                            //after 5 seconds, should be safe that if from is changed, then we want to trigger this routine
                            if (FromHandlerCount >= 1 || (today - ComposeLaunchTime) > 5000) {
                                var CurrentSubject = composeView.getSubject();
                                composeView.setSubject(CurrentSubject + " ");
                            }
                            FromHandlerCount++;
                        });
                        if (gmDebug) {
                            composeView.on('toContactAdded', function (event) {
                                console.log("to addresse added");
                            });
                        }
                        composeView.on('destroy', function (event) {
                            if (document.getElementById(settingsID) != null) {
                                document.getElementById(settingsID).remove();
                            }
                        });
                        composeView.on('presending', function (event) {
                            if (composeView.getToRecipients().length > 0 || composeView.getToRecipients().length >= 10 || (composeView.getToRecipients()[0].emailAddress.includes("recipients"))) {
                                if (confirm("Did you really mean to press the blue Gmail Send button instead of the red Genius Mail button?\nPress CANCEL to stop this send.\nPress OK if you really did mean to press the blue Gmail Send button.")) {
                                } else {
                                    event.cancel();
                                }
                            }
                        });
                        var bbm;
                        var bb;
                        var myOpenTracking = "off";
                        var myClickTracking = "off";
                        var gmFirstBumpDays;
                        var gmFirstBumpAddedText;
                        var gmSecondBumpDays;
                        var gmSecondBumpAddedText;
                        var gmThirdBumpDays;
                        var gmThirdBumpAddedText;
                        var gmFourthBumpDays;
                        var gmFourthBumpAddedText;
                        var gmFifthBumpDays;
                        var gmFifthBumpAddedText;
                        var gmSixthBumpDays;
                        var gmSixthBumpAddedText;
                        var gmSeventhBumpDays;
                        var gmSeventhBumpAddedText;
                        var gmEighthBumpDays;
                        var gmEighthBumpAddedText;

                        //**********Getting Auto Followup data from Local Storage and Setting their values according to that*****************

                        if (localStorage.getItem("gmFirstBumpDays") != null) { gmFirstBumpDays = localStorage.getItem("gmFirstBumpDays"); } else { gmFirstBumpDays = "2"; }
                        if (localStorage.getItem("gmFirstBumpAddedText") != null) { gmFirstBumpAddedText = localStorage.getItem("gmFirstBumpAddedText"); } else { gmFirstBumpAddedText = "Just making sure you saw this."; }
                        var gmFirstBumpAction = "r";
                        var gmFirstBumpCustom = "0";
                        var gmFirstBumpChoice = "t";
                        var gmFirstBump = "show";

                        if (localStorage.getItem("gmSecondBumpDays") != null) { gmSecondBumpDays = localStorage.getItem("gmSecondBumpDays"); } else { gmSecondBumpDays = "5"; }
                        if (localStorage.getItem("gmSecondBumpAddedText") != null) { gmSecondBumpAddedText = localStorage.getItem("gmSecondBumpAddedText"); } else { gmSecondBumpAddedText = "I've reached out a couple times, but I haven't heard back. I'd appreciate a response to my email below."; }
                        var gmSecondBumpAction = "r";
                        var gmSecondBumpCustom = "0";
                        var gmSecondBumpChoice = "t";
                        var gmSecondBump = "hide";

                        if (localStorage.getItem("gmThirdBumpDays") != null) { gmThirdBumpDays = localStorage.getItem("gmThirdBumpDays"); } else { gmThirdBumpDays = "8"; }
                        if (localStorage.getItem("gmThirdBumpAddedText") != null) { gmThirdBumpAddedText = localStorage.getItem("gmThirdBumpAddedText"); } else { gmThirdBumpAddedText = "I'm sure you're busy, but if you could respond to my email below, I can cross this off my list."; }
                        var gmThirdBumpAction = "r";
                        var gmThirdBumpCustom = "0";
                        var gmThirdBumpChoice = "t";
                        var gmThirdBump = "hide";

                        if (localStorage.getItem("gmFourthBumpDays") != null) { gmFourthBumpDays = localStorage.getItem("gmFourthBumpDays"); } else { gmFourthBumpDays = "11"; }
                        if (localStorage.getItem("gmFourthBumpAddedText") != null) { gmFourthBumpAddedText = localStorage.getItem("gmFourthBumpAddedText"); } else { gmFourthBumpAddedText = "Should I stop bothering you?"; }
                        var gmFourthBumpAction = "r";
                        var gmFourthBumpCustom = "0";
                        var gmFourthBumpChoice = "t";
                        var gmFourthBump = "hide";
                        if (localStorage.getItem("gmFifthBumpDays") != null) { gmFifthBumpDays = localStorage.getItem("gmFifthBumpDays"); } else { gmFifthBumpDays = "14"; }
                        if (localStorage.getItem("gmFifthBumpAddedText") != null) { gmFifthBumpAddedText = localStorage.getItem("gmFifthBumpAddedText"); } else { gmFifthBumpAddedText = "I have not heard from you. var me know please."; }
                        var gmFifthBumpAction = "r";
                        var gmFifthBumpCustom = "0";
                        var gmFifthBumpChoice = "t";
                        var gmFifthBump = "hide";

                        if (localStorage.getItem("gmSixthBumpDays") != null) { gmSixthBumpDays = localStorage.getItem("gmSixthBumpDays"); } else { gmSixthBumpDays = "17"; }
                        if (localStorage.getItem("gmSixthBumpAddedText") != null) { gmSixthBumpAddedText = localStorage.getItem("gmSixthBumpAddedText"); } else { gmSixthBumpAddedText = "Can I please get a response?"; }
                        var gmSixthBumpAction = "r";
                        var gmSixthBumpCustom = "0";
                        var gmSixthBumpChoice = "t";
                        var gmSixthBump = "hide";

                        if (localStorage.getItem("gmSeventhBumpDays") != null) { gmSeventhBumpDays = localStorage.getItem("gmSeventhBumpDays"); } else { gmSeventhBumpDays = "20"; }
                        if (localStorage.getItem("gmSeventhBumpAddedText") != null) { gmSeventhBumpAddedText = localStorage.getItem("gmSeventhBumpAddedText"); } else { gmSeventhBumpAddedText = "Hello?"; }
                        var gmSeventhBumpAction = "r";
                        var gmSeventhBumpCustom = "0";
                        var gmSeventhBumpChoice = "t";
                        var gmSeventhBump = "hide";

                        if (localStorage.getItem("gmEighthBumpDays") != null) { gmEighthBumpDays = localStorage.getItem("gmEighthBumpDays"); } else { gmEighthBumpDays = "23"; }
                        if (localStorage.getItem("gmEighthBumpAddedText") != null) { gmEighthBumpAddedText = localStorage.getItem("gmEighthBumpAddedText"); } else { gmEighthBumpAddedText = "I'm marking you down as being not interested."; }
                        var gmEighthBumpAction = "r";
                        var gmEighthBumpCustom = "0";
                        var gmEighthBumpChoice = "t";
                        var gmEighthBump = "hide";

                        var gmFirstBumpBox = "n";
                        var gmSecondBumpBox = "n";
                        var gmThirdBumpBox = "n";
                        var gmFourthBumpBox = "n";
                        var gmFifthBumpBox = "n";
                        var gmSixthBumpBox = "n";
                        var gmSeventhBumpBox = "n";
                        var gmEighthBumpBox = "n";
                        var resultCampaigns;
                        var GotState = false;
                        var NuclearBB;
                        var ComposeDraftID = "";

                        //Generating Draft ID
                        composeView.getCurrentDraftID().then(function (draftID) {

                            //OLD GMAIL AND OPENING NEW COMPOSE WINDOW FROM SCRATCH
                            if (ComposeTagger == "x" && (draftID == null || draftID == undefined)) {
                                console.log("block 1");

                                //only old gmail, blank compose or launched compose, but not an opened DRAFT. old gmail/opened draft, go to next block
                                //brand new compose, not gm launched
                                console.log("GM: getCurrentDraftID resolved to NULL, meaning blank compose. gotstate=true");
                                GotState = true;
                                composeView.getDraftID().then(function (draftID) {

                                    //this happens after user types stuff, or after gm sets to address
                                    ComposeDraftID = draftID;
                                    console.log("GM: Draft ID retrieved after user typed stuff =" + ComposeDraftID);
                                });
                            }
                            //EVERYTHING ELSE. OLD GMAIL AND gm-LAUNCHED-COMPOSE / OLD GMAIL AND OPENING UP A DRAFT / NEW GMAIL AND EVERY SITUATION
                            else {
                                console.log("block 2");
                                //WE WILL ALREADY HAVE THE DRAFT ID IN EVERY CASE EXCEPT FOR OLD GMAIL WHERE gm LAUNCHES THE COMPOSE, SO THAT'S WHY THIS IS HERE
                                if (draftID == null || draftID == undefined) {
                                    composeView.getDraftID().then(function (draftID) {
                                        ComposeDraftID = draftID;
                                        console.log("GM: Draft ID retrieved after promise met =" + ComposeDraftID);
                                    });
                                } else {
                                    ComposeDraftID = draftID;
                                    console.log("GM: Draft ID retrieved just cause it's new gmail/inbox" + ComposeDraftID);
                                }
                                var WaitForDraftIDCounter = 0;
                                var WaitForDraftID = setInterval(function () {
                                    console.log("running once");
                                    WaitForDraftIDCounter++;
                                    if (WaitForDraftIDCounter % 20 == 0) {
                                        console.log("going nuclear, putting text in Subject to trigger draft id");
                                        NuclearBB = sdk.ButterBar.showMessage({ text: "Wait a few more seconds please. The Genius Mail button won't work yet on this Compose window. Fixing it...", time: 10000 });
                                        if (composeView.getSubject().includes("Replace this Subject with your own!")) {
                                            composeView.setSubject(composeView.getSubject() + " :)");
                                        } else {
                                            composeView.setSubject("Replace this Subject with your own!");
                                        }
                                    }
                                    if (ComposeDraftID != "") {
                                        if (typeof NuclearBB != "undefined") {
                                            NuclearBB.destroy();
                                            sdk.ButterBar.showMessage({ text: "Fixed! You may proceed...", time: 10000 });
                                        }
                                        clearInterval(WaitForDraftID);
                                        GotState = true;
                                        console.log("GM: GotState=true because Draft ID state retrieved");
                                    }
                                }, 500);
                            }
                        });

                        //Hide Send Button
                        var boolForceShowSend = false;
                        var SendButtonAll = ((App.includes("Gmail")) ? document.querySelectorAll('[data-tooltip*="Enter"][data-tooltip-delay="800"][role="button"]') : document.querySelectorAll('div.sY.dy.Go.qj[aria-disabled="false"]'));
                        if (SendButtonAll.length == 1) {
                            var SendButton = ((App.includes("Gmail")) ? document.querySelector('[data-tooltip*="Enter"][data-tooltip-delay="800"][role="button"]') : document.querySelector('div.sY.dy.Go.qj'));
                            var SendSettings = SendButton.nextSibling;
                            if (SendButton != null) {
                                var SendDisplay = SendButton.style.display;
                                var SendButtonHide = setInterval(function () {
                                    if (((composeView.getToRecipients().length == 1 || composeView.getToRecipients().length > 20 || GMLaunchedCompose || ((composeView.getToRecipients().length > 0) && (composeView.getToRecipients()[0].emailAddress.indexOf("-big-") != -1))) && (!boolForceShowSend) && (composeView.getToRecipients()[composeView.getToRecipients().length - 1].emailAddress.toLowerCase() != "showsend@gmail.com"))) {
                                        if (SendButton.style.display == "") {
                                            sdk.ButterBar.showMessage({ text: "We've hidden the Send button to prevent you from making a dastardly mistake! Want it back? Add ShowSend@gmail.com to the To field.", time: 3000 });
                                        }
                                        // }
                                        SendButton.style.display = "none";
                                        SendSettings.style.display = "none";
                                    }
                                    if (composeView.getToRecipients().length > 0 && composeView.getToRecipients()[composeView.getToRecipients().length - 1].emailAddress.toLowerCase() == "showsend@gmail.com") {
                                        boolForceShowSend = true;
                                        clearInterval(SendButtonHide);
                                        SendButton.style.display = "";
                                        SendSettings.style.display = "";
                                        sdk.ButterBar.showMessage({ text: "Congratulations you got your Send Button back", time: 1000 });
                                    }
                                }, 3000);
                            }
                        } else {
                            SendButton.style.display = "";
                            SendSettings.style.display = "";
                        }

                        var SettingsFormed = false;
                        //var AccountStatusRetrieved = false;
                        var SettingsBox = document.createElement("div");
                        SettingsBox.style.backgroundColor = "white"
                        SettingsBox.id = settingsID;
                        document.body.appendChild(SettingsBox);
                        if (gmDebug) {
                            console.log("settings box created with id " + SettingsBox.id);
                        }
                        //SETTINGS DIV WON'T EVEN START TO BE CREATED UNTIL GOTSTATE==TRUE
                        var SettingsInterval = setInterval(function () {
                            if (GotState == true) {
                                console.log("Go to state true");
                                if (gmDebug) {
                                    console.log("about to clear interval and start forming settings box");
                                }
                                clearInterval(SettingsInterval);

                                //**********CREATE HTML FOR SETTINGS BOX DIV
                                //**********CREATE HTML FOR SETTINGS BOX DIV
                                //**********CREATE HTML FOR SETTINGS BOX DIV

                                var OptionsBox = '<div class="settingsPopupHeader"><p>Genius Mail Settings</p><div class="gmWhiteLogo"><img src="https://s3.amazonaws.com/tier5.us/gmext/canvas/GM_logo_white.png"></div></div><div class="g2_settings" id="' + settingsID + 'bigdiv" style="background: #FFFFFF; overflow-y: auto;max-height:500px;">'
                                console.log(GeniusMailPersonalization);
                                if (GeniusMailPersonalization.length > 0) {
                                    console.log("sheet found");
                                    OptionsBox = OptionsBox + '<div class="g_personalize"><div>Personalize:</div> \
                                    <select id="' + settingsID + 'Personalize"> \
                                    <option></option><option value="Hey" class="gmField">Opening</option>';
                                    var arrayFields = GeniusMailPersonalization;
                                    console.log(arrayFields);
                                    if (arrayFields[0].length > 0) {
                                        console.log("Sheet added");
                                        for (var i = 0; i < arrayFields[0].length; i++) {
                                            OptionsBox = OptionsBox + '<option value="{' + arrayFields[0][i] + '}" class="gmField">' + arrayFields[0][i] + '</option>';
                                        }
                                        console.log(OptionsBox);
                                    }
                                    OptionsBox = OptionsBox + '<option value="Thanks & Regards" class="gmField">Closing</option> \
                                    <option value="Hope To Hear From You Soon" class="gmField">PS</option></select></div>';
                                }
                                //non sheets
                                else {
                                    OptionsBox = OptionsBox + '<div class="g_personalize"><div>Personalize:</div>  \
                                    <select id="' + settingsID + 'Personalize">\
                                    <option></option><option value="Hey" class="gmField">Opening</option> \
                                    <option value="{Firstname}" class="gmField">First Name</option> \
                                    <option value="{Lastname}" class="gmField">Last Name</option> \
                                    <option value="{email}" class="gmField">Email Address</option> \
                                    <option value="Thanks & Regards" class="gmField">Closing</option> \
                                    <option value="Hope To Hear From You Soon" class="gmField">PS</option></select></div>';
                                }

                                //opens and clicks
                                OptionsBox += '<div class="g_track"><div>Track:</div><div><label class="g2_checkbox"><input type=checkbox name="OpenTracking" id="' + settingsID + 'OpenTracking" [OPENON]> <span>Opens</span></label> <label class="g2_checkbox"><input type=checkbox name="ClickTracking" id="' + settingsID + 'ClickTracking" [CLICKON]> <span>Clicks</span></label></div></div>'

                                //auto follow-up fields                     
                                OptionsBox = OptionsBox +
                                    '<div class="g2_auto_follow_up g_accordian"><div id="' + settingsID + 'oa"><div class="g_accordian_title"><span>Auto Follow-up</span> <span id="' + settingsID + 'mainauto"></span></div>';
                                OptionsBox += '<div class="g_accordian_content">';
                                //OptionsBox += '<div id="' + settingsID + 'afstatus" class="g_show_on_collapse"></div>';

                                OptionsBox += '<div id="' + settingsID + 'gmAFDisplay" class="g_hide_on_collapse gm-auto-follow-ups">';
                                var bumps = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth']

                                for (var i = 0; i < bumps.length; i++) {
                                    var bump = bumps[i];
                                    var lbump = bump.toLowerCase();
                                    var template =
                                        '<div class="gm-bump" data-bump="{index}" id="{settingsID}{lbump}bump">' +
                                        '<div class="gm-bump-stage">Stage {index}</div>' +
                                        '<label class="g2_checkbox" style="float:left; margin-right:3px; padding-top:2px"><input type="checkbox" class="gm-enable-bump" id="{settingsID}{bump}BumpBox"><span></span></label>' +
                                        'If ' +
                                        '<select class=g_bump_action name="{bump}BumpAction" id="{settingsID}{bump}BumpAction">' +
                                        '<option value="noreply">No Reply</option>' +
                                        '<option value="noopen">No Open</option>' +
                                        '<option value="noclick">No Click</option>' +
                                        '<option value="all">All</option>' +
                                        '</select>' +
                                        '<span>after</span> <input type=text size=2 class="g_bump_days" id="{settingsID}{bump}BumpDays" name="{bump}BumpDays" value=""> days ' +
                                        '<div class="gm-follow-up-settings">' +
                                        '<label class="g_radio"><input type="radio" id="{settingsID}{bump}BumpChoicet" name="{bump}BumpChoice" value="t"> <span style="font-size:8pt">Send text above original:</span></label>' +
                                        '<br />' +
                                        '<textarea id="{settingsID}{bump}BumpAddedText" class="g_bump_add_text" cols=34 rows=7></textarea>' +
                                        '<div><label class="g_radio"><input type="radio" id="{settingsID}{bump}BumpChoicec" name="{bump}BumpChoice" value="c"> <span id="{settingsID}CM{index}" style="font-size:8pt">Send custom message above original:</span></label>' +
                                        '<div id="{settingsID}{bump}BumpCustomDiv">' +
                                        '<select style="width: 260px; display:inline-block; font-size:8pt" id="{settingsID}{bump}BumpCustom" name="{bump}BumpCustom">' +
                                        '<option></option>' +
                                        '</select>' +
                                        '</div>' +
                                        '</div>' +
                                        '</div>' +
                                        '</div>';

                                    var s = template.replace(/{index}/g, (i + 1).toString());
                                    s = s.replace(/{bump}/g, bump);
                                    s = s.replace(/{lbump}/g, lbump);
                                    OptionsBox += s;
                                }
                                OptionsBox = OptionsBox + '</div>'; // accordian content
                                OptionsBox = OptionsBox + '</div></div></div>'
                                if (myOpenTracking == "on" || myOpenTracking == "default") {
                                    OptionsBox = OptionsBox.replace("[OPENON]", "checked")
                                } else if (myOpenTracking == "off") {
                                    OptionsBox = OptionsBox.replace("[OPENOFF]", "checked")
                                }
                                if (myClickTracking == "on" || myClickTracking == "default") {
                                    OptionsBox = OptionsBox.replace("[CLICKON]", "checked")
                                }
                                else if (myOpenTracking == "off") {
                                    OptionsBox = OptionsBox.replace("[OPENOFF]", "checked")
                                    //clean up
                                    OptionsBox = OptionsBox.replace("[OPENON]", "");
                                    OptionsBox = OptionsBox.replace("[OPENOFF]", "");
                                    OptionsBox = OptionsBox.replace("[CLICKON]", "");
                                    OptionsBox = OptionsBox.replace("[CLICKOFF]", "");
                                    OptionsBox = OptionsBox.replace(/{settingsID}/g, settingsID);

                                    //**********DONE CREATING HTML FOR SETTINGS BOX DIV
                                    //*********************************
                                    //*********************************
                                    //*********************************
                                    //*********************************
                                    if (gmDebug) { console.log("about to set HTML for options box"); }
                                    SettingsBox.innerHTML = OptionsBox;
                                    if (gmDebug) { console.log("DONE to set HTML for options box"); }

                                    //************EVENT HANDLERS FOR SETTINGS ELEMENTS**********************
                                    //**********************************
                                    //**********************************
                                    //**********************************
                                    //**********************************
                                    //$(document).ready(function () {

                                    $(SettingsBox).find('.gm-enable-bump').on('click refresh', function (e) {
                                        af = $(this).parents('.gm-auto-follow-ups');
                                        bump = $(this).parents('.gm-bump');
                                        var bumpNumber = bump.data('bump');
                                        var nextBumpNumber = bumpNumber + 1;
                                        var nextBump = af.find('[data-bump="' + nextBumpNumber + '"]');
                                        if (this.checked) {
                                            $(this).closest('.gm-bump').children('.gm-follow-up-settings').show();
                                            nextBump.show();
                                            bump.addClass('enabled');
                                        } else {
                                            $(this).closest('.gm-bump').children('.gm-follow-up-settings').hide();
                                            bump.removeClass('enabled');
                                            // disable all subsequent bumps too
                                            for (var i = nextBumpNumber; i <= 8; i++) {
                                                nextBump = af.find('[data-bump="' + i + '"]');
                                                nextBump.find('.gm-enable-bump').prop('checked', false);
                                                nextBump.removeClass('enabled');
                                                nextBump.hide();
                                            }
                                        }
                                    });
                                    $('#' + settingsID + 'Personalize').select2({
                                        dropdownParent: $('#' + settingsID + 'bigdiv'),
                                        width: "resolve",
                                        placeholder: ((GeniusMailPersonalization.length > 0) ? "Select Spreadsheet Field" : "Select Field")
                                    });
                                    $('#' + settingsID + 'Personalize').on('change', function (e) {
                                        var PersonalizationToken = document.getElementById(settingsID + "Personalize").value;
                                        CopyClipboard(PersonalizationToken);
                                        sdk.ButterBar.showMessage({ html: "The  personalization variable, <span style='color: #BFFFC5'>" + PersonalizationToken + "</span>, has been copied to your clipboard. Now you can PASTE it in your <span style='color: #BFFFC5'>Subject</span> or <span style='color: #BFFFC5'>Message</span>.", time: 10000 });
                                    });
                                    //********************
                                    $('#' + settingsID + 'FirstBumpCustom').select2({
                                        dropdownParent: $('#' + settingsID + 'FirstBumpCustomDiv'),
                                        width: "style",
                                        //templateResult: formatCampaignText,
                                        placeholder: ("Select message")
                                    });
                                    $('#' + settingsID + 'SecondBumpCustom').select2({
                                        dropdownParent: $('#' + settingsID + 'SecondBumpCustomDiv'),
                                        width: "style",
                                        //templateResult: formatCampaignText,
                                        placeholder: ("Select message")
                                    });
                                    $('#' + settingsID + 'ThirdBumpCustom').select2({
                                        dropdownParent: $('#' + settingsID + 'ThirdBumpCustomDiv'),
                                        width: "style",
                                        //templateResult: formatCampaignText,
                                        placeholder: ("Select message")
                                    });
                                    $('#' + settingsID + 'FourthBumpCustom').select2({
                                        dropdownParent: $('#' + settingsID + 'FourthBumpCustomDiv'),
                                        width: "style",
                                        //templateResult: formatCampaignText,
                                        placeholder: ("Select message")
                                    });
                                    $('#' + settingsID + 'FifthBumpCustom').select2({
                                        dropdownParent: $('#' + settingsID + 'FifthBumpCustomDiv'),
                                        width: "style",
                                        //templateResult: formatCampaignText,
                                        placeholder: ("Select message")
                                    });
                                    $('#' + settingsID + 'SixthBumpCustom').select2({
                                        dropdownParent: $('#' + settingsID + 'SixthBumpCustomDiv'),
                                        width: "style",
                                        //templateResult: formatCampaignText,
                                        placeholder: ("Select message")
                                    });
                                    $('#' + settingsID + 'SeventhBumpCustom').select2({
                                        dropdownParent: $('#' + settingsID + 'SeventhBumpCustomDiv'),
                                        width: "style",
                                        //templateResult: formatCampaignText,
                                        placeholder: ("Select message")
                                    });
                                    $('#' + settingsID + 'EighthBumpCustom').select2({
                                        dropdownParent: $('#' + settingsID + 'EighthBumpCustomDiv'),
                                        width: "style",
                                        //templateResult: formatCampaignText,
                                        placeholder: ("Select message")
                                    });
                                    //});

                                    //***************************


                                    //*********for auto follow-ups, just get all the form elements into variables
                                    var firstbump = document.getElementById(settingsID + "firstbump");
                                    var firstbumpaction = document.getElementById(settingsID + "FirstBumpAction");
                                    var firstbumpbox = document.getElementById(settingsID + "FirstBumpBox");
                                    var firstbumpcustom = document.getElementById(settingsID + "FirstBumpCustom");
                                    var firstbumpcustomdiv = document.getElementById(settingsID + "FirstBumpCustomDiv");
                                    var firstbumpdays = document.getElementById(settingsID + "FirstBumpDays");
                                    var firstbumpaddedtext = document.getElementById(settingsID + "FirstBumpAddedText");
                                    var firstbumpradiot = document.getElementById(settingsID + "FirstBumpChoicet");
                                    var firstbumpradioc = document.getElementById(settingsID + "FirstBumpChoicec");

                                    var secondbump = document.getElementById(settingsID + "secondbump");
                                    var secondbumpaction = document.getElementById(settingsID + "SecondBumpAction");
                                    var secondbumpbox = document.getElementById(settingsID + "SecondBumpBox");
                                    var secondbumpcustom = document.getElementById(settingsID + "SecondBumpCustom");
                                    var secondbumpcustomdiv = document.getElementById(settingsID + "SecondBumpCustomDiv");
                                    var secondbumpdays = document.getElementById(settingsID + "SecondBumpDays");
                                    var secondbumpaddedtext = document.getElementById(settingsID + "SecondBumpAddedText");
                                    var secondbumpradiot = document.getElementById(settingsID + "SecondBumpChoicet");
                                    var secondbumpradioc = document.getElementById(settingsID + "SecondBumpChoicec");

                                    var thirdbump = document.getElementById(settingsID + "thirdbump");
                                    var thirdbumpaction = document.getElementById(settingsID + "ThirdBumpAction");
                                    var thirdbumpbox = document.getElementById(settingsID + "ThirdBumpBox");
                                    var thirdbumpcustom = document.getElementById(settingsID + "ThirdBumpCustom");
                                    var thirdbumpcustomdiv = document.getElementById(settingsID + "ThirdBumpCustomDiv");
                                    var thirdbumpdays = document.getElementById(settingsID + "ThirdBumpDays");
                                    var thirdbumpaddedtext = document.getElementById(settingsID + "ThirdBumpAddedText");
                                    var thirdbumpradiot = document.getElementById(settingsID + "ThirdBumpChoicet");
                                    var thirdbumpradioc = document.getElementById(settingsID + "ThirdBumpChoicec");

                                    var fourthbump = document.getElementById(settingsID + "fourthbump");
                                    var fourthbumpaction = document.getElementById(settingsID + "FourthBumpAction");
                                    var fourthbumpbox = document.getElementById(settingsID + "FourthBumpBox");
                                    var fourthbumpcustom = document.getElementById(settingsID + "FourthBumpCustom");
                                    var fourthbumpcustomdiv = document.getElementById(settingsID + "FourthBumpCustomDiv");
                                    var fourthbumpdays = document.getElementById(settingsID + "FourthBumpDays");
                                    var fourthbumpaddedtext = document.getElementById(settingsID + "FourthBumpAddedText");
                                    var fourthbumpradiot = document.getElementById(settingsID + "FourthBumpChoicet");
                                    var fourthbumpradioc = document.getElementById(settingsID + "FourthBumpChoicec");

                                    var fifthbump = document.getElementById(settingsID + "fifthbump");
                                    var fifthbumpaction = document.getElementById(settingsID + "FifthBumpAction");
                                    var fifthbumpbox = document.getElementById(settingsID + "FifthBumpBox");
                                    var fifthbumpcustom = document.getElementById(settingsID + "FifthBumpCustom");
                                    var fifthbumpcustomdiv = document.getElementById(settingsID + "FifthBumpCustomDiv");
                                    var fifthbumpdays = document.getElementById(settingsID + "FifthBumpDays");
                                    var fifthbumpaddedtext = document.getElementById(settingsID + "FifthBumpAddedText");
                                    var fifthbumpradiot = document.getElementById(settingsID + "FifthBumpChoicet");
                                    var fifthbumpradioc = document.getElementById(settingsID + "FifthBumpChoicec");

                                    var sixthbump = document.getElementById(settingsID + "sixthbump");
                                    var sixthbumpaction = document.getElementById(settingsID + "SixthBumpAction");
                                    var sixthbumpbox = document.getElementById(settingsID + "SixthBumpBox");
                                    var sixthbumpcustom = document.getElementById(settingsID + "SixthBumpCustom");
                                    var sixthbumpcustomdiv = document.getElementById(settingsID + "SixthBumpCustomDiv");
                                    var sixthbumpdays = document.getElementById(settingsID + "SixthBumpDays");
                                    var sixthbumpaddedtext = document.getElementById(settingsID + "SixthBumpAddedText");
                                    var sixthbumpradiot = document.getElementById(settingsID + "SixthBumpChoicet");
                                    var sixthbumpradioc = document.getElementById(settingsID + "SixthBumpChoicec");

                                    var seventhbump = document.getElementById(settingsID + "seventhbump");
                                    var seventhbumpaction = document.getElementById(settingsID + "SeventhBumpAction");
                                    var seventhbumpbox = document.getElementById(settingsID + "SeventhBumpBox");
                                    var seventhbumpcustom = document.getElementById(settingsID + "SeventhBumpCustom");
                                    var seventhbumpcustomdiv = document.getElementById(settingsID + "SeventhBumpCustomDiv");
                                    var seventhbumpdays = document.getElementById(settingsID + "SeventhBumpDays");
                                    var seventhbumpaddedtext = document.getElementById(settingsID + "SeventhBumpAddedText");
                                    var seventhbumpradiot = document.getElementById(settingsID + "SeventhBumpChoicet");
                                    var seventhbumpradioc = document.getElementById(settingsID + "SeventhBumpChoicec");

                                    var eighthbump = document.getElementById(settingsID + "eighthbump");
                                    var eighthbumpaction = document.getElementById(settingsID + "EighthBumpAction");
                                    var eighthbumpbox = document.getElementById(settingsID + "EighthBumpBox");
                                    var eighthbumpcustom = document.getElementById(settingsID + "EighthBumpCustom");
                                    var eighthbumpcustomdiv = document.getElementById(settingsID + "EighthBumpCustomDiv");
                                    var eighthbumpdays = document.getElementById(settingsID + "EighthBumpDays");
                                    var eighthbumpaddedtext = document.getElementById(settingsID + "EighthBumpAddedText");
                                    var eighthbumpradiot = document.getElementById(settingsID + "EighthBumpChoicet");
                                    var eighthbumpradioc = document.getElementById(settingsID + "EighthBumpChoicec");
                                    var eighthbumptime = document.getElementById(settingsID + "EighthBumpTime");

                                    var ContentDDAUTOFirst = document.getElementById(settingsID + "FirstBumpCustom");
                                    var ContentDDAUTOSecond = document.getElementById(settingsID + "SecondBumpCustom");
                                    var ContentDDAUTOThird = document.getElementById(settingsID + "ThirdBumpCustom");
                                    var ContentDDAUTOFourth = document.getElementById(settingsID + "FourthBumpCustom");
                                    var ContentDDAUTOFifth = document.getElementById(settingsID + "FifthBumpCustom");
                                    var ContentDDAUTOSixth = document.getElementById(settingsID + "SixthBumpCustom");
                                    var ContentDDAUTOSeventh = document.getElementById(settingsID + "SeventhBumpCustom");
                                    var ContentDDAUTOEighth = document.getElementById(settingsID + "EighthBumpCustom");

                                    //*************Populating the dropdown options for Auto Followup Stages***************/
                                    if (AFCampaign.length > 0) {
                                        var AFarrayFields = AFCampaign;
                                        console.log("AFfields", AFarrayFields.length);
                                        if (AFarrayFields.length > 0) {
                                            console.log("AF field");

                                            for (var j = 0; j < AFarrayFields.length; j++) {
                                                console.log("template", AFarrayFields[j])
                                                var myoptionAuto = document.createElement("option");
                                                var myoption2Auto = document.createElement("option");
                                                var myoption3Auto = document.createElement("option");
                                                var myoption4Auto = document.createElement("option");
                                                var myoption5Auto = document.createElement("option");
                                                var myoption6Auto = document.createElement("option");
                                                var myoption7Auto = document.createElement("option");
                                                var myoption8Auto = document.createElement("option");

                                                myoptionAuto.text = AFarrayFields[j].subject
                                                myoptionAuto.value = AFarrayFields[j].message
                                                ContentDDAUTOFirst.add(myoptionAuto)

                                                myoption2Auto.text = AFarrayFields[j].subject
                                                myoption2Auto.value = AFarrayFields[j].message
                                                ContentDDAUTOSecond.add(myoption2Auto)

                                                myoption3Auto.text = AFarrayFields[j].subject
                                                myoption3Auto.value = AFarrayFields[j].message
                                                ContentDDAUTOThird.add(myoption3Auto)

                                                myoption4Auto.text = AFarrayFields[j].subject
                                                myoption4Auto.value = AFarrayFields[j].message
                                                ContentDDAUTOFourth.add(myoption4Auto)

                                                myoption5Auto.text = AFarrayFields[j].subject
                                                myoption5Auto.value = AFarrayFields[j].message
                                                ContentDDAUTOFifth.add(myoption5Auto)

                                                myoption6Auto.text = AFarrayFields[j].subject
                                                myoption6Auto.value = AFarrayFields[j].message
                                                ContentDDAUTOSixth.add(myoption6Auto)

                                                myoption7Auto.text = AFarrayFields[j].subject
                                                myoption7Auto.value = AFarrayFields[j].message
                                                ContentDDAUTOSeventh.add(myoption7Auto)

                                                myoption8Auto.text = AFarrayFields[j].subject
                                                myoption8Auto.value = AFarrayFields[j].message
                                                ContentDDAUTOEighth.add(myoption8Auto)
                                            }
                                        }
                                    }
                                    //********************End***********************// 
                                    $('#' + settingsID + 'bigdiv .gm-enable-bump').first().trigger('refresh');
                                    $('#' + settingsID + 'bigdiv .gm-enable-bump').eq(1).trigger('refresh');
                                    $('#' + settingsID + 'bigdiv .gm-enable-bump').eq(2).trigger('refresh');
                                    $('#' + settingsID + 'bigdiv .gm-enable-bump').eq(3).trigger('refresh');
                                    $('#' + settingsID + 'bigdiv .gm-enable-bump').eq(4).trigger('refresh');
                                    $('#' + settingsID + 'bigdiv .gm-enable-bump').eq(5).trigger('refresh');
                                    $('#' + settingsID + 'bigdiv .gm-enable-bump').eq(6).trigger('refresh');
                                    $('#' + settingsID + 'bigdiv .gm-enable-bump').eq(7).trigger('refresh');

                                    floater.style.display = "block";
                                    $('.g2_settings').animate({
                                        scrollTop: 1000
                                    }, 0)

                                    $('.gm-bump').children('.gm-follow-up-settings').hide();
                                    firstbumpdays.disabled = true;
                                    firstbumpaction.disabled = true;
                                    firstbumpradiot.disabled = true;
                                    firstbumpradioc.disabled = true;
                                    firstbumpaddedtext.disabled = true;
                                    firstbumpcustom.disabled = true;

                                    secondbumpdays.disabled = true;
                                    secondbumpaction.disabled = true;
                                    secondbumpradiot.disabled = true;
                                    secondbumpradioc.disabled = true;
                                    secondbumpaddedtext.disabled = true;
                                    secondbumpcustom.disabled = true;

                                    thirdbumpdays.disabled = true;
                                    thirdbumpaction.disabled = true;
                                    thirdbumpradiot.disabled = true;
                                    thirdbumpradioc.disabled = true;
                                    thirdbumpaddedtext.disabled = true;
                                    thirdbumpcustom.disabled = true;

                                    fourthbumpdays.disabled = true;
                                    fourthbumpaction.disabled = true;
                                    fourthbumpradiot.disabled = true;
                                    fourthbumpradioc.disabled = true;
                                    fourthbumpaddedtext.disabled = true;
                                    fourthbumpcustom.disabled = true;

                                    fifthbumpdays.disabled = true;
                                    fifthbumpaction.disabled = true;
                                    fifthbumpradiot.disabled = true;
                                    fifthbumpradioc.disabled = true;
                                    fifthbumpaddedtext.disabled = true;
                                    fifthbumpcustom.disabled = true;

                                    sixthbumpdays.disabled = true;
                                    sixthbumpaction.disabled = true;
                                    sixthbumpradiot.disabled = true;
                                    sixthbumpradioc.disabled = true;
                                    sixthbumpaddedtext.disabled = true;
                                    sixthbumpcustom.disabled = true;

                                    seventhbumpdays.disabled = true;
                                    seventhbumpaction.disabled = true;
                                    seventhbumpradiot.disabled = true;
                                    seventhbumpradioc.disabled = true;
                                    seventhbumpaddedtext.disabled = true;
                                    seventhbumpcustom.disabled = true;

                                    eighthbumpdays.disabled = true;
                                    eighthbumpaction.disabled = true;
                                    eighthbumpradiot.disabled = true;
                                    eighthbumpradioc.disabled = true;
                                    eighthbumpaddedtext.disabled = true;
                                    eighthbumpcustom.disabled = true;

                                    //*********auto follow-up stage based on clicking/unclicking checkboxes next to each stage
                                    firstbumpbox.addEventListener('click', function () {
                                        if (firstbumpbox.checked) {
                                            console.log("1 checked")
                                            firstbumpdays.disabled = false;
                                            firstbumpaction.disabled = false;
                                            firstbumpradiot.disabled = false;
                                            firstbumpradioc.disabled = false;
                                            firstbumpaddedtext.disabled = false;
                                            firstbumpcustom.disabled = false;
                                            gmFirstBumpBox = "y";
                                        } else {
                                            console.log("1 not checked")
                                            firstbumpdays.disabled = true;
                                            firstbumpaction.disabled = true;
                                            firstbumpradiot.disabled = true;
                                            firstbumpradioc.disabled = true;
                                            firstbumpaddedtext.disabled = true;
                                            firstbumpcustom.disabled = true;
                                            gmFirstBumpBox = "n";
                                        }
                                    });
                                    secondbumpbox.addEventListener('click', function () {
                                        if (secondbumpbox.checked) {
                                            console.log("2 checked")
                                            secondbumpdays.disabled = false;
                                            secondbumpaction.disabled = false;
                                            secondbumpradiot.disabled = false;
                                            secondbumpradioc.disabled = false;
                                            secondbumpaddedtext.disabled = false;
                                            secondbumpcustom.disabled = false;
                                            gmSecondBumpBox = "y";
                                        } else {
                                            console.log("2 not checked")
                                            secondbumpdays.disabled = true;
                                            secondbumpaction.disabled = true;
                                            secondbumpradiot.disabled = true;
                                            secondbumpradioc.disabled = true;
                                            secondbumpaddedtext.disabled = true;
                                            secondbumpcustom.disabled = true;
                                            gmSecondBumpBox = "n";
                                        }
                                    });
                                    thirdbumpbox.addEventListener('click', function () {
                                        if (thirdbumpbox.checked) {
                                            console.log("3 checked")
                                            thirdbumpdays.disabled = false;
                                            thirdbumpaction.disabled = false;
                                            thirdbumpradiot.disabled = false;
                                            thirdbumpradioc.disabled = false;
                                            thirdbumpaddedtext.disabled = false;
                                            thirdbumpcustom.disabled = false;
                                            gmThirdBumpBox = "y";
                                        } else {
                                            console.log("3 not checked")
                                            thirdbumpdays.disabled = true;
                                            thirdbumpaction.disabled = true;
                                            thirdbumpradiot.disabled = true;
                                            thirdbumpradioc.disabled = true;
                                            thirdbumpaddedtext.disabled = true;
                                            thirdbumpcustom.disabled = true;
                                            gmThirdBumpBox = "n";
                                        }
                                    });
                                    fourthbumpbox.addEventListener('click', function () {
                                        if (fourthbumpbox.checked) {
                                            fourthbumpdays.disabled = false;
                                            fourthbumpaction.disabled = false;
                                            fourthbumpradiot.disabled = false;
                                            fourthbumpradioc.disabled = false;
                                            fourthbumpaddedtext.disabled = false;
                                            fourthbumpcustom.disabled = false;
                                            gmFourthBumpBox = "y";
                                        } else {
                                            fourthbumpdays.disabled = true;
                                            fourthbumpaction.disabled = true;
                                            fourthbumpradiot.disabled = true;
                                            fourthbumpradioc.disabled = true;
                                            fourthbumpaddedtext.disabled = true;
                                            fourthbumpcustom.disabled = true;
                                            gmFourthBumpBox = "n";
                                        }
                                    });
                                    fifthbumpbox.addEventListener('click', function () {
                                        if (fifthbumpbox.checked) {
                                            fifthbumpdays.disabled = false;
                                            fifthbumpaction.disabled = false;
                                            fifthbumpradiot.disabled = false;
                                            fifthbumpradioc.disabled = false;
                                            fifthbumpaddedtext.disabled = false;
                                            fifthbumpcustom.disabled = false;
                                            gmFifthBumpBox = "y";
                                        } else {
                                            fifthbumpdays.disabled = true;
                                            fifthbumpaction.disabled = true;
                                            fifthbumpradiot.disabled = true;
                                            fifthbumpradioc.disabled = true;
                                            fifthbumpaddedtext.disabled = true;
                                            fifthbumpcustom.disabled = true;
                                            gmFifthBumpBox = "n";
                                        }
                                    });
                                    sixthbumpbox.addEventListener('click', function () {
                                        if (sixthbumpbox.checked) {
                                            sixthbumpdays.disabled = false;
                                            sixthbumpaction.disabled = false;
                                            sixthbumpradiot.disabled = false;
                                            sixthbumpradioc.disabled = false;
                                            sixthbumpaddedtext.disabled = false;
                                            sixthbumpcustom.disabled = false;
                                            gmSixthBumpBox = "y";
                                        } else {
                                            sixthbumpdays.disabled = true;
                                            sixthbumpaction.disabled = true;
                                            sixthbumpradiot.disabled = true;
                                            sixthbumpradioc.disabled = true;
                                            sixthbumpaddedtext.disabled = true;
                                            sixthbumpcustom.disabled = true;
                                            gmSixthBumpBox = "n";
                                        }
                                    });
                                    seventhbumpbox.addEventListener('click', function () {
                                        if (seventhbumpbox.checked) {
                                            seventhbumpdays.disabled = false;
                                            seventhbumpaction.disabled = false;
                                            seventhbumpradiot.disabled = false;
                                            seventhbumpradioc.disabled = false;
                                            seventhbumpaddedtext.disabled = false;
                                            seventhbumpcustom.disabled = false;
                                            gmSeventhBumpBox = "y";
                                        } else {
                                            seventhbumpdays.disabled = true;
                                            seventhbumpaction.disabled = true;
                                            seventhbumpradiot.disabled = true;
                                            seventhbumpradioc.disabled = true;
                                            seventhbumpaddedtext.disabled = true;
                                            seventhbumpcustom.disabled = true;
                                            gmSeventhBumpBox = "n";
                                        }
                                    });
                                    eighthbumpbox.addEventListener('click', function () {
                                        if (eighthbumpbox.checked) {
                                            eighthbumpdays.disabled = false;
                                            eighthbumpaction.disabled = false;
                                            eighthbumpradiot.disabled = false;
                                            eighthbumpradioc.disabled = false;
                                            eighthbumpaddedtext.disabled = false;
                                            eighthbumpcustom.disabled = false;
                                            gmEighthBumpBox = "y";
                                        } else {
                                            eighthbumpdays.disabled = true;
                                            eighthbumpaction.disabled = true;
                                            eighthbumpradiot.disabled = true;
                                            eighthbumpradioc.disabled = true;
                                            eighthbumpaddedtext.disabled = true;
                                            eighthbumpcustom.disabled = true;
                                            gmEighthBumpBox = "n";
                                        }
                                    });

                                    //*********auto follow-up stage based on what user has already selected (localstorage), so when user hides/shows settings box
                                    //**********varting user toggle between added text vs custom message
                                    firstbumpradiot.addEventListener('change', function () {
                                        if (firstbumpradiot.checked) {
                                            firstbumpcustomdiv.style.display = 'none';
                                            firstbumpaddedtext.style.display = 'block';
                                            gmFirstBumpChoice = "t";
                                        }
                                    });
                                    firstbumpradioc.addEventListener('change', function () {
                                        if (firstbumpradioc.checked) {
                                            firstbumpaddedtext.style.display = 'none';
                                            firstbumpcustomdiv.style.display = 'block';
                                            gmFirstBumpChoice = "c";
                                        }
                                    });
                                    secondbumpradiot.addEventListener('change', function () {
                                        if (secondbumpradiot.checked) {
                                            secondbumpcustomdiv.style.display = 'none';
                                            secondbumpaddedtext.style.display = 'block';
                                            gmSecondBumpChoice = "t";
                                        }
                                    });
                                    secondbumpradioc.addEventListener('change', function () {
                                        if (secondbumpradioc.checked) {
                                            secondbumpaddedtext.style.display = 'none';
                                            secondbumpcustomdiv.style.display = 'block';
                                            gmSecondBumpChoice = "c";
                                        }
                                    });
                                    thirdbumpradiot.addEventListener('change', function () {
                                        if (thirdbumpradiot.checked) {
                                            thirdbumpcustomdiv.style.display = 'none';
                                            thirdbumpaddedtext.style.display = 'block';
                                            gmThirdBumpChoice = "t";
                                        }
                                    });
                                    thirdbumpradioc.addEventListener('change', function () {
                                        if (thirdbumpradioc.checked) {
                                            thirdbumpaddedtext.style.display = 'none';
                                            thirdbumpcustomdiv.style.display = 'block';
                                            gmThirdBumpChoice = "c";
                                        }
                                    });
                                    fourthbumpradiot.addEventListener('change', function () {
                                        if (fourthbumpradiot.checked) {
                                            fourthbumpcustomdiv.style.display = 'none';
                                            fourthbumpaddedtext.style.display = 'block';
                                            gmFourthBumpChoice = "t";
                                        }
                                    });
                                    fourthbumpradioc.addEventListener('change', function () {
                                        if (fourthbumpradioc.checked) {
                                            fourthbumpaddedtext.style.display = 'none';
                                            fourthbumpcustomdiv.style.display = 'block';
                                            gmFourthBumpChoice = "c";
                                        }
                                    });
                                    fifthbumpradiot.addEventListener('change', function () {
                                        if (fifthbumpradiot.checked) {
                                            fifthbumpcustomdiv.style.display = 'none';
                                            fifthbumpaddedtext.style.display = 'block';
                                            gmFifthBumpChoice = "t";
                                        }
                                    });
                                    fifthbumpradioc.addEventListener('change', function () {
                                        if (fifthbumpradioc.checked) {
                                            fifthbumpaddedtext.style.display = 'none';
                                            fifthbumpcustomdiv.style.display = 'block';
                                            gmFifthBumpChoice = "c";
                                        }
                                    });
                                    sixthbumpradiot.addEventListener('change', function () {
                                        if (sixthbumpradiot.checked) {
                                            sixthbumpcustomdiv.style.display = 'none';
                                            sixthbumpaddedtext.style.display = 'block';
                                            gmSixthBumpChoice = "t";
                                        }
                                    });
                                    sixthbumpradioc.addEventListener('change', function () {
                                        if (sixthbumpradioc.checked) {
                                            sixthbumpaddedtext.style.display = 'none';
                                            sixthbumpcustomdiv.style.display = 'block';
                                            gmSixthBumpChoice = "c";
                                        }
                                    });
                                    seventhbumpradiot.addEventListener('change', function () {
                                        if (seventhbumpradiot.checked) {
                                            seventhbumpcustomdiv.style.display = 'none';
                                            seventhbumpaddedtext.style.display = 'block';
                                            gmSeventhBumpChoice = "t";
                                        }
                                    });
                                    seventhbumpradioc.addEventListener('change', function () {
                                        if (seventhbumpradioc.checked) {
                                            seventhbumpaddedtext.style.display = 'none';
                                            seventhbumpcustomdiv.style.display = 'block';
                                            gmSeventhBumpChoice = "c";
                                        }
                                    });
                                    eighthbumpradiot.addEventListener('change', function () {
                                        if (eighthbumpradiot.checked) {
                                            eighthbumpcustomdiv.style.display = 'none';
                                            eighthbumpaddedtext.style.display = 'block';
                                            gmEighthBumpChoice = "t";
                                        }
                                    });
                                    eighthbumpradioc.addEventListener('change', function () {
                                        if (eighthbumpradioc.checked) {
                                            eighthbumpaddedtext.style.display = 'none';
                                            eighthbumpcustomdiv.style.display = 'block';
                                            gmEighthBumpChoice = "c";
                                        }
                                    });
                                    //***********showing added text vs custom message based on what user has already chosen (if user shows/hides settings box)
                                    if (gmFirstBumpChoice == "c") {
                                        firstbumpaddedtext.style.display = 'none';
                                        firstbumpcustomdiv.style.display = 'block';
                                        firstbumpradioc.checked = true;
                                    } else {
                                        firstbumpcustomdiv.style.display = 'none';
                                        firstbumpaddedtext.style.display = 'block';
                                        firstbumpradiot.checked = true;
                                    }
                                    if (gmSecondBumpChoice == "c") {
                                        secondbumpaddedtext.style.display = 'none';
                                        secondbumpcustomdiv.style.display = 'block';
                                        secondbumpradioc.checked = true;
                                    } else {
                                        secondbumpcustomdiv.style.display = 'none';
                                        secondbumpaddedtext.style.display = 'block';
                                        secondbumpradiot.checked = true;
                                    }
                                    if (gmThirdBumpChoice == "c") {
                                        thirdbumpaddedtext.style.display = 'none';
                                        thirdbumpcustomdiv.style.display = 'block';
                                        thirdbumpradioc.checked = true;
                                    } else {
                                        thirdbumpcustomdiv.style.display = 'none';
                                        thirdbumpaddedtext.style.display = 'block';
                                        thirdbumpradiot.checked = true;
                                    }
                                    if (gmFourthBumpChoice == "c") {
                                        fourthbumpaddedtext.style.display = 'none';
                                        fourthbumpcustomdiv.style.display = 'block';
                                        fourthbumpradioc.checked = true;
                                    } else {
                                        fourthbumpcustomdiv.style.display = 'none';
                                        fourthbumpaddedtext.style.display = 'block';
                                        fourthbumpradiot.checked = true;
                                    }
                                    if (gmFifthBumpChoice == "c") {
                                        fifthbumpaddedtext.style.display = 'none';
                                        fifthbumpcustomdiv.style.display = 'block';
                                        fifthbumpradioc.checked = true;
                                    } else {
                                        fifthbumpcustomdiv.style.display = 'none';
                                        fifthbumpaddedtext.style.display = 'block';
                                        fifthbumpradiot.checked = true;
                                    }
                                    if (gmSixthBumpChoice == "c") {
                                        sixthbumpaddedtext.style.display = 'none';
                                        sixthbumpcustomdiv.style.display = 'block';
                                        sixthbumpradioc.checked = true;
                                    } else {
                                        sixthbumpcustomdiv.style.display = 'none';
                                        sixthbumpaddedtext.style.display = 'block';
                                        sixthbumpradiot.checked = true;
                                    }
                                    if (gmSeventhBumpChoice == "c") {
                                        seventhbumpaddedtext.style.display = 'none';
                                        seventhbumpcustomdiv.style.display = 'block';
                                        seventhbumpradioc.checked = true;
                                    } else {
                                        seventhbumpcustomdiv.style.display = 'none';
                                        seventhbumpaddedtext.style.display = 'block';
                                        seventhbumpradiot.checked = true;
                                    }
                                    if (gmEighthBumpChoice == "c") {
                                        eighthbumpaddedtext.style.display = 'none';
                                        eighthbumpcustomdiv.style.display = 'block';
                                        eighthbumpradioc.checked = true;
                                    } else {
                                        eighthbumpcustomdiv.style.display = 'none';
                                        eighthbumpaddedtext.style.display = 'block';
                                        eighthbumpradiot.checked = true;
                                    }
                                    //*****
                                    //*********setting reply/open/all for each stage when user selects
                                    firstbumpaction.addEventListener('change', function () {
                                        gmFirstBumpAction = firstbumpaction.value;
                                        if (firstbumpaction.value == 'all') {
                                            //change text for custom message
                                            document.getElementById(settingsID + "CM1").innerHTML = "Send custom message alone:";
                                            sdk.ButterBar.showMessage({ html: "Keep in mind that choosing ALL will send the follow-up to everyone in the original campaign and make sure you have at least one trackable link in your email.", time: 10000 });
                                        }
                                        else {
                                            document.getElementById(settingsID + "CM1").innerHTML = "Send custom message above original:";
                                        }
                                        if (firstbumpaction.value == 'noclick') {
                                            var BBClick = "Before using this option, make sure you have at least one trackable link in your email."
                                            //if (ForceClickTrack) { BBClick = "We have turned on the 'Track Clicks' setting for you because it was off. " + BBClick; }
                                            sdk.ButterBar.showMessage({ html: BBClick, time: 10000 });
                                        }
                                    });
                                    if (gmFirstBumpAction !== null) {
                                        firstbumpaction.value = gmFirstBumpAction;
                                        if (firstbumpaction.value == 'a') {
                                            //change text for custom message
                                            document.getElementById(settingsID + "CM1").innerHTML = "Send custom message alone:";
                                        } else {
                                            document.getElementById(settingsID + "CM1").innerHTML = "Send custom message above original:";
                                        }
                                    }
                                    $('#' + settingsID + 'FirstBumpCustom').on('change', function () {
                                        gmFirstBumpCustom = $('#' + settingsID + 'FirstBumpCustom').val();
                                    });
                                    firstbumpaddedtext.addEventListener('change', function () {
                                        gmFirstBumpAddedText = firstbumpaddedtext.value;
                                    });
                                    firstbumpdays.addEventListener('keyup', function (e) {
                                        console.log("value", firstbumpdays.value)
                                        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
                                            sdk.ButterBar.showMessage({ html: "Please Enter Numeric Value", time: 10000, className: "redbb" });
                                            firstbumpdays.value = this.value = firstbumpdays.value.replace(/\D/g, '');
                                            return false;
                                        }
                                        else {
                                            gmFirstBumpDays = firstbumpdays.value;
                                        }
                                    });
                                    if (gmFirstBumpDays !== null) {
                                        firstbumpdays.value = gmFirstBumpDays;
                                    }
                                    if (gmFirstBumpAddedText !== null) {
                                        firstbumpaddedtext.value = gmFirstBumpAddedText;
                                    }
                                    secondbumpaction.addEventListener('change', function () {
                                        gmSecondBumpAction = secondbumpaction.value;
                                        if (secondbumpaction.value == 'all') {
                                            //change text for custom message
                                            document.getElementById(settingsID + "CM2").innerHTML = "Send custom message alone:";
                                            sdk.ButterBar.showMessage({ html: "Keep in mind that choosing ALL will send the follow-up to everyone in the original campaign and make sure you have at least one trackable link in your email.", time: 10000 });
                                        } else {
                                            document.getElementById(settingsID + "CM2").innerHTML = "Send custom message above original:";
                                        }
                                        if (secondbumpaction.value == 'noclick') {
                                            var BBClick = "Before using this option, make sure you have at least one trackable link in your email. .";
                                            //if (ForceClickTrack) { BBClick = "We have turned on the 'Track Clicks' setting for you because it was off. " + BBClick; }
                                            sdk.ButterBar.showMessage({ html: BBClick, time: 10000 });
                                        }
                                    });
                                    if (gmSecondBumpAction !== null) {
                                        secondbumpaction.value = gmSecondBumpAction;
                                        if (secondbumpaction.value == 'a') {
                                            //change text for custom message
                                            document.getElementById(settingsID + "CM2").innerHTML = "Send custom message alone:";
                                        } else {
                                            document.getElementById(settingsID + "CM2").innerHTML = "Send custom message above original:";
                                        }
                                    }
                                    $('#' + settingsID + 'SecondBumpCustom').on('change', function () {
                                        gmSecondBumpCustom = $('#' + settingsID + 'SecondBumpCustom').val();
                                    });
                                    secondbumpaddedtext.addEventListener('change', function () {
                                        gmSecondBumpAddedText = secondbumpaddedtext.value;
                                    });
                                    secondbumpdays.addEventListener('keyup', function (e) {
                                        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
                                            //display error message
                                            sdk.ButterBar.showMessage({ html: "Please Enter Numeric Value", time: 10000, className: "redbb" });
                                            secondbumpdays.value = secondbumpdays.value.replace(/\D/g, '');
                                            return false;
                                        }
                                        else {
                                            gmSecondBumpDays = secondbumpdays.value;
                                        }
                                    });
                                    if (gmSecondBumpDays !== null) {
                                        secondbumpdays.value = gmSecondBumpDays;
                                    }
                                    if (gmSecondBumpAddedText !== null) {
                                        secondbumpaddedtext.value = gmSecondBumpAddedText;
                                    }
                                    if (gmSecondBump == "show") {
                                        secondbump.style.display = 'block';
                                    } else {
                                        secondbump.style.display = 'none';
                                    }
                                    thirdbumpaction.addEventListener('change', function () {
                                        gmThirdBumpAction = thirdbumpaction.value;
                                        if (thirdbumpaction.value == 'all') {
                                            //change text for custom message
                                            document.getElementById(settingsID + "CM3").innerHTML = "Send custom message alone:";
                                            sdk.ButterBar.showMessage({ html: "Keep in mind that choosing ALL will send the follow-up to everyone in the original campaign and make sure you have at least one trackable link in your email.", time: 10000 });
                                        }
                                        else {
                                            document.getElementById(settingsID + "CM3").innerHTML = "Send custom message above original:";
                                        }
                                        if (thirdbumpaction.value == 'noclick') {
                                            var BBClick = "Before using this option, make sure you have at least one trackable link in your email. .";
                                            //if (ForceClickTrack) { BBClick = "We have turned on the 'Track Clicks' setting for you because it was off. " + BBClick; }
                                            sdk.ButterBar.showMessage({ html: BBClick, time: 10000 });
                                        }
                                    });
                                    if (gmThirdBumpAction !== null) {
                                        thirdbumpaction.value = gmThirdBumpAction;
                                        if (thirdbumpaction.value == 'a') {
                                            //change text for custom message
                                            document.getElementById(settingsID + "CM3").innerHTML = "Send custom message alone:";
                                        } else {
                                            document.getElementById(settingsID + "CM3").innerHTML = "Send custom message above original:";
                                        }
                                    }
                                    $('#' + settingsID + 'ThirdBumpCustom').on('change', function () {
                                        gmThirdBumpCustom = $('#' + settingsID + 'ThirdBumpCustom').val();
                                    });
                                    thirdbumpaddedtext.addEventListener('change', function () {
                                        gmThirdBumpAddedText = thirdbumpaddedtext.value;
                                    });
                                    thirdbumpdays.addEventListener('keyup', function (e) {
                                        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
                                            //display error message
                                            sdk.ButterBar.showMessage({ html: "Please Enter Numeric Value", time: 10000, className: "redbb" });
                                            thirdbumpdays.value = thirdbumpdays.value.replace(/\D/g, '');
                                            return false;
                                        }
                                        else {
                                            gmThirdBumpDays = thirdbumpdays.value;
                                        }
                                    });
                                    if (gmThirdBumpDays !== null) {
                                        thirdbumpdays.value = gmThirdBumpDays;
                                    }
                                    if (gmThirdBumpAddedText !== null) {
                                        thirdbumpaddedtext.value = gmThirdBumpAddedText;
                                    }
                                    if (gmThirdBump == "show") {
                                        thirdbump.style.display = 'block';
                                    } else {
                                        thirdbump.style.display = 'none';
                                    }
                                    //**************
                                    fourthbumpaction.addEventListener('change', function () {
                                        gmFourthBumpAction = fourthbumpaction.value;
                                        if (fourthbumpaction.value == 'all') {
                                            //change text for custom message
                                            document.getElementById(settingsID + "CM4").innerHTML = "Send custom message alone:";
                                            sdk.ButterBar.showMessage({ html: "Keep in mind that choosing ALL will send the follow-up to everyone in the original campaign and make sure you have at least one trackable link in your email.", time: 10000 });
                                        } else {
                                            document.getElementById(settingsID + "CM4").innerHTML = "Send custom message above original:";
                                        }
                                        if (fourthbumpaction.value == 'noclick') {
                                            var BBClick = "Before using this option, make sure you have at least one trackable link in your email. .";
                                            //if (ForceClickTrack) { BBClick = "We have turned on the 'Track Clicks' setting for you because it was off. " + BBClick; }
                                            sdk.ButterBar.showMessage({ html: BBClick, time: 10000 });
                                        }
                                    });
                                    if (gmFourthBumpAction !== null) {
                                        fourthbumpaction.value = gmFourthBumpAction;
                                        if (fourthbumpaction.value == 'a') {
                                            //change text for custom message
                                            document.getElementById(settingsID + "CM4").innerHTML = "Send custom message alone:";
                                        } else {
                                            document.getElementById(settingsID + "CM4").innerHTML = "Send custom message above original:";
                                        }
                                    }
                                    $('#' + settingsID + 'FourthBumpCustom').on('change', function () {
                                        gmFourthBumpCustom = $('#' + settingsID + 'FourthBumpCustom').val();
                                    });
                                    fourthbumpaddedtext.addEventListener('change', function () {
                                        gmFourthBumpAddedText = fourthbumpaddedtext.value;
                                    });
                                    fourthbumpdays.addEventListener('keyup', function (e) {
                                        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
                                            sdk.ButterBar.showMessage({ html: "Please Enter Numeric Value", time: 10000, className: "redbb" });
                                            fourthbumpdays.value = this.value = fourthbumpdays.value.replace(/\D/g, '');
                                            return false;
                                        }
                                        else {
                                            gmFourthBumpDays = fourthbumpdays.value;
                                        }
                                    });
                                    if (gmFourthBumpDays !== null) {
                                        fourthbumpdays.value = gmFourthBumpDays;
                                    }
                                    if (gmFourthBumpAddedText !== null) {
                                        fourthbumpaddedtext.value = gmFourthBumpAddedText;
                                    }
                                    if (gmFourthBump == "show") {
                                        fourthbump.style.display = 'block';
                                    } else {
                                        fourthbump.style.display = 'none';
                                    }
                                    //*************
                                    fifthbumpaction.addEventListener('change', function () {
                                        gmFifthBumpAction = fifthbumpaction.value;
                                        if (fifthbumpaction.value == 'all') {
                                            //change text for custom message
                                            document.getElementById(settingsID + "CM5").innerHTML = "Send custom message alone:";
                                            sdk.ButterBar.showMessage({ html: "Keep in mind that choosing ALL will send the follow-up to everyone in the original campaign and make sure you have at least one trackable link in your email.", time: 10000 });
                                        } else {
                                            document.getElementById(settingsID + "CM5").innerHTML = "Send custom message above original:";
                                        }
                                        if (fifthbumpaction.value == 'noclick') {
                                            var BBClick = "Before using this option, make sure you have at least one trackable link in your email. .";
                                            //if (ForceClickTrack) { BBClick = "We have turned on the 'Track Clicks' setting for you because it was off. " + BBClick; }
                                            sdk.ButterBar.showMessage({ html: BBClick, time: 10000 });
                                        }
                                    });
                                    if (gmFifthBumpAction !== null) {
                                        fifthbumpaction.value = gmFifthBumpAction;
                                        if (fifthbumpaction.value == 'a') {
                                            //change text for custom message
                                            document.getElementById(settingsID + "CM5").innerHTML = "Send custom message alone:";
                                        } else {
                                            document.getElementById(settingsID + "CM5").innerHTML = "Send custom message above original:";
                                        }
                                    }
                                    $('#' + settingsID + 'FifthBumpCustom').on('change', function () {
                                        gmFifthBumpCustom = $('#' + settingsID + 'FifthBumpCustom').val();
                                    });
                                    fifthbumpaddedtext.addEventListener('change', function () {
                                        gmFifthBumpAddedText = fifthbumpaddedtext.value;
                                    });
                                    fifthbumpdays.addEventListener('keyup', function (e) {
                                        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
                                            //display error message
                                            sdk.ButterBar.showMessage({ html: "Please Enter Numeric Value", time: 10000, className: "redbb" });
                                            fifthbumpdays.value = fifthbumpdays.value.replace(/\D/g, '');
                                            return false;
                                        }
                                        else {
                                            gmFifthBumpDays = fifthbumpdays.value;
                                        }
                                    });
                                    if (gmFifthBumpDays !== null) {
                                        fifthbumpdays.value = gmFifthBumpDays;
                                    }
                                    if (gmFifthBumpAddedText !== null) {
                                        fifthbumpaddedtext.value = gmFifthBumpAddedText;
                                    }
                                    if (gmFifthBump == "show") {
                                        fifthbump.style.display = 'block';
                                    } else {
                                        fifthbump.style.display = 'none';
                                    }
                                    //*************
                                    sixthbumpaction.addEventListener('change', function () {
                                        gmSixthBumpAction = sixthbumpaction.value;
                                        if (sixthbumpaction.value == 'all') {
                                            //change text for custom message
                                            document.getElementById(settingsID + "CM6").innerHTML = "Send custom message alone:";
                                            sdk.ButterBar.showMessage({ html: "Keep in mind that choosing ALL will send the follow-up to everyone in the original campaign and make sure you have at least one trackable link in your email.", time: 10000 });
                                        } else {
                                            document.getElementById(settingsID + "CM6").innerHTML = "Send custom message above original:";
                                        }
                                        if (sixthbumpaction.value == 'noclick') {
                                            var BBClick = "Before using this option, make sure you have at least one trackable link in your email. .";
                                            //if (ForceClickTrack) { BBClick = "We have turned on the 'Track Clicks' setting for you because it was off. " + BBClick; }
                                            sdk.ButterBar.showMessage({ html: BBClick, time: 10000 });
                                        }
                                    });
                                    if (gmSixthBumpAction !== null) {
                                        sixthbumpaction.value = gmSixthBumpAction;
                                        if (sixthbumpaction.value == 'a') {
                                            //change text for custom message
                                            document.getElementById(settingsID + "CM6").innerHTML = "Send custom message alone:";
                                        } else {
                                            document.getElementById(settingsID + "CM6").innerHTML = "Send custom message above original:";
                                        }
                                    }
                                    $('#' + settingsID + 'SixthBumpCustom').on('change', function () {
                                        gmSixthBumpCustom = $('#' + settingsID + 'SixthBumpCustom').val();
                                    });
                                    sixthbumpaddedtext.addEventListener('change', function () {
                                        gmSixthBumpAddedText = sixthbumpaddedtext.value;
                                    });
                                    sixthbumpdays.addEventListener('keyup', function (e) {
                                        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
                                            //display error message
                                            sdk.ButterBar.showMessage({ html: "Please Enter Numeric Value", time: 10000, className: "redbb" });
                                            sixthbumpdays.value = secondbumpdays.value.replace(/\D/g, '');
                                            return false;
                                        }
                                        else {
                                            gmSixthBumpDays = sixthbumpdays.value;
                                        }
                                    });
                                    if (gmSixthBumpDays !== null) {
                                        sixthbumpdays.value = gmSixthBumpDays;
                                    }
                                    if (gmSixthBumpAddedText !== null) {
                                        sixthbumpaddedtext.value = gmSixthBumpAddedText;
                                    }
                                    if (gmSixthBump == "show") {
                                        sixthbump.style.display = 'block';
                                    } else {
                                        sixthbump.style.display = 'none';
                                    }
                                    //*************
                                    seventhbumpaction.addEventListener('change', function () {
                                        gmSeventhBumpAction = seventhbumpaction.value;
                                        if (seventhbumpaction.value == 'all') {
                                            //change text for custom message
                                            document.getElementById(settingsID + "CM7").innerHTML = "Send custom message alone:";
                                            sdk.ButterBar.showMessage({ html: "Keep in mind that choosing ALL will send the follow-up to everyone in the original campaign and make sure you have at least one trackable link in your email.", time: 10000 });
                                        } else {
                                            document.getElementById(settingsID + "CM7").innerHTML = "Send custom message above original:";
                                        }
                                        if (seventhbumpaction.value == 'noclick') {
                                            var BBClick = "Before using this option, make sure you have at least one trackable link in your email. .";
                                            //if (ForceClickTrack) { BBClick = "We have turned on the 'Track Clicks' setting for you because it was off. " + BBClick; }
                                            sdk.ButterBar.showMessage({ html: BBClick, time: 10000 });
                                        }
                                    });
                                    if (gmSeventhBumpAction !== null) {
                                        seventhbumpaction.value = gmSeventhBumpAction;
                                        if (seventhbumpaction.value == 'a') {
                                            //change text for custom message
                                            document.getElementById(settingsID + "CM7").innerHTML = "Send custom message alone:";
                                        } else {
                                            document.getElementById(settingsID + "CM7").innerHTML = "Send custom message above original:";
                                        }
                                    }
                                    $('#' + settingsID + 'SeventhBumpCustom').on('change', function () {
                                        gmSeventhBumpCustom = $('#' + settingsID + 'SeventhBumpCustom').val();
                                    });
                                    seventhbumpaddedtext.addEventListener('change', function () {
                                        gmSeventhBumpAddedText = seventhbumpaddedtext.value;
                                    });
                                    seventhbumpdays.addEventListener('keyup', function (e) {
                                        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
                                            //display error message
                                            sdk.ButterBar.showMessage({ html: "Please Enter Numeric Value", time: 10000, className: "redbb" });
                                            seventhbumpdays.value = secondbumpdays.value.replace(/\D/g, '');
                                            return false;
                                        }
                                        else {
                                            gmSeventhBumpDays = seventhbumpdays.value;
                                        }
                                    });
                                    if (gmSeventhBumpDays !== null) {
                                        gmSeventhBumpDays = seventhbumpdays.value;
                                    }
                                    if (gmSeventhBumpAddedText !== null) {
                                        seventhbumpaddedtext.value = gmSeventhBumpAddedText;
                                    }
                                    if (gmSeventhBump == "show") {
                                        seventhbump.style.display = 'block';
                                    } else {
                                        seventhbump.style.display = 'none';
                                    }
                                    //*************
                                    eighthbumpaction.addEventListener('change', function () {
                                        gmEighthBumpAction = eighthbumpaction.value;
                                        if (eighthbumpaction.value == 'all') {
                                            //change text for custom message
                                            document.getElementById(settingsID + "CM8").innerHTML = "Send custom message alone:";
                                            sdk.ButterBar.showMessage({ html: "Keep in mind that choosing ALL will send the follow-up to everyone in the original campaign and make sure you have at least one trackable link in your email.", time: 10000 });
                                        } else {
                                            document.getElementById(settingsID + "CM8").innerHTML = "Send custom message above original:";
                                        }
                                        if (eighthbumpaction.value == 'noclick') {
                                            var BBClick = "Before using this option, make sure you have at least one trackable link in your email. .";
                                            //if (ForceClickTrack) { BBClick = "We have turned on the 'Track Clicks' setting for you because it was off. " + BBClick; }
                                            sdk.ButterBar.showMessage({ html: BBClick, time: 10000 });
                                        }
                                    });
                                    if (gmEighthBumpAction !== null) {
                                        eighthbumpaction.value = gmEighthBumpAction;
                                        if (eighthbumpaction.value == 'a') {
                                            //change text for custom message
                                            document.getElementById(settingsID + "CM8").innerHTML = "Send custom message alone:";
                                        } else {
                                            document.getElementById(settingsID + "CM8").innerHTML = "Send custom message above original:";
                                        }
                                    }
                                    $('#' + settingsID + 'EighthBumpCustom').on('change', function () {
                                        gmEighthBumpCustom = $('#' + settingsID + 'EighthBumpCustom').val();
                                    });
                                    eighthbumpaddedtext.addEventListener('change', function () {
                                        gmEighthBumpAddedText = eighthbumpaddedtext.value;
                                    });
                                    eighthbumpdays.addEventListener('keyup', function (e) {
                                        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
                                            //display error message
                                            sdk.ButterBar.showMessage({ html: "Please Enter Numeric Value", time: 10000, className: "redbb" });
                                            eighthdays.value = eighthbumpdays.value.replace(/\D/g, '');
                                            return false;
                                        }
                                        else {
                                            gmEighthBumpDays = eighthbumpdays.value;
                                        }
                                    });
                                    if (gmEighthBumpDays !== null) {
                                        eighthbumpdays.value = gmEighthBumpDays;
                                    }
                                    if (gmEighthBumpAddedText !== null) {
                                        eighthbumpaddedtext.value = gmEighthBumpAddedText;
                                    }
                                    if (gmEighthBump == "show") {
                                        eighthbump.style.display = 'block';
                                    } else {
                                        eighthbump.style.display = 'none';
                                    }
                                    firstbump.style.display = 'block';

                                    // settings may have changed - tell all checkboxes to update settings
                                    // this one line negates alot of stuff above it
                                    $('.gm-enable-bump').trigger('refresh');
                                    //*********************************************************                         
                                    var OpenTrackingCheckbox = document.getElementById(settingsID + "OpenTracking");
                                    OpenTrackingCheckbox.addEventListener('click', function () {
                                        if (OpenTrackingCheckbox.checked) {
                                            myOpenTracking = "on";
                                        } else {
                                            myOpenTracking = "off";
                                        }
                                    });
                                    var ClickTrackingCheckbox = document.getElementById(settingsID + "ClickTracking");
                                    ClickTrackingCheckbox.addEventListener('click', function () {
                                        if (ClickTrackingCheckbox.checked) {
                                            myClickTracking = "on";
                                            var Click = "Before using this option, make sure you have at least one trackable link in your email."
                                            sdk.ButterBar.showMessage({ html: Click, time: 10000 });
                                        } else {
                                            myClickTracking = "off";
                                        }
                                    });
                                    OpenTrackingCheckbox.checked = false;
                                    ClickTrackingCheckbox.checked = false;
                                    if (gmDebug) {
                                        console.log("done adding event handling for settings box");
                                    }
                                    SettingsFormed = true;
                                }
                            }
                        }, 100)

                        //*****************Setting box formation compvared*************************

                        //Genius Mail setting button
                        composeView.addButton({
                            title: "Genius Mail Settings",
                            type: "SEND_ACTION",
                            orderHint: 1,
                            iconClass: (App.includes("Gmail") ? "GmailClassSettings" : "InboxClassSettings"),
                            hasDropdown: true,
                            onClick: function (event2) {
                                if (gmDebug) {
                                    console.log("***settings arrow clicked");
                                }
                                //we only ever want ONE SettingsBox div to exist in the document at any one time, even with multiple compose windows open
                                if (document.getElementById(settingsID) && SettingsFormed == true) {
                                    //document.removeChild(SettingsBox);
                                    document.getElementById(settingsID).remove();
                                    if (gmDebug) {
                                        console.log("***settings div REMOVED from doc");
                                    }
                                }

                                //this is the event handler for the dropdown being destroyed, either by clicking arrow again or clicking outside of box
                                //div is being removed from doc, but does it still exist?
                                event2.dropdown.once('destroy', () => {
                                    if (gmDebug) {
                                        console.log("***settings DESTROY called");
                                    }

                                    //console.log("destroyed!")
                                    //event2.dropdown.el.removeChild(SettingsBox);
                                    if (document.getElementById(settingsID) && SettingsFormed == true) {
                                        //document.removeChild(SettingsBox);
                                        document.getElementById(settingsID).remove();
                                        if (gmDebug) { console.log("***settings div REMOVED from doc because of destroy"); }
                                    }
                                    //alert("o");
                                });

                                //don't want this to run until we know that state has been loaded or there is no state, but we need to know.
                                //CheckGotState();
                                var clickedSettings = setInterval(function CheckGotState() {

                                    //don't want to display the Settings box until GotState==true, in case the settings need to be loaded if it's already a scheduled draft
                                    //console.log(GotState);
                                    if (SettingsFormed == true) {
                                        console.log("about to clear interval for settings box");
                                        clearInterval(clickedSettings);
                                        ;
                                        //FINALLY, ADDING THE SETTINGS DIV TO THE DROPDOWN ELEMENT PROVIDED BY INBOXSDK
                                        event2.dropdown.el.appendChild(SettingsBox);
                                        // if (LoadedCampaigns==false){
                                        //     LoadedCampaigns = true;
                                        //     LoadCampaigns();
                                    }
                                }, 100);
                            },// closing onclick handler
                        }); //add Genius Mail Setting Button closing

                        //Genius Mail Sending Button
                        composeView.addButton({
                            title: "Click this Genius Mail button instead of Send, and individual emails will be sent to each address in the To field.",
                            type: "SEND_ACTION",
                            orderHint: 0,
                            iconClass: (App.includes("Gmail") ? "GmailClass" : "InboxClass"),
                            hasDropdown: false,
                            onClick: function (event) {
                                ClickGMButton(event);
                            }
                        });
                        //add Genius Mail Sending Button closed
                        //Function for checking Subject Fields as well as Auto Followup options
                        /**
                       *@param {Object} event (Use to pass the button clicked response)
             */
                        function ClickGMButton(event) {
                            if (MainButtonPressed == false) {
                                MainButtonPressed = true;

                                //CheckAuth(true);
                                //this client side Subject check is important, even though we're also checking for subject server-side
                                //if there's a blank subject, then it means user hasn't typed anything in there (obvi), which means that there is no guarantee that a draftId will ever be returned on gm button press. creates odd situation where draftId is being searched, and then if you type something, suddenly it attempts to send mid-typing
                                //forcing a subject client side ensures that draftId will eventually come
                                if ((!composeView.isInlineReplyForm() && composeView.getSubject() == "") && !(composeView.getToRecipients().length > 0 && composeView.getToRecipients()[0].emailAddress.substr(composeView.getToRecipients()[0].emailAddress.length - 8) == "geniusmail.io")) {
                                    sdk.ButterBar.showMessage({ html: "You may not leave the Subject blank when using the Genius Mail button.", time: 10000, className: "redbb" });
                                    MainButtonPressed = false;
                                    return;
                                }
                                else {
                                    composeView.close()
                                    MainButtonPressed == false;
                                }
                                //auto followup validation
                                if (gmFirstBumpBox == "y") {
                                    if (!isNumeric(gmFirstBumpDays) || Number(gmFirstBumpDays) > 180 || Number(gmFirstBumpDays) <= 0) {
                                        sdk.ButterBar.showMessage({ html: "Stage 1 Days must be a number between 1 and 180. Uncheck the box to cancel this Stage.", time: 10000, className: "redbb" });
                                        MainButtonPressed = false;
                                        return;
                                    }
                                    if (gmFirstBumpAction != "noreply" && gmFirstBumpAction != "noopen" && gmFirstBumpAction != "noclick" && gmFirstBumpAction != "all") {
                                        sdk.ButterBar.showMessage({ html: "The Stage 1 Action has not been set to either Didn't Reply, Didn't Open, Didn't Click, or All", time: 10000, className: "redbb" });
                                        MainButtonPressed = false;
                                        return;
                                    }
                                    if (isNumeric(gmFirstBumpDays) && Number(gmFirstBumpDays) > 0) {
                                        if (gmFirstBumpChoice == "c" && gmFirstBumpCustom == "0") {
                                            sdk.ButterBar.showMessage({ html: "You chose to use a custom message for Stage 1, but didn't select an actual message.", time: 10000, className: "redbb" });
                                            MainButtonPressed = false;
                                            return;
                                        }
                                        if (gmFirstBumpChoice == "t" && gmFirstBumpAddedText.trim() == "") {
                                            sdk.ButterBar.showMessage({ html: "You chose follow-up text for Stage 1, but didn't specify any text.", time: 10000, className: "redbb" });
                                            MainButtonPressed = false;
                                            return;
                                        }
                                    }
                                }
                                if (gmSecondBumpBox == "y") {
                                    if (gmFirstBumpBox != "y") {
                                        sdk.ButterBar.showMessage({ html: "You've set a Stage 2 follow-up but you don't have a Stage 1 follow-up. You must activate the Stage 1 follow-up in order to also have a Stage 2 follow-up.", time: 10000, className: "redbb" });
                                        MainButtonPressed = false;
                                        return;
                                    }
                                    if (!isNumeric(gmSecondBumpDays) || Number(gmSecondBumpDays) > 180 || Number(gmSecondBumpDays) <= 0 || Number(gmSecondBumpDays) <= Number(gmFirstBumpDays)) {
                                        sdk.ButterBar.showMessage({ html: "Stage 2 Days must be a number between 1 and 180 and greater than Stage 1's Days. Uncheck the box to cancel this Stage.", time: 10000, className: "redbb" });
                                        MainButtonPressed = false;
                                        return;
                                    }
                                    if (gmSecondBumpAction != "noreply" && gmSecondBumpAction != "noopen" && gmSecondBumpAction != "noclick" && gmSecondBumpAction != "all") {
                                        sdk.ButterBar.showMessage({ html: "The Stage 2 Action has not been set to either Didn't Reply, Didn't Open, Didn't Click, or All", time: 10000, className: "redbb" });
                                        MainButtonPressed = false;
                                        return;
                                    }
                                    if (isNumeric(gmSecondBumpDays) && Number(gmSecondBumpDays) > 0) {
                                        if (gmSecondBumpChoice == "c" && gmSecondBumpCustom == "0") {
                                            sdk.ButterBar.showMessage({ html: "You chose to use a custom message for Stage 2, but didn't select an actual message.", time: 10000, className: "redbb" });
                                            MainButtonPressed = false;
                                            return;
                                        }
                                        if (gmSecondBumpChoice == "t" && gmSecondBumpAddedText.trim() == "") {
                                            sdk.ButterBar.showMessage({ html: "You chose follow-up text for Stage 2, but didn't specify any text.", time: 10000, className: "redbb" });
                                            MainButtonPressed = false;
                                            return;
                                        }
                                    }
                                }
                                if (gmThirdBumpBox == "y") {
                                    if (gmFirstBumpBox != "y" || gmSecondBumpBox != "y") {
                                        sdk.ButterBar.showMessage({ html: "You've set a Stage 3 follow-up but you don't have a Stage 1 and Stage 2 follow-up. You must activate both the Stage 1 and Stage 2 follow-ups in order to also have a Stage 3 follow-up.", time: 10000, className: "redbb", className: "redbb" });
                                        MainButtonPressed = false;
                                        return;
                                    }
                                    if (!isNumeric(gmThirdBumpDays) || Number(gmThirdBumpDays) > 180 || Number(gmThirdBumpDays) <= 0 || Number(gmThirdBumpDays) <= Number(gmSecondBumpDays)) {
                                        sdk.ButterBar.showMessage({ html: "Stage 3 Days must be a number between 1 and 180 and greater than Stage 2's Days. Uncheck the box to cancel this Stage.", time: 10000, className: "redbb" });
                                        MainButtonPressed = false;
                                        return;
                                    }
                                    if (gmThirdBumpAction != "noreply" && gmThirdBumpAction != "noopen" && gmThirdBumpAction != "noclick" && gmThirdBumpAction != "all") {
                                        sdk.ButterBar.showMessage({ html: "The Stage 3 Action has not been set to either Didn't Reply, Didn't Open, Didn't Click, or All", time: 10000, className: "redbb" });
                                        MainButtonPressed = false;
                                        return;
                                    }
                                    if (isNumeric(gmThirdBumpDays) && Number(gmThirdBumpDays) > 0) {
                                        if (gmThirdBumpChoice == "c" && gmThirdBumpCustom == "0") {
                                            sdk.ButterBar.showMessage({ html: "You chose to use a custom message for Stage 3, but didn't select an actual message.", time: 10000, className: "redbb" });
                                            MainButtonPressed = false;
                                            return;
                                        }
                                        if (gmThirdBumpChoice == "t" && gmThirdBumpAddedText.trim() == "") {
                                            sdk.ButterBar.showMessage({ html: "You chose follow-up text for Stage 3, but didn't specify any text.", time: 10000, className: "redbb" });
                                            MainButtonPressed = false;
                                            return;
                                        }
                                    }
                                }
                                if (gmFourthBumpBox == "y") {
                                    if (gmFirstBumpBox != "y" || gmSecondBumpBox != "y" || gmThirdBumpBox != "y") {
                                        sdk.ButterBar.showMessage({ html: "You've set a Stage 4 follow-up but you don't have a Stage 1, 2, and 3 follow-up. You must activate each of the Stage 1, 2, and 3 follow-ups in order to also have a Stage 4 follow-up.", time: 10000, className: "redbb" });
                                        MainButtonPressed = false;
                                        return;
                                    }
                                    if (!isNumeric(gmFourthBumpDays) || Number(gmFourthBumpDays) > 180 || Number(gmFourthBumpDays) <= 0 || Number(gmFourthBumpDays) <= Number(gmThirdBumpDays)) {
                                        sdk.ButterBar.showMessage({ html: "Stage 4 Days must be a number between 1 and 180 and greater than Stage 3's Days. Uncheck the box to cancel this Stage.", time: 10000, className: "redbb" });
                                        MainButtonPressed = false;
                                        return;
                                    }
                                    if (gmFourthBumpAction != "noreply" && gmFourthBumpAction != "noopen" && gmFourthBumpAction != "noclick" && gmFourthBumpAction != "all") {
                                        sdk.ButterBar.showMessage({ html: "The Stage 4 Action has not been set to either Didn't Reply, Didn't Open, Didn't Click, or All", time: 10000, className: "redbb" });
                                        MainButtonPressed = false;
                                        return;
                                    }
                                    if (isNumeric(gmFourthBumpDays) && Number(gmFourthBumpDays) > 0) {
                                        if (gmFourthBumpChoice == "c" && gmFourthBumpCustom == "0") {
                                            sdk.ButterBar.showMessage({ html: "You chose to use a custom message for Stage 4, but didn't select an actual message.", time: 10000, className: "redbb" });
                                            MainButtonPressed = false;
                                            return;
                                        }
                                        if (gmFourthBumpChoice == "t" && gmFourthBumpAddedText.trim() == "") {
                                            sdk.ButterBar.showMessage({ html: "You chose follow-up text for Stage 4, but didn't specify any text.", time: 10000, className: "redbb" });
                                            MainButtonPressed = false;
                                            return;
                                        }
                                    }
                                }
                                if (gmFifthBumpBox == "y") {
                                    if (gmFirstBumpBox != "y" || gmSecondBumpBox != "y" || gmThirdBumpBox != "y" || gmFourthBumpBox != "y") {
                                        sdk.ButterBar.showMessage({ html: "You've set a Stage 5 follow-up but you don't have a Stage 1, 2, 3, and 4 follow-up. You must activate each of the Stage 1, 2, 3, and 4 follow-ups in order to also have a Stage 5 follow-up.", time: 10000, className: "redbb" });
                                        MainButtonPressed = false;
                                        return;
                                    }
                                    if (!isNumeric(gmFifthBumpDays) || Number(gmFifthBumpDays) > 180 || Number(gmFifthBumpDays) <= 0 || Number(gmFifthBumpDays) <= Number(gmFourthBumpDays)) {
                                        sdk.ButterBar.showMessage({ html: "Stage 5 Days must be a number between 1 and 180 and greater than Stage 4's Days. Uncheck the box to cancel this Stage.", time: 10000, className: "redbb" });
                                        MainButtonPressed = false;
                                        return;
                                    }
                                    if (gmFifthBumpAction != "noreply" && gmFifthBumpAction != "noopen" && gmFifthBumpAction != "noclick" && gmFifthBumpAction != "all") {
                                        sdk.ButterBar.showMessage({ html: "The Stage 5 Action has not been set to either Didn't Reply, Didn't Open, Didn't Click, or All", time: 10000, className: "redbb" });
                                        MainButtonPressed = false;
                                        return;
                                    }
                                    if (isNumeric(gmFifthBumpDays) && Number(gmFifthBumpDays) > 0) {
                                        if (gmFifthBumpChoice == "c" && gmFifthBumpCustom == "0") {
                                            sdk.ButterBar.showMessage({ html: "You chose to use a custom message for Stage 5, but didn't select an actual message.", time: 10000, className: "redbb" });
                                            MainButtonPressed = false;
                                            return;
                                        }
                                        if (gmFifthBumpChoice == "t" && gmFifthBumpAddedText.trim() == "") {
                                            sdk.ButterBar.showMessage({ html: "You chose follow-up text for Stage 5, but didn't specify any text.", time: 10000, className: "redbb" });
                                            MainButtonPressed = false;
                                            return;
                                        }
                                    }
                                }
                                if (gmSixthBumpBox == "y") {
                                    if (gmFirstBumpBox != "y" || gmSecondBumpBox != "y" || gmThirdBumpBox != "y" || gmFourthBumpBox != "y" || gmFifthBumpBox != "y") {
                                        sdk.ButterBar.showMessage({ html: "You've set a Stage 6 follow-up but you don't have a Stage 1, 2, 3, 4, and 5 follow-up. You must activate each of the Stage 1, 2, 3, 4, and 5 follow-ups in order to also have a Stage 6 follow-up.", time: 10000, className: "redbb" });
                                        MainButtonPressed = false;
                                        return;
                                    }
                                    if (!isNumeric(gmSixthBumpDays) || Number(gmSixthBumpDays) > 180 || Number(gmSixthBumpDays) <= 0 || Number(gmSixthBumpDays) <= Number(gmFifthBumpDays)) {
                                        sdk.ButterBar.showMessage({ html: "Stage 6 Days must be a number between 1 and 180 and greater than Stage 5's Days. Uncheck the box to cancel this Stage.", time: 10000, className: "redbb" });
                                        MainButtonPressed = false;
                                        return;
                                    }
                                    if (gmSixthBumpAction != "noreply" && gmSixthBumpAction != "noopen" && gmSixthBumpAction != "noclick" && gmSixthBumpAction != "all") {
                                        sdk.ButterBar.showMessage({ html: "The Stage 6 Action has not been set to either Didn't Reply, Didn't Open, Didn't Click, or All", time: 10000, className: "redbb" });
                                        MainButtonPressed = false;
                                        return;
                                    }
                                    if (isNumeric(gmSixthBumpDays) && Number(gmSixthBumpDays) > 0) {
                                        if (gmSixthBumpChoice == "c" && gmSixthBumpCustom == "0") {
                                            sdk.ButterBar.showMessage({ html: "You chose to use a custom message for Stage 6, but didn't select an actual message.", time: 10000, className: "redbb" });
                                            MainButtonPressed = false;
                                            return;
                                        }
                                        if (gmSixthBumpChoice == "t" && gmSixthBumpAddedText.trim() == "") {
                                            sdk.ButterBar.showMessage({ html: "You chose follow-up text for Stage 6, but didn't specify any text.", time: 10000, className: "redbb" });
                                            MainButtonPressed = false;
                                            return;
                                        }
                                    }
                                }
                                if (gmSeventhBumpBox == "y") {
                                    if (gmFirstBumpBox != "y" || gmSecondBumpBox != "y" || gmThirdBumpBox != "y" || gmFourthBumpBox != "y" || gmFifthBumpBox != "y" || gmSixthBumpBox != "y") {
                                        sdk.ButterBar.showMessage({ html: "You've set a Stage 7 follow-up but you don't have a Stage 1, 2, 3, 4, 5, and 6 follow-up. You must activate each of the Stage 1, 2, 3, 4, 5, and 6 follow-ups in order to also have a Stage 7 follow-up.", time: 10000, className: "redbb" });
                                        MainButtonPressed = false;
                                        return;
                                    }
                                    if (!isNumeric(gmSeventhBumpDays) || Number(gmSeventhBumpDays) > 180 || Number(gmSeventhBumpDays) <= 0 || Number(gmSeventhBumpDays) <= Number(gmSixthBumpDays)) {
                                        sdk.ButterBar.showMessage({ html: "Stage 7 Days must be a number between 1 and 180 and greater than Stage 6's Days. Uncheck the box to cancel this Stage.", time: 10000, className: "redbb" });
                                        MainButtonPressed = false;
                                        return;
                                    }
                                    if (gmSeventhBumpAction != "noreply" && gmSeventhBumpAction != "noopen" && gmSeventhBumpAction != "noclick" && gmSeventhBumpAction != "all") {
                                        sdk.ButterBar.showMessage({ html: "The Stage 7 Action has not been set to either Didn't Reply, Didn't Open, Didn't Click, or All", time: 10000, className: "redbb" });
                                        MainButtonPressed = false;
                                        return;
                                    }
                                    if (isNumeric(gmSeventhBumpDays) && Number(gmSeventhBumpDays) > 0) {
                                        if (gmSeventhBumpChoice == "c" && gmSeventhBumpCustom == "0") {
                                            sdk.ButterBar.showMessage({ html: "You chose to use a custom message for Stage 7, but didn't select an actual message.", time: 10000, className: "redbb" });
                                            MainButtonPressed = false;
                                            return;
                                        }
                                        if (gmSeventhBumpChoice == "t" && gmSeventhBumpAddedText.trim() == "") {
                                            sdk.ButterBar.showMessage({ html: "You chose follow-up text for Stage 7, but didn't specify any text.", time: 10000, className: "redbb" });
                                            MainButtonPressed = false;
                                            return;
                                        }
                                    }
                                }
                                if (gmEighthBumpBox == "y") {
                                    if (gmFirstBumpBox != "y" || gmSecondBumpBox != "y" || gmThirdBumpBox != "y" || gmFourthBumpBox != "y" || gmFifthBumpBox != "y" || gmSixthBumpBox != "y" || gmSeventhBumpBox != "y") {
                                        sdk.ButterBar.showMessage({ html: "You've set a Stage 8 follow-up but you don't have a Stage 1, 2, 3, 4, 5, 6, and 7 follow-up. You must activate each of the Stage 1, 2, 3, 4, 5, 6, and 7 follow-ups in order to also have a Stage 8 follow-up.", time: 10000, className: "redbb" });
                                        MainButtonPressed = false;
                                        return;
                                    }
                                    if (!isNumeric(gmEighthBumpDays) || Number(gmEighthBumpDays) > 180 || Number(gmEighthBumpDays) <= 0 || Number(gmEighthBumpDays) <= Number(gmSeventhBumpDays)) {
                                        sdk.ButterBar.showMessage({ html: "Stage 8 Days must be a number between 1 and 180 and greater than Stage 7's Days. Uncheck the box to cancel this Stage.", time: 10000, className: "redbb" });
                                        MainButtonPressed = false;
                                        return;
                                    }
                                    if (gmEighthBumpAction != "noreply" && gmEighthBumpAction != "noopen" && gmEighthBumpAction != "noclick" && gmEighthBumpAction != "all") {
                                        sdk.ButterBar.showMessage({ html: "The Stage 8 Action has not been set to either Didn't Reply, Didn't Open, Didn't Click, or All", time: 10000, className: "redbb" });
                                        MainButtonPressed = false;
                                        return;
                                    }
                                    if (isNumeric(gmEighthBumpDays) && Number(gmEighthBumpDays) > 0) {
                                        if (gmEighthBumpChoice == "c" && gmEighthBumpCustom == "0") {
                                            sdk.ButterBar.showMessage({ html: "You chose to use a custom message for Stage 8, but didn't select an actual message.", time: 10000, className: "redbb" });
                                            MainButtonPressed = false;
                                            return;
                                        }
                                        if (gmEighthBumpChoice == "t" && gmEighthBumpAddedText.trim() == "") {
                                            sdk.ButterBar.showMessage({ html: "You chose follow-up text for Stage 8, but didn't specify any text.", time: 10000, className: "redbb" });
                                            MainButtonPressed = false;
                                            return;
                                        }
                                    }
                                }
                                GMPressCallBack(composeView);
                            }
                            else {
                                //tell user to stop clicking
                                sdk.ButterBar.showMessage({ html: "You already clicked the Genius Mail button. Please wait while that first request is processed...", time: 10000, className: "redbb" });
                            }
                        }// ClickGMButton function closed
                        //Function for Launching Connect To GeniusMail funtion and Checking for Draft id
                        function GMPressCallBack(composeView) {
                            if ((composeView.isInlineReplyForm()) || !((composeView.getToRecipients().length > 4000))) {
                                bbm = sdk.ButterBar.showMessage({ text: "Please wait for Genius Mail..." });
                                var clickedGMButton = setInterval(function IsDraftIDReady() {
                                    if (ComposeDraftID != "") {
                                        console.log(ComposeDraftID);
                                        //GenerateSendUrl(ComposeDraftID);
                                        clearInterval(clickedGMButton);
                                        //make sure draftId exists
                                        if (ComposeDraftID != null) {
                                            console.log(ComposeDraftID);
                                            if (composeView.getToRecipients().length > 0) {
                                                setTimeout(function () {
                                                    ConnectToGeniusMail();
                                                }, 3000);
                                            }
                                            else {
                                                ConnectToGeniusMail();
                                            }
                                        }
                                        //the MessageID exists, but we haven't yet found the DraftID for the MessageID via AJAX
                                        else {
                                            sdk.ButterBar.showMessage({ html: "You were too fast for us! Please wait just a second and then hit the Genius Mail button again.\nIf this error persists after a few more seconds, try re-loading Gmail in Chrome. That usually fixes it.", time: 10000, className: "redbb" });
                                            bb.destroy();
                                            MainButtonPressed = false;
                                        }
                                    }
                                    else {
                                        console.log("GM: draft id apparently not ready, trying in a sec");
                                        //could count iterations here, and if say, 10x, and still draftid not ready, then show error
                                    }
                                }, 1000);
                            } // closing check for > 2K recips
                            else {
                                sdk.ButterBar.showMessage({ html: "You can't have more than 4,000 email addresses in the To field, but you can send to more than 4,000 email addresses using the Google Sheets integration. Copy/paste your email addresses into a Google Sheets spreadsheet.", time: 10000, className: "redbb" });
                                MainButtonPressed = false;
                            }
                        }
                        //Final Funcction for Sending the mail through Genius Mail
                        function ConnectToGeniusMail() {
                            console.log("connect to gm launched")
                            payloads.email = email_address;
                            console.log("email address", email_address)
                            if (ComposeDraftID != null) {
                                payloads.draftid = ComposeDraftID;
                                console.log(payloads.draftid);
                                console.log(payloads)
                            }
                            if (myOpenTracking == "on") {
                                payloads.open = true;
                                console.log("OpenTracking on")
                            }
                            if (myClickTracking == "on") {
                                payloads.click = true;
                                console.log("ClickTracking on")
                            }
                            //****auto follow up feature
                            if (gmFirstBumpBox == "y") {
                                FirstStage.FirstBumpDays = gmFirstBumpDays;
                                if (gmFirstBumpChoice == "t") {
                                    FirstStage.FirstBumpAddedText = gmFirstBumpAddedText;
                                }
                                if (gmFirstBumpChoice == "c") {
                                    FirstStage.FirstBumpAddedText = gmFirstBumpCustom
                                }
                                console.log(FirstStage.FirstBumpAddedText)
                                FirstStage.FirstBumpAction = gmFirstBumpAction;
                                AF.push(FirstStage)
                                console.log("First stage AF payloads", FirstStage)
                                console.log("first satage Array of AF payloads", AF)
                            }
                            if (gmSecondBumpBox == "y") {
                                SecondStage.SecondBumpDays = gmSecondBumpDays;
                                if (gmSecondBumpChoice == "t") {
                                    SecondStage.SecondBumpAddedText = gmSecondBumpAddedText;
                                }
                                if (gmSecondBumpChoice == "c") {
                                    SecondStage.SecondBumpAddedText = gmSecondBumpCustom
                                }
                                SecondStage.SecondBumpAction = gmSecondBumpAction;
                                AF.push(SecondStage)
                                console.log("Second stage AF payloads", SecondStage)
                                console.log("second stage Array of AF payloads", AF)
                            }
                            if (gmThirdBumpBox == "y") {
                                ThirdStage.ThirdBumpDays = gmThirdBumpDays;
                                if (gmThirdBumpChoice == "t") {
                                    ThirdStage.ThirdBumpAddedText = gmThirdBumpAddedText;
                                }
                                if (gmThirdBumpChoice == "c") {
                                    ThirdStage.ThirdBumpAddedText = gmThirdBumpCustom
                                }
                                ThirdStage.ThirdBumpAddedText = gmThirdBumpAddedText;
                                ThirdStage.ThirdBumpAction = gmThirdBumpAction;
                                AF.push(ThirdStage)
                                console.log("Thirdstage AF payloads", ThirdStage)
                                console.log("third stage Array of AF payloads", AF)
                            }
                            if (gmFourthBumpBox == "y") {
                                FourthStage.FourthBumpDays = gmFourthBumpDays;
                                if (gmFourthBumpChoice == "t") {
                                    FourthStage.FourthBumpAddedText = gmFourthBumpAddedText;
                                }
                                if (gmFourthBumpChoice == "c") {
                                    FourthStage.FourthBumpAddedText = gmFourthBumpCustom
                                }
                                FourthStage.FourthBumpAction = gmFourthBumpAction;
                                AF.push(FourthStage)
                                console.log("Fourth stage AF payloads", FourthStage)
                                console.log("fourth stage Array of AF payloads", AF)
                            }
                            if (gmFifthBumpBox == "y") {
                                FifthStage.FifthBumpDays = gmFifthBumpDays;
                                if (gmFifthBumpChoice == "t") {
                                    FifthStage.FifthBumpAddedText = gmFifthBumpAddedText;
                                }
                                if (gmFifthBumpChoice == "c") {
                                    FifthStage.FifthBumpAddedText = gmFifthBumpCustom
                                }
                                FifthStage.FifthBumpAction = gmFifthBumpAction;
                                AF.push(FifthStage)
                                console.log("Fifth stage AF payloads", FifthStage)
                                console.log("fifth stage Array of AF payloads", AF)
                            }
                            if (gmSixthBumpBox == "y") {
                                SixthStage.SixthBumpDays = gmSixthBumpDays;
                                if (gmSixthBumpChoice == "t") {
                                    SixthStage.SixthBumpAddedText = gmSixthBumpAddedText;
                                }
                                if (gmSixthBumpChoice == "c") {
                                    SixthStage.SixthBumpAddedText = gmSixthBumpCustom
                                }
                                SixthStage.SixthBumpAction = gmSixthBumpAction;
                                AF.push(SixthStage)
                                console.log("Sixth stage AF payloads", SixthStage)
                                console.log("sixth stage Array of AF payloads", AF)
                            }
                            if (gmSeventhBumpBox == "y") {
                                SeventhStage.SeventhBumpDays = gmSeventhBumpDays;
                                if (gmSeventhBumpChoice == "t") {
                                    SeventhStage.SeventhBumpAddedText = gmSeventhBumpAddedText;
                                }
                                if (gmSeventhBumpChoice == "c") {
                                    SeventhStage.SeventhBumpAddedText = gmSeventhBumpCustom
                                }
                                SeventhStage.SeventhBumpAction = gmSeventhBumpAction;
                                AF.push(SeventhStage)
                                console.log("Seventh stage AF payloads", SeventhStage)
                                console.log("seventh stage Array of AF payloads", AF)
                            }
                            if (gmEighthBumpBox == "y") {
                                EighthStage.EighthBumpDays = gmEighthBumpDays;
                                if (gmEighthBumpChoice == "t") {
                                    EighthStage.EighthBumpAddedText = gmEighthBumpAddedText;
                                }
                                if (gmEighthBumpChoice == "c") {
                                    EighthStage.EighthBumpAddedText = gmEighthBumpCustom
                                }
                                EighthStage.EighthBumpAction = gmEighthBumpAction;
                                AF.push(EighthStage)
                                console.log("Eighth stage AF payloads", EighthStage)
                                console.log("eighth stage Array of AF payloads", AF)
                            }
                            console.log("Complete Array of AF payloads", AF)
                            payloads.AutoFollowUp = AF;
                            console.log("Whole mail sending payload is here", payloads);
                            fetch(config.baseurl + "/users/sendMail", {
                                method: 'POST', // or 'PUT'
                                // data can be `string` or {object}!
                                headers: {
                                    "Accept": "application/json",
                                    "Content-Type": "application/json",
                                    "Access-Control-Allow-Origin": "*",
                                },
                                body: JSON.stringify(
                                    payloads
                                )
                            })
                                .then((response) => response.json())
                                .then(function (resultSendMail) {
                                    console.log('Success:', resultSendMail);
                                    if (resultSendMail.Status == 200) {
                                        bbm.destroy();

                                        sdk.ButterBar.showMessage({ html: "Congratulations ! You Did it ! Your " + resultSendMail.message + " through Genius Mail!!" });

                                        localStorage.setItem("myOpenTracking", myOpenTracking);
                                        console.log(localStorage.getItem("myOpenTracking"));
                                        localStorage.setItem("myClickTracking", myClickTracking);
                                        console.log(localStorage.getItem("myClickTracking"));
                                        localStorage.setItem("gmFirstBumpDays", gmFirstBumpDays);
                                        console.log(localStorage.getItem("gmFirstBumpDays"));
                                        localStorage.setItem("gmFirstBumpAddedText", gmFirstBumpAddedText);
                                        console.log(localStorage.getItem("gmFirstBumpAddedText"));
                                        localStorage.setItem("gmSecondBumpDays", gmSecondBumpDays);
                                        localStorage.setItem("gmSecondBumpAddedText", gmSecondBumpAddedText);
                                        localStorage.setItem("gmThirdBumpDays", gmThirdBumpDays);
                                        localStorage.setItem("gmThirdBumpAddedText", gmThirdBumpAddedText);
                                        localStorage.setItem("gmFourthBumpDays", gmFourthBumpDays);
                                        localStorage.setItem("gmFourthBumpAddedText", gmFourthBumpAddedText);
                                        localStorage.setItem("gmFifthBumpDays", gmFifthBumpDays);
                                        localStorage.setItem("gmFifthBumpAddedText", gmFifthBumpAddedText);
                                        localStorage.setItem("gmSixthBumpDays", gmSixthBumpDays);
                                        localStorage.setItem("gmSixthBumpAddedText", gmSixthBumpAddedText);
                                        localStorage.setItem("gmSeventhBumpDays", gmSeventhBumpDays);
                                        localStorage.setItem("gmSeventhBumpAddedText", gmSeventhBumpAddedText);
                                        localStorage.setItem("gmEighthBumpDays", gmEighthBumpDays);
                                        localStorage.setItem("gmEighthBumpAddedText", gmEighthBumpAddedText);
                                        MainButtonPressed = false;
                                    }
                                    if (resultSendMail.status == 500) {
                                        bbm.destroy();
                                        MainButtonPressed = false;
                                        LaunchAuth(2, email_address)
                                    }
                                }).catch(function (error) {
                                    sdk.ButterBar.showMessage({ html: "Genius Mail:" + error + " Try Again ", time: 10000, className: "redbb" })
                                    MainButtonPressed = false;
                                });
                            GMLaunchedCompose = false;
                            SheetLaunched = false;
                            payloads = {};
                            AF = [];
                            console.log("payloads after sending mail", payloads)
                            console.log("Af payloads after sending mail", payloads)
                            console.log(GMLaunchedCompose);

                        }//connect to geniusmail function cosed
                    }//Inbox inline closed

                    if (App.includes("Gmail")) {
                        //trying to modify inboxsdk styles
                        var elements = document.querySelectorAll('.inboxsdk__compose_sendButton');
                        for (var i = 0; i < elements.length; i++) {
                            //elements[i].style.removeProperty('background-color');
                            elements[i].style.backgroundColor = "transparent";
                            elements[i].style.paddingLeft = "0px";
                            elements[i].style.paddingRight = "6px";
                            elements[i].style.backgroundImage = "none";
                            elements[i].style.borderColor = "transparent";
                            if (App == "newGmail") {
                                elements[i].style.paddingRight = "0px";
                                //just for settings button
                                if (elements[i].getAttribute("aria-label") == "gm Settings") {
                                    elements[i].style.marginLeft = "0px";
                                }
                            }
                        }
                        var elements2 = document.querySelectorAll('.GmailClass');
                        for (var i = 0; i < elements2.length; i++) {
                            if (App == "newGmail") {
                                elements2[i].style.height = "36px";
                                elements2[i].style.fontSize = "14px";
                                //elements2[i].style.lineHeight = "2.7em";
                                elements2[i].style.width = "55px";
                                elements2[i].style.border = "none";
                                elements2[i].style.padding = "5px 5px 4px 5px";
                                elements2[i].style.alignItems = "center";
                                elements2[i].style.display = "inline-flex";
                                elements2[i].style.justifyContent = "center";
                                elements2[i].style.position = "relative";
                                elements2[i].style.zIndex = "0";
                                elements2[i].style.borderRadius = "4px 0px 0px 4px";
                                elements2[i].style.boxSizing = "border-box";
                                elements2[i].style.varterSpacing = ".15px";
                                elements2[i].style.fontFamily = "'Google Sans',Roboto,RobotoDraft,Helvetica,Arial,sans-serif";
                                elements2[i].style.backgroundImage = "none";
                                elements2[i].style.backgroundColor = "rgb(48, 174, 80)";
                            } else {
                                elements2[i].style.height = "29px";
                                elements2[i].style.fontSize = "8pt";
                                elements2[i].style.lineHeight = "2.7em";
                            }
                        }
                        var elements3 = document.querySelectorAll('.GmailClassSettings');
                        for (var i = 0; i < elements3.length; i++) {
                            if (App == "newGmail") {
                                elements3[i].style.height = "36px";
                                elements3[i].style.borderRadius = "0px 4px 4px 0px";
                            } else {
                                elements3[i].style.height = "29px";
                            }
                        }
                    }
                }); //Register Handlerview closed
            }//genius mail funtion closed

            // Function for Launching New Compose View Window
            /**
            *@param {Array of String} ToRecipients (Use to store the value of al the spreadsheed email addresses after choosing Spreadsheet)
              */
            function LaunchCompose(ToRecipients) {
                console.log("opening new compose view window")
                sdk.Compose.openNewComposeView().then(function (composeviewobject) {
                    GMLaunchedCompose = true;
                    console.log("GMLaunchedCompose Launched");
                    if (gmDebug) {
                        console.log("***composeview launched");
                    }
                    //GMLaunchedCompose = true;
                    console.log("***composeview launched true");
                    composeviewobject.setToRecipients([ToRecipients]);
                    if (gmDebug) {
                        console.log("To address set")
                    }
                    ComposeTagger = ToRecipients;
                    // }
                    //}
                })
            } //launchCompose closed   

            //Function for Genius Mail Extension Login
            /**
            * @param {String} UserEmail (Existing email of the current gmail user)
            */
            function LaunchLogin(UserEmail) {

                var emailaddress = UserEmail
                console.log("Login email", emailaddress)
                var LoginDiv = document.createElement("div");
                LoginDiv.style.display = "none";
                LoginDiv.setAttribute("id", "LoginDiv");

                var HTMLString = "<div class='app_logo'><img src='https://s3.amazonaws.com/tier5.us/gmext/canvas/GM_logo.png'></div><p>Login to your account to continue with Genius Mail</p>";
                HTMLString = HTMLString + "<div style='text-align:center'><small id='error'></small></div>";
                HTMLString = HTMLString + "<div id='Login' style='text-align:center';><div id='email'><input type='text' id='email_id'; placeholder='Enter Your Email'></div><div><small id='emailerr'></small></div><div id='passwrd'><input type='password' id='password' placeholder='Enter Your Password'></div><div><small id='passerr'></small></div></div>";
                HTMLString = HTMLString + "<div id=LoginButton>Login</div><p class='forget_pass'><a href='#' id='fpass' style='text-align: right;color:green'>Forgot Password</a></p>";
                //HTMLString = HTMLString + "<div id=LoginButton>Login</div><p class='forget_pass'><a href='#' id='fpass' style='text-align: right;color:green'>Forgot Password</a></p><div class='loginPopupFooter'><p>Powered by <a href='https://www.tier5.us/' target='_blank'>Tier5</a> and the <a href='https://partnership.tier5.us/jr-partner1' target='_blank'>Tier5 Partnership</a></p><div class='social_icons'><a href='https://www.facebook.com/tier5development/' target='_blank'><img src='https://s3.amazonaws.com/tier5.us/gmext/canvas/Path 3.svg'></a><a href='https://www.facebook.com/messages/t/tier5development' target='_blank'><img src='https://s3.amazonaws.com/tier5.us/gmext/canvas/Messanger.svg'></a></div></div>";
                LoginDiv.innerHTML = HTMLString;
                document.body.appendChild(LoginDiv);
                document.getElementById("fpass").addEventListener("click", function () {
                    LoginBPopup.close();
                    ForgotPassword();
                });
                var LoginButtonDiv = document.getElementById("LoginButton");
                LoginButtonDiv.addEventListener("click", function (ev) {
                    ev.preventDefault();
                    console.log("Its loading");
                    console.log("Its clicking");
                    let emailid = $("#email_id").val();
                    let password = $("#password").val();
                    console.log("Email ", emailid);
                    console.log("Email value ", $("#email_id").val());
                    if (emailid == "" || emailid == undefined || emailid == null) {
                        let emailerrMessage = 'Please Enter Your Email Address';
                        $('#emailerr').removeAttr('style');
                        $('#emailerr').html(emailerrMessage);
                        $('#emailerr').css({ "color": "red", "text-align": "center" });
                        setTimeout(function () {
                            $('#emailerr').fadeOut('fast');
                        }, 3000);
                        return
                    }
                    if (password == "" || password == undefined || password == null) {
                        let passerrMessage = 'Please Enter Your Password';
                        $('#passerr').removeAttr('style');
                        $('#passerr').html(passerrMessage);
                        $('#passerr').css({ "color": "red", "text-align": "center" });
                        setTimeout(function () {
                            $('#passerr').fadeOut('fast');
                        }, 3000);
                        return
                    }
                    fetch(config.kyubiurl + "/login", {
                        method: 'POST', // or 'PUT'
                        // data can be `string` or {object}!
                        mode: "cors", // no-cors, cors, *same-origin
                        headers: {
                            "Content-Type": "application/json",
                            "Access-Control-Allow-Origin": "*",
                        },
                        body: JSON.stringify({
                            extensionId: extId, email: emailid, password: password
                        })
                    })
                        .then((response) => response.json())
                        .then(function (res) {
                            console.log('Success:', res);
                            if (res.status == true) {
                                if (res.token) {
                                    chrome.storage.sync.set({ 'extemail': emailid, 'accessToken': res.token }, function () {
                                        console.log(res.token);
                                        LoginBPopup.close();
                                        OauthStatus(emailaddress, emailid);
                                    })
                                }
                            } else if (res.status == false) {
                                console.log(res.status)
                                console.log(res.status)
                                $('#error').removeAttr('style');
                                $('#error').html(res.message);
                                $('#error').css({ "color": "red", "text-align": "center" });
                                setTimeout(function () {
                                    $('#error').fadeOut('fast');
                                }, 3000);
                            }
                        }).catch(function (error) {
                            sdk.ButterBar.showMessage({ html: "Genius Mail:" + error + " Try Again ", time: 10000, className: "redbb" })
                        })
                });
                let LoginBPopup = $('#LoginDiv').bPopup({ opacity: 0.6, modalClose: false });
            } //LaunchAuth closed

            /**
             * @param {Integer} messagetouser (Use to take input according to the Google Auth Status of user)
             * @param {String} emailid (Existing email of the current gmail user)
               */
            function LaunchAuth(messagetouser, emailid) {

                console.log("launch auth")
                var AuthEmail = emailid;
                console.log("Launchauth email", AuthEmail)

                var wLeft = window.screenLeft ? window.screenLeft : window.screenX;
                var wTop = window.screenTop ? window.screenTop : window.screenY;
                var left = wLeft + (window.innerWidth / 2) - (600 / 2);
                var btop = wTop + (window.innerHeight / 2) - (800 / 2);
                var para = document.createElement("div");
                var HTMLString;
                para.style.display = "none";
                para.setAttribute("id", "AuthDiv");

                if (messagetouser == 1) {
                    HTMLString = "You must connect Genius Mail to your Google account for this to work.";
                } else if (messagetouser == 2) {
                    HTMLString = "This browser isn't connected to your account. Please re-connect.";
                } else if (messagetouser == 3) {
                    HTMLString = "Google recently made a change to how Google Sheets work, so we need to re-connect your account to your Sheets.";
                }
                HTMLString = HTMLString + "<div id='authbutton'><img src='https://www.gmass.co/Extension2019Images/icon_sign_up_google.png';style='width:100%;max-width:400px'></div></p>";
                para.innerHTML = HTMLString;
                document.body.appendChild(para);
                var elLink = document.getElementById("authbutton");
                elLink.addEventListener("click", function () {
                    fetch(config.baseurl + "/users/getUserInfo", {
                        method: 'POST', // or 'PUT'
                        // data can be `string` or {object}!
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                            "Access-Control-Allow-Origin": "*",
                        },
                        body: JSON.stringify({
                            email: AuthEmail
                        })
                    })
                        .then((response) => response.json())
                        .then(function (response) {
                            console.log('Success:', response);
                            if (response && (response.Status == 200)) {
                                console.log("Its comming here");
                                console.log(response.Authorise)
                                if (response.Authorise == "false") {
                                    window.open(response.url, 'AuthWindow', 'width=600, height=800, top=' + top + ', left=' + left);
                                }
                                else {
                                    if (response.Authorise == "true") {
                                        chrome.storage.sync.set({ 'gauthemail': emailid }, function () {
                                            GeniusMail();
                                        })
                                    }
                                }
                            } else if (response.Status == 400) {
                                //alert("Something Went Wrong");
                            }
                        }).catch(function (error) {
                            sdk.ButterBar.showMessage({ html: "Genius Mail:" + error + " Try Again ", time: 10000, className: "redbb" })
                        })
                    AuthBPopup.close();
                });
                var AuthButton = document.getElementById("authbutton");
                AuthButton.style.textAlign = "center";
                AuthButton.style.cursor = "pointer";

                let AuthBPopup = $('#AuthDiv').bPopup({ opacity: 0.6, modalClose: false })
            } //LaunchAuth function closed

            //Function for Checking the Current Status of Existing User Whether the User is Active or Inactive
            /**
           * @param {String} Eid Email address of existing Gmail User
           * @returns the status of existing user
           */
            function UserStatus(Eid) {
                var email_id = Eid;
                chrome.storage.sync.get(['extemail'], function (resuseremail) {
                    if (resuseremail.extemail == null || resuseremail.extemail == undefined || resuseremail.extemail == "") {
                        LaunchLogin(email_id);
                    }
                    else {
                        console.log("user ext email from local storage", resuseremail.extemail)
                        fetch(config.kyubiurl + "/get-status", {
                            method: 'POST', // or 'PUT'
                            // data can be `string` or {object}!
                            headers: {
                                "Accept": "application/json",
                                "Content-Type": "application/json",
                                "Access-Control-Allow-Origin": "*",
                            },
                            body: JSON.stringify({
                                email: resuseremail.extemail, extId: extId
                            })
                        })
                            .then((response) => response.json())
                            .then(function (response) {
                                console.log('Success:', response);
                                if (response.status == true) {
                                    OauthStatus(email_id, resuseremail.extemail);
                                } else if (response.status == false) {
                                    chrome.storage.sync.remove(['accessToken', 'extemail'], function () {
                                        LaunchLogin(email_id);
                                    });
                                }
                            }).catch(function (error) {
                                sdk.ButterBar.showMessage({ html: "Genius Mail:" + error + " Try Again ", time: 10000, className: "redbb" })
                            })
                    }
                })
            }

            //Function for checking Google Auth Status
            /** @param {String} email (Existing email of the current gmail user)
             * */
            function OauthStatus(email, Ext_email) {
                var Oauthmail = email;
                var Extension_Email = Ext_email;
                console.log("Oauth email", Oauthmail)
                chrome.storage.sync.get(['gauthemail'], function (resuseremailid) {
                    if (resuseremailid.gauthemail != null || resuseremailid.gauthemail != undefined || resuseremailid.gauthemail != "") {
                        console.log("user auth email from local storage", resuseremailid.gauthemail)
                        if (email == resuseremailid.gauthemail) {
                            if (popup == false) {
                                GeniusMail()
                            }
                            else {
                                Dashboard_Popup(Extension_Email);
                            }
                        }
                        else {
                            fetch(config.baseurl + "/users/getUserInfo", {
                                method: 'POST', // or 'PUT'
                                // data can be `string` or {object}!
                                headers: {
                                    "Accept": "application/json",
                                    "Content-Type": "application/json",
                                    "Access-Control-Allow-Origin": "*",
                                },
                                body: JSON.stringify({
                                    email: Oauthmail
                                })
                            })
                                .then((response) => response.json())
                                .then(function (response) {
                                    console.log('Success:', response);
                                    if (response && (response.Status == 200)) {
                                        console.log("Its comming here");
                                        console.log(response.Authorise)
                                        if (response.Authorise == "false") {
                                            LaunchAuth(1, Oauthmail)
                                            // window.open(response.url, 'AuthWindow', 'width=600, height=800, top=' + top + ', left=' + left);
                                        }
                                        else {
                                            if (response.Authorise == "true") {
                                                console.log("user auth status", response.Authorise)
                                                chrome.storage.sync.remove(['gauthemail'], function () {
                                                    chrome.storage.sync.set({ 'gauthemail': Oauthmail }, function () {
                                                        chrome.storage.sync.get(['gauthemail'], function (resuseremailid) {
                                                            if (resuseremailid.gauthemail != null || resuseremailid.gauthemail != undefined || resuseremailid.gauthemail != "") {
                                                                if (popup == false) {
                                                                    GeniusMail()
                                                                }
                                                                else {
                                                                    Dashboard_Popup(Extension_Email);
                                                                }
                                                            }
                                                            else {
                                                                LaunchAuth(1, Oauthmail)
                                                            }
                                                        })
                                                    })
                                                })
                                            }
                                        }
                                    } else if (response.Status == 400) {
                                        //alert("Something Went Wrong");
                                    }
                                }).catch(function (error) {
                                    sdk.ButterBar.showMessage({ html: "Genius Mail:" + error + " Try Again ", time: 10000, className: "redbb" })
                                })
                        }
                    }
                    else {
                        fetch(config.baseurl + "/users/getUserInfo", {
                            method: 'POST', // or 'PUT'
                            // data can be `string` or {object}!
                            headers: {
                                "Accept": "application/json",
                                "Content-Type": "application/json",
                                "Access-Control-Allow-Origin": "*",
                            },
                            body: JSON.stringify({
                                email: Oauthmail
                            })
                        })
                            .then((response) => response.json())
                            .then(function (response) {
                                console.log('Success:', response);
                                if (response && (response.Status == 200)) {
                                    console.log("Its comming here");
                                    console.log(response.Authorise)
                                    if (response.Authorise == "false") {
                                        LaunchAuth(1, Oauthmail)
                                        // window.open(response.url, 'AuthWindow', 'width=600, height=800, top=' + top + ', left=' + left);
                                    }
                                    else {
                                        if (response.Authorise == "true") {
                                            console.log("user auth status", response.Authorise)
                                            chrome.storage.sync.remove(['gauthemail'], function () {
                                                chrome.storage.sync.set({ 'gauthemail': Oauthmail }, function () {
                                                    chrome.storage.sync.get(['gauthemail'], function (resuseremailid) {
                                                        if (resuseremailid.gauthemail != null || resuseremailid.gauthemail != undefined || resuseremailid.gauthemail != "") {
                                                            if (popup == false) {
                                                                GeniusMail()
                                                            }
                                                            else {
                                                                Dashboard_Popup(Extension_Email);
                                                            }
                                                        }
                                                        else {
                                                            LaunchAuth(1, Oauthmail)
                                                        }
                                                    })
                                                })
                                            })
                                        }
                                    }
                                } else if (response.Status == 400) {
                                    //alert("Something Went Wrong");
                                }
                            }).catch(function (error) {
                                sdk.ButterBar.showMessage({ html: "Genius Mail:" + error + " Try Again ", time: 10000, className: "redbb" })
                            })
                    }
                })
            }

            //Function for Opening Genius Mail Dashboard Popup
            /**
            * @param {String} userid (Existing email of the current gmail user)
            */
            function Dashboard_Popup(userid) {

                var DashboardDiv = document.createElement("div");
                DashboardDiv.style.display = "none";
                DashboardDiv.setAttribute("id", "DashboardDiv");

                var HTMLString = "<div class='app_logo';style='text-align:center;margin-bottom:14px';><img src='https://s3.amazonaws.com/tier5.us/gmext/canvas/GM_logo.png'></div><p>User Dashboard</p>";
                HTMLString = HTMLString + "<div id='Dashboard'><h3 style='text-align:center'><strong>" + userid + "</strong></h3><p>Welcome to the Genius Mail Dasboard</p></div><p class='change_pass'><a href='#' id='changepass' style='text-align: right;color:green'>Update Password</a></p>";
                DashboardDiv.innerHTML = HTMLString;
                document.body.appendChild(DashboardDiv);

                document.getElementById("changepass").addEventListener("click", function () {

                    DashboardBPopup.close();
                    ChangePassword();
                });
                var DashboardBPopup = $('#DashboardDiv').bPopup({ opacity: 0.6 });
            }
            //Function for Forgot Password
            function ForgotPassword() {

                console.log("Its hitting forgotpassword");
                var ForgotPass = document.createElement("div");
                ForgotPass.style.display = "none";
                ForgotPass.setAttribute("id", "ForgotPass");

                var HTMLString = "<div class='app_logo';style='text-align:center;margin-bottom:14px';><img src='https://s3.amazonaws.com/tier5.us/gmext/canvas/GM_logo.png'></div><p>Forgot Password</p>";
                HTMLString = HTMLString + "<div style='text-align:center'><small id='errorMessage'></small></div>";
                HTMLString = HTMLString + "<div id='ForgotPassDiv';style='text-align:center';><div id='email'><input type='text' id='emailid'; placeholder='Enter Your Email'></div></div>";
                HTMLString = HTMLString + "<div style='text-align:center'><small id='emailerror'></small></div>";
                HTMLString = HTMLString + "<div id=ForgotPassButton>Submit</div>";
                //HTMLString = HTMLString + "<div id=ForgotPassButton>Submit</div><div class='loginPopupFooter'><p>Powered by <a href='https://www.tier5.us/' target='_blank'>Tier5</a> and the <a href='https://partnership.tier5.us/jr-partner1' target='_blank'>Tier5 Partnership</a></p><div class='social_icons'><a href='https://www.facebook.com/tier5development/' target='_blank'><img src='https://s3.amazonaws.com/tier5.us/gmext/canvas/Path 3.svg'></a><a href='https://www.facebook.com/messages/t/tier5development' target='_blank'><img src='https://s3.amazonaws.com/tier5.us/gmext/canvas/Messanger.svg'></a></div></div>";
                ForgotPass.innerHTML = HTMLString;
                document.body.appendChild(ForgotPass);
                var ForgotPassButtonDiv = document.getElementById("ForgotPassButton");

                ForgotPassButtonDiv.addEventListener("click", function (e) {

                    e.preventDefault();
                    let email = $("#emailid").val();
                    console.log("ForgotPassword Email", email);
                    if (email == "" || email == undefined || email == null) {
                        console.log("Enter your email")
                        let emailerrMsg = 'Please Enter Your Email Address';
                        $('#emailerror').removeAttr('style');
                        $('#emailerror').html(emailerrMsg);
                        $('#emailerror').css({ "color": "red", "text-align": "center" });
                        setTimeout(function () {
                            $('#emailerror').fadeOut('fast');
                        }, 3000);
                        return
                    }
                    fetch(config.kyubiurl + "/generate-password-token", {
                        method: 'POST', // or 'PUT'
                        // data can be `string` or {object}!
                        mode: "cors", // no-cors, cors, *same-origin
                        headers: {
                            "Content-Type": "application/json",
                            "Access-Control-Allow-Origin": "*",
                        },
                        body: JSON.stringify({
                            extId: extId, email: email
                        })
                    })
                        .then((response) => response.json())
                        .then(function (response) {
                            console.log('Success:', response);
                            if (response.status == true) {
                                sdk.ButterBar.showMessage({ html: "Genius Mail:" + response.message, time: 10000 })
                                ForgotPassBPopup.close();
                                //LaunchLogin();
                            } else if (response.status == false) {
                                console.log(response.message)
                                $('#errorMessage').removeAttr('style');
                                $('#errorMessage').html(response.message);
                                $('#errorMessage').css({ "color": "red", "text-align": "center" });
                                setTimeout(function () {
                                    $('#errorMessage').fadeOut('fast');
                                }, 3000);
                            }
                        }).catch(function (error) {
                            sdk.ButterBar.showMessage({ html: "Genius Mail:" + error + " Try Again ", time: 10000, className: "redbb" })
                        })
                });
                let ForgotPassBPopup = $('#ForgotPass').bPopup({ opacity: 0.6, modalClose: false });
            } //Forgot Password Function closed

            //Function for Change Password
            function ChangePassword() {
                console.log("Its hitting UpdatePassword");
                chrome.storage.sync.get(['accessToken'], function (resuserToken) {
                    if (resuserToken.accessToken != null || resuserToken.accessToken != undefined || resuserToken.accessToken != "") {
                        console.log("token", resuserToken.accessToken)
                        var UpdatePassDiv = document.createElement("div");
                        UpdatePassDiv.style.display = "none";
                        UpdatePassDiv.setAttribute("id", "UpdatePassDiv");

                        var HTMLString = "<div class='app_logo';style='text-align:center;margin-bottom:14px';><img src='https://s3.amazonaws.com/tier5.us/gmext/canvas/GM_logo.png'></div><p>Update Password</p>";
                        HTMLString = HTMLString + "<div style='text-align:center'><small id='UpdatePass_errMessage'></small></div>";
                        HTMLString = HTMLString + "<div id='changepassword' style='text-align:center';><div id='currentpassword'><input type='password' id='current_password'; placeholder='Enter Your Current Password'></div><div><small id='currentpasserr'></small></div><div id='newpassword'><input type='password' id='new_password' placeholder='Enter Your New Password'></div><div><small id='newpasserr'></small></div><div id='reenternewpass'><input type='password' id='retypenew_password'; placeholder='Retype Your New Password'></div><div><small id='retypenewpasserr'></small></div></div>";
                        HTMLString = HTMLString + "<div id=UpdatePassButton>Update Password</div><p class='forgot_pass'><a href='#' id='forgotpass' style='text-align: right;color:green'>Forgot Password</a></p>";
                        //HTMLString = HTMLString + "<div id=ForgotPassButton>Submit</div><div class='loginPopupFooter'><p>Powered by <a href='https://www.tier5.us/' target='_blank'>Tier5</a> and the <a href='https://partnership.tier5.us/jr-partner1' target='_blank'>Tier5 Partnership</a></p><div class='social_icons'><a href='https://www.facebook.com/tier5development/' target='_blank'><img src='https://s3.amazonaws.com/tier5.us/gmext/canvas/Path 3.svg'></a><a href='https://www.facebook.com/messages/t/tier5development' target='_blank'><img src='https://s3.amazonaws.com/tier5.us/gmext/canvas/Messanger.svg'></a></div></div>";
                        UpdatePassDiv.innerHTML = HTMLString;
                        document.body.appendChild(UpdatePassDiv);
                        document.getElementById("forgotpass").addEventListener("click", function () {
                            UpdatePassBPopup.close();
                            ForgotPassword();
                        });

                        var UpdatePassButtonDiv = document.getElementById("UpdatePassButton");
                        UpdatePassButtonDiv.addEventListener("click", function (e) {
                            e.preventDefault();

                            let currentpassword = $("#current_password").val();
                            console.log("currentPassword ", currentpassword);
                            if (currentpassword == "" || currentpassword == undefined || currentpassword == null) {
                                let currentpassworderrMsg = 'Please Enter your Current Password';
                                $('#currentpasserr').removeAttr('style');
                                $('#currentpasserr').html(currentpassworderrMsg);
                                $('#currentpasserr').css({ "color": "red", "text-align": "center" });
                                setTimeout(function () {
                                    $('#currentpasserr').fadeOut('fast');
                                }, 3000);
                                return
                            }
                            let newpassword = $("#new_password").val();
                            console.log("newPassword ", newpassword);
                            if (newpassword == "" || newpassword == undefined || newpassword == null && newpassword.length < 6) {
                                let newpassworderrMsg = 'Please Enter your New Password';
                                $('#newpasserr').removeAttr('style');
                                $('#newpasserr').html(newpassworderrMsg);
                                $('#newpasserr').css({ "color": "red", "text-align": "center" });
                                setTimeout(function () {
                                    $('#newpasserr').fadeOut('fast');
                                }, 3000);
                                return
                            }
                            if (newpassword.length < 6) {
                                let newpassworderrMsg = 'Your New Password length should be greater than six characters';
                                $('#newpasserr').removeAttr('style');
                                $('#newpasserr').html(newpassworderrMsg);
                                $('#newpasserr').css({ "color": "red", "text-align": "center" });
                                setTimeout(function () {
                                    $('#newpasserr').fadeOut('fast');
                                }, 3000);
                                return
                            }
                            let retypenewpassword = $("#retypenew_password").val();
                            console.log("currentPassword ", retypenewpassword);

                            if (retypenewpassword == "" || retypenewpassword == undefined || retypenewpassword == null) {
                                let retypenewpassworderrMsg = 'Please Retype your New Password';
                                $('#retypenewpasserr').removeAttr('style');
                                $('#retypenewpasserr').html(retypenewpassworderrMsg);
                                $('#retypenewpasserr').css({ "color": "red", "text-align": "center" });
                                setTimeout(function () {
                                    $('#retypenewpasserr').fadeOut('fast');
                                }, 3000);
                                return
                            }
                            console.log("kyubi token", "KYUBI_" + resuserToken.accessToken)
                            fetch(config.kyubiurl + "/update-password", {
                                method: 'POST', // or 'PUT'
                                // data can be `string` or {object}!
                                mode: "cors", // no-cors, cors, *same-origin
                                headers: {
                                    "Content-Type": "application/json",
                                    "Accept": "application/json",
                                    'Authorization': "KYUBI_" + resuserToken.accessToken,
                                    "Access-Control-Allow-Origin": "*"
                                },
                                body: JSON.stringify({
                                    password: currentpassword, newPassword: newpassword, confirmNewPassword: retypenewpassword
                                })
                            })
                                .then((response) => response.json())
                                .then(function (response) {
                                    console.log('Success:', response);
                                    if (response.status == true) {
                                        sdk.ButterBar.showMessage({ html: "Genius Mail:" + response.message, time: 30000 })
                                        UpdatePassBPopup.close();
                                    } else if (response.status == false) {
                                        let errorMsg = "Your New Password and Your Confirmed Password is not equal"
                                        console.log(errorMsg)
                                        $('#UpdatePass_errMessage').removeAttr('style');
                                        $('#UpdatePass_errMessage').html(errorMsg);
                                        $('#UpdatePass_errMessage').css({ "color": "red", "text-align": "center" });
                                        setTimeout(function () {
                                            $('#UpdatePass_errMessage').fadeOut('fast');
                                        }, 3000);
                                    }
                                }).catch(function (error) {
                                    sdk.ButterBar.showMessage({ html: "Genius Mail:" + error + " Try Again ", time: 10000, className: "redbb" })
                                })
                        });
                        let UpdatePassBPopup = $('#UpdatePassDiv').bPopup({ opacity: 0.6, modalClose: false });
                    }
                    else {
                        LaunchLogin(email_address);
                    }
                })
            }

            //Function for Launching Spreadsheet
            function LaunchImport() {
                let bbSheets = sdk.ButterBar.showMessage({ text: "Checking Sheet Permissions....!! Please wait for your Google Sheets or Spreadsheets to load." });
                console.log("Sheets loading")
                fetch(config.baseurl + "/users/getspreadsheetslist", {
                    method: 'POST', // or 'POST'
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                    body: JSON.stringify({
                        email: email_address
                    })
                })
                    .then((response) => response.json())
                    .then(function (resultSheets) {
                        bbSheets.destroy();
                        console.log('Success:', resultSheets);
                        if (resultSheets.status == 200) {
                            console.log("coming")
                            //remove the whole div to start
                            if (document.getElementById('mainsheetsdiv') != null) {
                                console.log("mainsheet div exists");
                                document.getElementById('mainsheetsdiv').remove();
                                console.log("mainsheet div removed");
                            }
                            var MainSheetsDiv = document.createElement("div");
                            MainSheetsDiv.style.color = "black";
                            MainSheetsDiv.style.width = "600px";
                            MainSheetsDiv.style.borderColor = "black";
                            MainSheetsDiv.style.padding = "8px";
                            MainSheetsDiv.style.borderStyle = "solid";
                            MainSheetsDiv.style.backgroundColor = "white";
                            MainSheetsDiv.style.display = "none";
                            MainSheetsDiv.style.marginTop = "20px";
                            MainSheetsDiv.setAttribute("id", "mainsheetsdiv");
                            MainSheetsDiv.innerHTML = "<div><div style=\"text-align: center\"><img width=\"80px\" src=\"https://www.gmass.co/Extension2019Images/google_sheet_1.png\"></div><div style=\"margin-bottom: 20px; text-align: center\">Choose a Google Sheet below.</div><form id=\"SheetsForm\"></form></div>";
                            document.body.appendChild(MainSheetsDiv);

                            var SheetsFormDiv = document.getElementById("SheetsForm");

                            //get rid of the sheets dropdown
                            if (document.getElementById('divsheets') != null) {
                                document.getElementById('divsheets').remove();
                            }

                            //if worksheets dropdown exists remove it
                            if (document.getElementById('divworksheets') != null) {
                                document.getElementById('divworksheets').remove();
                            }
                            //create the sheets div
                            var divSheets = document.createElement("div");
                            divSheets.id = "divsheets";
                            divSheets.style.padding = '3px';
                            divSheets.style.marbinBottom = "4px";
                            divSheets.innerHTML = "<span>Google Sheets:</span>"

                            var WaitingStatus = document.createElement("div");
                            WaitingStatus.id = "waitingstatus";
                            WaitingStatus.style.display = "none";
                            WaitingStatus.style.padding = "3px";
                            WaitingStatus.innerHTML = "<span style='color: blue'>Please wait...</span>";

                            var EverythingButSheetsDD = document.createElement("div");
                            EverythingButSheetsDD.id = "everythingbutsheetsdd";
                            EverythingButSheetsDD.style.display = "none";
                            EverythingButSheetsDD.style.padding = "3px";

                            //create the sheets SELECT
                            let elSheets = document.createElement("select");
                            elSheets.id = "selectsheets";
                            elSheets.style.width = "550px";

                            //adding the Sheets div/dropdown to the Sheets form
                            SheetsFormDiv.appendChild(divSheets);
                            SheetsFormDiv.appendChild(WaitingStatus);
                            SheetsFormDiv.appendChild(EverythingButSheetsDD);
                            divSheets.appendChild(elSheets);
                            var myoption;

                            // //going through the list of sheets and creating option for each of them
                            myoption = document.createElement("option");
                            myoption.text = "";
                            myoption.value = "";
                            elSheets.add(myoption);
                            var arraySheetsLength = resultSheets.sheets.length

                            if (arraySheetsLength == 0) {
                                MainSheetsDiv.innerHTML = "<p style=\"text-align: center; color: red;\"><img src=\"https://s3.amazonaws.com/tier5.us/gmext/canvas/GM_logo.png\"></br>You don't have any Spreadsheet in your Google Drive yet.  Create one now, and then come back here.</br></br>  <form id=\"SheetsForm\"></form></p>";
                            }
                            else {
                                if (arraySheetsLength > 0) {
                                    for (i = 0; i < (arraySheetsLength); i++) {
                                        console.log(resultSheets.sheets[i])
                                        myoption = document.createElement("option");
                                        myoption.text = resultSheets.sheets[i].name;
                                        myoption.value = resultSheets.sheets[i].id;
                                        // //myoption.setAttribute("UpdatedTime");
                                        elSheets.add(myoption);
                                    }
                                }
                            }
                            var divWorksheets = document.createElement("div");
                            divWorksheets.id = "divworksheets";
                            divWorksheets.innerHTML = "Worksheets: ";
                            EverythingButSheetsDD.appendChild(divWorksheets);

                            //styling the CONNECT button
                            var SheetsConnectButton = document.createElement("div");
                            SheetsConnectButton.style.width = "300px";
                            SheetsConnectButton.style.textAlign = "center";
                            SheetsConnectButton.style.color = "white";
                            SheetsConnectButton.style.padding = "9px 5px 9px 12px";
                            SheetsConnectButton.style.fontWeight = "bold";
                            SheetsConnectButton.style.fontSize = "11px";
                            SheetsConnectButton.style.borderRadius = "8px";
                            SheetsConnectButton.style.margin = "auto";
                            SheetsConnectButton.style.backgroundColor = "gray";
                            SheetsConnectButton.style.marginTop = "20px";
                            SheetsConnectButton.style.cursor = "pointer";
                            SheetsConnectButton.innerHTML = "CONNECT TO SPREADSHEET";
                            SheetsConnectButton.id = "ConnectButton";

                            //event handler for clicking the connect button			
                            SheetsConnectButton.addEventListener("click", function () {

                                console.log($('#WorksheetsSelect  option:selected').html());
                                payloads.sheettitle = $('#WorksheetsSelect  option:selected').html();
                                console.log(payloads.sheettitle);
                                payloads.spreadsheetid = elSheets.value;
                                console.log(payloads.spreadsheetid);

                                if (elSheets.value != "default" && elSheets.value != "") {

                                    SheetsConnectButton.innerHTML = "PLEASE WAIT...";
                                    if (payloads.sheettitle == undefined || payloads.sheettitle == null || payloads.sheettitle == "") {
                                        SheetBPopup.close();
                                        sdk.ButterBar.showMessage({ html: "Genius Mail: You didn't choose your WorkSheet !! Try Again and wait for your Worksheet to load", time: 10000, className: "redbb" });
                                    }
                                    else {
                                        var EnsureWorksheetID = setInterval(function () {
                                            if (document.getElementById('WorksheetsSelect').value != "") {
                                                clearInterval(EnsureWorksheetID);

                                                fetch(config.baseurl + "/users/getSheetDetails", {
                                                    method: 'POST', // or 'PUT'
                                                    // data can be `string` or {object}!
                                                    headers: {
                                                        "Accept": "application/json",
                                                        "Content-Type": "application/json",
                                                        "Access-Control-Allow-Origin": "*",
                                                    },
                                                    body: JSON.stringify({
                                                        spreadsheetid: elSheets.value,
                                                        sheettitle: $('#WorksheetsSelect  option:selected').html(),
                                                        email: email_address
                                                    })
                                                })
                                                    .then((response) => response.json())
                                                    .then(function (resultWorkSheetRecipients) {
                                                        console.log('Success:', resultWorkSheetRecipients);
                                                        if (resultWorkSheetRecipients.Status == 200) {
                                                            console.log("Recipients lists is coming");
                                                            console.log("Response", resultWorkSheetRecipients.EmailInfo)
                                                            console.log("Response", resultWorkSheetRecipients.columnInfo)
                                                            if (resultWorkSheetRecipients.columnInfo.length > 0) {
                                                                GeniusMailPersonalization.push(resultWorkSheetRecipients.columnInfo);

                                                                GotState = true;
                                                                console.log("GotState true");
                                                            }
                                                            SheetBPopup.close();
                                                            if (resultWorkSheetRecipients.EmailInfo.length > 0) {
                                                                LaunchCompose(resultWorkSheetRecipients.EmailInfo);
                                                                SheetLaunched = true;
                                                            }
                                                            else {
                                                                if (resultWorkSheetRecipients.EmailInfo.length == null || resultWorkSheetRecipients.EmailInfo.length == "" || resultWorkSheetRecipients.EmailInfo.length == undefined) {
                                                                    var SheetsError = "Your Selected Sheet Doesn't Contain Email Fields!Please Add Atleast One Email Field Inside Your Sheet And Try To Connect Again";
                                                                    sdk.ButterBar.showMessage({ html: "GeniusMail: " + SheetsError, time: 10000, className: "redbb" });
                                                                    if (GeniusMailPersonalization.length > 0) {
                                                                        GeniusMailPersonalization.splice(0, GeniusMailPersonalization.length);
                                                                        console.log(GeniusMailPersonalization);
                                                                    }
                                                                }
                                                            }
                                                        }
                                                        if (resultWorkSheetRecipients.status == 500) {
                                                            sdk.ButterBar.showMessage({ text: "This computer needs to re-connect to your Gmail account.", time: 60000 });
                                                            LaunchAuth(3, email_address)
                                                        }
                                                        else if (App == "oldGmail") {
                                                            if (document.location.href.search("compose=") >= 0) {
                                                                document.location.href = document.location.href + "," + resultWorkSheetRecipients.messageId;
                                                            }
                                                            else {
                                                                var messageId = resultWorkSheetRecipients.messageId;
                                                                document.location.href = document.location.href + "?compose=" + messageId;
                                                            }
                                                        }
                                                    }).catch(function (error) {
                                                        sdk.ButterBar.showMessage({ html: "Genius Mail:" + error + " Try Again ", time: 10000, className: "redbb" })
                                                    })
                                            }
                                        }, 500);
                                    }
                                }
                                else {
                                    sdk.ButterBar.showMessage({ html: "Genius Mail: You didn't choose a spreadsheet.", time: 10000, className: "redbb" });
                                }
                            });
                            SheetsConnectButton.addEventListener("mouseover", function () {
                                if (SheetsConnectButton.style.backgroundColor != "gray") {
                                    SheetsConnectButton.style.backgroundColor = "blue";
                                }
                            });
                            SheetsConnectButton.addEventListener("mouseout", function () {
                                if (SheetsConnectButton.style.backgroundColor != "gray") {
                                    SheetsConnectButton.style.backgroundColor = "#c42329";
                                }
                            });
                            document.getElementById('mainsheetsdiv').appendChild(SheetsConnectButton);
                            var SheetBPopup = $('#mainsheetsdiv').bPopup({
                                opacity: 0.6, modalClose: false
                            });

                            $('#selectsheets').select2({
                                placeholder: "Select spreadsheet",
                                dropdownParent: $('#' + 'mainsheetsdiv'),
                                templateResult: formatSpreadsheets,
                                templateSelection: formatSpreadsheetsResult,
                                selectOnClose: true
                            });
                            if (document.getElementById("select2-selectsheets-container")) {
                                document.getElementById("select2-selectsheets-container").style.fontSize = "12pt";
                                document.getElementById("select2-selectsheets-container").style.paddingLeft = "8px";
                            }
                            if (document.querySelector('[aria-labelledby="select2-selectsheets-container"]')) {
                                document.querySelector('[aria-labelledby="select2-selectsheets-container"]').style.height = "50px";
                                document.querySelector('[aria-labelledby="select2-selectsheets-container"]').style.paddingTop = "15px";
                            }
                            if (document.querySelector('span[aria-labelledby="select2-selectsheets-container"]  > [role="presentation"][class="select2-selection__arrow"]')) {
                                document.querySelector('span[aria-labelledby="select2-selectsheets-container"]  > [role="presentation"][class="select2-selection__arrow"]').style.paddingTop = "30px";
                            }

                            $('#selectsheets').on('change', function (e) {

                                WaitingStatus.style.display = "block";
                                EverythingButSheetsDD.style.display = "none";

                                //creating select for the worksheets
                                SelectWorksheets = document.createElement("select");
                                SelectWorksheets.id = "WorksheetsSelect";
                                SelectWorksheets.style.width = "450px"
                                if (divWorksheets != null) {

                                    //instead of removing it, should remove all the options inside it
                                    //document.getElementById('divworksheets').remove();
                                    removeOptions(SelectWorksheets);
                                    while (divWorksheets.hasChildNodes()) {
                                        divWorksheets.removeChild(divWorksheets.firstChild);
                                    }
                                }
                                if (elSheets.value != "default") {
                                    SheetsConnectButton.style.backgroundColor = "#c42329";
                                    // var data= {"spreadsheetid":elSheets.value}
                                    fetch(config.baseurl + "/users/getnoOfSheet", {
                                        method: 'POST', // or 'PUT'
                                        // data can be `string` or {object}!
                                        headers: {
                                            "Accept": "application/json",
                                            "Content-Type": "application/json",
                                            "Access-Control-Allow-Origin": "*",
                                        },
                                        body: JSON.stringify({
                                            spreadsheetid: elSheets.value,
                                            email: email_address
                                        })
                                    })
                                        .then((response) => response.json())
                                        .then(function (resultWorkSheets) {
                                            console.log('Success:', resultWorkSheets);
                                            if (resultWorkSheets.Status == 200) {
                                                console.log()
                                                WaitingStatus.style.display = "none";
                                                EverythingButSheetsDD.style.display = "block";

                                                for (i = 0; i < (resultWorkSheets.sheetInfo.length); i++) {
                                                    console.log(resultWorkSheets.sheetInfo[i]);

                                                    var WSOption = document.createElement("option");
                                                    WSOption.text = resultWorkSheets.sheetInfo[i].properties.title;
                                                    WSOption.value = resultWorkSheets.sheetInfo[i].properties.sheetId;
                                                    WSOption.setAttribute("Rows", resultWorkSheets.sheetInfo[i].properties.gridProperties.rowCount);
                                                    WSOption.setAttribute("Columns", resultWorkSheets.sheetInfo[i].properties.gridProperties.columnCount);
                                                    SelectWorksheets.add(WSOption);
                                                }

                                                divWorksheets.appendChild(SelectWorksheets);
                                                $('#WorksheetsSelect').select2({
                                                    dropdownParent: $('#' + 'mainsheetsdiv'),
                                                    templateResult: formatWorksheets,
                                                    templateSelection: formatWorksheetsResult,
                                                    disabled: (resultWorkSheets.sheetInfo.length == 1 ? true : false)
                                                    //placeholder: "Select worksheet",
                                                    //create: false
                                                });
                                                if (document.getElementById("select2-WorksheetsSelect-container")) {
                                                    console.log("select2")
                                                    document.getElementById("select2-WorksheetsSelect-container").style.fontSize = "12pt";
                                                    document.getElementById("select2-WorksheetsSelect-container").style.paddingLeft = "8px";
                                                }
                                                if (document.querySelector('[aria-labelledby="select2-WorksheetsSelect-container"]')) {
                                                    document.querySelector('[aria-labelledby="select2-WorksheetsSelect-container"]').style.height = "50px";
                                                    document.querySelector('[aria-labelledby="select2-WorksheetsSelect-container"]').style.paddingTop = "15px";
                                                }
                                                if (document.querySelector('span[aria-labelledby="select2-WorksheetsSelect-container"]  > [role="presentation"][class="select2-selection__arrow"]')) {
                                                    document.querySelector('span[aria-labelledby="select2-WorksheetsSelect-container"]  > [role="presentation"][class="select2-selection__arrow"]').style.paddingTop = "30px";
                                                }
                                            }
                                            if (resultWorkSheets.status == 500) {
                                                sdk.ButterBar.showMessage({ text: "This computer needs to re-connect to your Gmail account.", time: 60000 });
                                                LaunchAuth(2, email_address)
                                            }
                                        }).catch(function (error) {
                                            sdk.ButterBar.showMessage({ html: "Genius Mail:" + error + " Try Again ", time: 10000, className: "redbb" })
                                        })
                                }
                                else {
                                    document.getElementById('ConnectButton').style.backgroundColor = "gray";
                                }

                            });
                        }
                        else {
                            if (resultSheets.status == 500) {
                                sdk.ButterBar.showMessage({ text: "This computer needs to re-connect to your Gmail account.", time: 60000 });
                                LaunchAuth(2, email_address)
                            }
                        }
                    }).catch(function (error) {
                        sdk.ButterBar.showMessage({ html: "Genius Mail:" + error + " Try Again ", time: 10000, className: "redbb" })
                    })
            }//launchimport function closed

            //Function for Loading the Campaign Info For Auto FollowUps
            function AFCampainDetails() {
                fetch(config.baseurl + "/users/loadCAmpaignInfo", {
                    method: 'POST', // or 'PUT'
                    // data can be `string` or {object}!
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                    body: JSON.stringify({
                        email: email_address
                    }),
                })
                    .then((response) => response.json())
                    .then(function (resultAFCampaigns) {
                        console.log('Success:', resultAFCampaigns);
                        if (resultAFCampaigns.status == 200) {
                            console.log("Campaign info - ", JSON.parse(resultAFCampaigns.campaign_info))
                            var AFcampaign_info = JSON.parse(resultAFCampaigns.campaign_info);
                            for (i = 0; i < (AFcampaign_info.length); i++) {
                                console.log("afcampaign", AFcampaign_info[i])
                                AFCampaign.push(AFcampaign_info[i])
                                console.log("afarr", AFCampaign)
                            }
                        }
                        if (resultAFCampaigns.status == 500) {
                            sdk.ButterBar.showMessage({ text: "This computer needs to re-connect to your Gmail account.", time: 60000 });
                            LaunchAuth(2, email_address)
                        }
                    }).catch(function (error) {
                        sdk.ButterBar.showMessage({ html: "Genius Mail:" + error + " Try Again ", time: 10000, className: "redbb" })
                    });
            }
            // AFCampainDetails function closed

            //Function for Launching Manual Follow ups
            function LaunchFollowup() {

                var bbFollowup = sdk.ButterBar.showMessage({ text: "Please wait for your campaigns to load.", time: 60000 });
                fetch(config.baseurl + "/users/loadCAmpaignInfo", {
                    method: 'POST', // or 'PUT'
                    // data can be `string` or {object}!
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                    body: JSON.stringify({
                        email: email_address
                    }),
                })
                    .then((response) => response.json())
                    .then(function (resultCampaigns) {
                        console.log('Success:', resultCampaigns);
                        if (resultCampaigns.status == 200) {
                            console.log("Campaign info - ", JSON.parse(resultCampaigns.campaign_info))
                            bbFollowup.destroy();

                            //remove the whole div to start
                            if (document.getElementById('maincampaignsdiv') != null) {
                                document.getElementById('maincampaignsdiv').remove();
                            }
                            var MainCampaignsDiv = document.createElement("div");
                            MainCampaignsDiv.style.color = "black";
                            MainCampaignsDiv.style.width = "700px";
                            MainCampaignsDiv.style.borderColor = "black";
                            MainCampaignsDiv.style.padding = "8px";
                            MainCampaignsDiv.style.width = "850px";
                            MainCampaignsDiv.style.borderStyle = "solid";
                            MainCampaignsDiv.style.backgroundColor = "white";
                            MainCampaignsDiv.style.display = "none";
                            MainCampaignsDiv.setAttribute("id", "maincampaignsdiv");

                            MainCampaignsDiv.innerHTML = "<p style=\"text-align: center\"><img width=\"305px\" src=\"https://www.gmass.co/Extension2019Images/campaign.png\"><span>Choose a past campaign to send a manual follow-up campaign.</span><form id=\"CampaignForm\"></form>";

                            //adding the div to the document
                            document.body.appendChild(MainCampaignsDiv);
                            var CampaignForm = document.getElementById("CampaignForm");

                            //get rid of the campaigns dropdown
                            if (document.getElementById('divcampaigns') != null) {
                                document.getElementById('divcampaigns').remove();
                            }
                            //if worksheets dropdown exists remove it
                            if (document.getElementById('divbehaviors') != null) {
                                document.getElementById('divbehaviors').remove();
                            }
                            //create the campaigns
                            var divCampaigns = document.createElement("div");
                            divCampaigns.id = "divcampaigns";
                            divCampaigns.style.marginBottom = "10px";
                            divCampaigns.innerHTML = "<span>Past Campaigns:</span>"

                            //create the behaviors SELECT
                            var elCampaigns = document.createElement("select");
                            elCampaigns.id = "selectcampaigns";
                            elCampaigns.style.width = "550px";

                            //adding the campaigns div/dropdown to the div
                            CampaignForm.appendChild(divCampaigns);
                            divCampaigns.appendChild(elCampaigns);

                            //Campaign behaviors varibles

                            var ToCount = 0;
                            var OpenCount = 0;
                            var DidnotOpenCount = 0;
                            var ClickCount = 0;
                            var DidnotClickCount = 0;
                            var DidnotSentCount = 0
                            var SentCount = 0;
                            var OCCount = 0;
                            var ReplyCount = 0;
                            var DidnotReplyCount = 0;
                            var GApiErrorCount = 0;
                            var arr;
                            var toarr;
                            var sentarr = [];
                            var didnotsentarr;
                            var openarr;
                            var didnotopenarr = [];
                            var clickarr;
                            var didnotclickarr = [];
                            var ocarr = [];
                            var replyarr;
                            var didnotreplyarr = [];
                            var GApiErrorarr;
                            var myoption;

                            myoption = document.createElement("option");
                            myoption.text = "";
                            myoption.value = "";
                            elCampaigns.add(myoption);

                            var campaign_info = JSON.parse(resultCampaigns.campaign_info);
                            if (campaign_info.length == 0) {
                                MainCampaignsDiv.innerHTML = "<p style=\"text-align: center; color: red;\"><img src=\"https://s3.amazonaws.com/tier5.us/gmext/canvas/GM_logo.png\"></br>You haven't sent any mass emails with Genius Mail yet. Send one now, and then come back here.</br></br>  <form id=\"CampaignForm\"></form></p>";
                            }
                            else {
                                if (campaign_info.length > 0) {
                                    console.log("campaign_info.length", campaign_info.length);
                                    for (var i = 0; i < campaign_info.length; i++) {
                                        myoption = document.createElement("option");
                                        myoption.text = (campaign_info[i].subject || "");
                                        myoption.setAttribute("subjectName", campaign_info[i].subject || "NO SUBJECT AVAILABLE");
                                        console.log(myoption.getAttribute("subjectName"));
                                        myoption.setAttribute("theDate", campaign_info[i].date);
                                        console.log(myoption.getAttribute("theDate"))
                                        myoption.value = campaign_info[i].campaignid;
                                        console.log(myoption.value);
                                        elCampaigns.add(myoption);
                                    }
                                }
                            }
                            var divBehaviors = document.createElement("div");
                            divBehaviors.id = "divbehaviors";
                            //divBehaviors.innerHTML = "<span style='color: blue'>Please wait...</span>";
                            CampaignForm.appendChild(divBehaviors);
                            var FollowupConnectButton = document.createElement("div");
                            FollowupConnectButton.style.width = "300px";
                            FollowupConnectButton.style.textAlign = "center";
                            FollowupConnectButton.style.color = "white";
                            FollowupConnectButton.style.padding = "9px 5px 9px 12px";
                            FollowupConnectButton.style.fontWeight = "bold";
                            FollowupConnectButton.style.fontSize = "11px";
                            FollowupConnectButton.style.borderRadius = "8px";
                            FollowupConnectButton.style.margin = "auto";
                            FollowupConnectButton.style.backgroundColor = "gray";
                            FollowupConnectButton.style.cursor = "pointer";
                            FollowupConnectButton.innerHTML = "COMPOSE FOLLOW-UP";
                            FollowupConnectButton.id = "FollowupConnectButton";

                            FollowupConnectButton.addEventListener("click", function () {

                                if (elCampaigns.value != "default" && elCampaigns.value != "") {
                                    FollowupConnectButton.innerHTML = "PLEASE WAIT...";
                                    myBPopup.close();
                                    if (document.getElementById('BehaviorsSelect') == null) {
                                        //behaviorType = "s";
                                        sdk.ButterBar.showMessage({ html: "Genius Mail:Your didn't choose any Campaign Behavior", time: 10000, className: "redbb" })
                                    }
                                    else {
                                        // behaviorType = document.getElementById('BehaviorsSelect').value;
                                        if ($('#BehaviorsSelect option:selected').val() == "s") {
                                            if (SentCount > 0 && sentarr.length > 0) {
                                                console.log(sentarr.length);
                                                LaunchCompose(sentarr);
                                            }
                                            else {
                                                sdk.ButterBar.showMessage({ html: "Genius Mail:Your Sent Count is 0!So You can't Launch Follow up for this Option", time: 10000, className: "redbb" });
                                                FollowupConnectButton.innerHTML = "COMPOSE FOLLOW-UP";
                                            }
                                        }
                                        if ($('#BehaviorsSelect option:selected').val() == "ds") {
                                            if (DidnotSentCount > 0 && didnotsentarr.length > 0) {
                                                LaunchCompose(didnotsentarr);
                                            }
                                            else {
                                                sdk.ButterBar.showMessage({ html: "Genius Mail:Your Didnot Sent Count is 0!So You can't Launch Follow up for this Option", time: 10000, className: "redbb" });
                                                FollowupConnectButton.innerHTML = "COMPOSE FOLLOW-UP";
                                            }
                                        }
                                        if ($('#BehaviorsSelect option:selected').val() == "o") {
                                            if (OpenCount > 0 && openarr.length > 0) {
                                                LaunchCompose(openarr);
                                            }
                                            else {
                                                sdk.ButterBar.showMessage({ html: "Genius Mail:Your Open Count is 0!So You can't Launch Follow up for this Option", time: 10000, className: "redbb" });
                                                FollowupConnectButton.innerHTML = "COMPOSE FOLLOW-UP";
                                            }
                                        }
                                        if ($('#BehaviorsSelect option:selected').val() == "p") {
                                            if (DidnotOpenCount > 0 && didnotopenarr.length > 0) {
                                                LaunchCompose(didnotopenarr);
                                            }
                                            else {
                                                sdk.ButterBar.showMessage({ html: "Genius Mail:Your Didnot Open Count is 0!So You can't Launch Follow up for this Option", time: 10000, className: "redbb" });
                                                FollowupConnectButton.innerHTML = "COMPOSE FOLLOW-UP";
                                            }
                                        }
                                        if ($('#BehaviorsSelect option:selected').val() == "c") {
                                            if (ClickCount > 0 && clickarr.length > 0) {
                                                LaunchCompose(clickarr);
                                            }
                                            else {
                                                sdk.ButterBar.showMessage({ html: "Genius Mail:Your Click Count is 0!So You can't Launch Follow up for this Option", time: 10000, className: "redbb" });
                                                FollowupConnectButton.innerHTML = "COMPOSE FOLLOW-UP";
                                            }
                                        }
                                        if ($('#BehaviorsSelect option:selected').val() == "d") {
                                            if (DidnotClickCount > 0 && didnotclickarr.length > 0) {
                                                LaunchCompose(didnotclickarr);
                                            }
                                            else {
                                                sdk.ButterBar.showMessage({ html: "Genius Mail:Your Didnot Click Count is 0!So You can't Launch Follow up for this Option", time: 10000, className: "redbb" });
                                                FollowupConnectButton.innerHTML = "COMPOSE FOLLOW-UP";
                                            }
                                        }
                                        if ($('#BehaviorsSelect option:selected').val() == "oc") {
                                            if (OCCount > 0 && ocarr.length > 0) {
                                                LaunchCompose(ocarr);
                                            }
                                            else {
                                                sdk.ButterBar.showMessage({ html: "Genius Mail:Your Open But Didnot Click Count is 0!So You can't Launch Follow up for this Option", time: 10000, className: "redbb" });
                                                FollowupConnectButton.innerHTML = "COMPOSE FOLLOW-UP";
                                            }
                                        }
                                        if ($('#BehaviorsSelect option:selected').val() == "r") {
                                            if (ReplyCount > 0 && replyarr.length > 0) {
                                                LaunchCompose(replyarr);
                                            }
                                            else {
                                                sdk.ButterBar.showMessage({ html: "Genius Mail:Your Reply Count is 0!So You can't Launch Follow up for this Option", time: 10000, className: "redbb" });
                                                FollowupConnectButton.innerHTML = "COMPOSE FOLLOW-UP";
                                            }
                                        }
                                        if ($('#BehaviorsSelect option:selected').val() == "dr") {
                                            if (DidnotReplyCount > 0 && didnotreplyarr.length > 0) {
                                                LaunchCompose(didnotreplyarr);
                                            }
                                            else {
                                                sdk.ButterBar.showMessage({ html: "Genius Mail:Your Didnot Reply Count is 0!So You can't Launch Follow up for this Option", time: 10000, className: "redbb" });
                                                FollowupConnectButton.innerHTML = "COMPOSE FOLLOW-UP";
                                            }
                                        }
                                        if ($('#BehaviorsSelect option:selected').val() == "gapi") {
                                            if (GApiErrorCount > 0 && GApiErrorarr.length > 0) {
                                                LaunchCompose(GApiErrorarr);
                                            }
                                            else {
                                                sdk.ButterBar.showMessage({ html: "Genius Mail:Your GmailApi Error Count is 0!So You can't Launch Follow up for this Option", time: 10000, className: "redbb" });
                                                FollowupConnectButton.innerHTML = "COMPOSE FOLLOW-UP";
                                            }
                                        }
                                    }
                                }
                                else {
                                    sdk.ButterBar.showMessage({ html: "Genius Mail: You didn't choose a campaign.", time: 10000, className: "redbb" });
                                }
                            });
                            FollowupConnectButton.addEventListener("mouseover", function () {
                                if (FollowupConnectButton.style.backgroundColor != "gray") {
                                    FollowupConnectButton.style.backgroundColor = "blue";
                                }
                            });
                            FollowupConnectButton.addEventListener("mouseout", function () {
                                if (FollowupConnectButton.style.backgroundColor != "gray") {
                                    FollowupConnectButton.style.backgroundColor = "#c42329";
                                }
                            });

                            var Spacer = document.createElement("div");
                            Spacer.style.height = "25px";
                            CampaignForm.appendChild(Spacer);
                            CampaignForm.appendChild(FollowupConnectButton);
                            //**********
                            var myBPopup = $('#maincampaignsdiv').bPopup({
                                opacity: 0.6, modalClose: false
                            });
                            $('#selectcampaigns').select2({
                                placeholder: "Select campaign",
                                dropdownParent: $('#divcampaigns'),
                                templateResult: formatCampaignTextPopup,
                                templateSelection: formatCampaignTextPopupResult,
                                selectOnClose: true
                            });
                            if (document.getElementById("select2-selectcampaigns-container")) {
                                document.getElementById("select2-selectcampaigns-container").style.fontSize = "12pt";
                                document.getElementById("select2-selectcampaigns-container").style.paddingLeft = "8px";
                            }
                            if (document.querySelector('[aria-labelledby="select2-selectcampaigns-container"]')) {
                                document.querySelector('[aria-labelledby="select2-selectcampaigns-container"]').style.height = "50px";
                                document.querySelector('[aria-labelledby="select2-selectcampaigns-container"]').style.paddingTop = "15px";
                            }
                            if (document.querySelector('span[aria-labelledby="select2-selectcampaigns-container"]  > [role="presentation"][class="select2-selection__arrow"]')) {
                                document.querySelector('span[aria-labelledby="select2-selectcampaigns-container"]  > [role="presentation"][class="select2-selection__arrow"]').style.paddingTop = "30px";
                            }

                            $('#selectcampaigns').on('change', function (e) {
                                //subBehaviors.style.display="block";
                                var theID = "BehaviorsSelect";
                                var SelectBehaviors = document.createElement("select");
                                SelectBehaviors.id = theID;
                                SelectBehaviors.style.width = "300px";
                                //if worksheets dropdown exists remove it
                                if (divBehaviors != null) {
                                    while (divBehaviors.hasChildNodes()) {
                                        divBehaviors.removeChild(divBehaviors.firstChild);
                                    }
                                    divBehaviors.innerHTML = "<span style='color: blue'>Please wait...</span>";
                                }
                                if (elCampaigns.value != "default") {
                                    document.getElementById('FollowupConnectButton').style.backgroundColor = "#c42329";
                                    fetch(config.baseurl + "/users/loadCampaignDetails", {
                                        method: 'POST', // or 'PUT'
                                        // data can be `string` or {object}!
                                        headers: {
                                            "Accept": "application/json",
                                            "Content-Type": "application/json",
                                            "Access-Control-Allow-Origin": "*",
                                        },
                                        body: JSON.stringify({
                                            campaignId: elCampaigns.value,
                                            email: email_address
                                        }),
                                    })
                                        .then((response) => response.json())
                                        .then(function (resultBehavior) {
                                            console.log('Success:', resultBehavior);
                                            if (resultBehavior.status == 200) {
                                                var CampaignDetails = JSON.parse(resultBehavior.campaign_info);
                                                console.log("Cmpaign Details ", CampaignDetails)
                                                if (CampaignDetails) {
                                                    console.log("Sent");
                                                    toarr = CampaignDetails.receipents.split(",");
                                                    // toarr = arr[0];
                                                    ToCount = toarr.length
                                                    console.log("to count", ToCount)
                                                    didnotsentarr = (CampaignDetails.bounce != "") ? CampaignDetails.bounce.split(",") : [];
                                                    console.log("Didnot sent arr", didnotsentarr)
                                                    DidnotSentCount = didnotsentarr.length
                                                    console.log("Didnot sent count", DidnotSentCount)
                                                    for (var i = 0; i < toarr.length; i++) {
                                                        if (didnotsentarr.indexOf(toarr[i]) == -1) {
                                                            sentarr.push(toarr[i]);
                                                            console.log("sentarr", sentarr)
                                                            SentCount = ToCount - DidnotSentCount;
                                                            console.log("sent count", SentCount)
                                                        }
                                                    }
                                                    if (CampaignDetails.open != "") {
                                                        console.log("OPENED");
                                                        openarr = CampaignDetails.open.split(",");
                                                        console.log("open array", openarr);
                                                        OpenCount = openarr.length
                                                        console.log("Open count", OpenCount);
                                                        for (var i = 0; i < sentarr.length; i++) {
                                                            console.log("opensentarr", sentarr[i])
                                                            if (openarr.indexOf(sentarr[i]) == -1) {
                                                                didnotopenarr.push(sentarr[i]);
                                                                console.log("Didnotopen arr", didnotopenarr);
                                                                DidnotOpenCount = SentCount - OpenCount;
                                                                console.log("didnot open count", DidnotOpenCount);
                                                            }
                                                        }
                                                    } else {
                                                        if (CampaignDetails.open == "") {
                                                            openarr = [];
                                                            console.log("open array", openarr);
                                                            didnotopenarr = sentarr;
                                                            console.log("Didnotopen arr", didnotopenarr);
                                                            DidnotOpenCount = SentCount - OpenCount;
                                                            console.log("didnot open count", DidnotOpenCount);
                                                        }
                                                    }
                                                    if (CampaignDetails.click != "") {
                                                        console.log("Clicked");
                                                        clickarr = CampaignDetails.click.split(",");
                                                        ClickCount = clickarr.length;
                                                        console.log("click count", ClickCount)
                                                        for (var j = 0; j < sentarr.length; j++) {
                                                            if (clickarr.indexOf(sentarr[j]) == -1) {
                                                                didnotclickarr.push(sentarr[j]);
                                                                console.log("Didnotclick arr", didnotclickarr);
                                                                DidnotClickCount = SentCount - ClickCount;
                                                                console.log("Didnotclick count", DidnotClickCount);
                                                            }
                                                        }
                                                    } else {
                                                        if (CampaignDetails.click == "") {
                                                            clickarr = [];
                                                            console.log("click arr", clickarr);
                                                            didnotclickarr = sentarr;
                                                            console.log("Didnotclick arr", didnotclickarr);
                                                            DidnotClickCount = SentCount - ClickCount;
                                                            console.log("Didnotclick count", DidnotClickCount);
                                                        }
                                                    }
                                                    for (var k = 0; k < openarr.length; k++) {
                                                        if (didnotclickarr.indexOf(openarr[k]) > -1) {
                                                            ocarr.push(openarr[k]);
                                                            console.log("ocarr", ocarr)
                                                            console.log("Open but didn't Click arr", ocarr);
                                                            OCCount = ocarr.length;
                                                            console.log("Open But didn't Click count", OCCount);
                                                        }
                                                    }
                                                    if (CampaignDetails.reply != "") {
                                                        console.log("Replied");
                                                        replyarr = CampaignDetails.reply.split(",");
                                                        console.log("reply arr", replyarr)
                                                        ReplyCount = replyarr.length;
                                                        console.log("reply count", ReplyCount)
                                                        for (var n = 0; n < sentarr.length; n++) {
                                                            console.log("sentArr", sentarr[n])
                                                            let cur_sent = (sentarr[n].indexOf("<") > -1) ? (sentarr[n].split("<")[1]).split(">")[0] : sentarr[n];
                                                            if (replyarr.indexOf(cur_sent) == -1) {
                                                                console.log("reply ", replyarr.indexOf(sentarr[n]))
                                                                didnotreplyarr.push(sentarr[n]);
                                                                console.log("DidnotReply arr", didnotreplyarr);
                                                                DidnotReplyCount = SentCount - ReplyCount;
                                                                console.log("DidnotReply count", DidnotReplyCount);
                                                            }
                                                        }
                                                    }
                                                    else {
                                                        if (CampaignDetails.reply == "") {
                                                            replyarr = [];
                                                            console.log("reply arr", replyarr);
                                                            didnotreplyarr = sentarr;
                                                            console.log("DidnotReply arr", didnotreplyarr);
                                                            DidnotReplyCount = SentCount - ReplyCount;
                                                            console.log("DidnotReply count", DidnotReplyCount);
                                                        }
                                                    }
                                                    GApiErrorarr = (CampaignDetails.apierror != "") ? CampaignDetails.apierror.split(",") : [];
                                                    console.log("GApi Error");
                                                    GApiErrorCount = GApiErrorarr.length;
                                                    console.log("GApi count", GApiErrorCount)
                                                }
                                                var BOption = document.createElement("option");
                                                BOption.text = "Sent";
                                                BOption.value = "s";
                                                BOption.setAttribute("theBehavior", "Sent");
                                                BOption.setAttribute("theCount", SentCount);
                                                SelectBehaviors.add(BOption);

                                                var BOption = document.createElement("option");
                                                BOption.text = "Didn't Sent";
                                                BOption.value = "ds";
                                                BOption.setAttribute("theBehavior", "Didn't Sent");
                                                BOption.setAttribute("theCount", DidnotSentCount);
                                                SelectBehaviors.add(BOption);

                                                var BOption = document.createElement("option");
                                                BOption.text = "Opened";
                                                BOption.value = "o";
                                                BOption.setAttribute("theBehavior", "Opened");
                                                BOption.setAttribute("theCount", OpenCount);
                                                SelectBehaviors.add(BOption);

                                                var BOption = document.createElement("option");
                                                BOption.text = "Didn't Open";
                                                BOption.value = "p";
                                                BOption.setAttribute("theBehavior", "Didn't Open");
                                                BOption.setAttribute("theCount", DidnotOpenCount);
                                                SelectBehaviors.add(BOption);

                                                var BOption = document.createElement("option");
                                                BOption.text = "Clicked";
                                                BOption.value = "c";
                                                BOption.setAttribute("theBehavior", "Clicked");
                                                BOption.setAttribute("theCount", ClickCount);
                                                SelectBehaviors.add(BOption);

                                                var BOption = document.createElement("option");
                                                BOption.text = "Didn't Click";
                                                BOption.value = "d";
                                                BOption.setAttribute("theBehavior", "Didn't Click");
                                                BOption.setAttribute("theCount", DidnotClickCount);
                                                SelectBehaviors.add(BOption);

                                                var BOption = document.createElement("option");
                                                BOption.text = "Open But Didn't Cick";
                                                BOption.value = "oc";
                                                BOption.setAttribute("theBehavior", "Open But Didn't Click");
                                                BOption.setAttribute("theCount", OCCount);
                                                SelectBehaviors.add(BOption);

                                                var BOption = document.createElement("option");
                                                BOption.text = "Reply";
                                                BOption.value = "r";
                                                BOption.setAttribute("theBehavior", "Reply");
                                                BOption.setAttribute("theCount", ReplyCount);
                                                SelectBehaviors.add(BOption);

                                                var BOption = document.createElement("option");
                                                BOption.text = "Didn't Reply";
                                                BOption.value = "dr";
                                                BOption.setAttribute("theBehavior", "Didn't Reply");
                                                BOption.setAttribute("theCount", DidnotReplyCount);
                                                SelectBehaviors.add(BOption);

                                                var BOption = document.createElement("option");
                                                BOption.text = "GmailApi Error";
                                                BOption.value = "gapi";
                                                BOption.setAttribute("theBehavior", "GmailApi Error");
                                                BOption.setAttribute("theCount", GApiErrorCount);
                                                SelectBehaviors.add(BOption);

                                                divBehaviors.innerHTML = "";
                                                divBehaviors.appendChild(SelectBehaviors);

                                                $('#BehaviorsSelect').select2({
                                                    dropdownParent: $('#divcampaigns'),
                                                    placeholder: "Select behavior",
                                                    templateResult: formatCampaignBehaviors,
                                                    templateSelection: formatCampaignBehaviorsResult,
                                                    disabled: (CampaignDetails.length == 1 ? true : false)
                                                });
                                                if (document.getElementById("select2-BehaviorsSelect-container")) {
                                                    document.getElementById("select2-BehaviorsSelect-container").style.fontSize = "12pt";
                                                    document.getElementById("select2-BehaviorsSelect-container").style.paddingLeft = "8px";
                                                }
                                                if (document.querySelector('[aria-labelledby="select2-BehaviorsSelect-container"]')) {
                                                    document.querySelector('[aria-labelledby="select2-BehaviorsSelect-container"]').style.height = "50px";
                                                    document.querySelector('[aria-labelledby="select2-BehaviorsSelect-container"]').style.paddingTop = "15px";
                                                }
                                                if (document.querySelector('span[aria-labelledby="select2-BehaviorsSelect-container"]  > [role="presentation"][class="select2-selection__arrow"]')) {
                                                    document.querySelector('span[aria-labelledby="select2-BehaviorsSelect-container"]  > [role="presentation"][class="select2-selection__arrow"]').style.paddingTop = "30px";
                                                }
                                            }
                                            if (resultBehavior.status == 500) {
                                                sdk.ButterBar.showMessage({ text: "This computer needs to re-connect to your Gmail account.", time: 60000 });
                                                LaunchAuth(2, email_address)
                                            }
                                            else if (App == "oldGmail") {
                                                if (document.location.href.search("compose=") >= 0) {
                                                    document.location.href = document.location.href + "," + resultCampaigns.messageId;
                                                }
                                                else {
                                                    let messageId = resultWorkSheetRecipients.messageId;
                                                    document.location.href = document.location.href + "?compose=" + messageId;
                                                }
                                            }
                                        }).catch(function (error) {
                                            sdk.ButterBar.showMessage({ html: "Genius Mail:" + error + " Try Again ", time: 10000, className: "redbb" })
                                        });
                                }
                                else {
                                    document.getElementById('FollowupConnectButton').style.backgroundColor = "gray";
                                }
                            });
                        }
                        if (resultCampaigns.status == 500) {
                            sdk.ButterBar.showMessage({ text: "This computer needs to re-connect to your Gmail account.", time: 60000 });
                            LaunchAuth(2, email_address)
                        }
                    }).catch(function (error) {
                        sdk.ButterBar.showMessage({ html: "Genius Mail:" + error + " Try Again ", time: 10000, className: "redbb" })
                    });
            }//launchimport function closed

            //LaunchUpgrade function for Extension Pricing after User gets Suspended
            function LaunchUpgrade() {
                var UpgradeDiv = document.createElement("div");
                UpgradeDiv.style.color = "black";
                UpgradeDiv.style.width = "300px";
                UpgradeDiv.style.height = "300px";
                UpgradeDiv.style.borderColor = "black";
                UpgradeDiv.style.borderStyle = "solid";
                UpgradeDiv.style.backgroundColor = "white";
                UpgradeDiv.style.display = "none";
                UpgradeDiv.setAttribute("id", "UpgradeDiv");
                var HTMLString = "<p style=\"color: #145DC9; text-align: center\"><img width=\"228px\" src=\"https://s3.amazonaws.com/tier5.us/gmext/canvas/GM_logo.png\">";
                HTMLString = HTMLString + "<span style=\"color:red\">Sorry You Are Suspended<strong>(" + sdk.User.getEmailAddress() + ")</strong> Please upgrade your account .<span>Don't worry - you can come right back here to send your campaign afterward.</span></span>";
                HTMLString = HTMLString + "<div id=UpgradeButton>Close</div></p>";
                UpgradeDiv.innerHTML = HTMLString;
                document.body.appendChild(UpgradeDiv);
                var UpgradeButtonDiv = document.getElementById("UpgradeButton");
                UpgradeButtonDiv.addEventListener("click", function () {
                    TestBPopup.close();
                    LaunchLogin(email_address);
                    // window.open('https://www.gmass.co/pricing?email=' + sdk.User.getEmailAddress(), 'PricingWindow', 'width=1400, height=1200, top=' + top + ', left=' + left);
                });
                UpgradeButtonDiv.style.width = "200px";
                UpgradeButtonDiv.style.textAlign = "center";
                UpgradeButtonDiv.style.color = "white";
                UpgradeButtonDiv.style.padding = "9px 5px 9px 12px";
                UpgradeButtonDiv.style.fontWeight = "bold";
                UpgradeButtonDiv.style.fontSize = "14px";
                UpgradeButtonDiv.style.borderRadius = "8px";
                UpgradeButtonDiv.style.margin = "auto";
                UpgradeButtonDiv.style.backgroundColor = "#30AE50";
                UpgradeButtonDiv.style.cursor = "pointer";
                let TestBPopup = $('#UpgradeDiv').bPopup({ opacity: 0.6, modalClose: false });

            }//LaunchUpgrade function closed

            function AliasSize(aliasaddress) {
                //to cast as a string
                aliasaddress = aliasaddress + "";
                return aliasaddress.substr(0, aliasaddress.indexOf("-recipients"));
            }
        } //try block closed
        catch (err) {
            console.log(err);
        }

    }); //inboxsdk closed

} //window onload closed
//********************START OF SECTION OUTSIDE WINDOW ONLOAD AND INBOX SDK

//Function for Formatting Spreadsheet Selection Div
/**
* @param {String} campaign Spreadsheet text which needs to be in format
* @returns Formatted Spreadsheet div text
 */
function formatSpreadsheets(campaign) {
    if (campaign.disabled) {
        return (campaign.text);
    } else {
        return $('<div style="height: 50px; display: flex; align-items: center">' + '<div><img height="40px" src="https://www.gmass.co/img2017/google-sheets.png"></div> ' + '<div style="margin-left: 0px; font-size: 8pt; padding: 3px; border-radius: 5px; background: #D3D3D3; color: gray">Sheet</div>' + '<div style="margin-left: 4px; font-size: 12pt;">' + campaign.element.text + '</div></div>');
    }
    //return (campaign.text);
}

function formatSpreadsheetsResult(campaign) {
    if (campaign.id == "") {
        return (campaign.text);
    } else {
        return $('<span style="font-size: 8pt; padding: 3px; border-radius: 5px; background: #D3D3D3; color: gray">Sheet</span> ' + '<span style="font-size: 12pt;">' + campaign.element.text + '</span>');
    }
    //return (campaign.text);
}
// End of Formatting Spreadsheet Function

//Function for Formatting Worksheet Selection Div
/**
* @param {String} campaign Worksheet text which needs to be in format
* @returns Formatted Worksheet div text
 */
function formatWorksheets(campaign) {
    if (campaign.disabled) {
        return (campaign.text);
    } else {
        return $('<span style="font-size: 12pt;">' + campaign.element.text + '</span> ' + '<span style="font-size: 8pt; padding: 3px; border-radius: 5px; background: green; color: white; float: right;">' + numberWithCommas(campaign.element.getAttribute("Rows")) + ' rows</span> ');
    }
    //return (campaign.text);
}

function formatWorksheetsResult(campaign) {
    if (campaign.id == "") {
        return (campaign.text);
    } else {
        return $('<span style="font-size: 12pt;">' + campaign.element.text + '</span> ' + '<span style="font-size: 8pt; padding: 3px; border-radius: 5px; background: green; color: white; float: right;">' + numberWithCommas(campaign.element.getAttribute("Rows")) + ' rows</span> ');
    }
    //return (campaign.text);
}
// End of Formatting Worksheet Function

//Function for Formatting Campaign Subject Selection Div for Manual Follow up
/**
* @param {String} campaign  text which needs to be in format
* @returns Formatted Campaign Subject div text
 */
function formatCampaignTextPopup(campaign) {
    if (campaign.disabled) {
        return $(campaign.text);
    }
    else {
        return $('<span style="font-size: 8pt; padding: 3px; border-radius: 5px; background: #D3D3D3; color: gray">' + campaign.element.getAttribute("theDate") + '</span> ' + '<span style="font-size: 12pt;">' + campaign.element.getAttribute("subjectName") + '</span> <span style="font-size: 8pt; padding: 1px 2px 1px 2px; border-radius: 5px; background: gray; color: white; float: right;">' + ' emails</span>');
    }
    //return (campaign.text);
}
function formatCampaignTextPopupResult(campaign) {
    if (campaign.id == "") {
        return (campaign.text);
    }
    else {
        return $('<span style="font-size: 8pt; padding: 3px; border-radius: 5px; background: #D3D3D3; color: gray">' + campaign.element.getAttribute("theDate") + '</span> ' + '<span style="font-size: 12pt;">' + campaign.element.getAttribute("subjectName") + '</span> <span style="font-size: 8pt; padding: 1px 2px 1px 2px; border-radius: 5px; background: gray; color: white; float: right;">' + ' emails</span>');
    }
}
// End of Formatting Campaign Subject Function for Manual Follow up

//Function for Formatting Campaign Behavior Selection Div for Manual Follow up
/**
* @param {String} campaign  text which needs to be in format
* @returns Formatted Campaign Behavior div text
 */
function formatCampaignBehaviors(campaign) {
    if (campaign.disabled) {
        return $(campaign.text);
    }
    else {
        return $('<span style="font-size: 12pt; font-weight: normal;">' + campaign.element.getAttribute("theBehavior") + ':</span> ' + '<span style="color: blue; float: right;">' + numberWithCommas(campaign.element.getAttribute("theCount")) + ' people</span>');
    }
}

function formatCampaignBehaviorsResult(campaign) {
    if (campaign.id == "") {
        return $(campaign.text);
    }
    else {
        return $('<span style="font-size: 12pt; font-weight: normal;">' + campaign.element.getAttribute("theBehavior") + ':</span> ' + '<span style="color: blue; float: right;">' + numberWithCommas(campaign.element.getAttribute("theCount")) + ' people</span>');
    }
}
// End of Formatting Campaign Behavior Function for Manual Follow up

//Function for Comma Separated numbers
/**
* @param {String} x use to take the input which we want to separate by Commas)
* @returns output item separated by comma
 */
//
function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

//Function for creating an Unique id
/**
* 
* @returns An unique id for all the Html
 */
function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;

} //Makeid closed

//Function for removing Dropdown Options
/**
* @param {String} selectbox (Use to take the input which we want to remove)
* @returns Remove selected
 */
//
function removeOptions(selectbox) {
    var i;
    for (i = selectbox.options.length - 1; i >= 0; i--) {
        selectbox.remove(i);
    }
} //removeOptions closed

//Function for Converting values into Numeric Value
/**
* @param {String} selectbox (Use to take the input which we want to convert)
* @returns Whether a number is numric or not
 */
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
//isNumeric closed

//Function for Copying items into Clipboard
/**
* @param {String} itemCopy (Use to take the input which we want to copy)
* @returns Copied item 
*/
function CopyClipboard(itemCopy) {
    var textArea = document.createElement("textarea");
    textArea.value = itemCopy;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("Copy");
    textArea.remove();
} //CpyClipboard closed