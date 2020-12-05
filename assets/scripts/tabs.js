if (tabWrapper = document.getElementsByClassName('jstabs')) {
	for (x in tabWrapper) {
		if (tabWrapper.hasOwnProperty(x)) {		
			var tabs = tabWrapper[x].childNodes;			
			for (i = 0; i < tabs.length; i++) {	
				let ownTabs = tabs;
				tabs[i].addEventListener('click', function () {					
					for (i = 0; i < ownTabs.length; i++) {
						ownTabs[i].classList.remove('active');
						document.getElementById(ownTabs[i].getAttribute('data-tab')).setAttribute('hidden', '');					
					}					
					this.classList.add('active');
					document.getElementById(this.getAttribute('data-tab')).removeAttribute('hidden');				
				});
			}			
		}		
	}
}