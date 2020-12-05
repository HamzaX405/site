function notice(noticeData) {	
	var noticeBox = document.getElementById('notice');
	var noticeHeadline = noticeBox.getElementsByClassName('headline')[0],
		noticeMessage = noticeBox.getElementsByClassName('message')[0],
		noticeButtons = noticeBox.getElementsByClassName('buttonswrap')[0],
		noticeClose = noticeBox.getElementsByClassName('close');
	
	noticeBox.classList.remove('success', 'error', 'target', 'confirm');
	noticeHeadline.innerHTML = 'We have an information for you';
	
	if (noticeData.status == 1) {
		noticeBox.classList.add('success');
		noticeHeadline.innerHTML = 'Your action was successful';		
	} 
	
	if (noticeData.status == 2) {
		noticeBox.classList.add('error');
		noticeHeadline.innerHTML = 'An error occured. Your action failed';		
	}
	
	if (noticeData.headline) noticeHeadline.innerHTML = noticeData.headline;	
	noticeMessage.innerHTML = noticeData.message;	
	
	if (noticeData.targetLink) {
		let noticeTargetBtn = noticeButtons.getElementsByClassName('target')[0];
		noticeTargetBtn.href = noticeData.targetLink;			
		if (noticeData.targetName) noticeTargetBtn.innerHTML = noticeData.targetName;			
		noticeBox.classList.add('target');
	}
		
	if (noticeData.submitData) {
		let noticeConfirmBtn = noticeButtons.getElementsByClassName('confirm')[0];
		noticeConfirmBtn.addEventListener('click', function () { submitData(noticeData.submitData); });
		noticeBox.classList.add('confirm');
	}	
	
	for (i = 0; i < noticeClose.length; i++) 
		noticeClose[i].addEventListener('click', function () {
			noticeBox.setAttribute('hidden', '');
		});
	
	noticeBox.removeAttribute('hidden');
	
	if (noticeData.autoHide) {
		setTimeout(function () {
			noticeBox.setAttribute('hidden', '');
		}, noticeData.autoHide * 1000);
	}	
}