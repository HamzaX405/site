var spamLock = false;
function submitData(input, inlineresponse = null) {		
	var ajaxData = (typeof(input) === 'object') ? input : {},
		getQueries = {},
		handler = new XMLHttpRequest();		
	
	location.search.substr(1).split('&').forEach(function(item) {
		getQueries[item.split('=')[0]] = item.split('=')[1];
	});
	
	for (var prop in getQueries)
		ajaxData[prop] = getQueries[prop];
	
	for (var prop in ajaxData) {		
		switch (true) {				
			case ajaxData[prop] == '':
				ajaxData[prop] = null;
				break;
				
			case typeof(ajaxData[prop]) == 'string' && !isNaN(ajaxData[prop]):
				ajaxData[prop] = Number(ajaxData[prop]);
				break;
		}		
	}		
	
	handler.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200 && this.responseText)
			responseHandler(this.responseText, inlineresponse);
	};		
	
	handler.open('POST', '?handle', true);
	handler.send(JSON.stringify(ajaxData));
	spamLock = false;
}

var elementName;
function responseHandler(response, inlineresponse = null) {
	var responseData = (typeof(response) === 'object') ? response : JSON.parse(response),
		inlineMessage = inlineresponse;
	
	if (inlineMessage) {
		inlineMessage.innerHTML = null;
		inlineMessage.classList.remove('success', 'error');	
	}		
	
	if (elementName) elementName.classList.remove('invalid');
	
	if ((!responseData.type || responseData.type == 0) && inlineMessage) {			
		
		if (responseData.elementName) {
			elementName = document.querySelector('[name="'+ responseData.elementName +'"]');				
			if ((!responseData.status || responseData.status == 0)) elementName.removeAttribute('hidden');				
			elementName.focus();
		}			
		
		if (responseData.status == 1)
			inlineMessage.classList.add('success');			
		
		if (responseData.status == 2) {
			inlineMessage.classList.add('error');
		
			if (responseData.elementName)
				elementName.classList.add('invalid');
		}
		
		inlineMessage.innerHTML = responseData.message; 			
	}		
	
	if (responseData.type == 1 || !inlineMessage) notice(responseData);
	
	if (responseData.targetLink && responseData.autoRedirect) {
		setTimeout(function() {	
			window.location.replace(responseData.targetLink);
		}, responseData.autoRedirect * 1000);
	}
}

var grecaptchaSubmit = {};
function grecaptchaCallback() {
	grecaptchaSubmit.ajaxFormData.grecaptcharesponse = grecaptcha.getResponse();	
	submitData(grecaptchaSubmit.ajaxFormData, grecaptchaSubmit.ajaxFormInlineResponse);	
	grecaptcha.reset();
}

function validateAjaxForm(ajaxFormInputs, ajaxFormInlineResponse = null, ajaxFormGrecaptcha = null) {	
	var ajaxFormData = {};	
	
	if (!spamLock) {
		spamLock = true;
        for (prop in ajaxFormInputs) {	
            
            if ((ajaxFormInputs[prop].type == 'checkbox' && ajaxFormInputs[prop].checked) || ajaxFormInputs[prop].type != 'checkbox') {
                
                if (ajaxFormData[ajaxFormInputs[prop].name]) {
                    if (!Array.isArray(ajaxFormData[ajaxFormInputs[prop].name])) ajaxFormData[ajaxFormInputs[prop].name] = [ajaxFormData[ajaxFormInputs[prop].name]];
                    ajaxFormData[ajaxFormInputs[prop].name].push(ajaxFormInputs[prop].value);
                }
                
                else ajaxFormData[ajaxFormInputs[prop].name] = ajaxFormInputs[prop].value;			
            }
        }
	}
	
	if (ajaxFormGrecaptcha) {		
		grecaptcha.execute();	
		grecaptchaSubmit.ajaxFormData = ajaxFormData;
		grecaptchaSubmit.ajaxFormInlineResponse = ajaxFormInlineResponse;		
	}
	
	else submitData(ajaxFormData, ajaxFormInlineResponse);
}

if (ajaxForms = document.getElementsByClassName('jshandle')) {	
	for (i = 0; i < ajaxForms.length; i++) {		
		let ajaxForm = ajaxForms[i];	
		let	ajaxFormSubmit = ajaxForm.getElementsByClassName('jssubmit')[0],			
			ajaxFormInputsRaw = ajaxForm.querySelectorAll('[name]'),
			ajaxFormGrecaptcha = ajaxForm.getElementsByClassName('g-recaptcha')[0],
			ajaxFormInlineResponse = ajaxForm.getElementsByClassName('inlinemessage')[0];		
		
		ajaxForm.addEventListener('keypress', function(el) {
			if (el.keyCode == 13 && el.target.tagName != 'TEXTAREA') {
				el.preventDefault();
				let ajaxFormExceptions = ajaxForm.querySelectorAll('[hidden]'),
					ajaxFormInputs = Array.from(ajaxFormInputsRaw);		
				for (i = 0; i < ajaxFormInputs.length; i++) {
					for (j = 0; j < ajaxFormExceptions.length; j++) {
						if (ajaxFormExceptions[j].contains(ajaxFormInputs[i])) delete ajaxFormInputs[i];
					}		 
				}
				validateAjaxForm(ajaxFormInputs, ajaxFormInlineResponse, ajaxFormGrecaptcha);
			}
		});	
		
		ajaxFormSubmit.addEventListener('click', function () {
			let ajaxFormExceptions = ajaxForm.querySelectorAll('[hidden]'),
				ajaxFormInputs = Array.from(ajaxFormInputsRaw);		
			for (i = 0; i < ajaxFormInputs.length; i++) {
				for (j = 0; j < ajaxFormExceptions.length; j++) {
					if (ajaxFormExceptions[j].contains(ajaxFormInputs[i])) delete ajaxFormInputs[i];
				}		 
			}			
			validateAjaxForm(ajaxFormInputs, ajaxFormInlineResponse, ajaxFormGrecaptcha);
		});			
	}	
}

if (formatDates = document.getElementsByClassName('jsdate')) {	
	for (i = 0; i < formatDates.length; i++) {		
		if (Number.isInteger(parseInt(formatDates[i].innerHTML))) {			
			let unixTimestamp = parseInt(formatDates[i].innerHTML);
			let date = new Date(unixTimestamp * 1000);
			
			formatDates[i].innerHTML = date.toLocaleString(false, {
				"year": "numeric",
				"month": "short",
				"day": "2-digit",
				"hour": "2-digit",
				"minute": "2-digit"
			});		
		}
	}
}

if (showPassword = document.getElementsByClassName('jsshowpw'))	{
	for (i = 0; i < showPassword.length; i++) {
		let targetElement = document.getElementById(showPassword[i].getAttribute('data-for'));	
		
		showPassword[i].addEventListener('mousedown', function () {
			targetElement.setAttribute('type', 'text');			
		});	
		
		window.addEventListener('mouseup', function () {
			targetElement.setAttribute('type', 'password');			
		});		
	}
}