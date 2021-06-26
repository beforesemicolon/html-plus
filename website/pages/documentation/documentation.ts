{
	const searchField: HTMLInputElement | null = document.querySelector('.search-field');

	if (searchField) {
		const docMenu: HTMLElement | null = document.querySelector('.doc-menu');
		const docMenuSection: HTMLElement | null = document.querySelector('.doc-menu-section');
		const searchResultSection: HTMLElement | null = document.createElement('div');
		searchResultSection.className = 'search-results';

		if (docMenu && docMenuSection) {
			const links: NodeListOf<HTMLAnchorElement> = docMenu.querySelectorAll('a');

			searchField.style.display = 'block';

			searchField.addEventListener('input', (e: Event) => {
				const inputField = (e.currentTarget as Element)?.querySelector('input');

				if (inputField) {
					const resultLinks = getSearchResultLinks(inputField.value, links);

					if (resultLinks.length) {
						docMenuSection.insertAdjacentElement('afterend', searchResultSection);
						docMenuSection.style.display = 'none';
						searchResultSection.innerHTML = '';
						// must clone the node otherwise it will remove it from initial place
						resultLinks.forEach(el => searchResultSection.appendChild(el.cloneNode(true)))
					} else {
						docMenuSection.style.display = 'block';
						searchResultSection.remove();
					}
				}
			});
		}
	}
}

function getSearchResultLinks(searchTerm: string, links: NodeListOf<HTMLAnchorElement>): HTMLAnchorElement[] {
	if (searchTerm.length >= 3) {
		const pattern = new RegExp(searchTerm, 'ig');

		return Array.from(links).filter(link => {
			return pattern.test(link.textContent ?? '') ;
		})
	}

	return [];
}