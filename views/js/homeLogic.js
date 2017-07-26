
function handleKeypress(event) {
	if (event.which === 13 || event.keyCode === 13) {
		openResultsPage();
	}
}
function openResultsPage() {
	var repoUrl = document.getElementById('inputLink').value;

	if (!repoUrl) {
		// Change the border of textbox to red
		document.getElementById('inputLink').className = document.getElementById('inputLink').className + " error";  // this adds the error class
		return
	}

	parent.location = '/w/' + repoUrl;
}


<!-- Google Analytics Start -->

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-102659539-1', 'auto');
ga('send', 'pageview');

<!-- Google Analytics End -->