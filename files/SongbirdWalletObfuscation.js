$(document).ready(function () {            
    var web3 = new Web3();
    var accounts;
    
    if (typeof window.ethereum !== 'undefined') {
        $("#consIst").fadeIn("slow", function () {});
        $("#metamaskstatus").fadeOut("slow", function () {});
        $("#contactform").fadeOut("slow", function () {});

    } else {        
        $("#consIst").fadeOut("slow", function () {});
        $("#metamaskstatus").fadeIn("slow", function () {});
        $("#contactform").fadeOut("slow", function () {});
        $("#connect").fadeOut("slow", function () {});

    }
    
    ethereum.on('accountsChanged', function () {
        if (walletInitialised == true) {
            getAccount();
        }        
    })
    
    $("#createWallet").click(function () {
        createWallet();
    });

    async function createWallet() {
        var account = await web3.eth.accounts.create(web3.utils.randomHex(32));
        $("#address").val(account.address);
        $("#privatekey").val(account.privateKey);
        setLog("Address: "+ account.address,true);
        setLog("Private Key: "+ account.privateKey,true);
        $("#createWallet").fadeOut("slow", function () {});
        $("#seedWalletHead").fadeOut("slow", function () {});
        $("#seedWalletText").fadeOut("slow", function () {});
        $("#privateKeyNote").fadeIn("slow", function () {});        
        $("#toAddressLbl").fadeIn("slow", function () {});
        $("#privatekey").fadeIn("slow", function () {});
        $("#seedWallet").fadeIn("slow", function () {});
    }

    $("#seedWallet").click(function () {                
        seedWallet();
    });

    async function seedWallet() { 
        const AnonymousSeedABI = JSON.parse('[{"inputs":[{"internalType":"string","name":"inputHash","type":"string"}],"name":"seedAnonymous","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function","payable":true}]');        
        const AnonymousSeedAddress = '0x8f24AB33Dbda80A3f420589013aFe9d69ac7E79C';        
        let web3 = new Web3(window.ethereum);
        if($("#address").val().length <= 20) {
           $("#fromAddressLbl").text("* Address - Please enter an address");
           return;
        }
        
        ajaxurl = "https://sun-dara.co.uk/SongbirdEncrypt.php";
        var addy = $("#address").val();
        if(web3.utils.isAddress(addy) == false) {
            $("#fromAddressLbl").text("* Address - Please enter an address");
            return;
        }
        
        addy = addy.trim(addy);
        var hashData = await $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: {DATA: addy}
        });     
                
        var contractDataInit = await new web3.eth.Contract(AnonymousSeedABI);
        contractDataInit.options.address = AnonymousSeedAddress;
        contractDataInit.options.from = accounts[0];
        var valueToSend = $("#val").val();
        valueToSend = await Web3.utils.toWei(valueToSend, 'ether');
        if(hashData.length > 10) {
        await contractDataInit
                .methods
                .seedAnonymous(hashData)
                .send({value: valueToSend,chainId:19})                
                .then((result) => {            
                    var dateInfo = new Date();
                    setLog("Seeding Operation Start @ "+dateInfo,true);
                })
                .catch((processFailure => {                    
                    setLog("Seeding Operation Cannot Start",true);
                }));
                      
            } else {
                alert("Cannot start seed process, please check your Seed Wallet Address");
            }
    }


    $("#connectButton").click(function () {
        if (typeof window.ethereum !== "undefined") {
            getAccount();
        }
        else {
            alert("NOT CONNECTED");
        }
    });

    async function getAccount() {
        accounts = await ethereum.request({method: 'eth_requestAccounts'});
        if (accounts.length > 0) {
            $("#fromAddress").val(accounts);
            $("#contactform").fadeIn("slow", function () {});
            $("#connect").fadeOut("slow", function () {});
            walletInitialised = true;
        }
    }
    
    function setLog(message, append = false) {
        if (append == false) {
            $("#log").html(message + ' <br />');
        }

        if (append == true) {
            $("#log").html($("#log").html() + message + ' <br />');
        }
    }
});
