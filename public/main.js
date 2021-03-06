(function () {
	var copySupported = document.queryCommandSupported('copy');

	var submitButton = document.getElementById("url-submit");
	var input = document.getElementById("url-input");
	var aliasInput = document.getElementById("alias-input");
	var result = document.getElementById("result");

	var output = document.getElementById("output");
	var outputAlias = document.getElementById("output-alias");
	var outputUrl = document.getElementById("url-output");
	var outputAliasUrl = document.getElementById("url-alias-output");

	var copyButtons = document.getElementsByClassName("copy");

	for (var i = 0; i < copyButtons.length; i++) {
		copyButtons[i].addEventListener("click", function (e) {
			e.preventDefault();

			var url = e.target.parentElement.firstElementChild.firstElementChild.href;
			copyTextToClipboard(url);
		})
	};

	submitButton.addEventListener("click", function (e) {
		e.preventDefault();

		var url = input.value;
		if (url === "") {
			return;
		}

		var alias;
		if (aliasInput) {
			alias = aliasInput.value;
		}

		var request = new XMLHttpRequest();
		request.open('POST', 'shrink.json', true);

		request.onreadystatechange = function () {
			if (this.readyState === 4) {
				if (this.status >= 200 && this.status < 400) {
					var data = JSON.parse(this.responseText);
					outputUrl.href = window.location.href
					outputUrl.pathname = "/" + data.short
					outputUrl.innerText = outputUrl.href

					if ((typeof data.alias) !== "undefined" && data.alias !== "") {
						outputAliasUrl.href = window.location.href
						outputAliasUrl.pathname = "/" + data.alias
						outputAliasUrl.innerText = outputAliasUrl.href
						outputAlias.style.display = "";
					}

					result.style.display = "";
					output.style.display = "";
				} else {
					alert("I'm afraid something went wrong");
					console.dir(this);
				}
			}
		};

		request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		request.send(JSON.stringify({ url: url, alias: alias }));
		request = null;
	})

	function copyTextToClipboard(text) {
		var textArea = document.createElement("textarea");

		textArea.style.position = 'fixed';
		textArea.style.top = 0;
		textArea.style.left = 0;

		textArea.style.width = '2em';
		textArea.style.height = '2em';

		textArea.style.padding = 0;

		textArea.style.border = 'none';
		textArea.style.outline = 'none';
		textArea.style.boxShadow = 'none';

		textArea.style.background = 'transparent';

		textArea.value = text;

		document.body.appendChild(textArea);

		textArea.select();

		var successful = false

		try {
			successful = document.execCommand('copy');
		} catch (err) {
			successful = false
		}

		document.body.removeChild(textArea);

		var msg = successful ? 'URL copied to Clipboard' : 'Unable to copy to clipboard';
		alert(msg);
	}
})();
