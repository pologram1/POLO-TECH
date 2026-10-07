// Add your actual contact information here. Keep null for missing links.
const profile = {email: null, linkedin: null, github: null, resume: null};
document.querySelectorAll('[data-profile]').forEach(link => {
 const name = link.dataset.profile;
 if (!profile[name]) return;
 link.href = name === 'email' ? 'mailto:' + profile[name] : profile[name];
 link.hidden = false;
});
const note = document.getElementById('contact-note');
if (note && (profile.email || profile.linkedin || profile.github)) note.hidden = true;
document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
