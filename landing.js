(() => {
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    document.documentElement.classList.add('has-reveal');
    reveals.forEach(element => observer.observe(element));
  }

  const picker = document.querySelector('.language-picker');
  document.addEventListener('click', event => {
    if (!picker.contains(event.target)) picker.open = false;
  });
  picker.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      picker.open = false;
      picker.querySelector('summary').focus();
    }
  });

  const form = document.getElementById('waitlistForm');
  const input = document.getElementById('emailInput');
  const submit = form.querySelector('button');
  const success = document.getElementById('successMessage');
  const errorMessage = document.getElementById('formError');
  const submitLabel = submit.textContent;
  let pending = false;
  form.noValidate = true;
  input.addEventListener('input', () => input.setCustomValidity(''));

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (pending) return;
    input.value = input.value.trim();
    input.setCustomValidity('');
    if (!input.checkValidity()) {
      input.setCustomValidity(form.dataset.invalid);
      input.reportValidity();
      return;
    }
    pending = true;
    submit.disabled = true;
    submit.textContent = form.dataset.pending;
    form.setAttribute('aria-busy', 'true');
    errorMessage.hidden = true;
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new URLSearchParams({ email: input.value }).toString(),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      if (!response.ok) throw new Error('Waitlist request failed');
      form.hidden = true;
      success.classList.add('show');
    } catch {
      errorMessage.textContent = form.dataset.error;
      errorMessage.hidden = false;
    } finally {
      pending = false;
      submit.disabled = false;
      submit.textContent = submitLabel;
      form.removeAttribute('aria-busy');
    }
  });
})();
