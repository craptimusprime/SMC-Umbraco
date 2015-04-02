
var oStateMessages = new Object();
// State Messages will be provided in page onload action

var current_rodend = "";
var hasXOptions = false;
var bore_size = "";
var stroke_size = "";
var rod_end_dom = "";
var MM_user_select = "";

function blockEnter(e) { //e is event object passed from function invocation
	if (!e) var e = window.event;
	var characterCode;
	if (e.which) { //if which property of event object is supported (NN4)
		characterCode = e.which //character code is contained in NN4's which property
	} else {
		characterCode = e.keyCode //character code is contained in IE's keyCode property
	}

	if (characterCode == 13) {
		//if generated character code is equal to ascii 13 (if enter key)
		var targ = e.target || e.srcElement;
		if (targ.nodeType == 3) targ = targ.parentNode // defeat Safari bug
		targ.blur();
		return false
	}
}

function toggleAddOpts(domid, button, alttext) {
	//alert(domid)
	var oTr = document.getElementById("CROW_" + domid);
	if (oTr) {
		if (oTr.style.display == "") {
			oTr.style.display = "none";
		} else {
			oTr.style.display = "";
		}
	}
	if (button) {
		var oButton = document.getElementById("add_opts_button");
		var saveval = oButton.value;
		if ('undefined' == typeof oButton.value2) {
		//alert("was undefined setting to "+alttext)
			oButton.value = alttext;
		} else {
		//alert("ok setting to "+oButton.value2)
			oButton.value = oButton.value2;
		}
		oButton.value2 = saveval;
	}
	for (var i=0; i<addOptsDomArray.length; i++) {
	//alert('domid = '+domid+' addOptsDomArray['+i+'] = '+ addOptsDomArray[i])
		if (addOptsDomArray[i] == domid && i<(addOptsDomArray.length-1)) {
			var cmd = "toggleAddOpts(" + addOptsDomArray[i+1] + ", false, '"+alttext+"');"
			setTimeout(cmd, 30);
			break;
		}
	}
}

function ShowRodEndPicture( rodcode ) {
	if (rodcode == current_rodend) return;
	var oRodDiv = document.getElementById("rodModArea");
	if (oRodDiv) {
		current_rodend = rodcode;
		oRodDiv.innerHTML = "";
		RodEndInitAction = "";
		if (rodcode == "") {
			oRodDiv.style.display = "none";
		} else {
			oRodDiv.innerHTML = '<table><tr><td><img src="images/animated_busy2.gif" alt="" width="20" height="20" border="0"></td><td> Loading...</td></tr></table>';
			oRodDiv.style.display = "";
			var params = 'rod_code='+encodeURIComponent(rodcode);
			params += '&base_linecode='+encodeURIComponent(base_linecode);
			params += '&catalog_dsn='+encodeURIComponent(catalog_dsn);
			params += '&series='+encodeURIComponent(series);
			params += '&id='+encodeURIComponent(product_id);
			params += '&reqpartnobutton='+encodeURIComponent(reqpartno_buttontext);
			params += '&ordcustrodend='+encodeURIComponent(ordcustrodends_linktext);
			params += '&ordcustrodendmsg='+encodeURIComponent(ordcustrodend_msgtext);
			params += '&rodend_domarray='+encodeURIComponent(rodEndArray);
		    // use the standard_ajax.js ajax object
		    new net.ContentLoader("/cc_host/pages/public/custom/smc/services/ajax/rodends.cfm", loadRodEndDiv, null, "POST", params);
		}
	} else alert("no rod end area!")
}

var RodEndInitAction = "";
function loadRodEndDiv() {
    var responsetxt = this.req.responseText;
    var responseObj = eval("(" + responsetxt + ")");

	var oRodDiv = document.getElementById("rodModArea");
    if ("undefined" != typeof responseObj.status && !responseObj.status) {
		oRodDiv.innerHTML = "";
        alert('Loading Rod End Information Failed: '+responseObj.data.message);
        return;
    }
	oRodDiv.innerHTML = responseObj.html_content;
	MM_user_select = responseObj.init_mm;
	RodEndInitAction = responseObj.init_action;
	setTimeout(RodEndInitAction);
	last_bore = "";
}

function customFormChange(nTriggerDomain) {
	stdFormChange(nTriggerDomain);
	for (var domid in oDomains.domains)  {
		if (oDomains.domains.hasOwnProperty(domid)) {
			oDom = oDomains.domains[domid];
			if (oDom.dtype != "D_CONSTANT" && oDom.dtype != "") {
				var oDiv = document.getElementById("MP_"+domid);
				if (oDiv) oDiv.style.display = "none";
				var oConfigRow = document.getElementById('CROW_'+domid);
				var oStateImage = document.getElementById('status_img_'+domid);
				if (!oDom.hasSelection()) {
					if (oStateImage) {
						oStateImage.style.cursor = "";
						oStateImage.src = 'http://content2.smcetech.com/image/configurator_images/status-icons/tilda_16.png';
					}
					backgroundColor = "#B8CCFF";//"#D0D0A0";
				} else {
					backgroundColor = "#FFFFFF";//"#EEEEEE";
					oStroke = document.getElementById('stroke_'+domid);
					if (oStateImage) {
						oStateImage.style.cursor = "";
						switch (oDom.contype) {
						case Rule.NoConstraint:
							oStateImage.src = 'http://content2.smcetech.com/image/configurator_images/status-icons/sq_check_16.png';
							if (oStroke) oStroke.style.color = gNoConstraintColor;
							break;
						case Rule.SoftConstraint:
							oStateImage.src = 'images/NA/warning_diamond16.GIF';
							if (oStroke) oStroke.style.color = gSoftConstraintColor;
							// popup a message box
							var xpos = getPositionX(oStateImage)+18;
							var ypos = getPositionY(oStateImage);
							displayErrorMsg(domid, getDomainConflictMessages(domid, ''), xpos ,ypos, 'warn');
							break;
						case Rule.HardConstraint:
							oStateImage.src = 'http://content2.smcetech.com/image/configurator_images/status-icons/helphere16_red.png';//'images/red_x_16.GIF';
							oStateImage.style.cursor = "help";
							if (oStroke) oStroke.style.color = gHardConstraintColor;
							// popup a message box
							var xpos = getPositionX(oStateImage)+18;
							var ypos = getPositionY(oStateImage);
							displayErrorMsg(domid, getDomainConflictMessages(domid, '<br>&nbsp;'), xpos ,ypos, 'error');
							break;
						}
					}
				}
				try {
				oConfigRow.cells[0].style.backgroundColor = backgroundColor;//"#DEBE84"
				oConfigRow.cells[1].style.backgroundColor = backgroundColor;
				oConfigRow.cells[2].style.backgroundColor = backgroundColor;
				//oConfigRow.cells[3].style.backgroundColor = backgroundColor;
				} catch (myexcept) { }
				if (oDom.code == 'XROD_ENDS') {
					ShowRodEndPicture(oDom.selectionString());
					rod_end_dom = oDom;
					// clear any xtra attributes
					rod_end_dom.extraAttributes = new Object();
				}
				if (oDom.code == 'BORE') {
					bore_size = oDom.hasSelection()?oDom.selectionString():"";
				}
				if (oDom.code == 'STROKE') {
					stroke_size = oDom.hasSelection()?DomInputValProcessor(oDom):"";
				}
			}
		}
	}
	if (RodEndInitAction != "") {
		setTimeout(RodEndInitAction);
	}
}
function smcShowDomainMessages(domainid, oDiv, sTitle) {
	var wobj = self;
	var title = "Conflicts/Warnings"

	if (arguments.length > 1) {
		wobj = arguments[1];
	}
	if (typeof sTitle != "undefined") {
		title = sTitle;
	}
	var oDom = oDomains.domains[domainid];
	if (getDomainConflictMessages(domainid, '') != "") {
		displayErrorMsg(domainid, getDomainConflictMessages(domainid, '<br>&nbsp;'), getPositionX(wobj)+18, getPositionY(wobj), (oDom.contype == Rule.HardConstraint)?'error':'warn' );
	}
}


function displayErrorMsg( domid, text, xp, yp, level ) {
	var oDiv = document.getElementById("MP_"+domid);
	var color = "ce2929";
	var img = "red_left";
	if (level == "warn") {
		color = "cfb529";
		img = "yellow_left";
	}
	if (!oDiv) oDiv = createDivElement("MP_"+domid, "display:none;")
	oDiv.innerHTML = '<div><table class="small" cellspacing="0" cellpadding="0"><tr><td valign="top"><img src="images/'+img+'.gif" alt="" width="12" height="12" vspace="12" border="0"></td><td style="border-bottom: 1px solid silver; border-top: 1px solid white; color:white;background-color:#'+color+';padding:5px 0px 5px 5px;">'+text+'</td><td valign="top" style="border-right: 1px solid silver; border-bottom: 1px solid silver; border-top: 1px solid white; color:white;background-color:#'+color+';"><img src="images/closebox_white.GIF" alt="Close Message Box" width="15" height="15" hspace="3" vspace="3" border="0"> </td></tr></table></div>';
	oDiv.style.top=(yp-12)+"px";
	oDiv.style.left=xp+"px";
	oDiv.style.width=176+"px";
	oDiv.style.position='absolute';
	oDiv.style.cursor='pointer';
	oDiv.style.display='';
	oDiv.onclick = function () {this.style.display="none";}

	document.body.appendChild(oDiv);
	//alert(domid+"',"+text+", "+xp+", "+yp);
}

var currentPartNumber;
function smcShowPartNumber() {
	var oCPNString = document.getElementById('cpn_partnumber');
	partNumberString = "";
	currentPartNumber = "";
	partCode = '';
	//partArray = oDomains.getPartNumber();
	partNumberString = oDomains.getPartNumber().join("");
	hasXOptions = false;
	for (var i=0; i<oDomains.cpcarray.length; i++) {
		partBlock = '';
		partBackColor = 'FFFFFF';
		oDom = oDomains.cpcarray[i];
		switch (oDom.dtype) {
		case Domain.Constant:
			//It is a constant - user can't pick
			partBlock = oDom.label;
			currentPartNumber = currentPartNumber+partBlock;
			partBackColor = 'FFFFFF';
			break;
		case Domain.List:
			//If oDom.label == 'dash' then user cannot pick it is autoset.
			//code will either be '-' or empty string.
			partBackColor = 'B8CCFF';
			if (oDom.label.substring(0,1) == '-')//optional dash fields
				partBackColor = 'FFFFFF';
			if (oDom.state == Domain.NotSet) {
				partBlock = '';
			} else {
				partBlock = oDom.selectionString();
			}
			hasXOptions = hasXOptions || (partBlock == '-X');
			currentPartNumber = currentPartNumber+partBlock;
			break;
		case Domain.Mixed:
		case Domain.IntegerRange:
		case Domain.DecimalRange:
			partBackColor = 'B8CCFF';
			if (oDom.hasSelection()) {
				try {
					partBlock = DomInputValProcessor(oDom);
				} catch (myexcept) {
					partBlock = oDom.inputval;
				}
			} else {
				partBlock = new String(oDomains.nopick);
			}
			currentPartNumber = currentPartNumber+partBlock;
			break;
		default:
			alert('Domain ('+oDom.label+') is an unsupported datatype ('+oDom.dtype+')');
			break;
		}
		if(oDom.contype == Rule.HardConstraint)
			partBackColor = 'FF0000';
		if(partBlock == '')
			partCode = partCode + '<td nowrap bgcolor="#' + partBackColor + '">' + '&nbsp;&nbsp;' + '</td>';
		else
			partCode = partCode + '<td nowrap bgcolor="#' + partBackColor + '">' + partBlock + '</td>';
	}

	oCPNString.innerHTML = '<table border="0" cellpadding="3" cellspacing="1" bgcolor="#000000"><tr style="font-family: arial; font-weight: bold;">' +
							partCode +
							'</tr></table>';
	var oCPNState = document.getElementById('cpn_state');
	var sState = oDomains.getConstraintEngineState();
	var oStateImage = document.getElementById('status_img');
	switch(sState) {
	case 'Partial':
		oStateImage.src = 'http://content2.smcetech.com/image/configurator_images/status-icons/tilda_32.png';
		break;
	case 'Complete':
		oStateImage.src = 'http://content2.smcetech.com/image/configurator_images/status-icons/sq_check_32.png';
		break;
	case 'Invalid':
		oStateImage.src = 'http://content2.smcetech.com/image/configurator_images/status-icons/red_x_32.png';
		break;
	}
	//alert("sstate : "+sState);
	oCPNState.innerHTML = oStateMessages[sState];
}

ShowPartNumber = smcShowPartNumber;

