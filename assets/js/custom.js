document.addEventListener('DOMContentLoaded', () => {
	// Copy buttons in contact section
	const contactContainer = document.querySelector('#contact') || document;

	async function copyText(value) {
		try {
			if (navigator.clipboard && navigator.clipboard.writeText) {
				await navigator.clipboard.writeText(value);
				return;
			}
		} catch (_) {
			// fall through to fallback
		}

		// Fallback copy
		const ta = document.createElement('textarea');
		ta.value = value;
		ta.style.position = 'fixed';
		ta.style.left = '-9999px';
		document.body.appendChild(ta);
		ta.select();
		try { document.execCommand('copy'); } catch (e) { /* ignore */ }
		document.body.removeChild(ta);
	}

	function showCopyFeedback(btn) {
		const parent = btn.parentElement || btn;
		if (getComputedStyle(parent).position === 'static') {
			parent.style.position = 'relative';
		}

		let bubble = parent.querySelector('.copy-feedback-bubble');
		if (!bubble) {
			bubble = document.createElement('div');
			bubble.className = 'copy-feedback-bubble';
			bubble.textContent = 'Copied!';
			Object.assign(bubble.style, {
				position: 'absolute',
				bottom: 'calc(100% + 8px)',
				left: `${btn.offsetLeft + (btn.offsetWidth / 2)}px`,
				transform: 'translateX(-50%) translateY(4px)',
				background: 'rgba(0,0,0,0.85)',
				color: '#fff',
				padding: '6px 10px',
				borderRadius: '12px',
				fontSize: '0.85rem',
				whiteSpace: 'nowrap',
				opacity: '0',
				transition: 'opacity .18s ease-in-out, transform .18s ease-in-out',
				pointerEvents: 'none',
				zIndex: '1000',
				boxShadow: '0 4px 10px rgba(0,0,0,0.25)'
			});
			parent.appendChild(bubble);
			void bubble.offsetWidth; // trigger transition
		} else {
			bubble.style.left = `${btn.offsetLeft + (btn.offsetWidth / 2)}px`;
		}

		if (bubble._timeout) clearTimeout(bubble._timeout);
		bubble.style.opacity = '1';
		bubble.style.transform = 'translateX(-50%) translateY(0)';
		bubble._timeout = setTimeout(() => {
			bubble.style.opacity = '0';
			bubble.style.transform = 'translateX(-50%) translateY(4px)';
		}, 1200);
	}

	contactContainer.addEventListener('click', async (e) => {
		const btn = e.target.closest && e.target.closest('.copy-btn');
		if (!btn) return;

		e.preventDefault();
		e.stopImmediatePropagation();

		const value = btn.getAttribute('data-copy');
		if (!value) return;

		if (!btn.dataset._origHtml) {
			btn.dataset._origHtml = btn.innerHTML;
		}

		await copyText(value);
		btn.classList.add('copied');
		btn.innerHTML = '✓';
		showCopyFeedback(btn);
		setTimeout(() => {
			btn.classList.remove('copied');
			btn.innerHTML = btn.dataset._origHtml;
		}, 1500);
	}, true);

	// Smooth scrolling
	const scrollLinks = document.querySelectorAll('a.scrolly, #nav a[href^="#"]');
	scrollLinks.forEach(link => {
		link.addEventListener('click', function (e) {
			e.preventDefault();
			const targetId = this.getAttribute('href');
			if (!targetId || !targetId.startsWith('#') || targetId.length <= 1) return;

			const targetElement = document.querySelector(targetId);
			if (!targetElement) return;

			targetElement.scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			});
		});
	});

	// Active nav highlighting on scroll
	const navLinks = Array.from(document.querySelectorAll('#nav a'));
	const sections = Array.from(document.querySelectorAll('article[id]'));
	const topLink = document.querySelector('#nav a[href="#top"]');

	function changeNavActiveState() {
		let current = '';

		sections.forEach(section => {
			const sectionTop = section.offsetTop;
			if (window.pageYOffset >= sectionTop - 50) {
				current = section.getAttribute('id');
			}
		});

		navLinks.forEach(link => {
			link.classList.remove('active');
			if (link.getAttribute('href') === `#${current}`) {
				link.classList.add('active');
			}
		});

		if (current === 'top' || current === '') {
			if (topLink) topLink.classList.add('active');
		}
	}

	changeNavActiveState();
	window.addEventListener('scroll', changeNavActiveState);
});
