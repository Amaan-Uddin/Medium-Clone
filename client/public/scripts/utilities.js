export function hourCheck(blogDate) {
	const newDate = new Date().getTime()
	const oldDate = new Date(blogDate).getTime()
	const timeDiff = newDate - oldDate
	return timeDiff > 24 * 60 * 60 * 1000 * 30 * 12
}

export function previewImage(e, setFile) {
	setFile(e.target.files)
	const image = e.target.files[0]
	if (image) {
		const reader = new FileReader()
		reader.onload = function (e) {
			const img = document.createElement('img')
			img.src = e.target.result
			document.getElementById('previewImage').innerHTML = '' // Clear previous image
			document.getElementById('previewImage').appendChild(img)
		}
		reader.readAsDataURL(image)
	}
}
