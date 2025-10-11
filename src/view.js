
  /**
 * Text Animator Block - Frontend Animation Controller
 * 
 * Handles all animation effects for the text animator block on the frontend.
 * Respects user motion preferences and provides smooth animations.
 */

document.addEventListener('DOMContentLoaded', function() {
	// Check for reduced motion preference
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	
	// Initialize all text animator blocks
	const textAnimators = document.querySelectorAll('.wp-block-telex-block-text-animator');
	
	textAnimators.forEach(initTextAnimator);
	
	function initTextAnimator(block) {
		const textStrings = JSON.parse(block.dataset.textStrings || '[]');
		const animationType = block.dataset.animationType || 'typewriter';
		const animationDuration = parseInt(block.dataset.animationDuration || '1000');
		const displayDuration = parseInt(block.dataset.displayDuration || '2000');
		
		if (textStrings.length === 0) return;
		
		const animatedTextEl = block.querySelector('.text-animator__animated-text');
		if (!animatedTextEl) return;
		
		let currentIndex = 0;
		let isAnimating = false;
		
		// Start the animation cycle
		startAnimationCycle();
		
		function startAnimationCycle() {
			if (prefersReducedMotion) {
				// For users who prefer reduced motion, just cycle text without animations
				simpleTextCycle();
				return;
			}
			
			// Start with the first text
			showText(textStrings[currentIndex]);
			
			// Set up the main animation loop
			setInterval(() => {
				if (isAnimating) return;
				
				currentIndex = (currentIndex + 1) % textStrings.length;
				animateToNextText(textStrings[currentIndex]);
			}, displayDuration + animationDuration);
		}
		
		function simpleTextCycle() {
			setInterval(() => {
				currentIndex = (currentIndex + 1) % textStrings.length;
				animatedTextEl.textContent = textStrings[currentIndex];
			}, displayDuration);
		}
		
		function animateToNextText(nextText) {
			if (isAnimating) return;
			isAnimating = true;
			
			// Pre-lock dimensions before any animation starts
			lockDimensions(nextText);
			
			block.classList.add('text-animator--animating');
			
			switch (animationType) {
				case 'typewriter':
					typewriterAnimation(nextText);
					break;
				case 'matrix':
					matrixAnimation(nextText);
					break;
				case 'fade':
					fadeAnimation(nextText);
					break;
				case 'flash':
					flashAnimation(nextText);
					break;
				case 'burst':
					burstAnimation(nextText);
					break;
				case 'glitch':
					glitchAnimation(nextText);
					break;
				default:
					showText(nextText);
					unlockDimensions();
					endAnimation();
			}
		}
		
		function lockDimensions(nextText) {
			const currentText = animatedTextEl.textContent;
			const computedStyle = getComputedStyle(animatedTextEl);
			const parentWidth = animatedTextEl.parentElement.offsetWidth;
			
			// Get current dimensions
			const currentWidth = animatedTextEl.offsetWidth;
			const currentHeight = animatedTextEl.offsetHeight;
			
			// Measure next text at constrained width
			const tempSpan = document.createElement('span');
			tempSpan.textContent = nextText;
			tempSpan.style.visibility = 'hidden';
			tempSpan.style.position = 'absolute';
			tempSpan.style.display = 'inline-block';
			tempSpan.style.maxWidth = parentWidth + 'px';
			tempSpan.style.fontSize = computedStyle.fontSize;
			tempSpan.style.fontFamily = computedStyle.fontFamily;
			tempSpan.style.fontWeight = computedStyle.fontWeight;
			tempSpan.style.letterSpacing = computedStyle.letterSpacing;
			tempSpan.style.lineHeight = computedStyle.lineHeight;
			tempSpan.style.wordBreak = computedStyle.wordBreak;
			tempSpan.style.whiteSpace = computedStyle.whiteSpace;
			document.body.appendChild(tempSpan);
			const nextWidth = tempSpan.offsetWidth;
			const nextHeight = tempSpan.offsetHeight;
			document.body.removeChild(tempSpan);
			
			// Lock to maximum dimensions
			const maxWidth = Math.max(currentWidth, nextWidth);
			const maxHeight = Math.max(currentHeight, nextHeight);
			
			animatedTextEl.style.display = 'inline-block';
			animatedTextEl.style.minWidth = maxWidth + 'px';
			animatedTextEl.style.minHeight = maxHeight + 'px';
			animatedTextEl.style.verticalAlign = 'top';
		}
		
		function unlockDimensions() {
			animatedTextEl.style.display = '';
			animatedTextEl.style.minWidth = '';
			animatedTextEl.style.minHeight = '';
			animatedTextEl.style.verticalAlign = '';
		}
		
		function typewriterAnimation(nextText) {
			const currentText = animatedTextEl.textContent;
			let eraseIndex = currentText.length;
			let typeIndex = 0;
			
			block.classList.add('text-animator--typing');
			
			// Erase current text
			const eraseInterval = setInterval(() => {
				if (eraseIndex > 0) {
					animatedTextEl.textContent = currentText.substring(0, eraseIndex - 1);
					eraseIndex--;
				} else {
					clearInterval(eraseInterval);
					// Start typing new text
					const typeInterval = setInterval(() => {
						if (typeIndex < nextText.length) {
							animatedTextEl.textContent = nextText.substring(0, typeIndex + 1);
							typeIndex++;
						} else {
							clearInterval(typeInterval);
							block.classList.remove('text-animator--typing');
							endAnimation();
						}
					}, 50);
				}
			}, 30);
		}
		
		function matrixAnimation(nextText) {
			const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
			const iterations = 20;
			let iteration = 0;
			
			const interval = setInterval(() => {
				const scrambled = nextText
					.split('')
					.map((char, index) => {
						if (index < (nextText.length * iteration) / iterations) {
							return nextText[index];
						}
						return chars[Math.floor(Math.random() * chars.length)];
					})
					.join('');
				
				animatedTextEl.textContent = scrambled;
				
				iteration++;
				if (iteration > iterations) {
					clearInterval(interval);
					animatedTextEl.textContent = nextText;
					endAnimation();
				}
			}, animationDuration / iterations);
		}
		
		function fadeAnimation(nextText) {
			animatedTextEl.style.opacity = '0';
			
			setTimeout(() => {
				animatedTextEl.textContent = nextText;
				animatedTextEl.style.opacity = '1';
				endAnimation();
			}, animationDuration / 2);
		}
		
		function flashAnimation(nextText) {
			let flashes = 0;
			const maxFlashes = 3;
			
			const flashInterval = setInterval(() => {
				animatedTextEl.style.opacity = flashes % 2 === 0 ? '0' : '1';
				flashes++;
				
				if (flashes === Math.floor(maxFlashes * 1.5)) {
					animatedTextEl.textContent = nextText;
				}
				
				if (flashes >= maxFlashes * 2) {
					clearInterval(flashInterval);
					animatedTextEl.style.opacity = '1';
					endAnimation();
				}
			}, animationDuration / (maxFlashes * 2));
		}
		
		function burstAnimation(nextText) {
			animatedTextEl.style.transform = 'scale(1.2) rotateY(90deg)';
			animatedTextEl.style.opacity = '0';
			
			setTimeout(() => {
				animatedTextEl.textContent = nextText;
				animatedTextEl.style.transform = 'scale(1) rotateY(0deg)';
				animatedTextEl.style.opacity = '1';
				endAnimation();
			}, animationDuration / 2);
		}
		
		function glitchAnimation(nextText) {
			const currentText = animatedTextEl.textContent;
			
			// Set the data attribute for CSS pseudo-elements
			animatedTextEl.setAttribute('data-text', nextText);
			
			// Calculate and lock dimensions to prevent bouncing
			const computedStyle = getComputedStyle(animatedTextEl);
			const currentWidth = animatedTextEl.offsetWidth;
			const currentHeight = animatedTextEl.offsetHeight;
			
			// Measure the natural width of current text
			const tempSpanCurrent = document.createElement('span');
			tempSpanCurrent.textContent = currentText;
			tempSpanCurrent.style.visibility = 'hidden';
			tempSpanCurrent.style.position = 'absolute';
			tempSpanCurrent.style.whiteSpace = 'nowrap';
			tempSpanCurrent.style.fontSize = computedStyle.fontSize;
			tempSpanCurrent.style.fontFamily = computedStyle.fontFamily;
			tempSpanCurrent.style.fontWeight = computedStyle.fontWeight;
			tempSpanCurrent.style.letterSpacing = computedStyle.letterSpacing;
			document.body.appendChild(tempSpanCurrent);
			const currentNaturalWidth = tempSpanCurrent.offsetWidth;
			document.body.removeChild(tempSpanCurrent);
			
			// Measure the natural width of the next text
			const tempSpanNext = document.createElement('span');
			tempSpanNext.textContent = nextText;
			tempSpanNext.style.visibility = 'hidden';
			tempSpanNext.style.position = 'absolute';
			tempSpanNext.style.whiteSpace = 'nowrap';
			tempSpanNext.style.fontSize = computedStyle.fontSize;
			tempSpanNext.style.fontFamily = computedStyle.fontFamily;
			tempSpanNext.style.fontWeight = computedStyle.fontWeight;
			tempSpanNext.style.letterSpacing = computedStyle.letterSpacing;
			document.body.appendChild(tempSpanNext);
			const nextNaturalWidth = tempSpanNext.offsetWidth;
			const nextNaturalHeight = tempSpanNext.offsetHeight;
			document.body.removeChild(tempSpanNext);
			
			// Lock to the absolute maximum width and height
			const maxWidth = Math.max(currentWidth, currentNaturalWidth, nextNaturalWidth);
			const maxHeight = Math.max(currentHeight, nextNaturalHeight);
			
			// Set fixed dimensions to prevent ANY layout shift
			animatedTextEl.style.display = 'inline-block';
			animatedTextEl.style.width = maxWidth + 'px';
			animatedTextEl.style.height = maxHeight + 'px';
			animatedTextEl.style.overflow = 'hidden';
			animatedTextEl.style.verticalAlign = 'top';
			
			// Simple approach: glitch the entire text, then reveal the new text
			let glitchCount = 0;
			const maxGlitches = 15;
			const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
			
			const glitchInterval = setInterval(() => {
				if (glitchCount < maxGlitches) {
					// Create random glitched text - use 2 fewer characters to prevent wrapping
					let glitchedText = '';
					const glitchLength = Math.max(1, currentText.length - 4);
					
					for (let i = 0; i < glitchLength; i++) {
						glitchedText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
					}
					
					animatedTextEl.textContent = glitchedText;
					glitchCount++;
				} else {
					clearInterval(glitchInterval);
					// Very subtle fade to smooth the transition
					animatedTextEl.style.transition = 'opacity 0.02s ease';
					animatedTextEl.style.opacity = '0.7';
					
					setTimeout(() => {
						animatedTextEl.textContent = nextText;
						animatedTextEl.style.opacity = '1';
						
						setTimeout(() => {
							animatedTextEl.removeAttribute('data-text');
							animatedTextEl.style.transition = '';
							animatedTextEl.style.display = '';
							animatedTextEl.style.width = '';
							animatedTextEl.style.height = '';
							animatedTextEl.style.overflow = '';
							animatedTextEl.style.verticalAlign = '';
							endAnimation();
						}, 20);
					}, 20);
				}
			}, animationDuration / maxGlitches);
		}
		
		function showText(text) {
			animatedTextEl.textContent = text;
		}
		
		function endAnimation() {
			isAnimating = false;
			block.classList.remove('text-animator--animating');
			
			// Reset any inline styles
			animatedTextEl.style.opacity = '';
			animatedTextEl.style.transform = '';
			
			// Unlock dimensions
			unlockDimensions();
		}
	}
});
	