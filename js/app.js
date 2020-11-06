const $form = document.getElementById('form'),
	$inputURL = document.getElementById('input-url'),
	$shortenList = document.getElementById('shorten-list');

let urlList = JSON.parse(localStorage.getItem('urls')) || [];

const addToLS = (urlInfo) => {
	urlList.push(urlInfo);
	localStorage.setItem('urls', JSON.stringify(urlList));
};
const renderURLs = () => {
	urlList.forEach(({ url }) => {
		renderShortenURL(url);
	});
};

const renderShortenURL = (url) => {
	const result = document.createElement('div');
	result.className = 'shortener__result';
	result.innerHTML = `
    <p class="normal-link text">
      ${url}
    </p>
    <p class="shorten-link">${url}</p>
    <button class="btn btn--copy">Copy</button>
  `;
	$shortenList.appendChild(result);
};

const invalidInput = () => {
	const box = $inputURL.parentElement;
	box.classList.add('invalid');
	box.nextElementSibling.nextElementSibling.classList.add('show');
};

const validInput = () => {
	const box = $inputURL.parentElement;
	box.classList.remove('invalid');
	box.nextElementSibling.nextElementSibling.classList.remove('show');
};

const handleSubmit = (e) => {
	e.preventDefault();
	const url = $inputURL.value.trim();
	if (!url) {
		invalidInput();
		return;
	}
	validInput();
	$form.reset();
	renderShortenURL(url);
	addToLS({ url, shortenUrl: url });
};

const copyToClipboard = (text, btn) => {
	navigator.permissions.query({ name: 'clipboard-write' }).then((result) => {
		if (result.state == 'granted' || result.state == 'prompt') {
			navigator.clipboard
				.writeText(text)
				.then(() => {
					btn.classList.add('btn--violet');
					btn.innerText = 'Copied!';
					setTimeout(() => {
						btn.classList.remove('btn--violet');
						btn.innerText = 'Copy';
					}, 2000);
				})
				.catch(() => {
					alert('Unexpected error. Please try again');
				});
		}
	});
};

const handleCopy = ({ target }) => {
	if (target.classList.contains('btn--copy')) {
		text = target.previousElementSibling.innerText;
		copyToClipboard(text, target);
	}
};

const init = () => {
	if (urlList.length) {
		renderURLs();
	}
};

$form.addEventListener('submit', handleSubmit);
$shortenList.addEventListener('click', handleCopy);

init();
