{
	const searchField: HTMLInputElement | null = document.querySelector('.search-field');

	if (searchField) {
		const docMenu: HTMLElement | null = document.querySelector('.doc-menu');
		const aside: HTMLElement | null = document.querySelector('aside');
		const docMenuSection: HTMLElement | null = document.querySelector('.doc-menu-section');
		const searchResultSection: HTMLElement | null = document.createElement('div');
		searchResultSection.className = 'search-results';

		if (docMenu && docMenuSection && aside) {
			const links: HTMLAnchorElement[] = Array.from(docMenu.querySelectorAll('a'));

			searchField.style.display = 'block';

			let timer: NodeJS.Timeout;

			searchField.addEventListener('input', (e: Event) => {
				clearTimeout(timer);
				timer = setTimeout(() => {
					const field = e.target as HTMLInputElement;

					if (field) {
						let pattern: RegExp;
						let resultLinks: HTMLAnchorElement[] = [];

						if (field.value.length >= 3) {
							pattern = new RegExp(field.value, 'gi');
							resultLinks = links.filter(link => (link.textContent ?? '').search(pattern) >= 0);
						}

						if (resultLinks.length) {
							docMenuSection.remove();
							aside.appendChild(searchResultSection);
							searchResultSection.innerHTML = '';
							// must clone the node otherwise it will remove it from initial place
							resultLinks.forEach(el => searchResultSection.appendChild(el.cloneNode(true)))
						} else {
							searchResultSection.remove();
							aside.appendChild(docMenuSection);
						}
					}
				}, 300);

			});
		}
	}
}