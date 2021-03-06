class Reflector {
	static toggle(key, value) {
		if(value) {
			document.getElementById(key).classList.add('toggle_on')
		}
	}
	static text(key, value) {
		document.getElementById(key).value = value
	}
	static range(key, value) {
		for(const item of document.querySelectorAll(`.${key}`)) {
			item.value = value
		}
		document.getElementById(`${key}Range`).value = value
	}
	static radio(key, value) {
		document.getElementById(value).checked = true
	}
	static select(key, value) {
		for(const item of document.querySelectorAll(`select[name="${key}"]`)) {
			item.value = value
		}
	}
}

class ReflectSettings extends DefaultSettings {
	constructor() {
		super()
	}
	init() {
		this.reflect()
		this.addElementsEventListener()
		rippleEffect()
	}
	reflect() {
		const data = this.settings
		console.log(data)
		for(const type in data){
			if(typeof data[type] === "object") {
				this.setState(type, data[type])
			}
		}
	}
	setState(type, data) {
		for(const key in data) {
			Reflector[type](key, data[key])
		}
	}
	// toast() {
	// }
	wrapper(key, action, func) {
		const all = document.querySelectorAll(key)
		for(const item of all) {
			item.addEventListener(action, (event) => {func(event)})
		}
	}
	addElementsEventListener() {
		this.wrapper('#save', 'click', (event) => {
			this.saveData()
			chrome.runtime.sendMessage({newtab: 'reload'})

			let t = document.getElementById('toast')
			t.style.transform  = 'translateY(-6rem)'
			setTimeout((a) => {a.style.transform  = 'translateY(6rem)'}, 2000, t)
		})
		this.wrapper('.toggle', 'click', (event) => {
			event.target.classList.toggle('toggle_on')
			this.settings.toggle[event.target.id] = event.target.classList.contains('toggle_on')
		})
		this.wrapper('.text', 'blur', (event) => {
			this.settings.text[event.target.id] = event.target.value
		})
		this.wrapper('input[type="radio"]', 'click', (event) => {
			this.settings.radio[event.target.name] = event.target.id
		})
		this.wrapper('input[type="range"]', 'change', (event) => {
			this.settings.range[event.target.name] = event.target.value
			for(const item of document.querySelectorAll(`.${event.target.name}`)) {
				item.value = event.target.value
			}
		})
		this.wrapper('.textTime', 'change', (event) => {
			const value = event.target.value;
			for(const item of document.querySelectorAll(`.${event.target.name}`)) {
				item.value = value
			}
			for(const item of document.querySelectorAll(`#${event.target.name}Range`)) {
				item.value = event.target.value
			}
		})
		this.wrapper('select', 'change', (event) => {
			this.settings.select[event.target.name] = event.target.value
		})
	}
}

class ExtensionInfo {
	constructor() {
		this.wrapper('https://api.github.com/repos/Y-Ysss/HelloNewTab/releases/latest', this.versionInfo)
		this.wrapper('https://api.github.com/repos/Y-Ysss/HelloNewTab/commits', this.gitCommitsInfo)
	}
	wrapper(url, func) {
		fetch(url).then((response) => response.json()).then((data) => {
			func(data)
		})
	}

	versionInfo(data) {
		const manifestData = chrome.runtime.getManifest();
		let str = `<div class="cardContents"><b>Installed Version</b><br>${manifestData.version}</div>`
		if(manifestData.version !== data.name) {
			str += `<h2>#Latest Release</h2><div class="cardContents"><b>Version</b><br>${data.name}</div><div class="cardContents"><b>What\'s New</b><br>${data.body}</div><div class="cardContents"><b>URL</b><br><a href="${data.html_url}"></a></div>`
			str = str.replace(/\r?\n/g, '<br>')
		}
		document.getElementById('ExtensionInfo').insertAdjacentHTML('beforeend', str);
	}

	gitCommitsInfo(data) {
		let str = ''
		for(let i = 0; i < 5; i++) {
			str += `<div class="cardContents"><b>${data[i].commit.message}</b><br><span>${
				(data[i].commit.author.date).replace('T', ', ').slice(0, -1)} (UTC)</span><br><a href="${data[i].html_url}"></a></div>`;
		}
		document.getElementById('gitCommitsInfo').insertAdjacentHTML('beforeend', str);
	}
}

const opt = new ReflectSettings()
const info = new ExtensionInfo()

